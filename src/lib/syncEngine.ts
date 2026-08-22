/**
 * Real-Time Cross-Device Cloud Sync Engine (Desktop ⇄ Mobile Phone)
 * Synchronizes Tactical Alarms, Daily Accomplishments, Percentiles, and Logs across paired devices.
 */

import { FullBackupPayload } from './storage';

export interface CloudSyncState {
  syncCode: string | null;
  status: 'DISCONNECTED' | 'CONNECTING' | 'SYNCED' | 'SYNCING' | 'ERROR';
  lastSyncedAt: string | null;
  pairedDeviceCount: number;
}

// High-speed zero-auth serverless KV storage endpoint for real-time state relay
const SYNC_SERVER_ENDPOINT = 'https://ntfy.sh'; // High-reliability WebSocket/HTTP real-time pub-sub

class CloudSyncEngine {
  private syncCode: string | null = null;
  private eventSource: EventSource | null = null;
  private pollInterval: number | null = null;
  private onRemoteUpdateCallback: ((payload: FullBackupPayload) => void) | null = null;
  private isBroadcasting = false;

  constructor() {
    this.syncCode = this.getStoredSyncCode();
  }

  public getStoredSyncCode(): string | null {
    try {
      return localStorage.getItem('titan_sync_code') || null;
    } catch {
      return null;
    }
  }

  public setStoredSyncCode(code: string | null) {
    this.syncCode = code;
    try {
      if (code) {
        localStorage.setItem('titan_sync_code', code.trim().toUpperCase());
      } else {
        localStorage.removeItem('titan_sync_code');
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Generate a random 6-character Operator Sync Code (e.g. TITAN-784)
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

  /**
   * Broadcast current full state payload to cloud relay
   */
  public async pushStateToCloud(payload: FullBackupPayload, customCode?: string): Promise<boolean> {
    const code = customCode || this.syncCode;
    if (!code) return false;

    try {
      this.isBroadcasting = true;
      const topic = `titan_sync_${code.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      
      const response = await fetch(`${SYNC_SERVER_ENDPOINT}/${topic}`, {
        method: 'POST',
        headers: {
          'Title': 'TITAN_STATE_SYNC',
          'Priority': 'urgent'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (err) {
      console.warn('Cloud sync broadcast warning:', err);
      return false;
    } finally {
      setTimeout(() => {
        this.isBroadcasting = false;
      }, 1000);
    }
  }

  /**
   * Fetch the latest state from cloud
   */
  public async pullStateFromCloud(code: string): Promise<FullBackupPayload | null> {
    try {
      const topic = `titan_sync_${code.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      const res = await fetch(`${SYNC_SERVER_ENDPOINT}/${topic}/json?poll=1&since=all`);
      
      if (!res.ok) return null;
      
      const lines = (await res.text()).trim().split('\n');
      if (lines.length === 0 || !lines[lines.length - 1]) return null;

      // Parse the last message from the topic
      const lastMsg = JSON.parse(lines[lines.length - 1]);
      if (lastMsg && lastMsg.message) {
        const payload = JSON.parse(lastMsg.message) as FullBackupPayload;
        return payload;
      }
      return null;
    } catch (err) {
      console.warn('Failed to pull state from cloud:', err);
      return null;
    }
  }

  /**
   * Start Real-Time WebSocket / EventSource Listener for instant cross-device updates
   */
  public startRealTimeListener(
    code: string,
    onUpdate: (payload: FullBackupPayload) => void
  ) {
    this.stopListener();
    this.syncCode = code;
    this.setStoredSyncCode(code);
    this.onRemoteUpdateCallback = onUpdate;

    const topic = `titan_sync_${code.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;

    try {
      const eventSource = new EventSource(`${SYNC_SERVER_ENDPOINT}/${topic}/sse`);
      this.eventSource = eventSource;

      eventSource.onmessage = (event) => {
        if (this.isBroadcasting) return; // Don't process self-broadcasted echo

        try {
          const data = JSON.parse(event.data);
          if (data && data.message) {
            const payload = JSON.parse(data.message) as FullBackupPayload;
            if (payload && payload.version) {
              console.log('⚡ Received real-time cross-device cloud sync update!');
              if (this.onRemoteUpdateCallback) {
                this.onRemoteUpdateCallback(payload);
              }
            }
          }
        } catch (e) {
          // Ignore parse errors on ping/keep-alive frames
        }
      };

      eventSource.onerror = () => {
        // Fallback polling if SSE drops on mobile sleep
        console.log('SSE reconnecting...');
      };

      // Background fallback polling every 6 seconds to ensure reliable cross-device sync even when browser wakes up
      this.pollInterval = window.setInterval(async () => {
        if (this.isBroadcasting) return;
        const fresh = await this.pullStateFromCloud(code);
        if (fresh && this.onRemoteUpdateCallback) {
          this.onRemoteUpdateCallback(fresh);
        }
      }, 6000);

    } catch (err) {
      console.warn('Real-time listener initialization error:', err);
    }
  }

  public stopListener() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
}

export const cloudSyncEngine = new CloudSyncEngine();
