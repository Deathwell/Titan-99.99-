import {
  CompositeCalculationResult,
  FinanceStudyLogEntry,
  OperatorBadge,
  UserMetricsState,
  UserProfile,
  WorkoutLogEntry
} from '../types/titan';

export function evaluateOperatorBadges(
  metrics: UserMetricsState,
  profile: UserProfile,
  composite: CompositeCalculationResult,
  workoutLogs: WorkoutLogEntry[],
  financeLogs: FinanceStudyLogEntry[]
): OperatorBadge[] {
  const bw = Math.max(40, profile.bodyWeightKg || metrics.bodyWeightKg || 75);
  const benchBW = metrics.benchPressBW ?? (metrics.benchPressKg / bw);
  const deadliftBW = metrics.deadliftBW ?? (metrics.deadliftKg / bw);

  const badges: OperatorBadge[] = [
    {
      id: 'badge-iron-lung',
      title: 'IRON LUNG',
      icon: '🫁',
      category: 'PHYSIQUE',
      rarity: 'RARE',
      requirement: 'VO2 Max ≥ 60.0 ml/kg/min',
      description: 'Superior aerobic engine & mitochondrial density matching Tier 1 Special Operations operators.',
      isUnlocked: metrics.vo2Max >= 60.0,
      progressPercent: Math.min(100, Math.round((metrics.vo2Max / 60.0) * 100)),
      currentValDisplay: `${metrics.vo2Max.toFixed(1)} ml/kg`,
      targetValDisplay: '60.0 ml/kg'
    },
    {
      id: 'badge-sub-9',
      title: 'SUB-9 TACTICAL PACE',
      icon: '⚡',
      category: 'PHYSIQUE',
      rarity: 'RARE',
      requirement: '1.5-Mile Run ≤ 540 sec (9:00 min)',
      description: 'Navy SEAL BUD/S PST qualifying lactate threshold endurance pace.',
      isUnlocked: metrics.run15Mile <= 540,
      progressPercent: metrics.run15Mile <= 540 ? 100 : Math.min(100, Math.round((540 / metrics.run15Mile) * 100)),
      currentValDisplay: `${Math.floor(metrics.run15Mile / 60)}:${(metrics.run15Mile % 60).toString().padStart(2, '0')}`,
      targetValDisplay: '9:00 min'
    },
    {
      id: 'badge-silverback',
      title: 'SILVERBACK POWER',
      icon: '🦍',
      category: 'PHYSIQUE',
      rarity: 'EPIC',
      requirement: 'Deadlift ≥ 2.50x Bodyweight',
      description: 'Extreme posterior chain recruitment. Raw primal pulling power.',
      isUnlocked: deadliftBW >= 2.50,
      progressPercent: Math.min(100, Math.round((deadliftBW / 2.50) * 100)),
      currentValDisplay: `${deadliftBW.toFixed(2)}x BW (${metrics.deadliftKg}kg)`,
      targetValDisplay: '2.50x BW'
    },
    {
      id: 'badge-double-bw',
      title: 'UPPER BODY TITAN',
      icon: '🏋️',
      category: 'PHYSIQUE',
      rarity: 'EPIC',
      requirement: 'Bench Press ≥ 1.50x Bodyweight',
      description: 'Elite upper body pressing strength exceeding 98th percentile of lifters.',
      isUnlocked: benchBW >= 1.50,
      progressPercent: Math.min(100, Math.round((benchBW / 1.50) * 100)),
      currentValDisplay: `${benchBW.toFixed(2)}x BW (${metrics.benchPressKg}kg)`,
      targetValDisplay: '1.50x BW'
    },
    {
      id: 'badge-shredded',
      title: 'DXA SHREDDED',
      icon: '🛡️',
      category: 'PHYSIQUE',
      rarity: 'RARE',
      requirement: 'Body Fat ≤ 10.0%',
      description: 'Single-digit adipose composition with full vascularity and high work capacity.',
      isUnlocked: metrics.bodyFatPercent <= 10.0,
      progressPercent: metrics.bodyFatPercent <= 10.0 ? 100 : Math.min(100, Math.round((10.0 / metrics.bodyFatPercent) * 100)),
      currentValDisplay: `${metrics.bodyFatPercent.toFixed(1)}%`,
      targetValDisplay: '≤ 10.0%'
    },
    {
      id: 'badge-lbo-architect',
      title: 'LBO ARCHITECT',
      icon: '📈',
      category: 'FINANCE',
      rarity: 'EPIC',
      requirement: 'Transaction Structuring Score ≥ 90',
      description: 'Mastery over multi-tranche debt sizing, 75% ECF sweeps, circularity breakers & MoIC grids.',
      isUnlocked: metrics.transactionStructuring >= 90,
      progressPercent: Math.min(100, Math.round((metrics.transactionStructuring / 90) * 100)),
      currentValDisplay: `${metrics.transactionStructuring} / 100`,
      targetValDisplay: '90 pts'
    },
    {
      id: 'badge-quant-sorcerer',
      title: 'QUANT SORCERER',
      icon: '🧠',
      category: 'FINANCE',
      rarity: 'EPIC',
      requirement: 'Quant & Derivatives Score ≥ 90',
      description: 'Flawless calibration of high-order Greeks (Vanna, Volga, Charm) and SVI volatility smiles.',
      isUnlocked: metrics.quantitativeDerivatives >= 90,
      progressPercent: Math.min(100, Math.round((metrics.quantitativeDerivatives / 90) * 100)),
      currentValDisplay: `${metrics.quantitativeDerivatives} / 100`,
      targetValDisplay: '90 pts'
    },
    {
      id: 'badge-dcf-maestro',
      title: 'DCF VALUATION MAESTRO',
      icon: '🏛️',
      category: 'FINANCE',
      rarity: 'RARE',
      requirement: 'Financial Modeling Score ≥ 90',
      description: 'Zero-error dynamic 3-statement modeling with stub periods and mid-year convention.',
      isUnlocked: metrics.financialModeling >= 90,
      progressPercent: Math.min(100, Math.round((metrics.financialModeling / 90) * 100)),
      currentValDisplay: `${metrics.financialModeling} / 100`,
      targetValDisplay: '90 pts'
    },
    {
      id: 'badge-streak-7',
      title: 'UNBROKEN DISCIPLINE',
      icon: '🔥',
      category: 'DISCIPLINE',
      rarity: 'COMMON',
      requirement: '7 Consecutive Active Days',
      description: 'Zero zero-days. Established neurological habit formation.',
      isUnlocked: profile.streakDays >= 7,
      progressPercent: Math.min(100, Math.round((profile.streakDays / 7) * 100)),
      currentValDisplay: `${profile.streakDays} Days`,
      targetValDisplay: '7 Days'
    },
    {
      id: 'badge-streak-30',
      title: 'CENTURION PROTOCOL',
      icon: '🏆',
      category: 'DISCIPLINE',
      rarity: 'EPIC',
      requirement: '30 Consecutive Active Days',
      description: 'Ironclad consistency that outlasts 99% of civilian motivation.',
      isUnlocked: profile.streakDays >= 30,
      progressPercent: Math.min(100, Math.round((profile.streakDays / 30) * 100)),
      currentValDisplay: `${profile.streakDays} Days`,
      targetValDisplay: '30 Days'
    },
    {
      id: 'badge-sovereign',
      title: 'SOVEREIGN // TOP 10%',
      icon: '⚔️',
      category: 'TITAN',
      rarity: 'EPIC',
      requirement: 'Global Percentile ≥ 90.0%',
      description: 'Ranked in the top 10% of humanity in dual physical and financial dimensions.',
      isUnlocked: composite.percentileGlobal >= 90.0,
      progressPercent: Math.min(100, Math.round((composite.percentileGlobal / 90.0) * 100)),
      currentValDisplay: `${composite.percentileGlobal.toFixed(1)}%ile`,
      targetValDisplay: '90.0%ile'
    },
    {
      id: 'badge-apex-titan',
      title: 'APEX TITAN // TOP 1%',
      icon: '👑',
      category: 'TITAN',
      rarity: 'LEGENDARY',
      requirement: 'Global Percentile ≥ 99.00%',
      description: 'Supreme dual-domain apex operator. The top 0.1% of humanity.',
      isUnlocked: composite.percentileGlobal >= 99.0,
      progressPercent: Math.min(100, Math.round((composite.percentileGlobal / 99.0) * 100)),
      currentValDisplay: `${composite.percentileGlobal.toFixed(2)}%ile`,
      targetValDisplay: '99.00%ile'
    }
  ];

  return badges;
}
