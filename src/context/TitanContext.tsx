import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  BlackMarkEntry,
  CompositeCalculationResult,
  DailyQuest,
  DecayPenaltyEvent,
  DimensionWeights,
  FinanceStudyLogEntry,
  HistoricalSnapshot,
  NeuralVoiceSettings,
  NightlyRewardClaim,
  NightlyRewardKey,
  SyllabusTopic,
  TacticalAlarm,
  UserMetricsState,
  UserProfile,
  WorkoutLogEntry
} from '../types/titan';
import { calculateCompositeState, DEFAULT_WEIGHTS } from '../lib/statsEngine';
import { soundEngine } from '../lib/audio';
import { neuralVoiceService } from '../lib/neuralVoiceService';
import { cloudSyncEngine } from '../lib/syncEngine';
import { DeviceMetadata } from '../lib/deviceDetector';
import { tacticalPushService } from '../lib/pushNotifications';
import {
  exportBackupJSON,
  importBackupJSON,
  loadAlarms,
  loadDecayLogs,
  loadFinanceLogs,
  loadHistory,
  loadMetrics,
  loadNightlyRewards,
  loadProfile,
  loadQuests,
  loadWeights,
  loadWorkoutLogs,
  resetToCleanSlate,
  saveAlarms,
  saveDecayLogs,
  saveFinanceLogs,
  saveHistory,
  saveMetrics,
  saveNightlyRewards,
  saveProfile,
  saveQuests,
  saveWeights,
  saveWorkoutLogs,
  loadDemoDataset,
  FullBackupPayload
} from '../lib/storage';
import {
  CLEAN_START_METRICS,
  CLEAN_START_PROFILE,
  DEFAULT_DAILY_QUESTS,
  DEMO_METRICS,
  DEMO_USER_PROFILE,
  generateCleanStartHistory,
  generateDemoHistory,
  SYLLABUS_TOPICS
} from '../lib/defaultData';

export type DailyAccomplishmentType = 'ENDURANCE' | 'STRENGTH' | 'MODELING' | 'QUANT';

interface TitanContextType {
  profile: UserProfile;
  metrics: UserMetricsState;
  weights: DimensionWeights;
  workoutLogs: WorkoutLogEntry[];
  financeLogs: FinanceStudyLogEntry[];
  history: HistoricalSnapshot[];
  quests: DailyQuest[];
  decayLogs: DecayPenaltyEvent[];
  nightlyRewards: NightlyRewardClaim[];
  todayRewardClaim: NightlyRewardClaim | null;
  alarms: TacticalAlarm[];
  activeAlarmRinging: TacticalAlarm | null;
  composite: CompositeCalculationResult;
  activeTab: 'overview' | 'charts' | 'physique' | 'finance' | 'alarms' | 'quests' | 'curriculum' | 'hologram';
  setActiveTab: (tab: 'overview' | 'charts' | 'physique' | 'finance' | 'alarms' | 'quests' | 'curriculum' | 'hologram') => void;
  
  // Modals & Banners
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isBackupOpen: boolean;
  setIsBackupOpen: (open: boolean) => void;
  isSyncModalOpen: boolean;
  setIsSyncModalOpen: (open: boolean) => void;
  isMobilePushSetupOpen: boolean;
  setIsMobilePushSetupOpen: (open: boolean) => void;
  isVictoryModalOpen: boolean;
  openVictoryModal: () => void;
  closeVictoryModal: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  analyticsSubTab: 'CHARTS' | 'ALARMS' | 'CURRICULUM' | 'DOSSIER';
  setAnalyticsSubTab: (tab: 'CHARTS' | 'ALARMS' | 'CURRICULUM' | 'DOSSIER') => void;
  openAlarmsTab: () => void;
  activeQuizTopic: SyllabusTopic | null;
  setActiveQuizTopic: (topic: SyllabusTopic | null) => void;
  activeDecayAlert: DecayPenaltyEvent | null;
  dismissDecayAlert: () => void;

  // Real-Time Cross Device Cloud Sync
  syncCode: string | null;
  syncStatus: 'DISCONNECTED' | 'CONNECTING' | 'SYNCED' | 'SYNCING' | 'ERROR';
  lastSyncedAt: string | null;
  pairedDevices: DeviceMetadata[];
  currentDevice: DeviceMetadata;
  setCustomDeviceName: (name: string) => void;
  generateNewSyncKey: () => Promise<string | null>;
  connectSyncCode: (code: string) => Promise<boolean>;
  disconnectSync: () => void;
  forcePushCloud: () => Promise<boolean>;
  forcePullCloud: () => Promise<boolean>;

  // Push Notification & Black Mark Methods
  requestPushPermission: () => Promise<boolean>;
  sendTestPushAlert: () => void;

  // Actions
  updateMetrics: (partial: Partial<UserMetricsState>) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  updateWeights: (weights: DimensionWeights) => void;
  updateNeuralVoiceSettings: (settings: Partial<NeuralVoiceSettings>) => void;
  addWorkoutLog: (entry: Omit<WorkoutLogEntry, 'id' | 'timestamp' | 'dateDisplay'>) => void;
  addFinanceLog: (entry: Omit<FinanceStudyLogEntry, 'id' | 'timestamp' | 'dateDisplay'>) => void;
  toggleDailyAccomplishment: (type: DailyAccomplishmentType) => boolean;
  setDailyTaskDuration: (type: DailyAccomplishmentType, durationMinutes: number) => void;
  claimNightlyReward: (key: NightlyRewardKey, customNote?: string) => void;
  toggleQuest: (id: string) => void;
  submitQuizScore: (topic: SyllabusTopic, scorePercentage: number) => void;
  toggleSound: () => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
  resetAllData: () => void;
  loadDemoMode: () => void;
  gainXP: (amount: number) => void;

  // Tactical Alarm Actions
  addAlarm: (alarm: Omit<TacticalAlarm, 'id' | 'createdAt'>) => void;
  updateAlarm: (id: string, partial: Partial<TacticalAlarm>) => void;
  deleteAlarm: (id: string) => void;
  triggerAlarmDirectly: (alarm: TacticalAlarm) => void;
  dismissAlarm: () => void;
  snoozeAlarm: (minutes?: number) => void;

  // Real-Time Decay & Punishment Controls
  simulateMissedDays: (missedCount: number) => void;
  clearDecayPenalty: () => void;
}

const TitanContext = createContext<TitanContextType | undefined>(undefined);

function getDaysBetween(dateStr1: string, dateStr2: string): number {
  try {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export const TitanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [metrics, setMetrics] = useState<UserMetricsState>(loadMetrics);
  const [weights, setWeights] = useState<DimensionWeights>(loadWeights);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>(loadWorkoutLogs);
  const [financeLogs, setFinanceLogs] = useState<FinanceStudyLogEntry[]>(loadFinanceLogs);
  const [history, setHistory] = useState<HistoricalSnapshot[]>(loadHistory);
  const [quests, setQuests] = useState<DailyQuest[]>(loadQuests);
  const [decayLogs, setDecayLogs] = useState<DecayPenaltyEvent[]>(loadDecayLogs);
  const [nightlyRewards, setNightlyRewards] = useState<NightlyRewardClaim[]>(loadNightlyRewards);
  const [alarms, setAlarms] = useState<TacticalAlarm[]>(loadAlarms);
  const [activeAlarmRinging, setActiveAlarmRinging] = useState<TacticalAlarm | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'physique' | 'finance' | 'alarms' | 'quests' | 'curriculum' | 'hologram'>('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isMobilePushSetupOpen, setIsMobilePushSetupOpen] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'CHARTS' | 'ALARMS' | 'CURRICULUM' | 'DOSSIER'>('CHARTS');
  const [activeQuizTopic, setActiveQuizTopic] = useState<SyllabusTopic | null>(null);
  const [activeDecayAlert, setActiveDecayAlert] = useState<DecayPenaltyEvent | null>(null);

  const openAlarmsTab = () => {
    setActiveTab('charts');
    setAnalyticsSubTab('ALARMS');
    soundEngine.playClick(750);
  };

  // Listen globally for ⌘K or Ctrl+K
  useEffect(() => {
    const handleGlobalKbd = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKbd);
    return () => window.removeEventListener('keydown', handleGlobalKbd);
  }, []);

  const [syncCode, setSyncCode] = useState<string | null>(cloudSyncEngine.getStoredSyncCode);
  const [syncStatus, setSyncStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'SYNCED' | 'SYNCING' | 'ERROR'>(
    cloudSyncEngine.getStoredSyncCode() ? 'SYNCED' : 'DISCONNECTED'
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [pairedDevices, setPairedDevices] = useState<DeviceMetadata[]>(() => cloudSyncEngine.getPairedDevices());

  const currentDevice = useMemo(() => cloudSyncEngine.getCurrentDevice(), [pairedDevices]);

  const setCustomDeviceName = (name: string) => {
    cloudSyncEngine.setCustomDeviceName(name);
    setPairedDevices(cloudSyncEngine.getPairedDevices());
  };

  const [lastTriggeredMinute, setLastTriggeredMinute] = useState<string>('');
  const isRemoteApplyingRef = useRef(false);

  useEffect(() => {
    soundEngine.setEnabled(profile.soundEnabled);
  }, [profile.soundEnabled]);

  const composite = useMemo(() => {
    return calculateCompositeState(metrics, weights, profile.xp, profile.streakDays);
  }, [metrics, weights, profile.xp, profile.streakDays]);

  // Today's active reward claim
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayRewardClaim = useMemo(() => {
    return nightlyRewards.find(r => r.date === todayDateStr) || null;
  }, [nightlyRewards, todayDateStr]);

  // Handle incoming remote sync updates from paired device
  const handleRemoteCloudUpdate = (payload: FullBackupPayload) => {
    if (!payload || !payload.version) return;

    isRemoteApplyingRef.current = true;
    try {
      if (payload.profile) {
        setProfile(prev => {
          // Keep highest XP/level
          const updated = {
            ...prev,
            ...payload.profile,
            xp: Math.max(prev.xp, payload.profile.xp || 0),
            level: Math.max(prev.level, payload.profile.level || 1),
            streakDays: Math.max(prev.streakDays, payload.profile.streakDays || 0)
          };
          saveProfile(updated);
          return updated;
        });
      }
      if (payload.metrics) {
        setMetrics(prev => {
          const updated = { ...prev, ...payload.metrics };
          saveMetrics(updated);
          return updated;
        });
      }
      if (payload.weights) {
        setWeights(payload.weights);
        saveWeights(payload.weights);
      }
      if (payload.workoutLogs && Array.isArray(payload.workoutLogs)) {
        setWorkoutLogs(prev => {
          const map = new Map<string, WorkoutLogEntry>();
          prev.forEach(w => map.set(w.id, w));
          payload.workoutLogs.forEach(w => map.set(w.id, w));
          const merged = Array.from(map.values()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          saveWorkoutLogs(merged);
          return merged;
        });
      }
      if (payload.financeLogs && Array.isArray(payload.financeLogs)) {
        setFinanceLogs(prev => {
          const map = new Map<string, FinanceStudyLogEntry>();
          prev.forEach(f => map.set(f.id, f));
          payload.financeLogs.forEach(f => map.set(f.id, f));
          const merged = Array.from(map.values()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          saveFinanceLogs(merged);
          return merged;
        });
      }
      if (payload.history && Array.isArray(payload.history)) {
        setHistory(prev => {
          const map = new Map<string, HistoricalSnapshot>();
          prev.forEach(h => map.set(h.date, h));
          payload.history.forEach(h => map.set(h.date, h));
          const merged = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
          saveHistory(merged);
          return merged;
        });
      }
      if (payload.quests) {
        setQuests(payload.quests);
        saveQuests(payload.quests);
      }
      if (payload.decayLogs) {
        setDecayLogs(payload.decayLogs);
        saveDecayLogs(payload.decayLogs);
      }
      if (payload.nightlyRewards) {
        setNightlyRewards(payload.nightlyRewards);
        saveNightlyRewards(payload.nightlyRewards);
      }
      if (payload.alarms && Array.isArray(payload.alarms)) {
        setAlarms(payload.alarms);
        saveAlarms(payload.alarms);
      }

      setSyncStatus('SYNCED');
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setPairedDevices(cloudSyncEngine.getPairedDevices());
    } catch (err) {
      console.warn('Error applying remote cloud update:', err);
    } finally {
      setTimeout(() => {
        isRemoteApplyingRef.current = false;
      }, 500);
    }
  };

  // Check URL query parameters for auto-pairing (?sync=TITAN-XXXX)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSyncCode = urlParams.get('sync');
      if (urlSyncCode && urlSyncCode.trim()) {
        const cleanCode = urlSyncCode.trim().toUpperCase();
        connectSyncCode(cleanCode);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Initialize Real-Time Cloud Sync Listener if sync code exists
  useEffect(() => {
    if (syncCode) {
      setSyncStatus('SYNCED');
      cloudSyncEngine.startRealTimeListener(syncCode, handleRemoteCloudUpdate);
    }
    return () => {
      cloudSyncEngine.stopListener();
    };
  }, [syncCode]);

  // Auto-broadcast local state changes to Cloud Relay if paired
  const broadcastCurrentState = () => {
    if (!syncCode || isRemoteApplyingRef.current) return;

    const payload: FullBackupPayload = {
      version: '2.6.0',
      exportedAt: new Date().toISOString(),
      profile,
      metrics,
      weights,
      workoutLogs,
      financeLogs,
      history,
      quests,
      decayLogs,
      nightlyRewards,
      alarms
    };

    cloudSyncEngine.pushStateToCloud(payload, syncCode);
    setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Broadcast whenever key states mutate
  useEffect(() => {
    if (!isRemoteApplyingRef.current && syncCode) {
      const debounceTimer = setTimeout(() => {
        broadcastCurrentState();
      }, 350);
      return () => clearTimeout(debounceTimer);
    }
  }, [profile, metrics, workoutLogs, financeLogs, alarms, quests, nightlyRewards]);

  // Sync Management methods
  const generateNewSyncKey = async (): Promise<string | null> => {
    const immediateCode = cloudSyncEngine.generateNewSyncCode();
    setSyncCode(immediateCode);
    setSyncStatus('SYNCED');

    const payload: FullBackupPayload = {
      version: '2.6.0',
      exportedAt: new Date().toISOString(),
      profile,
      metrics,
      weights,
      workoutLogs,
      financeLogs,
      history,
      quests,
      decayLogs,
      nightlyRewards,
      alarms
    };

    cloudSyncEngine.startRealTimeListener(immediateCode, handleRemoteCloudUpdate);
    cloudSyncEngine.pushStateToCloud(payload, immediateCode);
    setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    return immediateCode;
  };

  const connectSyncCode = async (code: string): Promise<boolean> => {
    const clean = code.trim().toUpperCase();
    setSyncStatus('CONNECTING');
    setSyncCode(clean);
    cloudSyncEngine.setStoredSyncCode(clean);
    cloudSyncEngine.startRealTimeListener(clean, handleRemoteCloudUpdate);
    setSyncStatus('SYNCED');

    const freshPayload = await cloudSyncEngine.pullStateFromCloud(clean);
    if (freshPayload) {
      handleRemoteCloudUpdate(freshPayload);
      return true;
    } else {
      broadcastCurrentState();
      return true;
    }
  };

  const disconnectSync = () => {
    cloudSyncEngine.stopListener();
    cloudSyncEngine.setStoredSyncCode(null);
    setSyncCode(null);
    setSyncStatus('DISCONNECTED');
    setLastSyncedAt(null);
    soundEngine.playClick(600);
  };

  const forcePushCloud = async (): Promise<boolean> => {
    if (!syncCode) return false;
    const payload: FullBackupPayload = {
      version: '2.6.0',
      exportedAt: new Date().toISOString(),
      profile,
      metrics,
      weights,
      workoutLogs,
      financeLogs,
      history,
      quests,
      decayLogs,
      nightlyRewards,
      alarms
    };
    const success = await cloudSyncEngine.pushStateToCloud(payload, syncCode);
    if (success) {
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      soundEngine.playQuestComplete();
    }
    return success;
  };

  const forcePullCloud = async (): Promise<boolean> => {
    if (!syncCode) return false;
    const fresh = await cloudSyncEngine.pullStateFromCloud(syncCode);
    if (fresh) {
      handleRemoteCloudUpdate(fresh);
      soundEngine.playMilestoneFanfare();
      return true;
    }
    return false;
  };

  // Background Clock Ticker checking for alarms every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime24 = `${currentHours}:${currentMinutes}`;
      const currentFullMinute = `${now.toISOString().split('T')[0]}_${currentTime24}`;

      if (currentFullMinute === lastTriggeredMinute) {
        return; // Already triggered this minute
      }

      // Check armed alarms
      const matchingAlarm = alarms.find(a => a.isEnabled && a.time24h === currentTime24);
      if (matchingAlarm && !activeAlarmRinging) {
        setLastTriggeredMinute(currentFullMinute);
        triggerAlarmDirectly(matchingAlarm);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, activeAlarmRinging, lastTriggeredMinute]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = profile.lastActiveDate || today;
    const diffDays = getDaysBetween(lastActive, today);

    if (diffDays > 1) {
      const missedCount = diffDays - 1;
      executeDecayPenalty(missedCount, `Inactivity Check: ${missedCount} calendar day(s) missed since ${lastActive}`);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setHistory(prev => {
      const existingIdx = prev.findIndex(h => h.date === today);
      const newSnapshot: HistoricalSnapshot = {
        date: today,
        percentileGlobal: Number(composite.percentileGlobal.toFixed(2)),
        percentilePhysique: Number(composite.percentilePhysique.toFixed(2)),
        percentileFinance: Number(composite.percentileFinance.toFixed(2)),
        zGlobal: Number(composite.zGlobal.toFixed(3)),
        gainsRecorded: prev[existingIdx]?.gainsRecorded || workoutLogs.length > 0 || financeLogs.length > 0,
        dayIndex: prev.length
      };

      let nextHistory: HistoricalSnapshot[];
      if (existingIdx >= 0) {
        nextHistory = [...prev];
        nextHistory[existingIdx] = { ...nextHistory[existingIdx], ...newSnapshot };
      } else {
        nextHistory = [...prev, newSnapshot];
      }
      saveHistory(nextHistory);
      return nextHistory;
    });
  }, [composite.percentileGlobal, composite.percentilePhysique, composite.percentileFinance, composite.zGlobal]);

  const executeDecayPenalty = (missedDaysCount: number, reason: string) => {
    if (missedDaysCount <= 0) return;

    let erasedDates: string[] = [];
    const penaltyXP = missedDaysCount * 250;

    setHistory(prev => {
      const activeGainSnapshots = prev.filter(h => h.gainsRecorded && !h.isDecayErased);
      const toEraseCount = Math.min(missedDaysCount, activeGainSnapshots.length);

      if (toEraseCount === 0) return prev;

      const targets = activeGainSnapshots.slice(-toEraseCount);
      erasedDates = targets.map(t => t.date);

      const updated = prev.map(snap => {
        if (erasedDates.includes(snap.date)) {
          const baselinePct = prev[0]?.percentileGlobal || 35.0;
          return {
            ...snap,
            isDecayErased: true,
            percentileGlobal: baselinePct,
            percentilePhysique: baselinePct,
            percentileFinance: baselinePct
          };
        }
        return snap;
      });

      saveHistory(updated);
      return updated;
    });

    const newBlackMark: BlackMarkEntry = {
      id: `mark-${Date.now()}`,
      dateTriggered: new Date().toISOString().split('T')[0],
      penaltyXP,
      missedDaysCount,
      reason,
      status: 'ACTIVE_INFRACTION',
      streakAtInfraction: profile.streakDays || 0,
      consecutiveStreakRequiredToExpunge: 30,
      consecutiveDaysAchieved: 0
    };

    setProfile(prev => {
      const nextXP = Math.max(0, prev.xp - penaltyXP);
      const nextLevel = Math.floor(Math.sqrt(nextXP / 12)) + 1;
      const currentMarks = prev.blackMarks || [];
      const updated: UserProfile = {
        ...prev,
        streakDays: 0,
        xp: nextXP,
        level: Math.max(1, nextLevel),
        decayPenaltyActive: true,
        lastActiveDate: new Date().toISOString().split('T')[0],
        blackMarks: [newBlackMark, ...currentMarks]
      };
      saveProfile(updated);
      return updated;
    });

    const event: DecayPenaltyEvent = {
      id: `decay-${Date.now()}`,
      dateTriggered: new Date().toISOString().split('T')[0],
      missedDaysCount,
      erasedDaysCount: Math.max(1, erasedDates.length || missedDaysCount),
      erasedDates,
      xpDeducted: penaltyXP,
      reason
    };

    setDecayLogs(prev => {
      const next = [event, ...prev];
      saveDecayLogs(next);
      return next;
    });

    setActiveDecayAlert(event);
    soundEngine.playAlert();

    // Dispatch Push Notification Warning
    tacticalPushService.sendNotification({
      title: '☠️ TITAN PUNISHMENT PROTOCOL ACTIVATED',
      body: `A Black Mark has been stamped on your permanent record. -${penaltyXP} XP deducted and prior gains erased.`,
      tag: 'titan-decay-penalty',
      requireInteraction: true
    });
  };

  const requestPushPermission = async (): Promise<boolean> => {
    const granted = await tacticalPushService.requestPermission();
    if (granted) {
      setProfile(prev => {
        const updated = { ...prev, pushNotificationsEnabled: true };
        saveProfile(updated);
        return updated;
      });
    }
    return granted;
  };

  const sendTestPushAlert = () => {
    tacticalPushService.sendNotification({
      title: '🚨 TITAN PROTOCOL • URGENT ACCOUNTABILITY TEST',
      body: 'Tactical link active: 2 hours remaining to lock daily physical and financial mastery before decay engine triggers.',
      tag: `titan-test-${Date.now()}`
    });
  };

  const simulateMissedDays = (missedCount: number) => {
    executeDecayPenalty(missedCount, `Manual Decay Simulation: ${missedCount} Missed Day(s)`);
  };

  const clearDecayPenalty = () => {
    setProfile(prev => {
      const updated = { ...prev, decayPenaltyActive: false };
      saveProfile(updated);
      return updated;
    });
    setActiveDecayAlert(null);
    soundEngine.playClick(800);
  };

  const dismissDecayAlert = () => {
    setActiveDecayAlert(null);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#06b6d4', '#10b981', '#a855f7', '#fbbf24', '#f43f5e']
      });
    } catch {
      // Ignore
    }
  };

  const openVictoryModal = () => {
    setIsVictoryModalOpen(true);
    soundEngine.playMilestoneFanfare();
    triggerConfetti();
  };

  const closeVictoryModal = () => {
    setIsVictoryModalOpen(false);
  };

  const claimNightlyReward = (key: NightlyRewardKey, customNote?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const titles: Record<NightlyRewardKey, string> = {
      GAMING: 'Unrestricted Gaming Night',
      MEDIA: 'Cinema & Media Immersion',
      SOCIAL_HANGOUT: 'Night Out with Friends',
      OUTSIDE_FOOD: 'Guilt-Free Outside Feast',
      PLEASURE_RELEASE: 'Sensory Pleasure & Release',
      DEEP_REST: 'Unapologetic Deep Sleep',
      CUSTOM: customNote || 'Custom Nightly Indulgence'
    };

    const icons: Record<NightlyRewardKey, string> = {
      GAMING: '🎮',
      MEDIA: '🎬',
      SOCIAL_HANGOUT: '🍻',
      OUTSIDE_FOOD: '🍕',
      PLEASURE_RELEASE: '🔞',
      DEEP_REST: '🛌',
      CUSTOM: '✍️'
    };

    const newClaim: NightlyRewardClaim = {
      id: `reward-${Date.now()}`,
      date: today,
      rewardKey: key,
      title: titles[key],
      icon: icons[key],
      customNote,
      claimedAt: nowTime
    };

    setNightlyRewards(prev => {
      const filtered = prev.filter(r => r.date !== today);
      const updated = [newClaim, ...filtered];
      saveNightlyRewards(updated);
      return updated;
    });

    gainXP(150);
    soundEngine.playMilestoneFanfare();
    triggerConfetti();
  };

  const gainXP = (amount: number) => {
    setProfile(prev => {
      const newXP = Math.max(0, prev.xp + amount);
      const newLevel = Math.floor(Math.sqrt(newXP / 12)) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        soundEngine.playLevelUp();
        triggerConfetti();
      }

      const today = new Date().toISOString().split('T')[0];
      const streakIncrement = (amount > 0 && prev.lastActiveDate !== today) ? 1 : 0;

      const updated = {
        ...prev,
        xp: newXP,
        level: Math.max(1, newLevel),
        streakDays: Math.max(0, prev.streakDays + streakIncrement),
        lastActiveDate: today,
        decayPenaltyActive: false
      };
      saveProfile(updated);
      return updated;
    });
  };

  const updateMetrics = (partial: Partial<UserMetricsState>) => {
    setMetrics(prev => {
      const next = { ...prev, ...partial };
      const bw = next.bodyWeightKg || 75;
      next.benchPressBW = Number((next.benchPressKg / bw).toFixed(3));
      next.deadliftBW = Number((next.deadliftKg / bw).toFixed(3));

      saveMetrics(next);
      soundEngine.playClick(920);

      const testComp = calculateCompositeState(next, weights);
      if (testComp.percentileGlobal >= 99.0 && composite.percentileGlobal < 99.0) {
        soundEngine.playMilestoneFanfare();
        triggerConfetti();
      }

      return next;
    });
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...partial };
      saveProfile(next);
      return next;
    });
  };

  const updateWeights = (newWeights: DimensionWeights) => {
    setWeights(newWeights);
    saveWeights(newWeights);
    soundEngine.playClick(750);
  };

  const updateNeuralVoiceSettings = (newSettings: Partial<NeuralVoiceSettings>) => {
    setProfile(prev => {
      const current = prev.neuralVoice || {
        provider: 'OPENAI_GPT4O',
        openaiVoice: 'nova',
        studioMasteringEnabled: true
      };
      const updatedVoice = { ...current, ...newSettings };
      const updated = { ...prev, neuralVoice: updatedVoice };
      saveProfile(updated);
      return updated;
    });
  };

  const addWorkoutLog = (entry: Omit<WorkoutLogEntry, 'id' | 'timestamp' | 'dateDisplay'>) => {
    const now = new Date();
    const id = `w-${Date.now()}`;
    const newLog: WorkoutLogEntry = {
      ...entry,
      id,
      timestamp: now.toISOString(),
      dateDisplay: 'Today'
    };

    const updatedLogs = [newLog, ...workoutLogs];
    setWorkoutLogs(updatedLogs);
    saveWorkoutLogs(updatedLogs);

    soundEngine.playQuestComplete();

    const today = now.toISOString().split('T')[0];
    setHistory(prev => {
      const next = prev.map(h => h.date === today ? { ...h, gainsRecorded: true, isDecayErased: false } : h);
      saveHistory(next);
      return next;
    });

    gainXP(250 + Math.floor(entry.durationMinutes * 3));
  };

  const addFinanceLog = (entry: Omit<FinanceStudyLogEntry, 'id' | 'timestamp' | 'dateDisplay'>) => {
    const now = new Date();
    const id = `f-${Date.now()}`;
    const newLog: FinanceStudyLogEntry = {
      ...entry,
      id,
      timestamp: now.toISOString(),
      dateDisplay: 'Today'
    };

    const updatedLogs = [newLog, ...financeLogs];
    setFinanceLogs(updatedLogs);
    saveFinanceLogs(updatedLogs);

    const topic = SYLLABUS_TOPICS.find(s => s.id === entry.topicId);
    if (topic) {
      const dim = topic.targetDimension;
      if (entry.scoreAchieved > metrics[dim]) {
        updateMetrics({ [dim]: entry.scoreAchieved });
      }
    }

    soundEngine.playQuestComplete();

    const today = now.toISOString().split('T')[0];
    setHistory(prev => {
      const next = prev.map(h => h.date === today ? { ...h, gainsRecorded: true, isDecayErased: false } : h);
      saveHistory(next);
      return next;
    });

    gainXP(200 + entry.scoreAchieved * 2);
  };

  const toggleDailyAccomplishment = (type: DailyAccomplishmentType): boolean => {
    const todayStr = new Date().toISOString().split('T')[0];
    let isRecordedNow = false;

    if (type === 'ENDURANCE') {
      const existingIdx = workoutLogs.findIndex(w => w.pillar === 'ENDURANCE' && w.timestamp.startsWith(todayStr));
      if (existingIdx >= 0) {
        const updated = workoutLogs.filter((_, idx) => idx !== existingIdx);
        setWorkoutLogs(updated);
        saveWorkoutLogs(updated);
        updateMetrics({ vo2Max: Math.max(25, Number((metrics.vo2Max - 0.4).toFixed(1))), run15Mile: metrics.run15Mile + 4 });
        gainXP(-350);
        soundEngine.playClick(600);
        isRecordedNow = false;
      } else {
        addWorkoutLog({
          pillar: 'ENDURANCE',
          title: '1 Hour Endurance / Zone 2 Base',
          durationMinutes: 60,
          intensity: 'ZONE_2_STEADY',
          peakHeartRateBpm: 152,
          caloricBurn: 620,
          notes: 'Logged 1-hour aerobic endurance mission.'
        });
        updateMetrics({ vo2Max: Math.min(75, Number((metrics.vo2Max + 0.4).toFixed(1))), run15Mile: Math.max(480, metrics.run15Mile - 4) });
        isRecordedNow = true;
      }
    } else if (type === 'STRENGTH') {
      const existingIdx = workoutLogs.findIndex(w => w.pillar === 'STRENGTH' && w.timestamp.startsWith(todayStr));
      if (existingIdx >= 0) {
        const updated = workoutLogs.filter((_, idx) => idx !== existingIdx);
        setWorkoutLogs(updated);
        saveWorkoutLogs(updated);
        updateMetrics({ benchPressKg: Math.max(40, metrics.benchPressKg - 1.5), deadliftKg: Math.max(60, metrics.deadliftKg - 2.5) });
        gainXP(-350);
        soundEngine.playClick(600);
        isRecordedNow = false;
      } else {
        addWorkoutLog({
          pillar: 'STRENGTH',
          title: '1 Hour Heavy Compound Strength',
          durationMinutes: 60,
          intensity: 'HEAVY_RESISTANCE',
          peakHeartRateBpm: 160,
          caloricBurn: 490,
          notes: 'Logged 1-hour compound strength session.'
        });
        updateMetrics({ benchPressKg: Math.min(220, metrics.benchPressKg + 1.5), deadliftKg: Math.min(350, metrics.deadliftKg + 2.5) });
        isRecordedNow = true;
      }
    } else if (type === 'MODELING') {
      const existingIdx = financeLogs.findIndex(f => (f.discipline === 'PRIVATE_EQUITY' || f.discipline === 'INVESTMENT_BANKING') && f.timestamp.startsWith(todayStr));
      if (existingIdx >= 0) {
        const updated = financeLogs.filter((_, idx) => idx !== existingIdx);
        setFinanceLogs(updated);
        saveFinanceLogs(updated);
        updateMetrics({ transactionStructuring: Math.max(0, metrics.transactionStructuring - 2) });
        gainXP(-350);
        soundEngine.playClick(600);
        isRecordedNow = false;
      } else {
        addFinanceLog({
          discipline: 'PRIVATE_EQUITY',
          topicId: 'syl-01',
          topicName: 'LBO Debt Structuring & Cash Sweeps',
          durationMinutes: 60,
          scoreAchieved: 94,
          notes: '1-Hour institutional modeling drill completed.'
        });
        updateMetrics({ transactionStructuring: Math.min(100, metrics.transactionStructuring + 2) });
        isRecordedNow = true;
      }
    } else if (type === 'QUANT') {
      const existingIdx = financeLogs.findIndex(f => (f.discipline === 'QUANT_DERIVATIVES' || f.discipline === 'FACTOR_RISK') && f.timestamp.startsWith(todayStr));
      if (existingIdx >= 0) {
        const updated = financeLogs.filter((_, idx) => idx !== existingIdx);
        setFinanceLogs(updated);
        saveFinanceLogs(updated);
        updateMetrics({ quantitativeDerivatives: Math.max(0, metrics.quantitativeDerivatives - 2) });
        gainXP(-350);
        soundEngine.playClick(600);
        isRecordedNow = false;
      } else {
        addFinanceLog({
          discipline: 'QUANT_DERIVATIVES',
          topicId: 'syl-02',
          topicName: 'Option Greeks & Vol Surface Fitting',
          durationMinutes: 60,
          scoreAchieved: 92,
          notes: '1-Hour quantitative derivatives drill completed.'
        });
        updateMetrics({ quantitativeDerivatives: Math.min(100, metrics.quantitativeDerivatives + 2) });
        isRecordedNow = true;
      }
    }

    if (isRecordedNow) {
      setTimeout(() => {
        const currentWorkouts = loadWorkoutLogs().filter(w => w.timestamp.startsWith(todayStr));
        const currentFinance = loadFinanceLogs().filter(f => f.timestamp.startsWith(todayStr));
        const eDone = currentWorkouts.some(w => w.pillar === 'ENDURANCE');
        const sDone = currentWorkouts.some(w => w.pillar === 'STRENGTH');
        const mDone = currentFinance.some(f => f.discipline === 'PRIVATE_EQUITY' || f.discipline === 'INVESTMENT_BANKING');
        const qDone = currentFinance.some(f => f.discipline === 'QUANT_DERIVATIVES' || f.discipline === 'FACTOR_RISK');

        if (eDone && sDone && mDone && qDone) {
          openVictoryModal();
        }
      }, 300);
    }

    return isRecordedNow;
  };

  const setDailyTaskDuration = (type: DailyAccomplishmentType, durationMinutes: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const roundedMin = Math.max(0, Math.round(durationMinutes / 15) * 15);

    if (type === 'STRENGTH') {
      const existingIdx = workoutLogs.findIndex(w => w.pillar === 'STRENGTH' && w.timestamp.startsWith(todayStr));
      const previousDuration = existingIdx >= 0 ? workoutLogs[existingIdx].durationMinutes : 0;
      const deltaDuration = roundedMin - previousDuration;
      const deltaXP = Math.floor(deltaDuration * 1.5);

      if (roundedMin <= 0) {
        if (existingIdx >= 0) {
          const updated = workoutLogs.filter((_, idx) => idx !== existingIdx);
          setWorkoutLogs(updated);
          saveWorkoutLogs(updated);
        }
        updateMetrics({ benchPressKg: Math.max(40, Number((metrics.benchPressKg - 1.5).toFixed(1))), deadliftKg: Math.max(60, Number((metrics.deadliftKg - 2.5).toFixed(1))) });
        if (previousDuration > 0) gainXP(-Math.floor(previousDuration * 1.5));
      } else {
        const entry: WorkoutLogEntry = {
          id: existingIdx >= 0 ? workoutLogs[existingIdx].id : `w-${Date.now()}`,
          timestamp: existingIdx >= 0 ? workoutLogs[existingIdx].timestamp : new Date().toISOString(),
          dateDisplay: 'Today',
          pillar: 'STRENGTH',
          title: `${roundedMin}m Heavy Compound Strength Protocol`,
          durationMinutes: roundedMin,
          intensity: 'HEAVY_RESISTANCE',
          peakHeartRateBpm: 160,
          caloricBurn: Math.round(roundedMin * 8.5),
          notes: `Logged ${roundedMin} min compound strength session.`
        };

        let updatedLogs: WorkoutLogEntry[];
        if (existingIdx >= 0) {
          updatedLogs = workoutLogs.map((w, idx) => idx === existingIdx ? entry : w);
        } else {
          updatedLogs = [entry, ...workoutLogs];
        }
        setWorkoutLogs(updatedLogs);
        saveWorkoutLogs(updatedLogs);

        updateMetrics({
          benchPressKg: Math.min(220, Number((metrics.benchPressKg + (deltaDuration / 60) * 1.5).toFixed(1))),
          deadliftKg: Math.min(350, Number((metrics.deadliftKg + (deltaDuration / 60) * 2.5).toFixed(1)))
        });
        if (deltaXP !== 0) gainXP(deltaXP);
      }
    } else if (type === 'MODELING') {
      const existingIdx = financeLogs.findIndex(f => (f.discipline === 'PRIVATE_EQUITY' || f.discipline === 'INVESTMENT_BANKING') && f.timestamp.startsWith(todayStr));
      const previousDuration = existingIdx >= 0 ? financeLogs[existingIdx].durationMinutes : 0;
      const deltaDuration = roundedMin - previousDuration;
      const deltaXP = Math.floor(deltaDuration * 1.5);

      if (roundedMin <= 0) {
        if (existingIdx >= 0) {
          const updated = financeLogs.filter((_, idx) => idx !== existingIdx);
          setFinanceLogs(updated);
          saveFinanceLogs(updated);
        }
        updateMetrics({ transactionStructuring: Math.max(0, Number((metrics.transactionStructuring - 2).toFixed(1))) });
        if (previousDuration > 0) gainXP(-Math.floor(previousDuration * 1.5));
      } else {
        const entry: FinanceStudyLogEntry = {
          id: existingIdx >= 0 ? financeLogs[existingIdx].id : `f-${Date.now()}`,
          timestamp: existingIdx >= 0 ? financeLogs[existingIdx].timestamp : new Date().toISOString(),
          dateDisplay: 'Today',
          discipline: 'PRIVATE_EQUITY',
          topicId: 'syl-01',
          topicName: 'LBO Debt Structuring & Cash Sweeps',
          durationMinutes: roundedMin,
          scoreAchieved: Math.min(100, 80 + Math.round(roundedMin / 10)),
          notes: `${roundedMin}m institutional modeling drill.`
        };

        let updatedLogs: FinanceStudyLogEntry[];
        if (existingIdx >= 0) {
          updatedLogs = financeLogs.map((f, idx) => idx === existingIdx ? entry : f);
        } else {
          updatedLogs = [entry, ...financeLogs];
        }
        setFinanceLogs(updatedLogs);
        saveFinanceLogs(updatedLogs);

        updateMetrics({
          transactionStructuring: Math.min(100, Number((metrics.transactionStructuring + (deltaDuration / 60) * 2).toFixed(1)))
        });
        if (deltaXP !== 0) gainXP(deltaXP);
      }
    } else if (type === 'QUANT') {
      const existingIdx = financeLogs.findIndex(f => (f.discipline === 'QUANT_DERIVATIVES' || f.discipline === 'FACTOR_RISK') && f.timestamp.startsWith(todayStr));
      const previousDuration = existingIdx >= 0 ? financeLogs[existingIdx].durationMinutes : 0;
      const deltaDuration = roundedMin - previousDuration;
      const deltaXP = Math.floor(deltaDuration * 1.5);

      if (roundedMin <= 0) {
        if (existingIdx >= 0) {
          const updated = financeLogs.filter((_, idx) => idx !== existingIdx);
          setFinanceLogs(updated);
          saveFinanceLogs(updated);
        }
        updateMetrics({ quantitativeDerivatives: Math.max(0, Number((metrics.quantitativeDerivatives - 2).toFixed(1))) });
        if (previousDuration > 0) gainXP(-Math.floor(previousDuration * 1.5));
      } else {
        const entry: FinanceStudyLogEntry = {
          id: existingIdx >= 0 ? financeLogs[existingIdx].id : `f-q-${Date.now()}`,
          timestamp: existingIdx >= 0 ? financeLogs[existingIdx].timestamp : new Date().toISOString(),
          dateDisplay: 'Today',
          discipline: 'QUANT_DERIVATIVES',
          topicId: 'syl-02',
          topicName: 'Option Greeks & Vol Surface Fitting',
          durationMinutes: roundedMin,
          scoreAchieved: Math.min(100, 80 + Math.round(roundedMin / 10)),
          notes: `${roundedMin}m tactical discipline & quant drill.`
        };

        let updatedLogs: FinanceStudyLogEntry[];
        if (existingIdx >= 0) {
          updatedLogs = financeLogs.map((f, idx) => idx === existingIdx ? entry : f);
        } else {
          updatedLogs = [entry, ...financeLogs];
        }
        setFinanceLogs(updatedLogs);
        saveFinanceLogs(updatedLogs);

        updateMetrics({
          quantitativeDerivatives: Math.min(100, Number((metrics.quantitativeDerivatives + (deltaDuration / 60) * 2).toFixed(1)))
        });
        if (deltaXP !== 0) gainXP(deltaXP);
      }
    }
  };

  /**
   * TACTICAL ALARM MANAGEMENT & TRIGGER ACTIONS
   */
  const addAlarm = (alarmData: Omit<TacticalAlarm, 'id' | 'createdAt'>) => {
    const newAlarm: TacticalAlarm = {
      ...alarmData,
      id: `alarm-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...alarms, newAlarm];
    setAlarms(updated);
    saveAlarms(updated);

    // Immediate zero-latency cloud sync
    if (syncCode) {
      cloudSyncEngine.pushStateToCloud({
        version: '2.6.0',
        exportedAt: new Date().toISOString(),
        profile,
        metrics,
        weights,
        workoutLogs,
        financeLogs,
        history,
        quests,
        decayLogs,
        nightlyRewards,
        alarms: updated
      }, syncCode);
    }
  };

  const updateAlarm = (id: string, partial: Partial<TacticalAlarm>) => {
    const updated = alarms.map(a => a.id === id ? { ...a, ...partial } : a);
    setAlarms(updated);
    saveAlarms(updated);

    // Immediate zero-latency cloud sync
    if (syncCode) {
      cloudSyncEngine.pushStateToCloud({
        version: '2.6.0',
        exportedAt: new Date().toISOString(),
        profile,
        metrics,
        weights,
        workoutLogs,
        financeLogs,
        history,
        quests,
        decayLogs,
        nightlyRewards,
        alarms: updated
      }, syncCode);
    }

    // If disabled alarm was ringing, stop it immediately
    if (partial.isEnabled === false && activeAlarmRinging?.id === id) {
      neuralVoiceService.stop();
      soundEngine.stopAlarm();
      setActiveAlarmRinging(null);
    }

    soundEngine.playClick(750);
  };

  const deleteAlarm = (id: string) => {
    const updated = alarms.filter(a => a.id !== id);
    setAlarms(updated);
    saveAlarms(updated);

    // Immediate zero-latency cloud sync
    if (syncCode) {
      cloudSyncEngine.pushStateToCloud({
        version: '2.6.0',
        exportedAt: new Date().toISOString(),
        profile,
        metrics,
        weights,
        workoutLogs,
        financeLogs,
        history,
        quests,
        decayLogs,
        nightlyRewards,
        alarms: updated
      }, syncCode);
    }

    soundEngine.playClick(600);
  };

  const snoozeTimeoutRef = useRef<number | null>(null);

  const triggerAlarmDirectly = (alarm: TacticalAlarm) => {
    // HARD GUARD: NEVER trigger if alarm is not enabled / is on standby
    if (!alarm.isEnabled) {
      return;
    }

    setActiveAlarmRinging(alarm);
    soundEngine.playAlarmSound(alarm.soundStyle);
    neuralVoiceService.speakSmartVoice(alarm.voiceMessage, profile.neuralVoice, {
      pitch: alarm.voicePitch,
      rate: alarm.voiceRate,
      loop: true
    });

    // Mobile device tactile vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([600, 200, 600, 200, 800, 200, 1000]);
      } catch {
        // Ignore
      }
    }
  };

  const dismissAlarm = () => {
    if (snoozeTimeoutRef.current) {
      window.clearTimeout(snoozeTimeoutRef.current);
      snoozeTimeoutRef.current = null;
    }
    neuralVoiceService.stop();
    soundEngine.stopAlarm();
    setActiveAlarmRinging(null);
    gainXP(50);
    soundEngine.playQuestComplete();
    triggerConfetti();
  };

  const snoozeAlarm = (minutes = 5) => {
    if (snoozeTimeoutRef.current) {
      window.clearTimeout(snoozeTimeoutRef.current);
      snoozeTimeoutRef.current = null;
    }
    neuralVoiceService.stop();
    soundEngine.stopAlarm();
    const ringing = activeAlarmRinging;
    setActiveAlarmRinging(null);

    if (ringing) {
      snoozeTimeoutRef.current = window.setTimeout(() => {
        const currentAlarms = loadAlarms();
        const fresh = currentAlarms.find(a => a.id === ringing.id);
        if (fresh && fresh.isEnabled) {
          triggerAlarmDirectly(fresh);
        }
      }, minutes * 60 * 1000);
    }
  };

  const toggleQuest = (id: string) => {
    setQuests(prev => {
      const next = prev.map(q => {
        if (q.id === id) {
          const willComplete = !q.completed;
          if (willComplete) {
            soundEngine.playQuestComplete();
            gainXP(q.xpReward);
          } else {
            soundEngine.playClick(600);
          }
          return {
            ...q,
            completed: willComplete,
            completedAt: willComplete ? 'Just now' : undefined
          };
        }
        return q;
      });
      saveQuests(next);
      return next;
    });
  };

  const submitQuizScore = (topic: SyllabusTopic, scorePercentage: number) => {
    addFinanceLog({
      discipline: topic.discipline,
      topicId: topic.id,
      topicName: topic.title,
      durationMinutes: 15,
      scoreAchieved: scorePercentage,
      notes: `Institutional Concept Drill Quiz scored ${scorePercentage}%.`
    });

    if (scorePercentage >= 90) {
      soundEngine.playMilestoneFanfare();
      triggerConfetti();
    } else {
      soundEngine.playQuestComplete();
    }
  };

  const toggleSound = () => {
    const nextState = !profile.soundEnabled;
    soundEngine.setEnabled(nextState);
    updateProfile({ soundEnabled: nextState });
    if (nextState) {
      soundEngine.playClick(1050);
    }
  };

  const exportData = () => {
    soundEngine.playClick(990);
    exportBackupJSON();
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const restored = importBackupJSON(jsonStr);
      setProfile(restored.profile);
      setMetrics(restored.metrics);
      setWeights(restored.weights);
      setWorkoutLogs(restored.workoutLogs);
      setFinanceLogs(restored.financeLogs);
      setHistory(restored.history);
      setQuests(restored.quests);
      setDecayLogs(restored.decayLogs || []);
      setNightlyRewards(restored.nightlyRewards || []);
      setAlarms(restored.alarms || []);
      soundEngine.playMilestoneFanfare();
      triggerConfetti();
      return true;
    } catch (e) {
      console.error(e);
      soundEngine.playAlert();
      return false;
    }
  };

  const resetAllData = () => {
    resetToCleanSlate();
    setProfile(CLEAN_START_PROFILE);
    setMetrics(CLEAN_START_METRICS);
    setWeights(DEFAULT_WEIGHTS);
    setWorkoutLogs([]);
    setFinanceLogs([]);
    setHistory(generateCleanStartHistory(CLEAN_START_METRICS));
    setQuests(DEFAULT_DAILY_QUESTS);
    setDecayLogs([]);
    setNightlyRewards([]);
    setAlarms(loadAlarms());
    setActiveDecayAlert(null);
    setIsVictoryModalOpen(false);
    setActiveAlarmRinging(null);
    neuralVoiceService.stop();
    soundEngine.stopAlarm();
    soundEngine.playAlert();
  };

  const loadDemoMode = () => {
    loadDemoDataset();
    setProfile(DEMO_USER_PROFILE);
    setMetrics(DEMO_METRICS);
    setWeights(DEFAULT_WEIGHTS);
    setHistory(generateDemoHistory());
    setQuests(DEFAULT_DAILY_QUESTS);
    setAlarms(loadAlarms());
    soundEngine.playMilestoneFanfare();
    triggerConfetti();
  };

  return (
    <TitanContext.Provider
      value={{
        profile,
        metrics,
        weights,
        workoutLogs,
        financeLogs,
        history,
        quests,
        decayLogs,
        nightlyRewards,
        todayRewardClaim,
        alarms,
        activeAlarmRinging,
        composite,
        activeTab,
        setActiveTab,
        isSettingsOpen,
        setIsSettingsOpen,
        isBackupOpen,
        setIsBackupOpen,
        isSyncModalOpen,
        setIsSyncModalOpen,
        isMobilePushSetupOpen,
        setIsMobilePushSetupOpen,
        isVictoryModalOpen,
        openVictoryModal,
        closeVictoryModal,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        analyticsSubTab,
        setAnalyticsSubTab,
        openAlarmsTab,
        activeQuizTopic,
        setActiveQuizTopic,
        activeDecayAlert,
        dismissDecayAlert,
        syncCode,
        syncStatus,
        lastSyncedAt,
        pairedDevices,
        currentDevice,
        setCustomDeviceName,
        generateNewSyncKey,
        connectSyncCode,
        disconnectSync,
        forcePushCloud,
        forcePullCloud,
        requestPushPermission,
        sendTestPushAlert,
        updateMetrics,
        updateProfile,
        updateWeights,
        updateNeuralVoiceSettings,
        addWorkoutLog,
        addFinanceLog,
        toggleDailyAccomplishment,
        setDailyTaskDuration,
        claimNightlyReward,
        toggleQuest,
        submitQuizScore,
        toggleSound,
        exportData,
        importData,
        resetAllData,
        loadDemoMode,
        gainXP,
        addAlarm,
        updateAlarm,
        deleteAlarm,
        triggerAlarmDirectly,
        dismissAlarm,
        snoozeAlarm,
        simulateMissedDays,
        clearDecayPenalty
      }}
    >
      {children}
    </TitanContext.Provider>
  );
};

export const useTitan = () => {
  const context = useContext(TitanContext);
  if (!context) {
    throw new Error('useTitan must be used within a TitanProvider');
  }
  return context;
};
