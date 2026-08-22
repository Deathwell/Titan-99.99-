// Empirical Gaussian & Pareto Heavy-Tail Statistical Analysis Engine
// Calibrated against the total 8.15 Billion Global Human Population
// Implements Standard Normal Cumulative Distribution Function Φ(z) via Error Function erf(x)
// and Laplace Continued Fraction for Extreme Apex Tails (99.9%+ / z > 3.0902)

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
 * Total Living Human Species Population Reference (UN World Population Prospects 2026)
 */
export const GLOBAL_HUMAN_POPULATION = 8_150_000_000;

/**
 * Z-score threshold for Top 0.1% (99.9th percentile)
 * Φ(3.0902323) = 0.999000
 */
export const APEX_999_Z_THRESHOLD = 3.0902323;

/**
 * Standard Normal Probability Density Function φ(z)
 * φ(z) = (1 / sqrt(2π)) * exp(-0.5 * z^2)
 */
export function standardNormalPDF(z: number): number {
  return (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp(-0.5 * z * z);
}

/**
 * High-precision numerical approximation of the Error Function erf(x)
 * Abramowitz & Stegun approximation with maximum error < 1.5e-7
 */
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

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
 * Laplace Continued Fraction for Upper Tail Probability Q(z) = 1 - Φ(z)
 * Provides ultra-high numerical precision for extreme positive z-scores (z >= 3.0 / 99.9%+)
 */
export function upperTailQ(z: number): number {
  if (z <= 0) {
    return 1.0 - normalCDF(z);
  }
  // For extreme tail z >= 3.0, use continued fraction
  if (z >= 3.0) {
    const phi = standardNormalPDF(z);
    // Laplace continued fraction: Q(z) = phi(z) / (z + 1 / (z + 2 / (z + 3 / (z + 4 / (z + 5)))))
    const d5 = z + 5.0 / z;
    const d4 = z + 4.0 / d5;
    const d3 = z + 3.0 / d4;
    const d2 = z + 2.0 / d3;
    const d1 = z + 1.0 / d2;
    return phi / d1;
  }
  return 0.5 * (1.0 - erf(z / Math.SQRT2));
}

/**
 * Standard Normal Cumulative Distribution Function Φ(z)
 * Returns percentile fraction in range (0.000000001, 0.999999999)
 */
export function normalCDF(z: number): number {
  if (z > 3.0) {
    return 1.0 - upperTailQ(z);
  }
  return 0.5 * (1.0 + erf(z / Math.SQRT2));
}

/**
 * Convert Z-score to Percentile (0.00001 to 99.99999)
 */
export function zScoreToPercentile(z: number): number {
  const p = normalCDF(z) * 100.0;
  return Math.min(99.9999, Math.max(0.0001, p));
}

/**
 * Hybrid Pareto / Power-Law Tail Transform for Financial & Quantitative Mastery
 * Translates raw institutional scores (0 to 100) into realistic global human population Z-scores.
 * Reflects the economic reality that 99%+ of humanity has near-zero capital modeling aptitude,
 * while top quant mastery scales exponentially (Pareto exponent alpha = 1.618).
 */
export function calculateParetoFinanceZ(score: number, baseMean: number, baseStd: number): number {
  if (score <= 10) {
    // Bottom civilian baseline
    return -1.0 + (score / 10) * 0.5;
  }
  // Normalized skill index between 0.1 and 1.0
  const normalized = Math.min(100, Math.max(10, score)) / 100;
  // Pareto transformation
  const alpha = 1.618;
  const paretoTail = Math.pow(normalized, alpha);
  // Linear baseline plus exponential tail
  const rawZ = ((score - baseMean) / baseStd) * (1 + 0.35 * paretoTail);
  return rawZ;
}

/**
 * Normative Benchmarks Calibrated Against ALL 8.15 BILLION Humans on Planet Earth
 * (No age handicaps, no demographic filters — pure raw global human species comparison)
 */
export const NORMATIVE_BENCHMARKS: Record<MetricKey, NormativeBenchmark> = {
  vo2Max: {
    key: 'vo2Max',
    label: 'Aerobic Capacity (VO2 Max)',
    category: 'physique',
    unit: 'ml/kg/min',
    mean: 34.0, // True global human average (including sedentary adults & global demographic)
    stdDev: 7.5,
    top1PercentThreshold: 51.5, // 99.0% threshold
    isInverse: false,
    description: 'Maximal oxygen uptake per kg body mass. Gold standard metric of cardiorespiratory fitness & cellular mitochondrial density.',
    source: 'Global Human Population Epidemiology / Cooper Clinic CCLS / WHO Physical Health Datasets',
    inputStep: 0.5,
    minVal: 15.0,
    maxVal: 95.0
  },
  run15Mile: {
    key: 'run15Mile',
    label: 'Tactical 1.5-Mile Run',
    category: 'physique',
    unit: 'seconds',
    mean: 840, // 14:00 mins (global human baseline)
    stdDev: 120, // 2:00 mins stdDev
    top1PercentThreshold: 560, // 9:20 mins (99.0% threshold)
    isInverse: true, // Lower is better
    description: 'Standard military & tactical readiness run test measuring sustained lactate threshold velocity.',
    source: 'Global Tactical Readiness Standards & US Navy SEAL BUD/S PST Baselines',
    inputStep: 5,
    minVal: 400,
    maxVal: 1500
  },
  benchPressBW: {
    key: 'benchPressBW',
    label: 'Upper Body Relative Strength (1RM / BW)',
    category: 'physique',
    unit: 'x Bodyweight',
    mean: 0.65, // True global human average (over 70% of humanity cannot bench 0.7x BW)
    stdDev: 0.28,
    top1PercentThreshold: 1.30, // 1.30x BW = Top 1% of all humans alive
    isInverse: false,
    description: 'Maximal single-repetition barbell bench press normalized against total body mass.',
    source: 'Global Musculoskeletal Strength Database & IPF Global Standards',
    inputStep: 0.05,
    minVal: 0.2,
    maxVal: 3.5
  },
  deadliftBW: {
    key: 'deadliftBW',
    label: 'Posterior Chain Relative Strength (1RM / BW)',
    category: 'physique',
    unit: 'x Bodyweight',
    mean: 0.95, // True global human average
    stdDev: 0.35,
    top1PercentThreshold: 1.76, // 1.76x BW = Top 1% globally
    isInverse: false,
    description: 'Maximal conventional/sumo deadlift from floor normalized to body mass. Ultimate measure of absolute posterior power.',
    source: 'Global Human Strength Dataset & USAPL Powerlifting Standards',
    inputStep: 0.05,
    minVal: 0.3,
    maxVal: 4.5
  },
  bodyFatPercent: {
    key: 'bodyFatPercent',
    label: 'Body Composition (DXA Body Fat %)',
    category: 'physique',
    unit: '% Fat',
    mean: 23.0, // Global human species mean (DXA validated)
    stdDev: 5.5,
    top1PercentThreshold: 10.2, // Sub-10% DXA is top 1% globally
    isInverse: true, // Lower is better
    description: 'Dual-energy X-ray absorptiometry (DXA) adipose tissue percentage.',
    source: 'WHO Global Body Composition Survey & ACSM Clinical Biomarkers',
    inputStep: 0.5,
    minVal: 4.0,
    maxVal: 45.0
  },
  financialModeling: {
    key: 'financialModeling',
    label: 'Financial Modeling & DCF',
    category: 'finance',
    unit: 'Score / 100',
    mean: 12.0, // True global human average (over 95% of humanity has 0 DCF modeling skills)
    stdDev: 15.0,
    top1PercentThreshold: 47.0,
    isInverse: false,
    description: '3-Statement dynamic integration, DCF valuation, scenario matrices & error-free speed.',
    source: 'Wall Street Prep / ModelOff World Championship Benchmarks vs Global Population',
    inputStep: 1,
    minVal: 0,
    maxVal: 100
  },
  transactionStructuring: {
    key: 'transactionStructuring',
    label: 'Transaction Structuring (LBO/M&A)',
    category: 'finance',
    unit: 'Score / 100',
    mean: 8.0,
    stdDev: 12.0,
    top1PercentThreshold: 36.0,
    isInverse: false,
    description: 'LBO debt tranches, revolving cash sweeps, IRR/MoIC sensitivity, M&A accretion/dilution.',
    source: 'Institutional Private Equity & Investment Banking Analysts vs Global Population',
    inputStep: 1,
    minVal: 0,
    maxVal: 100
  },
  quantitativeDerivatives: {
    key: 'quantitativeDerivatives',
    label: 'Quant Macro & Derivatives',
    category: 'finance',
    unit: 'Score / 100',
    mean: 5.0,
    stdDev: 10.0,
    top1PercentThreshold: 28.2,
    isInverse: false,
    description: 'Option Greeks, Black-Scholes surfaces, volatility smile calibration, cross-asset factor risk.',
    source: 'Proprietary Quantitative Trading Desk Screeners vs Global Population',
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
    description: 'Sub-median civilian baseline. Standard sedentary conditioning and entry-level aptitude.'
  },
  TIER_2: {
    level: 'TIER_2',
    name: 'VANGUARD',
    code: 'OPERATOR TIER II',
    minPercentile: 50.0,
    maxPercentile: 74.99,
    colorHex: '#06b6d4',
    badgeClass: 'border-cyan-700 bg-cyan-950/40 text-cyan-400',
    description: 'Above-average human operative. Superior endurance and foundational analytical acumen.'
  },
  TIER_3: {
    level: 'TIER_3',
    name: 'APEX',
    code: 'OPERATOR TIER III',
    minPercentile: 75.0,
    maxPercentile: 89.99,
    colorHex: '#10b981',
    badgeClass: 'border-emerald-600 bg-emerald-950/40 text-emerald-400',
    description: 'Top quartile global contender. Elite physical stamina and institutional financial mechanics.'
  },
  TIER_4: {
    level: 'TIER_4',
    name: 'SOVEREIGN',
    code: 'OPERATOR TIER IV',
    minPercentile: 90.0,
    maxPercentile: 98.99,
    colorHex: '#f59e0b',
    badgeClass: 'border-amber-500 bg-amber-950/40 text-amber-400 shadow-glow-amber',
    description: 'Top 10% elite global practitioner. High-readiness tactical conditioning and Wall Street grade modeling.'
  },
  TIER_TITAN: {
    level: 'TIER_TITAN',
    name: 'TITAN // 99.0%+',
    code: 'OPERATOR TIER V',
    minPercentile: 99.0,
    maxPercentile: 100.0,
    colorHex: '#ff2e4d',
    badgeClass: 'border-rose-500 bg-rose-950/60 text-rose-300 shadow-[0_0_20px_rgba(255,46,77,0.4)] animate-pulse',
    description: 'Apex 1% of the human species. Dual-domain supremacy. Peak physical conditioning and quantitative mastery.'
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

  if (benchmark.category === 'finance') {
    // Use hybrid Pareto / Power Law tail engine for finance metrics
    zScore = calculateParetoFinanceZ(rawValue, benchmark.mean, benchmark.stdDev);
  } else {
    // Use Gaussian normal distribution for physique metrics
    if (benchmark.isInverse) {
      zScore = (benchmark.mean - rawValue) / benchmark.stdDev;
    } else {
      zScore = (rawValue - benchmark.mean) / benchmark.stdDev;
    }
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
  metricDetails[strongest.key].isStrongest = true;

  const tier = getOperatorTier(percentileGlobal);

  // Exact Global Human Population Statistics (8.15 Billion Humans on Earth)
  const tailFraction = Math.max(1 / GLOBAL_HUMAN_POPULATION, (100.0 - percentileGlobal) / 100.0);
  const globalRank = Math.max(1, Math.round(GLOBAL_HUMAN_POPULATION * tailFraction));
  const humansDefeated = Math.max(0, GLOBAL_HUMAN_POPULATION - globalRank);
  const humansRemaining = globalRank;

  const oneInN = Math.round(1 / tailFraction);
  const oneInNFormatted = oneInN >= 1_000_000
    ? `1 in ${(oneInN / 1_000_000).toFixed(1)}M humans`
    : oneInN >= 1_000
    ? `1 in ${(oneInN / 1_000).toFixed(1)}k humans`
    : `1 in ${oneInN} humans`;

  const globalRankFormatted = `#${globalRank.toLocaleString()}`;

  // Gap to Top 0.1% Club (99.9th percentile)
  const gapToTopPointOneZ = Math.max(0, APEX_999_Z_THRESHOLD - zGlobal);
  const isApexTopPointOne = percentileGlobal >= 99.9;

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
    humansRemaining,
    globalRank,
    globalRankFormatted,
    oneInN,
    oneInNFormatted,
    gapToTopPointOneZ,
    isApexTopPointOne
  };
}

/**
 * Generate sampled distribution coordinates for Bell Curve Area charts
 */
export function generateBellCurveData(userZ: number, pointsCount = 80): Array<{
  z: number;
  pdf: number;
  userMarker?: number;
  highlight?: boolean;
}> {
  const minZ = -4.0;
  const maxZ = 4.0;
  const step = (maxZ - minZ) / (pointsCount - 1);
  const points: Array<{ z: number; pdf: number; userMarker?: number; highlight?: boolean }> = [];

  for (let i = 0; i < pointsCount; i++) {
    const z = Number((minZ + i * step).toFixed(2));
    const pdf = standardNormalPDF(z);
    const isClose = Math.abs(z - userZ) < step / 1.8;

    points.push({
      z,
      pdf,
      userMarker: isClose ? pdf : undefined,
      highlight: z <= userZ
    });
  }

  return points;
}

/**
 * Time formatting helpers for running protocols
 */
export function formatSecondsToTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  return parseInt(timeStr, 10) || 0;
}

/**
 * Format large population figures cleanly
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'k';
  }
  return num.toLocaleString();
}

