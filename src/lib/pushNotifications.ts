// Tactical System & Mobile Push Notification Engine
// Dual Layer:
// 1. Native Web Notification & Service Worker Push
// 2. Instant Phone Push Relay via ntfy.sh (pings locked mobile screen even when browser is completely closed)

import { soundEngine } from './audio';

export interface PushNotificationPayload {
  title: string;
  body: string;
  tag?: string;
  requireInteraction?: boolean;
  priority?: number; // 1-5 (5 = max urgent)
  tags?: string[];
}

const STORAGE_KEY_NTFY_TOPIC = 'titan_protocol_ntfy_topic_v1';

class TacticalPushService {
  private lastAlertTimestamp: Record<string, number> = {};

  /**
   * Get or initialize a unique operator mobile push topic
   */
  public getOrCreateRelayTopic(operatorId: string = 'TITAN-OP'): string {
    let stored = localStorage.getItem(STORAGE_KEY_NTFY_TOPIC);
    if (!stored) {
      const cleanId = operatorId.toLowerCase().replace(/[^a-z0-9]/g, '');
      stored = `titan_${cleanId || 'operator'}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem(STORAGE_KEY_NTFY_TOPIC, stored);
    }
    return stored;
  }

  public getStoredRelayTopic(): string {
    return localStorage.getItem(STORAGE_KEY_NTFY_TOPIC) || this.getOrCreateRelayTopic();
  }

  public setRelayTopic(topic: string) {
    localStorage.setItem(STORAGE_KEY_NTFY_TOPIC, topic.trim());
  }

  /**
   * Check if the browser supports the Notifications API
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Get current notification permission state
   */
  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Request push notification permission from the user
   */
  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        this.sendNotification({
          title: '🛡️ TITAN PROTOCOL • SYSTEM LINK ESTABLISHED',
          body: 'Tactical push alerts are now active. You will receive authoritative mission briefings and loss-aversion ultimatums.',
          tag: 'titan-init-link'
        });
        soundEngine.playMilestoneFanfare();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Dispatch a high-priority push notification (Both Native Web + Mobile Relay)
   */
  public sendNotification(payload: PushNotificationPayload): boolean {
    // 1. Send Native Browser / Service Worker Notification
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notification = new Notification(payload.title, {
          body: payload.body,
          icon: '/manifest.json',
          tag: payload.tag || 'titan-alert',
          requireInteraction: payload.requireInteraction ?? false
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (err) {
        console.warn('Native notification dispatch error:', err);
      }
    }

    // 2. Dispatch Mobile Push Relay (pings phone even if browser is closed)
    this.sendMobilePushRelay(payload);

    soundEngine.playAlert();
    return true;
  }

  /**
   * Dispatch mobile push relay over HTTPS to phone lockscreen
   */
  public async sendMobilePushRelay(payload: PushNotificationPayload, customTopic?: string): Promise<boolean> {
    try {
      const topic = customTopic || this.getStoredRelayTopic();
      if (!topic) return false;

      const priority = payload.priority ?? 4;
      const tagsHeader = (payload.tags && payload.tags.length > 0)
        ? payload.tags.join(',')
        : priority >= 5 ? 'rotating_light,skull' : 'shield,zap';

      await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
        method: 'POST',
        headers: {
          'Title': payload.title,
          'Priority': String(priority),
          'Tags': tagsHeader,
          'Click': window.location.origin
        },
        body: payload.body
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Automated Inactivity Interrogation:
   * Dispatches escalation warnings based on remaining hours until midnight
   */
  public checkAndDispatchInactivityAlerts(hoursLeft: number, hasLoggedToday: boolean, streak: number) {
    if (hasLoggedToday) return;

    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Evening Warning (6 hours left - 18:00)
    if (hoursLeft <= 6 && hoursLeft > 3) {
      const tag = `titan-warning-6h-${todayStr}`;
      if (!this.lastAlertTimestamp[tag]) {
        this.sendNotification({
          title: '⚠️ TITAN PROTOCOL • INACTIVITY THREAT DETECTED',
          body: `6 hours remaining until day closure. 0 protocols logged today. Secure your ${streak}d streak before the N-for-N decay engine triggers.`,
          tag,
          priority: 3,
          tags: ['warning', 'hourglass']
        });
        this.lastAlertTimestamp[tag] = now;
      }
    }

    // 2. Urgent Warning (3 hours left - 21:00)
    if (hoursLeft <= 3 && hoursLeft > 1) {
      const tag = `titan-warning-3h-${todayStr}`;
      if (!this.lastAlertTimestamp[tag]) {
        this.sendNotification({
          title: '🚨 CRITICAL INTERROGATION • 3 HOURS REMAINING',
          body: `You are vulnerable to progress erasure. Missing today will permanently erase prior XP and reset your streak to 0. Log session now.`,
          tag,
          requireInteraction: true,
          priority: 4,
          tags: ['rotating_light', 'fire']
        });
        this.lastAlertTimestamp[tag] = now;
      }
    }

    // 3. CODE RED (1 hour left - 23:00)
    if (hoursLeft <= 1) {
      const tag = `titan-codered-1h-${todayStr}`;
      if (!this.lastAlertTimestamp[tag]) {
        this.sendNotification({
          title: '☠️ CODE RED • 60 MINUTES BEFORE PROGRESS ANNIHILATION',
          body: `Final ultimatum: Day closes at midnight. Inactivity will trigger an instant Black Mark on your permanent record. Log protocols immediately.`,
          tag,
          requireInteraction: true,
          priority: 5,
          tags: ['skull', 'sos']
        });
        this.lastAlertTimestamp[tag] = now;
      }
    }
  }
}

export const tacticalPushService = new TacticalPushService();
