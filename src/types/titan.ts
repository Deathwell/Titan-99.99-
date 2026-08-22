// TITAN PROTOCOL Type Definitions

export type DimensionKey = 'physique' | 'finance';

export type PhysicalMetricKey = 
  | 'vo2Max'
  | 'run15Mile'
  | 'benchPressBW'
  | 'deadliftBW'
  | 'bodyFatPercent';

export type FinanceMetricKey = 
  | 'financialModeling'
  | 'transactionStructuring'
  | 'quantitativeDerivatives';

export type MetricKey = PhysicalMetricKey | FinanceMetricKey;

export interface NormativeBenchmark {
  key: MetricKey;
  label: string;
  category: DimensionKey;
  unit: string;
  mean: number;
  stdDev: number;
  top1PercentThreshold: number;
  isInverse: boolean;
  description: string;
  source: string;
  inputStep?: number;
  minVal?: number;
  maxVal?: number;
}

export interface MetricScoreDetail {
  key: MetricKey;
  rawValue: number;
  zScore: number;
  percentile: number;
  benchmark: NormativeBenchmark;
  isTitan: boolean;
  isWeakest?: boolean;
  isStrongest?: boolean;
}

export interface UserMetricsState {
  vo2Max: number;          // ml/kg/min
  run15Mile: number;       // seconds
  benchPressKg: number;    // raw kg
  deadliftKg: number;      // raw kg
  bodyWeightKg: number;    // user bodyweight
  bodyFatPercent: number;  // body composition

  benchPressBW?: number;
  deadliftBW?: number;

  financialModeling: number;       // 0 - 100
  transactionStructuring: number;  // 0 - 100
  quantitativeDerivatives: number; // 0 - 100
}

export interface DimensionWeights {
  physique: {
    vo2Max: number;
    run15Mile: number;
    benchPressBW: number;
    deadliftBW: number;
    bodyFatPercent: number;
  };
  finance: {
    financialModeling: number;
    transactionStructuring: number;
    quantitativeDerivatives: number;
  };
  global: {
    physique: number;
    finance: number;
  };
}

export interface CompositeCalculationResult {
  metrics: Record<MetricKey, MetricScoreDetail>;
  zPhysique: number;
  percentilePhysique: number;
  zFinance: number;
  percentileFinance: number;
  zGlobal: number;
  percentileGlobal: number;
  tier: OperatorTier;
  weakestMetric: MetricScoreDetail;
  strongestMetric: MetricScoreDetail;
  // Human scale statistics (8.15 Billion Global Population)
  humansDefeated: number;
  humansRemaining: number;
  globalRank: number;
  globalRankFormatted: string;
  oneInN: number;
  oneInNFormatted: string;
  gapToTopPointOneZ: number;
  isApexTopPointOne: boolean;
}

export type OperatorTierLevel = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'TIER_4' | 'TIER_TITAN';

export interface OperatorTier {
  level: OperatorTierLevel;
  name: string;
  code: string;
  minPercentile: number;
  maxPercentile: number;
  colorHex: string;
  badgeClass: string;
  description: string;
}

export type WorkoutPillar = 'ENDURANCE' | 'STRENGTH' | 'HYBRID_TACTICAL' | 'MOBILITY_RECOVERY';

export interface WorkoutLogEntry {
  id: string;
  timestamp: string;
  dateDisplay: string;
  pillar: WorkoutPillar;
  title: string;
  durationMinutes: number;
  intensity: 'ZONE_2_STEADY' | 'ZONE_4_TEMPO' | 'ZONE_5_MAX' | 'HEAVY_RESISTANCE' | 'MODERATE_VOLUME';
  peakHeartRateBpm?: number;
  caloricBurn?: number;
  notes: string;
}

export interface FinanceStudyLogEntry {
  id: string;
  timestamp: string;
  dateDisplay: string;
  discipline: 'PRIVATE_EQUITY' | 'INVESTMENT_BANKING' | 'QUANT_DERIVATIVES' | 'FIXED_INCOME_MACRO' | 'FACTOR_RISK';
  topicId: string;
  topicName: string;
  durationMinutes: number;
  scoreAchieved: number;
  notes: string;
}

export interface HistoricalSnapshot {
  date: string;
  percentileGlobal: number;
  percentilePhysique: number;
  percentileFinance: number;
  zGlobal: number;
  isDecayErased?: boolean;
  gainsRecorded?: boolean;
  dayIndex?: number;
}

export interface DecayPenaltyEvent {
  id: string;
  dateTriggered: string;
  missedDaysCount: number;
  erasedDaysCount: number;
  erasedDates: string[];
  xpDeducted: number;
  reason: string;
}

export type NightlyRewardKey = 
  | 'GAMING'
  | 'MEDIA'
  | 'SOCIAL_HANGOUT'
  | 'OUTSIDE_FOOD'
  | 'PLEASURE_RELEASE'
  | 'DEEP_REST'
  | 'CUSTOM';

export interface NightlyRewardClaim {
  id: string;
  date: string; // YYYY-MM-DD
  rewardKey: NightlyRewardKey;
  title: string;
  icon: string;
  customNote?: string;
  claimedAt: string; // Time string
}

export interface OperatorBadge {
  id: string;
  title: string;
  icon: string;
  category: 'PHYSIQUE' | 'FINANCE' | 'DISCIPLINE' | 'TITAN';
  requirement: string;
  description: string;
  isUnlocked: boolean;
  progressPercent: number;
  currentValDisplay: string;
  targetValDisplay: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export type AlarmSoundStyle = 'TACTICAL_SIREN' | 'NEON_ARCADIA' | 'MILITARY_KLAXON' | 'SUB_BASS_PULSE';
export type AlarmCategory = 'STUDY' | 'WORKOUT' | 'STRENGTH' | 'NUTRITION' | 'HYDRATION' | 'REST' | 'FOCUS';

export type NeuralVoiceProvider = 'BROWSER_NATURAL' | 'OPENAI_GPT4O' | 'ELEVENLABS';
export type OpenAIVoiceName = 'nova' | 'shimmer' | 'alloy' | 'fable' | 'onyx' | 'echo';

export interface NeuralVoiceSettings {
  provider: NeuralVoiceProvider;
  openaiApiKey?: string;
  openaiVoice: OpenAIVoiceName;
  elevenlabsApiKey?: string;
  elevenlabsVoiceId?: string;
  studioMasteringEnabled: boolean;
}

export interface TacticalAlarm {
  id: string;
  time24h: string; // e.g. "11:00", "06:30", "17:00"
  label: string;    // e.g. "Institutional Finance Study Time"
  voiceMessage: string; // e.g. "Study time at 11am! Time to master LBO models and outrank the world!"
  category: AlarmCategory;
  soundStyle: AlarmSoundStyle;
  voicePitch: number; // 0.8 - 1.4
  voiceRate: number;  // 0.8 - 1.3
  isEnabled: boolean;
  repeatDaily: boolean;
  createdAt: string;
  lastTriggeredDate?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  category: 'PHYSIQUE' | 'FINANCE' | 'SYSTEM';
  description: string;
  targetMetricKey: MetricKey;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  difficulty: 'STANDARD' | 'HARD' | 'TITAN';
}

export interface SyllabusTopic {
  id: string;
  discipline: 'PRIVATE_EQUITY' | 'INVESTMENT_BANKING' | 'QUANT_DERIVATIVES' | 'FIXED_INCOME_MACRO' | 'FACTOR_RISK';
  targetDimension: 'financialModeling' | 'transactionStructuring' | 'quantitativeDerivatives';
  title: string;
  level: 'INSTITUTIONAL' | 'TOP_1_PERCENT' | 'APEX_TRADING';
  subtopics: string[];
  keyFormulas: string[];
  benchmarkZTarget: number;
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface UserProfile {
  callsign: string;
  operatorId: string;
  age: number;
  heightCm: number;
  bodyWeightKg: number;
  targetPercentile: number;
  soundEnabled: boolean;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  isFreshStart: boolean;
  decayPenaltyActive: boolean;
  lastDecayEvent?: DecayPenaltyEvent;
  neuralVoice?: NeuralVoiceSettings;
}
