/**
 * Real-Time Cross-Device Cloud Sync Engine (Desktop ⇄ Mobile Phone)
 * Enterprise-Grade WebSocket State Relay powered by Public MQTT Broker with Retained Cloud State.
 * Includes Automatic Device Detection & Hardware Metadata Registry.
 */

import mqtt, { MqttClient } from 'mqtt';
import { FullBackupPayload } from './storage';
import { deviceDetector, DeviceMetadata } from './deviceDetector';

export interface CloudSyncState {
  syncCode: string | null;
  status: 'DISCONNECTED' | 'CONNECTING' | 'SYNCED' | 'SYNCING' | 'ERROR';
  lastSyncedAt: string | null;
  pairedDevices: DeviceMetadata[];
}

const PRIMARY_BROKER = 'wss://broker.hivemq.com:8884/mqtt';
const BACKUP_BROKER = 'wss://broker.emqx.io:8084/mqtt';

class CloudSyncEngine {
  private syncCode: string | null = null;
  private client: MqttClient | null = null;
  private onRemoteUpdateCallback: ((payload: FullBackupPayload & { deviceInfo?: DeviceMetadata }) => void) | null = null;
  private localBroadcastChannel: BroadcastChannel | null = null;
  private isBroadcasting = false;
  private lastKnownRemoteTimestamp: number = 0;
  private clientId: string;

  constructor() {
    this.clientId = 'titan_' + Math.random().toString(36).substring(2, 10);
    this.syncCode = this.getStoredSyncCode();
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.localBroadcastChannel = new BroadcastChannel('titan_cross_tab_sync');
        this.localBroadcastChannel.onmessage = (event) => {
          if (this.isBroadcasting) return;
          if (event.data && event.data.version && this.onRemoteUpdateCallback) {
            if (event.data.deviceInfo) {
              deviceDetector.savePairedDevice(event.data.deviceInfo);
            }
            this.onRemoteUpdateCallback(event.data);
          }
        };
      }
    } catch {
      // Ignore
    }
  }

  public getStoredSyncCode(): string | null {
    try {
      return localStorage.getItem('titan_sync_code') || null;
    } catch {
      return null;
    }
  }

  public setStoredSyncCode(code: string | null) {
    this.syncCode = code ? code.trim() : null;
    try {
      if (code) {
        localStorage.setItem('titan_sync_code', code.trim());
      } else {
        localStorage.removeItem('titan_sync_code');
        deviceDetector.clearPairedDevices();
      }
    } catch {
      // Ignore
    }
  }

  public getPairedDevices(): DeviceMetadata[] {
    return deviceDetector.getKnownPairedDevices();
  }

  public getCurrentDevice(): DeviceMetadata {
    return deviceDetector.getCurrentDevice();
  }

  public setCustomDeviceName(name: string) {
    deviceDetector.setCustomDeviceName(name);
  }

  /**
   * Generate a clean 6-character Operator Sync Code (e.g. TITAN-784X)
   */
  public generateNewSyncCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'TITAN-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.setStoredSyncCode(code);
    return code;
  }

  private getTopic(code: string): string {
    return `titan_protocol/v2/channel/${code.trim().toUpperCase()}`;
  }

  /**
   * Push state to cloud channel with Retained flag (instant delivery to all paired devices)
   */
  public async pushStateToCloud(payload: FullBackupPayload, customCode?: string): Promise<boolean> {
    const code = (customCode || this.syncCode)?.trim();
    if (!code) return false;

    const topic = this.getTopic(code);
    const now = Date.now();
    this.lastKnownRemoteTimestamp = now;

    const currentDevice = deviceDetector.getCurrentDevice();
    const fullData = {
      ...payload,
      cloudSenderId: this.clientId,
      cloudUpdatedAt: now,
      deviceInfo: currentDevice
    };

    const messageStr = JSON.stringify(fullData);

    // Cross-tab broadcast
    try {
      if (this.localBroadcastChannel) {
        this.localBroadcastChannel.postMessage(fullData);
      }
    } catch {
      // Ignore
    }

    try {
      this.isBroadcasting = true;

      // If client is already connected to this channel, publish directly
      if (this.client && this.client.connected) {
        this.client.publish(topic, messageStr, { retain: true, qos: 1 });
        return true;
      }

      // Otherwise connect and publish
      const tempClient = mqtt.connect(PRIMARY_BROKER, {
        clientId: this.clientId + '_p',
        clean: true,
        connectTimeout: 4000
      });

      return new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => {
          try { tempClient.end(); } catch {}
          resolve(false);
        }, 5000);

        tempClient.on('connect', () => {
          tempClient.publish(topic, messageStr, { retain: true, qos: 1 }, () => {
            clearTimeout(timer);
            try { tempClient.end(); } catch {}
            resolve(true);
          });
        });

        tempClient.on('error', () => {
          clearTimeout(timer);
          try { tempClient.end(); } catch {}
          resolve(false);
        });
      });
    } catch (err) {
      console.warn('Cloud sync push warning:', err);
      return false;
    } finally {
      setTimeout(() => {
        this.isBroadcasting = false;
      }, 400);
    }
  }

  /**
   * Start live Real-Time WebSocket subscription for a sync channel
   */
  public startRealTimeListener(
    code: string,
    onUpdate: (payload: FullBackupPayload & { deviceInfo?: DeviceMetadata }) => void
  ) {
    this.stopListener();
    const cleanCode = code.trim().toUpperCase();
    this.syncCode = cleanCode;
    this.setStoredSyncCode(cleanCode);
    this.onRemoteUpdateCallback = onUpdate;

    const topic = this.getTopic(cleanCode);

    try {
      this.client = mqtt.connect(PRIMARY_BROKER, {
        clientId: this.clientId,
        clean: true,
        reconnectPeriod: 3000,
        connectTimeout: 5000
      });

      this.client.on('connect', () => {
        console.log(`⚡ Connected to Titan Cloud Relay for channel [${cleanCode}]`);
        this.client?.subscribe(topic, { qos: 1 });

        // Announce presence with current device info
        const currentDev = deviceDetector.getCurrentDevice();
        const pingPayload = {
          version: '2.6.0',
          pingOnly: true,
          cloudSenderId: this.clientId,
          cloudUpdatedAt: Date.now(),
          deviceInfo: currentDev
        };
        this.client?.publish(`${topic}/presence`, JSON.stringify(pingPayload), { qos: 0 });
      });

      this.client.on('message', (t, msgBuffer) => {
        try {
          if (t !== topic) return;
          const jsonStr = msgBuffer.toString();
          const data = JSON.parse(jsonStr) as FullBackupPayload & { cloudSenderId?: string; cloudUpdatedAt?: number; deviceInfo?: DeviceMetadata };

          // Ignore own echoes
          if (data.cloudSenderId === this.clientId) {
            return;
          }

          if (data.deviceInfo) {
            deviceDetector.savePairedDevice(data.deviceInfo);
          }

          if (data && data.version && this.onRemoteUpdateCallback) {
            console.log('⚡ Received live sync state update from paired device:', data.deviceInfo?.deviceName);
            this.onRemoteUpdateCallback(data);
          }
        } catch (err) {
          console.warn('Failed to parse incoming cloud sync message:', err);
        }
      });

      this.client.on('error', (err) => {
        console.warn('MQTT Connection Warning, attempting fallback broker...', err);
        try {
          if (!this.client?.connected) {
            this.client?.end();
            this.client = mqtt.connect(BACKUP_BROKER, {
              clientId: this.clientId + '_fb',
              clean: true
            });
            this.client.on('connect', () => {
              this.client?.subscribe(topic, { qos: 1 });
            });
          }
        } catch {
          // Ignore
        }
      });
    } catch (err) {
      console.warn('Could not initialize cloud sync listener:', err);
    }
  }

  /**
   * Pull the single latest state on demand
   */
  public async pullStateFromCloud(code: string): Promise<(FullBackupPayload & { deviceInfo?: DeviceMetadata }) | null> {
    const cleanCode = code.trim().toUpperCase();
    const topic = this.getTopic(cleanCode);

    return new Promise((resolve) => {
      const tempClient = mqtt.connect(PRIMARY_BROKER, {
        clientId: this.clientId + '_pull',
        clean: true,
        connectTimeout: 4000
      });

      const timer = setTimeout(() => {
        try { tempClient.end(); } catch {}
        resolve(null);
      }, 5000);

      tempClient.on('connect', () => {
        tempClient.subscribe(topic, { qos: 1 });
      });

      tempClient.on('message', (t, msgBuffer) => {
        if (t === topic) {
          clearTimeout(timer);
          try {
            const data = JSON.parse(msgBuffer.toString());
            if (data.deviceInfo) {
              deviceDetector.savePairedDevice(data.deviceInfo);
            }
            try { tempClient.end(); } catch {}
            resolve(data);
          } catch {
            try { tempClient.end(); } catch {}
            resolve(null);
          }
        }
      });

      tempClient.on('error', () => {
        clearTimeout(timer);
        try { tempClient.end(); } catch {}
        resolve(null);
      });
    });
  }

  public stopListener() {
    if (this.client) {
      try {
        this.client.end(true);
      } catch {
        // Ignore
      }
      this.client = null;
    }
  }
}

export const cloudSyncEngine = new CloudSyncEngine();
