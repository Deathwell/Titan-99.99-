import {
  DailyQuest,
  DecayPenaltyEvent,
  DimensionWeights,
  FinanceStudyLogEntry,
  HistoricalSnapshot,
  NightlyRewardClaim,
  TacticalAlarm,
  UserMetricsState,
  UserProfile,
  WorkoutLogEntry
} from '../types/titan';
import {
  CLEAN_START_METRICS,
  CLEAN_START_PROFILE,
  DEFAULT_DAILY_QUESTS,
  DEMO_METRICS,
  DEMO_USER_PROFILE,
  generateCleanStartHistory,
  generateDemoHistory
} from './defaultData';
import { DEFAULT_WEIGHTS } from './statsEngine';

const STORAGE_KEYS = {
  PROFILE: 'titan_protocol_profile_v2',
  METRICS: 'titan_protocol_metrics_v2',
  WEIGHTS: 'titan_protocol_weights_v2',
  WORKOUT_LOGS: 'titan_protocol_workout_logs_v2',
  FINANCE_LOGS: 'titan_protocol_finance_logs_v2',
  HISTORY: 'titan_protocol_history_v2',
  QUESTS: 'titan_protocol_quests_v2',
  DECAY_LOGS: 'titan_protocol_decay_logs_v2',
  NIGHTLY_REWARDS: 'titan_protocol_nightly_rewards_v2',
  ALARMS: 'titan_protocol_alarms_v2'
};

export const DEFAULT_TACTICAL_ALARMS: TacticalAlarm[] = [
  {
    id: 'alarm-study-11am',
    time24h: '11:00',
    label: 'Institutional Finance Command',
    voiceMessage: 'Good morning, Operator. It is precisely 11:00 AM. Your institutional finance mastery protocol is now active. Time to dominate the models and outrank the world.',
    category: 'STUDY',
    soundStyle: 'TACTICAL_SIREN',
    voicePitch: 0.98,
    voiceRate: 0.94,
    isEnabled: false,
    repeatDaily: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'alarm-workout-630am',
    time24h: '06:30',
    label: 'Morning Endurance Protocol',
    voiceMessage: 'Reveille, Operator. 06:30 hours. Initiating your 1-hour aerobic endurance mission. Mitochondrial optimization is now in progress.',
    category: 'WORKOUT',
    soundStyle: 'MILITARY_KLAXON',
    voicePitch: 0.98,
    voiceRate: 0.94,
    isEnabled: false,
    repeatDaily: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'alarm-strength-5pm',
    time24h: '17:00',
    label: 'Heavy Strength Battle Stations',
    voiceMessage: 'Combat readiness alert. It is 17:00 hours. Initiating heavy compound resistance protocol. Let us forge maximum relative power.',
    category: 'STRENGTH',
    soundStyle: 'NEON_ARCADIA',
    voicePitch: 0.98,
    voiceRate: 0.94,
    isEnabled: false,
    repeatDaily: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'alarm-nightly-reward',
    time24h: '22:30',
    label: 'Guilt-Free Nightly Reward Protocol',
    voiceMessage: 'Daily protocol executed with 100% efficiency. It is 22:30 hours. Your guilt-free nightly reward is now unlocked. Decompress and enjoy, Operator.',
    category: 'REST',
    soundStyle: 'SUB_BASS_PULSE',
    voicePitch: 0.98,
    voiceRate: 0.94,
    isEnabled: false,
    repeatDaily: true,
    createdAt: new Date().toISOString()
  }
];

export interface FullBackupPayload {
  version: string;
  exportedAt: string;
  profile: UserProfile;
  metrics: UserMetricsState;
  weights: DimensionWeights;
  workoutLogs: WorkoutLogEntry[];
  financeLogs: FinanceStudyLogEntry[];
  history: HistoricalSnapshot[];
  quests: DailyQuest[];
  decayLogs?: DecayPenaltyEvent[];
  nightlyRewards?: NightlyRewardClaim[];
  alarms?: TacticalAlarm[];
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return CLEAN_START_PROFILE;
    return { ...CLEAN_START_PROFILE, ...JSON.parse(raw) };
  } catch {
    return CLEAN_START_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function loadMetrics(): UserMetricsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.METRICS);
    if (!raw) return CLEAN_START_METRICS;
    return { ...CLEAN_START_METRICS, ...JSON.parse(raw) };
  } catch {
    return CLEAN_START_METRICS;
  }
}

export function saveMetrics(metrics: UserMetricsState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
  } catch (e) {
    console.error('Failed to save metrics:', e);
  }
}

export function loadWeights(): DimensionWeights {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
    if (!raw) return DEFAULT_WEIGHTS;
    return { ...DEFAULT_WEIGHTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_WEIGHTS;
  }
}

export function saveWeights(weights: DimensionWeights): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
  } catch (e) {
    console.error('Failed to save weights:', e);
  }
}

export function loadWorkoutLogs(): WorkoutLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWorkoutLogs(logs: WorkoutLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save workout logs:', e);
  }
}

export function loadFinanceLogs(): FinanceStudyLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FINANCE_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveFinanceLogs(logs: FinanceStudyLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FINANCE_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save finance logs:', e);
  }
}

export function loadHistory(): HistoricalSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return generateCleanStartHistory();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateCleanStartHistory();
  } catch {
    return generateCleanStartHistory();
  }
}

export function saveHistory(history: HistoricalSnapshot[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
}

export function loadQuests(): DailyQuest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!raw) return DEFAULT_DAILY_QUESTS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DAILY_QUESTS;
  }
}

export function saveQuests(quests: DailyQuest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  } catch (e) {
    console.error('Failed to save quests:', e);
  }
}

export function loadDecayLogs(): DecayPenaltyEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DECAY_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDecayLogs(logs: DecayPenaltyEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DECAY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save decay logs:', e);
  }
}

export function loadNightlyRewards(): NightlyRewardClaim[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NIGHTLY_REWARDS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveNightlyRewards(rewards: NightlyRewardClaim[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NIGHTLY_REWARDS, JSON.stringify(rewards));
  } catch (e) {
    console.error('Failed to save nightly rewards:', e);
  }
}

export function loadAlarms(): TacticalAlarm[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALARMS);
    if (!raw) return DEFAULT_TACTICAL_ALARMS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TACTICAL_ALARMS;
  }
}

export function saveAlarms(alarms: TacticalAlarm[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ALARMS, JSON.stringify(alarms));
  } catch (e) {
    console.error('Failed to save alarms:', e);
  }
}

export function exportBackupJSON(): void {
  const payload: FullBackupPayload = {
    version: '2.6.0',
    exportedAt: new Date().toISOString(),
    profile: loadProfile(),
    metrics: loadMetrics(),
    weights: loadWeights(),
    workoutLogs: loadWorkoutLogs(),
    financeLogs: loadFinanceLogs(),
    history: loadHistory(),
    quests: loadQuests(),
    decayLogs: loadDecayLogs(),
    nightlyRewards: loadNightlyRewards(),
    alarms: loadAlarms()
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateTag = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `TITAN_PROTOCOL_BACKUP_${dateTag}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importBackupJSON(jsonString: string): FullBackupPayload {
  const parsed = JSON.parse(jsonString) as Partial<FullBackupPayload>;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON format for backup file.');
  }

  if (parsed.profile) saveProfile(parsed.profile);
  if (parsed.metrics) saveMetrics(parsed.metrics);
  if (parsed.weights) saveWeights(parsed.weights);
  if (parsed.workoutLogs) saveWorkoutLogs(parsed.workoutLogs);
  if (parsed.financeLogs) saveFinanceLogs(parsed.financeLogs);
  if (parsed.history) saveHistory(parsed.history);
  if (parsed.quests) saveQuests(parsed.quests);
  if (parsed.decayLogs) saveDecayLogs(parsed.decayLogs);
  if (parsed.nightlyRewards) saveNightlyRewards(parsed.nightlyRewards);
  if (parsed.alarms) saveAlarms(parsed.alarms);

  return {
    version: parsed.version || '2.6.0',
    exportedAt: parsed.exportedAt || new Date().toISOString(),
    profile: loadProfile(),
    metrics: loadMetrics(),
    weights: loadWeights(),
    workoutLogs: loadWorkoutLogs(),
    financeLogs: loadFinanceLogs(),
    history: loadHistory(),
    quests: loadQuests(),
    decayLogs: loadDecayLogs(),
    nightlyRewards: loadNightlyRewards(),
    alarms: loadAlarms()
  };
}

export function resetToCleanSlate(): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(CLEAN_START_PROFILE));
  localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(CLEAN_START_METRICS));
  localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(DEFAULT_WEIGHTS));
  localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.FINANCE_LOGS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(generateCleanStartHistory(CLEAN_START_METRICS)));
  localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(DEFAULT_DAILY_QUESTS));
  localStorage.setItem(STORAGE_KEYS.DECAY_LOGS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.NIGHTLY_REWARDS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.ALARMS, JSON.stringify(DEFAULT_TACTICAL_ALARMS));
}

export function loadDemoDataset(): void {
  saveProfile(DEMO_USER_PROFILE);
  saveMetrics(DEMO_METRICS);
  saveWeights(DEFAULT_WEIGHTS);
  saveHistory(generateDemoHistory());
  saveQuests(DEFAULT_DAILY_QUESTS);
  saveAlarms(DEFAULT_TACTICAL_ALARMS);
}
