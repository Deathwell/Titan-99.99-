/**
 * Real-Time Cross-Device Cloud Sync Engine (Desktop ⇄ Mobile Phone)
 * High-Reliability Zero-Auth Cloud Object State Relay with Persistent Channel ID.
 */

import { FullBackupPayload } from './storage';

export interface CloudSyncState {
  syncCode: string | null;
  status: 'DISCONNECTED' | 'CONNECTING' | 'SYNCED' | 'SYNCING' | 'ERROR';
  lastSyncedAt: string | null;
  pairedDeviceCount: number;
}

const RESTFUL_ENDPOINT = 'https://api.restful-api.dev/objects';

class CloudSyncEngine {
  private syncCode: string | null = null;
  private pollInterval: number | null = null;
  private onRemoteUpdateCallback: ((payload: FullBackupPayload) => void) | null = null;
  private isBroadcasting = false;
  private localBroadcastChannel: BroadcastChannel | null = null;
  private lastKnownRemoteTimestamp: number = 0;

  constructor() {
    this.syncCode = this.getStoredSyncCode();
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.localBroadcastChannel = new BroadcastChannel('titan_cross_tab_sync');
        this.localBroadcastChannel.onmessage = (event) => {
          if (this.isBroadcasting) return;
          if (event.data && event.data.version && this.onRemoteUpdateCallback) {
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
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Create a new Cloud Sync Channel on the cloud relay
   */
  public async createNewSyncChannel(initialPayload: FullBackupPayload): Promise<string | null> {
    try {
      const response = await fetch(RESTFUL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'TITAN_OPERATOR_CHANNEL',
          data: {
            ...initialPayload,
            cloudUpdatedAt: Date.now()
          }
        })
      });

      if (!response.ok) return null;
      const data = await response.json();
      if (data && data.id) {
        const id = data.id.toString();
        this.setStoredSyncCode(id);
        return id;
      }
      return null;
    } catch (err) {
      console.warn('Failed to create new cloud sync channel:', err);
      return null;
    }
  }

  /**
   * Push current state to the active cloud channel
   */
  public async pushStateToCloud(payload: FullBackupPayload, customCode?: string): Promise<boolean> {
    const code = (customCode || this.syncCode)?.trim();
    if (!code) return false;

    // Also broadcast to local tabs
    try {
      if (this.localBroadcastChannel) {
        this.localBroadcastChannel.postMessage(payload);
      }
    } catch {
      // Ignore
    }

    try {
      this.isBroadcasting = true;
      const now = Date.now();
      this.lastKnownRemoteTimestamp = now;

      const response = await fetch(`${RESTFUL_ENDPOINT}/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'TITAN_OPERATOR_CHANNEL',
          data: {
            ...payload,
            cloudUpdatedAt: now
          }
        })
      });

      return response.ok;
    } catch (err) {
      console.warn('Cloud sync push warning:', err);
      return false;
    } finally {
      setTimeout(() => {
        this.isBroadcasting = false;
      }, 600);
    }
  }

  /**
   * Fetch the latest authoritative state from the cloud channel
   */
  public async pullStateFromCloud(code: string): Promise<FullBackupPayload | null> {
    const cleanCode = code.trim();
    if (!cleanCode) return null;

    try {
      const response = await fetch(`${RESTFUL_ENDPOINT}/${cleanCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return null;
      const json = await response.json();

      if (json && json.data && json.data.version) {
        const remoteData = json.data as FullBackupPayload & { cloudUpdatedAt?: number };
        const remoteTs = remoteData.cloudUpdatedAt || 0;
        
        if (remoteTs > 0 && remoteTs <= this.lastKnownRemoteTimestamp && !this.isBroadcasting) {
          // Already have this version or newer
          return null;
        }

        if (remoteTs > 0) {
          this.lastKnownRemoteTimestamp = remoteTs;
        }
        return remoteData;
      }
      return null;
    } catch (err) {
      console.warn('Failed to pull state from cloud:', err);
      return null;
    }
  }

  /**
   * Start high-frequency background cloud sync listener (poll every 2.5s)
   */
  public startRealTimeListener(
    code: string,
    onUpdate: (payload: FullBackupPayload) => void
  ) {
    this.stopListener();
    const cleanCode = code.trim();
    this.syncCode = cleanCode;
    this.setStoredSyncCode(cleanCode);
    this.onRemoteUpdateCallback = onUpdate;

    // Immediate initial pull
    this.pullStateFromCloud(cleanCode).then(fresh => {
      if (fresh && this.onRemoteUpdateCallback) {
        this.onRemoteUpdateCallback(fresh);
      }
    });

    // High-responsiveness polling interval (every 2.5s)
    this.pollInterval = window.setInterval(async () => {
      if (this.isBroadcasting) return;
      const fresh = await this.pullStateFromCloud(cleanCode);
      if (fresh && this.onRemoteUpdateCallback) {
        console.log('⚡ Received cloud sync update from paired device!');
        this.onRemoteUpdateCallback(fresh);
      }
    }, 2500);

    // Also trigger immediate sync when user focuses or touches the app screen
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.handleWindowFocus);
      window.addEventListener('visibilitychange', this.handleWindowFocus);
    }
  }

  private handleWindowFocus = async () => {
    if (!this.syncCode || this.isBroadcasting) return;
    const fresh = await this.pullStateFromCloud(this.syncCode);
    if (fresh && this.onRemoteUpdateCallback) {
      this.onRemoteUpdateCallback(fresh);
    }
  };

  public stopListener() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', this.handleWindowFocus);
      window.removeEventListener('visibilitychange', this.handleWindowFocus);
    }
  }
}

export const cloudSyncEngine = new CloudSyncEngine();
