// Empirical Gaussian Percentile & Statistical Analysis Engine
// Implements Standard Normal Cumulative Distribution Function Φ(z) via Error Function erf(x)

import {
  CompositeCalculationResult,
  DimensionKey,
  DimensionWeights,
  MetricKey,
  MetricScoreDetail,
  NormativeBenchmark,
  OperatorTier,
  UserMetricsState
} from '../types/titan';

/**
 * High-precision numerical approximation of the Error Function erf(x)
 * Abramowitz & Stegun approximation with maximum error < 1.5e-7
 */
export function erf(x: number): number {
  // Sign of x
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  // Coefficients
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

/**
 * Standard Normal Cumulative Distribution Function Φ(z)
 * Φ(z) = 0.5 * [1 + erf(z / sqrt(2))]
 * Returns percentile value in range [0.0001, 99.9999]
 */
export function normalCDF(z: number): number {
  return 0.5 * (1.0 + erf(z / Math.SQRT2));
}

/**
 * Convert Z-score to Percentile (0 to 100)
 */
export function zScoreToPercentile(z: number): number {
  const p = normalCDF(z) * 100.0;
  // Bounded between 0.01% and 99.99% for numerical stability
  return Math.min(99.99, Math.max(0.01, p));
}

/**
 * Standard Normal Probability Density Function φ(z)
 * φ(z) = (1 / sqrt(2π)) * exp(-0.5 * z^2)
 */
export function standardNormalPDF(z: number): number {
  return (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp(-0.5 * z * z);
}

/**
 * Normative Population Constants & Thresholds based on Peer-Reviewed Exercise Physiology
 * and Institutional Finance Benchmarks (ACSM, Cooper Institute, NSCA, ModelOff, Wall Street)
 */
export const NORMATIVE_BENCHMARKS: Record<MetricKey, NormativeBenchmark> = {
  vo2Max: {
    key: 'vo2Max',
    label: 'Aerobic Capacity (VO2 Max)',
    category: 'physique',
    unit: 'ml/kg/min',
    mean: 44.0,
    stdDev: 8.5,
    top1PercentThreshold: 65.0,
    isInverse: false,
    description: 'Maximal oxygen uptake per kg body mass. Gold standard metric of cardiorespiratory fitness & cellular mitochondrial density.',
    source: 'Cooper Clinic Longitudinal Study (CCLS) / ACSM Fitness Guidelines',
    inputStep: 0.5,
    minVal: 20.0,
    maxVal: 90.0
  },
  run15Mile: {
    key: 'run15Mile',
    label: 'Tactical 1.5-Mile Run',
    category: 'physique',
    unit: 'seconds',
    mean: 720, // 12:00 mins
    stdDev: 90,
    top1PercentThreshold: 525, // 8:45 mins
    isInverse: true, // Lower is better
    description: 'Standard military & tactical readiness run test measuring sustained lactate threshold velocity.',
    source: 'US Navy SEAL BUD/S PST & FBI Tactical Readiness Standards',
    inputStep: 5,
    minVal: 450,
    maxVal: 1200
  },
  benchPressBW: {
    key: 'benchPressBW',
    label: 'Upper Body Relative Strength (1RM / BW)',
    category: 'physique',
    unit: 'x Bodyweight',
    mean: 1.10,
    stdDev: 0.38,
    top1PercentThreshold: 2.25,
    isInverse: false,
    description: 'Maximal single-repetition barbell bench press normalized against total body mass.',
    source: 'StrengthLevel Global Dataset & International Powerlifting Federation (IPF)',
    inputStep: 0.05,
    minVal: 0.4,
    maxVal: 3.5
  },
  deadliftBW: {
    key: 'deadliftBW',
    label: 'Posterior Chain Relative Strength (1RM / BW)',
    category: 'physique',
    unit: 'x Bodyweight',
    mean: 1.75,
    stdDev: 0.45,
    top1PercentThreshold: 3.15,
    isInverse: false,
    description: 'Maximal conventional/sumo deadlift from floor normalized to body mass. Ultimate measure of absolute posterior power.',
    source: 'USAPL Normative Strength Standards & NSCA Strength Data',
    inputStep: 0.05,
    minVal: 0.8,
    maxVal: 4.5
  },
  bodyFatPercent: {
    key: 'bodyFatPercent',
    label: 'Body Composition (DXA Body Fat %)',
    category: 'physique',
    unit: '% Fat',
    mean: 20.0,
    stdDev: 4.5,
    top1PercentThreshold: 8.0,
    isInverse: true, // Lower is better
    description: 'Dual-energy X-ray absorptiometry (DXA) adipose tissue percentage.',
    source: 'ACSM Health-Related Physical Fitness Assessment',
    inputStep: 0.5,
    minVal: 4.0,
    maxVal: 35.0
  },
  financialModeling: {
    key: 'financialModeling',
    label: 'Financial Modeling & DCF',
    category: 'finance',
    unit: 'Score / 100',
    mean: 45.0,
    stdDev: 18.0,
    top1PercentThreshold: 95.0,
    isInverse: false,
    description: '3-Statement dynamic integration, DCF valuation, scenario matrices & error-free speed.',
    source: 'Wall Street Prep / ModelOff Championship Benchmarks',
    inputStep: 1,
    minVal: 0,
    maxVal: 100
  },
  transactionStructuring: {
    key: 'transactionStructuring',
    label: 'Transaction Structuring (LBO/M&A)',
    category: 'finance',
    unit: 'Score / 100',
    mean: 40.0,
    stdDev: 20.0,
    top1PercentThreshold: 94.0,
    isInverse: false,
    description: 'LBO debt tranches, revolving cash sweeps, IRR/MoIC sensitivity, M&A accretion/dilution.',
    source: 'Private Equity Associate & Investment Banking Analyst Assessments',
    inputStep: 1,
    minVal: 0,
    maxVal: 100
  },
  quantitativeDerivatives: {
    key: 'quantitativeDerivatives',
    label: 'Quant Macro & Derivatives',
    category: 'finance',
    unit: 'Score / 100',
    mean: 35.0,
    stdDev: 20.0,
    top1PercentThreshold: 92.0,
    isInverse: false,
    description: 'Option Greeks, Black-Scholes surfaces, volatility smile calibration, cross-asset factor risk.',
    source: 'Proprietary Trading Desk & Quantitative Hedge Fund Screeners',
    inputStep: 1,
    minVal: 0,
    maxVal: 100
  }
};

export const DEFAULT_WEIGHTS: DimensionWeights = {
  physique: {
    vo2Max: 0.25,
    run15Mile: 0.25,
    benchPressBW: 0.15,
    deadliftBW: 0.20,
    bodyFatPercent: 0.15
  },
  finance: {
    financialModeling: 0.35,
    transactionStructuring: 0.35,
    quantitativeDerivatives: 0.30
  },
  global: {
    physique: 0.50,
    finance: 0.50
  }
};

export const OPERATOR_TIERS: Record<string, OperatorTier> = {
  TIER_1: {
    level: 'TIER_1',
    name: 'INITIATE',
    code: 'OPERATOR TIER I',
    minPercentile: 0.0,
    maxPercentile: 49.99,
    colorHex: '#64748b',
    badgeClass: 'border-slate-600 bg-slate-800/40 text-slate-400',
    description: 'Sub-median baseline. Standard civilian conditioning and entry-level quantitative aptitude.'
  },
  TIER_2: {
    level: 'TIER_2',
    name: 'VANGUARD',
    code: 'OPERATOR TIER II',
    minPercentile: 50.0,
    maxPercentile: 74.99,
    colorHex: '#06b6d4',
    badgeClass: 'border-cyan-700 bg-cyan-950/40 text-cyan-400',
    description: 'Above average operative. Superior endurance and solid financial foundational acumen.'
  },
  TIER_3: {
    level: 'TIER_3',
    name: 'APEX',
    code: 'OPERATOR TIER III',
    minPercentile: 75.0,
    maxPercentile: 89.99,
    colorHex: '#10b981',
    badgeClass: 'border-emerald-600 bg-emerald-950/40 text-emerald-400',
    description: 'Top quartile practitioner. Elite physical stamina and advanced institutional transaction mechanics.'
  },
  TIER_4: {
    level: 'TIER_4',
    name: 'SOVEREIGN',
    code: 'OPERATOR TIER IV',
    minPercentile: 90.0,
    maxPercentile: 98.99,
    colorHex: '#f59e0b',
    badgeClass: 'border-amber-500 bg-amber-950/40 text-amber-400 shadow-glow-amber',
    description: 'Top 10% elite specialist. Special Operations grade physical metrics and senior Wall Street modeling capability.'
  },
  TIER_TITAN: {
    level: 'TIER_TITAN',
    name: 'TITAN // 99.0%+',
    code: 'OPERATOR TIER V',
    minPercentile: 99.0,
    maxPercentile: 100.0,
    colorHex: '#a855f7',
    badgeClass: 'border-purple-500 bg-purple-950/50 text-purple-300 shadow-glow-purple animate-pulse-slow',
    description: 'God-tier apex 1%. Dual-domain supremacy. Highest tier of human physical endurance and quantitative finance precision.'
  }
};

export function getOperatorTier(percentile: number): OperatorTier {
  if (percentile >= 99.0) return OPERATOR_TIERS.TIER_TITAN;
  if (percentile >= 90.0) return OPERATOR_TIERS.TIER_4;
  if (percentile >= 75.0) return OPERATOR_TIERS.TIER_3;
  if (percentile >= 50.0) return OPERATOR_TIERS.TIER_2;
  return OPERATOR_TIERS.TIER_1;
}

export function calculateMetricDetail(
  key: MetricKey,
  rawValue: number
): MetricScoreDetail {
  const benchmark = NORMATIVE_BENCHMARKS[key];
  let zScore = 0;

  if (benchmark.isInverse) {
    zScore = (benchmark.mean - rawValue) / benchmark.stdDev;
  } else {
    zScore = (rawValue - benchmark.mean) / benchmark.stdDev;
  }

  const percentile = zScoreToPercentile(zScore);
  const isTitan = percentile >= 99.0;

  return {
    key,
    rawValue,
    zScore,
    percentile,
    benchmark,
    isTitan
  };
}

export function calculateCompositeState(
  metricsState: UserMetricsState,
  weights: DimensionWeights = DEFAULT_WEIGHTS
): CompositeCalculationResult {
  const bw = Math.max(40, metricsState.bodyWeightKg || 75);
  const benchBW = metricsState.benchPressBW ?? (metricsState.benchPressKg / bw);
  const deadliftBW = metricsState.deadliftBW ?? (metricsState.deadliftKg / bw);

  const metricDetails: Record<MetricKey, MetricScoreDetail> = {
    vo2Max: calculateMetricDetail('vo2Max', metricsState.vo2Max),
    run15Mile: calculateMetricDetail('run15Mile', metricsState.run15Mile),
    benchPressBW: calculateMetricDetail('benchPressBW', benchBW),
    deadliftBW: calculateMetricDetail('deadliftBW', deadliftBW),
    bodyFatPercent: calculateMetricDetail('bodyFatPercent', metricsState.bodyFatPercent),
    financialModeling: calculateMetricDetail('financialModeling', metricsState.financialModeling),
    transactionStructuring: calculateMetricDetail('transactionStructuring', metricsState.transactionStructuring),
    quantitativeDerivatives: calculateMetricDetail('quantitativeDerivatives', metricsState.quantitativeDerivatives)
  };

  const pw = weights.physique;
  const sumPhysiqueWeights = pw.vo2Max + pw.run15Mile + pw.benchPressBW + pw.deadliftBW + pw.bodyFatPercent;
  const zPhysique = (
    metricDetails.vo2Max.zScore * pw.vo2Max +
    metricDetails.run15Mile.zScore * pw.run15Mile +
    metricDetails.benchPressBW.zScore * pw.benchPressBW +
    metricDetails.deadliftBW.zScore * pw.deadliftBW +
    metricDetails.bodyFatPercent.zScore * pw.bodyFatPercent
  ) / sumPhysiqueWeights;
  const percentilePhysique = zScoreToPercentile(zPhysique);

  const fw = weights.finance;
  const sumFinanceWeights = fw.financialModeling + fw.transactionStructuring + fw.quantitativeDerivatives;
  const zFinance = (
    metricDetails.financialModeling.zScore * fw.financialModeling +
    metricDetails.transactionStructuring.zScore * fw.transactionStructuring +
    metricDetails.quantitativeDerivatives.zScore * fw.quantitativeDerivatives
  ) / sumFinanceWeights;
  const percentileFinance = zScoreToPercentile(zFinance);

  const gw = weights.global;
  const sumGlobalWeights = gw.physique + gw.finance;
  const zGlobal = (zPhysique * gw.physique + zFinance * gw.finance) / sumGlobalWeights;
  const percentileGlobal = zScoreToPercentile(zGlobal);

  const metricList = Object.values(metricDetails);
  let weakest = metricList[0];
  let strongest = metricList[0];

  for (const m of metricList) {
    if (m.zScore < weakest.zScore) weakest = m;
    if (m.zScore > strongest.zScore) strongest = m;
  }

  metricDetails[weakest.key].isWeakest = true;

  const tier = getOperatorTier(percentileGlobal);

  // Global scale population calculus (8,000,000,000 Earth Population)
  const TOTAL_HUMAN_POPULATION = 8000000000;
  const humansDefeated = Math.round((percentileGlobal / 100) * TOTAL_HUMAN_POPULATION);
  const humansRemaining = Math.max(0, TOTAL_HUMAN_POPULATION - humansDefeated);

  return {
    metrics: metricDetails,
    zPhysique,
    percentilePhysique,
    zFinance,
    percentileFinance,
    zGlobal,
    percentileGlobal,
    tier,
    weakestMetric: weakest,
    strongestMetric: strongest,
    humansDefeated,
    humansRemaining
  };
}

export function formatLargeNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function parseTimeToSeconds(timeStr: string | number): number {
  if (typeof timeStr === 'number') return timeStr;
  if (!timeStr.includes(':')) {
    const parsed = parseFloat(timeStr);
    return isNaN(parsed) ? 720 : parsed;
  }
  const parts = timeStr.split(':');
  const mins = parseInt(parts[0], 10) || 0;
  const secs = parseInt(parts[1], 10) || 0;
  return mins * 60 + secs;
}

export interface BellCurvePoint {
  z: number;
  pdf: number;
  percentile: number;
  isUserZ: boolean;
  isTop1Percent: boolean;
}

export function generateBellCurveData(userZ: number, steps = 100): BellCurvePoint[] {
  const minZ = -3.5;
  const maxZ = 3.5;
  const stepSize = (maxZ - minZ) / steps;
  const data: BellCurvePoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const z = Number((minZ + i * stepSize).toFixed(2));
    const pdf = standardNormalPDF(z);
    const percentile = zScoreToPercentile(z);
    const isTop1Percent = z >= 2.326;

    data.push({
      z,
      pdf,
      percentile,
      isUserZ: Math.abs(z - userZ) < stepSize / 2,
      isTop1Percent
    });
  }

  return data;
}
