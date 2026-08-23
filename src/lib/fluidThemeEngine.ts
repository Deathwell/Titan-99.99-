export type FluidThemeId = 'crimson' | 'gold' | 'violet' | 'cyan' | 'emerald';

export interface FluidThemeConfig {
  id: FluidThemeId;
  name: string;
  shortName: string;
  iconColor: string;
  accentHex: string;
  baseHue: number;
  hueRange: number;
  sat: number;
  baseLight: number;
  shockwaveHue: number;
  ambientHue: number;
  gradientCoreOffset: number;
  gradientMidOffset: number;
  gradientOuterOffset: number;
}

export const FLUID_THEMES: Record<FluidThemeId, FluidThemeConfig> = {
  crimson: {
    id: 'crimson',
    name: 'Crimson Blood',
    shortName: 'Crimson',
    iconColor: 'from-rose-500 to-red-600',
    accentHex: '#ff2e4d',
    baseHue: 346,
    hueRange: 14,
    sat: 96,
    baseLight: 44,
    shockwaveHue: 350,
    ambientHue: 348,
    gradientCoreOffset: 8,
    gradientMidOffset: 0,
    gradientOuterOffset: -14
  },
  gold: {
    id: 'gold',
    name: 'Molten Gold',
    shortName: 'Gold',
    iconColor: 'from-amber-400 to-yellow-600',
    accentHex: '#fbbf24',
    baseHue: 38,
    hueRange: 12,
    sat: 98,
    baseLight: 48,
    shockwaveHue: 42,
    ambientHue: 40,
    gradientCoreOffset: 12,
    gradientMidOffset: 0,
    gradientOuterOffset: -16
  },
  violet: {
    id: 'violet',
    name: 'Cyber Violet',
    shortName: 'Violet',
    iconColor: 'from-fuchsia-500 to-purple-600',
    accentHex: '#c084fc',
    baseHue: 280,
    hueRange: 16,
    sat: 95,
    baseLight: 48,
    shockwaveHue: 285,
    ambientHue: 278,
    gradientCoreOffset: 10,
    gradientMidOffset: 0,
    gradientOuterOffset: -15
  },
  cyan: {
    id: 'cyan',
    name: 'Hyperdrive Cyan',
    shortName: 'Cyan',
    iconColor: 'from-cyan-400 to-blue-600',
    accentHex: '#06b6d4',
    baseHue: 188,
    hueRange: 14,
    sat: 96,
    baseLight: 46,
    shockwaveHue: 192,
    ambientHue: 195,
    gradientCoreOffset: 10,
    gradientMidOffset: 0,
    gradientOuterOffset: -16
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Matrix',
    shortName: 'Emerald',
    iconColor: 'from-emerald-400 to-teal-600',
    accentHex: '#10b981',
    baseHue: 152,
    hueRange: 14,
    sat: 96,
    baseLight: 44,
    shockwaveHue: 154,
    ambientHue: 156,
    gradientCoreOffset: 10,
    gradientMidOffset: 0,
    gradientOuterOffset: -16
  }
};

const STORAGE_KEY = 'titan_fluid_theme_id';

class FluidThemeManager {
  private currentThemeId: FluidThemeId = 'crimson';
  private listeners: ((theme: FluidThemeConfig) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as FluidThemeId | null;
      if (saved && FLUID_THEMES[saved]) {
        this.currentThemeId = saved;
      }
    }
  }

  public getTheme(): FluidThemeConfig {
    return FLUID_THEMES[this.currentThemeId] || FLUID_THEMES.crimson;
  }

  public getThemeId(): FluidThemeId {
    return this.currentThemeId;
  }

  public setTheme(themeId: FluidThemeId) {
    if (!FLUID_THEMES[themeId]) return;
    this.currentThemeId = themeId;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, themeId);
      window.dispatchEvent(new CustomEvent('titan-fluid-theme-changed', { detail: themeId }));
    }
    const config = this.getTheme();
    this.listeners.forEach(fn => fn(config));
  }

  public subscribe(fn: (theme: FluidThemeConfig) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }
}

export const fluidThemeManager = new FluidThemeManager();
