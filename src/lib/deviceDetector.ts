// Device Detection & Hardware Metadata Engine for TITAN Real-Time Cloud Sync
// Identifies device type, OS, browser, model, and persistent device ID

export type DeviceType = 'MOBILE' | 'DESKTOP' | 'TABLET';

export interface DeviceMetadata {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  os: string;
  browser: string;
  screenResolution: string;
  lastSeen: string;
  isCurrent?: boolean;
}

const STORAGE_KEY_DEVICE_ID = 'titan_local_device_id_v2';
const STORAGE_KEY_CUSTOM_NAME = 'titan_local_device_custom_name_v2';
const STORAGE_KEY_PAIRED_DEVICES = 'titan_known_paired_devices_v2';

class DeviceDetector {
  private deviceId: string;

  constructor() {
    this.deviceId = this.getOrCreateDeviceId();
  }

  private getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') return 'dev_server';
    let id = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_DEVICE_ID, id);
    }
    return id;
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  public getCurrentDevice(): DeviceMetadata {
    if (typeof window === 'undefined') {
      return {
        deviceId: 'dev_server',
        deviceName: 'Server Environment',
        deviceType: 'DESKTOP',
        os: 'Linux',
        browser: 'NodeJS',
        screenResolution: '1920x1080',
        lastSeen: new Date().toISOString(),
        isCurrent: true
      };
    }

    const ua = navigator.userAgent || '';
    let os = 'Unknown OS';
    let deviceType: DeviceType = 'DESKTOP';
    let browser = 'Browser';

    // Detect OS
    if (/iPhone/i.test(ua)) {
      os = 'iOS';
      deviceType = 'MOBILE';
    } else if (/iPad/i.test(ua)) {
      os = 'iPadOS';
      deviceType = 'TABLET';
    } else if (/Android/i.test(ua)) {
      os = 'Android';
      deviceType = /Mobile/i.test(ua) ? 'MOBILE' : 'TABLET';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      os = 'macOS';
      deviceType = 'DESKTOP';
    } else if (/Windows NT 10.0/i.test(ua)) {
      os = 'Windows 11 / 10';
      deviceType = 'DESKTOP';
    } else if (/Windows/i.test(ua)) {
      os = 'Windows PC';
      deviceType = 'DESKTOP';
    } else if (/Linux/i.test(ua)) {
      os = 'Linux';
      deviceType = 'DESKTOP';
    }

    // Detect Browser
    if (/Edg\//i.test(ua)) {
      browser = 'Microsoft Edge';
    } else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
      browser = 'Google Chrome';
    } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
      browser = 'Apple Safari';
    } else if (/Firefox\//i.test(ua)) {
      browser = 'Mozilla Firefox';
    }

    const customName = localStorage.getItem(STORAGE_KEY_CUSTOM_NAME);
    const defaultName = customName || (
      deviceType === 'MOBILE'
        ? `${os} Phone (${browser.split(' ')[0]})`
        : deviceType === 'TABLET'
        ? `${os} Tablet`
        : `${os} (${browser.split(' ')[0]})`
    );

    const screenRes = `${window.screen?.width || 0}x${window.screen?.height || 0}`;

    return {
      deviceId: this.deviceId,
      deviceName: defaultName,
      deviceType,
      os,
      browser,
      screenResolution: screenRes,
      lastSeen: new Date().toISOString(),
      isCurrent: true
    };
  }

  public setCustomDeviceName(name: string) {
    if (typeof window === 'undefined') return;
    if (name && name.trim()) {
      localStorage.setItem(STORAGE_KEY_CUSTOM_NAME, name.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_NAME);
    }
  }

  public getKnownPairedDevices(): DeviceMetadata[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PAIRED_DEVICES);
      const list: DeviceMetadata[] = raw ? JSON.parse(raw) : [];
      const current = this.getCurrentDevice();

      // Ensure current device is always present and marked current
      const filtered = list.filter(d => d.deviceId !== current.deviceId);
      return [current, ...filtered];
    } catch {
      return [this.getCurrentDevice()];
    }
  }

  public savePairedDevice(device: DeviceMetadata) {
    if (typeof window === 'undefined') return;
    try {
      const currentId = this.getDeviceId();
      if (device.deviceId === currentId) return;

      const devices = this.getKnownPairedDevices().filter(d => d.deviceId !== currentId && d.deviceId !== device.deviceId);
      const updated = [this.getCurrentDevice(), { ...device, isCurrent: false, lastSeen: new Date().toISOString() }, ...devices];
      localStorage.setItem(STORAGE_KEY_PAIRED_DEVICES, JSON.stringify(updated.slice(0, 10)));
    } catch {
      // Ignore
    }
  }

  public clearPairedDevices() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY_PAIRED_DEVICES);
    } catch {
      // Ignore
    }
  }
}

export const deviceDetector = new DeviceDetector();
