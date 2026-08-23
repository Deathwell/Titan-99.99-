/**
 * Tactical AI Prescription Engine
 * Generates science-backed, personalized workout routines and financial modeling curricula
 * for operators who are unsure of what to do on a given day.
 */

export type PrescriptionDomain = 'FITNESS' | 'FINANCE';

export interface ExerciseStep {
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  intensityRpe: string;
  cue: string;
}

export interface FinanceStep {
  topic: string;
  durationMinutes: number;
  deliverable: string;
  coreConcepts: string[];
  keyFormulaOrSkill: string;
}

export interface TacticalPrescription {
  id: string;
  domain: PrescriptionDomain;
  title: string;
  subtitle: string;
  durationMinutes: number;
  difficulty: 'STANDARD' | 'INTENSE' | 'ELITE';
  targetObjective: string;
  physiologicalOrCognitiveImpact: string;
  calorieBurnOrXPBonus: string;
  exerciseSteps?: ExerciseStep[];
  financeSteps?: FinanceStep[];
}

export function generateTacticalPrescriptions(
  domain: PrescriptionDomain,
  durationMinutes: number,
  userLevel: number = 1
): TacticalPrescription[] {
  const dur = Math.max(15, Math.min(240, durationMinutes));

  if (domain === 'FITNESS') {
    return getFitnessPrescriptions(dur, userLevel);
  } else {
    return getFinancePrescriptions(dur, userLevel);
  }
}

function getFitnessPrescriptions(duration: number, level: number): TacticalPrescription[] {
  if (duration <= 30) {
    return [
      {
        id: `fit-hiit-${duration}`,
        domain: 'FITNESS',
        title: 'Tabata & Mitochondrial Shockwave',
        subtitle: 'High-density HIIT for rapid EPOC caloric burn and VO2 peak',
        durationMinutes: duration,
        difficulty: 'INTENSE',
        targetObjective: 'Maximum cardiovascular stimulus in minimal timeframe',
        physiologicalOrCognitiveImpact: '+3.8% Post-exercise oxygen consumption (EPOC), glycogen depletion',
        calorieBurnOrXPBonus: '~320 kcal • +45 Bonus XP',
        exerciseSteps: [
          {
            name: 'Kettlebell Swings / Dumbbell Snatch',
            targetMuscle: 'Posterior Chain & Glutes',
            sets: 4,
            reps: '20s ON / 10s OFF',
            restSeconds: 30,
            intensityRpe: 'RPE 9.0',
            cue: 'Snap hips forcefully at top, maintain neutral spine.'
          },
          {
            name: 'Burpee Broad Jumps',
            targetMuscle: 'Full Body Explosiveness',
            sets: 4,
            reps: '20s ON / 10s OFF',
            restSeconds: 30,
            intensityRpe: 'RPE 9.5',
            cue: 'Land softly in athletic stance, explode forward instantly.'
          },
          {
            name: 'Hanging Leg Raises / V-Ups',
            targetMuscle: 'Core & Rectus Abdominis',
            sets: 3,
            reps: '15 Reps',
            restSeconds: 30,
            intensityRpe: 'RPE 8.5',
            cue: 'Control eccentric descent, zero swinging momentum.'
          }
        ]
      },
      {
        id: `fit-upper-pump-${duration}`,
        domain: 'FITNESS',
        title: 'Upper Torso Hypertrophy Blast',
        subtitle: 'Supersets targeting upper chest, lateral delts, and lats',
        durationMinutes: duration,
        difficulty: 'STANDARD',
        targetObjective: 'V-Taper aesthetic definition and upper body muscle density',
        physiologicalOrCognitiveImpact: 'High sarcoplasmic hypertrophy signal with low joint fatigue',
        calorieBurnOrXPBonus: '~240 kcal • +35 Bonus XP',
        exerciseSteps: [
          {
            name: 'Incline Dumbbell Press (30° Angle)',
            targetMuscle: 'Clavicular Upper Pectorals',
            sets: 3,
            reps: '10–12 Reps',
            restSeconds: 60,
            intensityRpe: 'RPE 8.0',
            cue: 'Slow 3-second eccentric descent, pause 1s at stretch.'
          },
          {
            name: 'Dumbbell Lateral Raises (Lean-in)',
            targetMuscle: 'Lateral Deltoids',
            sets: 3,
            reps: '12–15 Reps',
            restSeconds: 45,
            intensityRpe: 'RPE 9.0',
            cue: 'Lead with elbows, hold peak contraction for 1 second.'
          },
          {
            name: 'Chest-Supported Row or Pull-Ups',
            targetMuscle: 'Latissimus Dorsi & Rhomboids',
            sets: 3,
            reps: '8–10 Reps',
            restSeconds: 60,
            intensityRpe: 'RPE 8.5',
            cue: 'Drive elbows back toward hips, squeeze scapulae together.'
          }
        ]
      },
      {
        id: `fit-zone2-${duration}`,
        domain: 'FITNESS',
        title: 'Incline Ruck & Cellular Autophagy',
        subtitle: 'Steady-state Zone 2 fat-oxidation and mitochondrial density',
        durationMinutes: duration,
        difficulty: 'STANDARD',
        targetObjective: 'Aerobic base building with 100% lipid fuel substrate utilization',
        physiologicalOrCognitiveImpact: 'Zero nervous system fatigue, lowers resting heart rate',
        calorieBurnOrXPBonus: '~210 kcal • +30 Bonus XP',
        exerciseSteps: [
          {
            name: '15% Incline Treadmill Walk (3.2–3.8 mph)',
            targetMuscle: 'Cardiovascular & Calves/Hamstrings',
            sets: 1,
            reps: `${duration} Minutes Steady`,
            restSeconds: 0,
            intensityRpe: 'Zone 2 (125–138 BPM)',
            cue: 'Maintain nasal breathing exclusively throughout the entire session.'
          }
        ]
      }
    ];
  }

  if (duration <= 60) {
    return [
      {
        id: `fit-push-power-${duration}`,
        domain: 'FITNESS',
        title: 'Heavy Push & Deltoid Architecture',
        subtitle: 'Pecs, Front/Side Delts, and Triceps Horseshoe Strength',
        durationMinutes: duration,
        difficulty: 'ELITE',
        targetObjective: 'Progressive overload on heavy compound presses and shoulder capping',
        physiologicalOrCognitiveImpact: 'High motor unit recruitment & myofibrillar protein synthesis',
        calorieBurnOrXPBonus: '~480 kcal • +65 Bonus XP',
        exerciseSteps: [
          {
            name: 'Barbell Flat Bench Press',
            targetMuscle: 'Sternal & Clavicular Chest',
            sets: 4,
            reps: '5–6 Reps',
            restSeconds: 120,
            intensityRpe: 'RPE 8.5',
            cue: 'Retract scapulae, leg drive through heels, bar path over sternum.'
          },
          {
            name: 'Standing Barbell Overhead Press (OHP)',
            targetMuscle: 'Anterior Deltoids & Core',
            sets: 3,
            reps: '6–8 Reps',
            restSeconds: 90,
            intensityRpe: 'RPE 8.5',
            cue: 'Squeeze glutes tight, press vertically around chin, lock elbows.'
          },
          {
            name: 'Incline Dumbbell Fly-to-Press',
            targetMuscle: 'Upper Chest Fibers',
            sets: 3,
            reps: '10–12 Reps',
            restSeconds: 60,
            intensityRpe: 'RPE 9.0',
            cue: 'Deep stretch at bottom, squeeze elbows inward at top.'
          },
          {
            name: 'Cable Lateral Raises (Behind Back)',
            targetMuscle: 'Lateral Head Deltoid',
            sets: 4,
            reps: '12–15 Reps',
            restSeconds: 45,
            intensityRpe: 'RPE 9.5',
            cue: 'Constant tension throughout range, zero torso momentum.'
          },
          {
            name: 'Overhead Cable Triceps Extensions',
            targetMuscle: 'Long Head Triceps',
            sets: 3,
            reps: '10–12 Reps',
            restSeconds: 60,
            intensityRpe: 'RPE 9.0',
            cue: 'Keep elbows tucked beside temples, full lockout at extension.'
          }
        ]
      },
      {
        id: `fit-pull-density-${duration}`,
        domain: 'FITNESS',
        title: 'Titan Back Width & Biceps Thickness',
        subtitle: 'Heavy deadlifts, chest-supported rows, and arm thickness',
        durationMinutes: duration,
        difficulty: 'ELITE',
        targetObjective: 'Maximum posterior chain width, lat flared taper, and grip power',
        physiologicalOrCognitiveImpact: 'Significant systemic hormone signaling and postural spinal integrity',
        calorieBurnOrXPBonus: '~520 kcal • +70 Bonus XP',
        exerciseSteps: [
          {
            name: 'Conventional Barbell Deadlift',
            targetMuscle: 'Spinal Erectors, Glutes, Hamstrings',
            sets: 4,
            reps: '4–5 Reps',
            restSeconds: 150,
            intensityRpe: 'RPE 8.5',
            cue: 'Pull slack out of bar before breaking floor, drive hips forward.'
          },
          {
            name: 'Weighted Neutral-Grip Pull-Ups',
            targetMuscle: 'Latissimus Dorsi',
            sets: 3,
            reps: '6–8 Reps',
            restSeconds: 90,
            intensityRpe: 'RPE 9.0',
            cue: 'Full dead-hang at bottom, chest to bar contact at top.'
          },
          {
            name: 'Chest-Supported T-Bar Row',
            targetMuscle: 'Rhomboids & Mid-Traps',
            sets: 3,
            reps: '8–10 Reps',
            restSeconds: 75,
            intensityRpe: 'RPE 8.5',
            cue: 'Pause 1 second at full scapular retraction.'
          },
          {
            name: 'Incline Dumbbell Biceps Curls',
            targetMuscle: 'Biceps Long Head (Peak)',
            sets: 3,
            reps: '10–12 Reps',
            restSeconds: 60,
            intensityRpe: 'RPE 9.0',
            cue: 'Shoulders back against 45° incline, full elbow supination.'
          }
        ]
      },
      {
        id: `fit-norwegian-vo2-${duration}`,
        domain: 'FITNESS',
        title: 'Norwegian 4x4 VO2 Max Protocol',
        subtitle: 'Clinically proven gold-standard aerobic capacity expansion',
        durationMinutes: duration,
        difficulty: 'INTENSE',
        targetObjective: 'Rapidly elevate VO2 Max toward 60+ mL/kg/min benchmark',
        physiologicalOrCognitiveImpact: 'Maximizes stroke volume and cardiac capillary density',
        calorieBurnOrXPBonus: '~580 kcal • +75 Bonus XP',
        exerciseSteps: [
          {
            name: '10-Minute Progressive Dynamic Warmup',
            targetMuscle: 'Cardiovascular & Joint Lubrication',
            sets: 1,
            reps: '10 Minutes',
            restSeconds: 60,
            intensityRpe: 'Zone 1–2 (110–130 BPM)',
            cue: 'Gradually increase treadmill speed or bike resistance.'
          },
          {
            name: 'Norwegian Interval 1 (4m @ 90–95% HRmax)',
            targetMuscle: 'Cardiorespiratory Engine',
            sets: 1,
            reps: '4 Minutes Sprint/Climb',
            restSeconds: 180,
            intensityRpe: 'Zone 4–5 (170–185 BPM)',
            cue: 'Aggressive sustained cadence, controlled rhythmic breathing.'
          },
          {
            name: 'Norwegian Interval 2 (4m @ 90–95% HRmax)',
            targetMuscle: 'Cardiorespiratory Engine',
            sets: 1,
            reps: '4 Minutes Sprint/Climb',
            restSeconds: 180,
            intensityRpe: 'Zone 4–5 (170–185 BPM)',
            cue: 'Maintain pace, resist premature muscular fatigue.'
          },
          {
            name: 'Norwegian Interval 3 (4m @ 90–95% HRmax)',
            targetMuscle: 'Cardiorespiratory Engine',
            sets: 1,
            reps: '4 Minutes Sprint/Climb',
            restSeconds: 180,
            intensityRpe: 'Zone 4–5 (170–185 BPM)',
            cue: 'Lock in mental focus, match previous interval distance.'
          },
          {
            name: 'Norwegian Interval 4 (4m @ 90–95% HRmax)',
            targetMuscle: 'Cardiorespiratory Engine',
            sets: 1,
            reps: '4 Minutes Sprint/Climb',
            restSeconds: 0,
            intensityRpe: 'Zone 5 (Peak)',
            cue: 'Empty the tank on final 60 seconds. Finish strong.'
          }
        ]
      }
    ];
  }

  // 90m to 240m Long Sessions
  return [
    {
      id: `fit-gladiator-power-${duration}`,
      domain: 'FITNESS',
      title: 'Full-Body Decathlon & Hypertrophy Siege',
      subtitle: `${duration}m comprehensive strength, hypertrophy, and conditioning block`,
      durationMinutes: duration,
      difficulty: 'ELITE',
      targetObjective: 'Total structural overload and athletic conditioning at maximum volume',
      physiologicalOrCognitiveImpact: 'Complete glycogen exhaustion with systemic muscle protein synthesis',
      calorieBurnOrXPBonus: `~${Math.round(duration * 9.5)} kcal • +${Math.round(duration * 1.5)} XP`,
      exerciseSteps: [
        {
          name: 'Barbell Back Squats (High-Bar)',
          targetMuscle: 'Quadriceps, Glutes, Adductors',
          sets: 5,
          reps: '5 Reps',
          restSeconds: 150,
          intensityRpe: 'RPE 8.5',
          cue: 'Break at knees and hips simultaneously, hit parallel depth.'
        },
        {
          name: 'Barbell Flat Bench Press',
          targetMuscle: 'Chest & Anterior Deltoids',
          sets: 5,
          reps: '5 Reps',
          restSeconds: 120,
          intensityRpe: 'RPE 8.5',
          cue: 'Controlled descent, violent explosive press.'
        },
        {
          name: 'Romanian Deadlifts (RDL)',
          targetMuscle: 'Hamstrings & Posterior Glutes',
          sets: 4,
          reps: '8–10 Reps',
          restSeconds: 90,
          intensityRpe: 'RPE 8.0',
          cue: 'Push hips backward until deep hamstring stretch is felt.'
        },
        {
          name: 'Weighted Dips & Pull-Ups Superset',
          targetMuscle: 'Chest, Triceps, Lats, Biceps',
          sets: 4,
          reps: '8–10 Reps Each',
          restSeconds: 90,
          intensityRpe: 'RPE 9.0',
          cue: 'Full range of motion, controlled tempo.'
        },
        {
          name: 'Zone 2 Cardio Cool-Down Ruck',
          targetMuscle: 'Cardiovascular Clearance',
          sets: 1,
          reps: `${Math.max(20, duration - 60)} Minutes`,
          restSeconds: 0,
          intensityRpe: 'Zone 2',
          cue: 'Flush lactic acid and initiate parasympathetic recovery.'
        }
      ]
    },
    {
      id: `fit-endurance-ultra-${duration}`,
      domain: 'FITNESS',
      title: 'Ultra-Endurance Metabolic Furnace',
      subtitle: 'Hybrid zone 2 aerobic rucking + kettlebell functional armor',
      durationMinutes: duration,
      difficulty: 'INTENSE',
      targetObjective: 'Immense caloric burn, mental grit, and fat oxidation conditioning',
      physiologicalOrCognitiveImpact: 'Maximizes mitochondrial biogenesis and capillary density',
      calorieBurnOrXPBonus: `~${Math.round(duration * 8.8)} kcal • +${Math.round(duration * 1.5)} XP`,
      exerciseSteps: [
        {
          name: 'Weighted Vest / Ruck Hill March (35 lbs)',
          targetMuscle: 'Cardio, Traps, Spinal Erectors, Legs',
          sets: 1,
          reps: `${Math.floor(duration * 0.7)} Minutes`,
          restSeconds: 60,
          intensityRpe: 'Zone 2–3 (130–145 BPM)',
          cue: 'Keep chest high, maintain 3.5 mph brisk power walk.'
        },
        {
          name: 'Kettlebell Clean & Press + Front Squat Complex',
          targetMuscle: 'Full Body Functional Core',
          sets: 6,
          reps: '10 Complexes',
          restSeconds: 60,
          intensityRpe: 'RPE 8.5',
          cue: 'Smooth transition from clean into overhead press.'
        },
        {
          name: 'Hanging Leg Raises & Farmer Walk Carries',
          targetMuscle: 'Grip & Core Anti-Extension',
          sets: 4,
          reps: '50m Carry + 15 Raises',
          restSeconds: 60,
          intensityRpe: 'RPE 9.0',
          cue: 'Heavy dumbbells in each hand, zero spinal sway.'
        }
      ]
    }
  ];
}

function getFinancePrescriptions(duration: number, level: number): TacticalPrescription[] {
  if (duration <= 30) {
    return [
      {
        id: `fin-lbo-core-${duration}`,
        domain: 'FINANCE',
        title: 'LBO Mechanics & Cash Sweep Speed Drill',
        subtitle: 'Build a rapid 1-sheet Leveraged Buyout model with debt paydown',
        durationMinutes: duration,
        difficulty: 'STANDARD',
        targetObjective: 'Master debt paydown schedules and IRR return sensitivity',
        physiologicalOrCognitiveImpact: 'Strengthens mental modeling of capital structure & leverage effects',
        calorieBurnOrXPBonus: `+${Math.floor(duration * 1.5)} XP • Institutional PE Skill`,
        financeSteps: [
          {
            topic: 'Sources & Uses and Entry Multiples',
            durationMinutes: 10,
            deliverable: 'Complete Sources & Uses table with Sponsor Equity plug',
            coreConcepts: ['Transaction multiples (10x EBITDA)', 'Senior Term Loan vs Subordinated Mezzanine debt', 'Transaction fees & financing capitalized costs'],
            keyFormulaOrSkill: 'Sponsor Equity = Total Uses - (Total Debt Raised + Rollover Equity)'
          },
          {
            topic: 'Debt Schedule & 100% Cash Sweep Logic',
            durationMinutes: 12,
            deliverable: 'Formulated dynamic debt paydown schedule in Excel',
            coreConcepts: ['Mandatory amortization vs voluntary sweeps', 'Cash flow available for debt service (CFADS)', 'Interest expense circularity handling'],
            keyFormulaOrSkill: 'Sweep = MIN(Beginning Debt - Mandatory Amort, Max(0, Free Cash Flow))'
          },
          {
            topic: 'Returns Analysis (IRR & MOIC Table)',
            durationMinutes: 8,
            deliverable: '2D Data table showing 3-year and 5-year IRR vs Exit Multiple',
            coreConcepts: ['Multiple expansion vs multiple contraction', 'Deleveraging impact on equity returns'],
            keyFormulaOrSkill: 'IRR = (Exit Equity / Entry Equity) ^ (1 / Years) - 1'
          }
        ]
      },
      {
        id: `fin-dcf-wacc-${duration}`,
        domain: 'FINANCE',
        title: 'Unlevered DCF & WACC Derivation Drill',
        subtitle: 'Calculate intrinsic value per share from UFCF projections',
        durationMinutes: duration,
        difficulty: 'STANDARD',
        targetObjective: 'Master enterprise value bridge and discount rate computation',
        physiologicalOrCognitiveImpact: 'High precision in valuation assumptions and terminal growth dynamics',
        calorieBurnOrXPBonus: `+${Math.floor(duration * 1.5)} XP • Investment Banking Skill`,
        financeSteps: [
          {
            topic: 'Unlevered Free Cash Flow (UFCF) Bridge',
            durationMinutes: 12,
            deliverable: 'Clean 5-year forecast of NOPAT and UFCF',
            coreConcepts: ['EBIT * (1 - Tax Rate)', '+ D&A', '- CapEx', '- Change in Net Working Capital'],
            keyFormulaOrSkill: 'UFCF = NOPAT + D&A - CapEx - ΔNWC'
          },
          {
            topic: 'WACC & Terminal Value Calculation',
            durationMinutes: 10,
            deliverable: 'Calculated Gordon Growth and Exit Multiple terminal values',
            coreConcepts: ['CAPM Cost of Equity: Rf + Beta * (Rm - Rf)', 'Cost of Debt * (1 - T)', 'Gordon Growth vs EBITDA multiple method'],
            keyFormulaOrSkill: 'Terminal Value = UFCF(n) * (1 + g) / (WACC - g)'
          },
          {
            topic: 'Enterprise Value to Equity Value Bridge',
            durationMinutes: 8,
            deliverable: 'Per share implied intrinsic value calculation',
            coreConcepts: ['PV of Cash Flows + PV of TV = Enterprise Value', 'Equity Value = EV - Total Debt + Cash - Minority Interest'],
            keyFormulaOrSkill: 'Implied Share Price = Equity Value / Diluted Shares Outstanding'
          }
        ]
      },
      {
        id: `fin-mna-accretion-${duration}`,
        domain: 'FINANCE',
        title: 'M&A Accretion / Dilution Rapid Sensitivity',
        subtitle: 'Evaluate buyer pro-forma EPS impact with cash vs stock deal mix',
        durationMinutes: duration,
        difficulty: 'INTENSE',
        targetObjective: 'Determine acquisition viability and break-even synergy requirements',
        physiologicalOrCognitiveImpact: 'Fast corporate finance strategic reasoning under time constraints',
        calorieBurnOrXPBonus: `+${Math.floor(duration * 1.5)} XP • M&A Execution Skill`,
        financeSteps: [
          {
            topic: 'Buyer vs Target Earnings Power Bridge',
            durationMinutes: 10,
            deliverable: 'Combined net income schedule with interest & forgone cash',
            coreConcepts: ['Standalone Buyer Net Income + Target Net Income', 'New debt interest expense post-tax', 'Forgone interest income on balance sheet cash'],
            keyFormulaOrSkill: 'Pro-Forma Net Income = Buyer NI + Target NI + After-Tax Synergies - Post-Tax Deal Interest'
          },
          {
            topic: 'New Shares Issued & EPS Sensitivity',
            durationMinutes: 12,
            deliverable: 'Accretion / Dilution % matrix across stock consideration percentages',
            coreConcepts: ['New shares = Stock Consideration / Buyer Share Price', 'Pro-Forma EPS = Pro-Forma NI / Pro-Forma Share Count'],
            keyFormulaOrSkill: 'Accretion % = (Pro-Forma EPS - Buyer Standalone EPS) / Buyer Standalone EPS'
          },
          {
            topic: 'Break-Even Synergy Threshold',
            durationMinutes: 8,
            deliverable: 'Calculated pre-tax synergies required to avoid dilution',
            coreConcepts: ['Synergy realization curve', 'Integration cost write-offs'],
            keyFormulaOrSkill: 'Required Synergies = EPS Shortfall * Pro-Forma Shares / (1 - Tax Rate)'
          }
        ]
      }
    ];
  }

  // 60m to 240m In-Depth Modules
  return [
    {
      id: `fin-institutional-lbo-${duration}`,
      domain: 'FINANCE',
      title: 'Full Institutional LBO Model & Sensitivity Suite',
      subtitle: `${duration}m complete private equity case study with dynamic debt tranches`,
      durationMinutes: duration,
      difficulty: 'ELITE',
      targetObjective: 'Build a presentation-ready buyout model with revolver, Term Loan B, and mezzanine debt',
      physiologicalOrCognitiveImpact: 'Comprehensive command of institutional private equity transaction structuring',
      calorieBurnOrXPBonus: `+${Math.floor(duration * 1.5)} XP • Wall Street Elite Tier`,
      financeSteps: [
        {
          topic: 'Operating Model & 3-Statement Forecast',
          durationMinutes: Math.floor(duration * 0.35),
          deliverable: 'Revenue build, COGS breakdown, CapEx schedule, working capital engine',
          coreConcepts: ['Price vs Volume drivers', 'Fixed vs Variable operating leverage', 'Days Sales Outstanding (DSO) & Inventory turnover'],
          keyFormulaOrSkill: 'NWC = (A/R + Inventory + Prepaid) - (A/P + Accrued Liabilities)'
        },
        {
          topic: 'Advanced Multi-Tranche Debt Waterfall',
          durationMinutes: Math.floor(duration * 0.35),
          deliverable: 'Revolving credit facility, Senior Term Loan A/B, and Mezzanine PIK interest',
          coreConcepts: ['Revolver minimum cash requirements', 'Mandatory 1% annual amortization', 'Payment-in-Kind (PIK) non-cash interest toggle'],
          keyFormulaOrSkill: 'Ending Mezzanine = Beginning Mezzanine + PIK Interest - Repayments'
        },
        {
          topic: 'Returns Sensitivity & Waterfall Carried Interest',
          durationMinutes: Math.floor(duration * 0.3),
          deliverable: 'LP/GP distribution waterfall with 8% hurdle rate and 20% carry',
          coreConcepts: ['MoIC by investor class', 'Exit multiple vs EBITDA growth attribution', 'Catch-up provisions'],
          keyFormulaOrSkill: 'GP Carried Interest = (Total Gains - Hurdle) * 20%'
        }
      ]
    },
    {
      id: `fin-quant-volatility-${duration}`,
      domain: 'FINANCE',
      title: 'Quant Volatility & Black-Scholes Greeks Engine',
      subtitle: 'Derivatives pricing, delta hedging, and volatility surface skew modeling',
      durationMinutes: duration,
      difficulty: 'ELITE',
      targetObjective: 'Understand mathematical options pricing, gamma risk, and statistical arbitrage',
      physiologicalOrCognitiveImpact: 'Deep quantitative literacy in risk management and non-linear payoff structures',
      calorieBurnOrXPBonus: `+${Math.floor(duration * 1.5)} XP • Quant Hedge Fund Skill`,
      financeSteps: [
        {
          topic: 'Black-Scholes-Merton Call & Put Formulations',
          durationMinutes: Math.floor(duration * 0.35),
          deliverable: 'Closed-form BSM option pricer in Excel / Python logic',
          coreConcepts: ['d1 & d2 cumulative normal distribution calculations', 'Risk-free discounting', 'Implied volatility root finding (Newton-Raphson)'],
          keyFormulaOrSkill: 'C = S*N(d1) - K*e^(-rt)*N(d2)'
        },
        {
          topic: 'The Greeks: Delta, Gamma, Theta, Vega, Rho',
          durationMinutes: Math.floor(duration * 0.35),
          deliverable: 'Dynamic Greek sensitivity matrix across spot price and time decay',
          coreConcepts: ['Delta hedging position sizing', 'Gamma risk acceleration near expiration', 'Vega exposure across volatility regimes'],
          keyFormulaOrSkill: 'Delta = ∂C/∂S = N(d1) • Gamma = ∂²C/∂S² = N\'(d1)/(S*σ*√T)'
        },
        {
          topic: 'Volatility Skew & Delta-Neutral Hedging Strategy',
          durationMinutes: Math.floor(duration * 0.3),
          deliverable: 'Simulated delta-neutral portfolio with daily rebalancing logs',
          coreConcepts: ['Implied volatility smile and skew', 'PnL attribution: Theta decay vs Gamma gains'],
          keyFormulaOrSkill: 'Rebalance Shares = - Delta * Number of Contracts * 100'
        }
      ]
    }
  ];
}
