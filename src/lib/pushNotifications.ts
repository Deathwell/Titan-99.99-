// Tactical System & Mobile Push Notification Engine
// Dispatches high-priority loss-aversion alerts, decay ultimatums, and wake-up protocols

import { soundEngine } from './audio';

export interface PushNotificationPayload {
  title: string;
  body: string;
  tag?: string;
  requireInteraction?: boolean;
}

class TacticalPushService {
  private lastAlertTimestamp: Record<string, number> = {};

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
   * Dispatch a high-priority push notification to the user's OS / Lockscreen
   */
  public sendNotification(payload: PushNotificationPayload): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: '/manifest.json', // System icon
        tag: payload.tag || 'titan-alert',
        requireInteraction: payload.requireInteraction ?? false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      soundEngine.playAlert();
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
    if (hasLoggedToday || Notification.permission !== 'granted') return;

    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Evening Warning (6 hours left - 18:00)
    if (hoursLeft <= 6 && hoursLeft > 3) {
      const tag = `titan-warning-6h-${todayStr}`;
      if (!this.lastAlertTimestamp[tag]) {
        this.sendNotification({
          title: '⚠️ TITAN PROTOCOL • INACTIVITY THREAT DETECTED',
          body: `6 hours remaining until day closure. 0 protocols logged today. Secure your ${streak}d streak before the N-for-N decay engine triggers.`,
          tag
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
          requireInteraction: true
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
          requireInteraction: true
        });
        this.lastAlertTimestamp[tag] = now;
      }
    }
  }
}

export const tacticalPushService = new TacticalPushService();
