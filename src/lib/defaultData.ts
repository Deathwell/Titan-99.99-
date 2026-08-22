import {
  DailyQuest,
  DimensionWeights,
  FinanceStudyLogEntry,
  HistoricalSnapshot,
  SyllabusTopic,
  UserMetricsState,
  UserProfile,
  WorkoutLogEntry
} from '../types/titan';
import { calculateCompositeState } from './statsEngine';

/**
 * Clean Slate / Day 0 Profile (For real user beginning their journey)
 */
export const CLEAN_START_PROFILE: UserProfile = {
  callsign: 'OPERATOR-01',
  operatorId: 'TITAN-INIT-001',
  age: 25,
  heightCm: 178,
  bodyWeightKg: 75,
  targetPercentile: 99.00,
  soundEnabled: true,
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  isFreshStart: true,
  decayPenaltyActive: false
};

/**
 * Clean Slate / Day 0 Initial Starting Baseline Metrics
 */
export const CLEAN_START_METRICS: UserMetricsState = {
  // Physical Metrics (Entry Baseline)
  vo2Max: 40.0,
  run15Mile: 750,
  benchPressKg: 65,
  deadliftKg: 95,
  bodyWeightKg: 75,
  bodyFatPercent: 22.0,

  benchPressBW: 0.866,
  deadliftBW: 1.266,

  // Finance Scores (Entry Baseline: 0-100)
  financialModeling: 30,
  transactionStructuring: 25,
  quantitativeDerivatives: 20
};

export function generateCleanStartHistory(initialMetrics: UserMetricsState = CLEAN_START_METRICS): HistoricalSnapshot[] {
  const today = new Date().toISOString().split('T')[0];
  const comp = calculateCompositeState(initialMetrics);

  return [
    {
      date: today,
      percentileGlobal: Number(comp.percentileGlobal.toFixed(2)),
      percentilePhysique: Number(comp.percentilePhysique.toFixed(2)),
      percentileFinance: Number(comp.percentileFinance.toFixed(2)),
      zGlobal: Number(comp.zGlobal.toFixed(3)),
      gainsRecorded: false,
      dayIndex: 0
    }
  ];
}

/**
 * DEMO DATA
 */
export const DEMO_USER_PROFILE: UserProfile = {
  callsign: 'SPECTRE-09',
  operatorId: 'TITAN-ARCH-884',
  age: 27,
  heightCm: 182,
  bodyWeightKg: 78,
  targetPercentile: 99.00,
  soundEnabled: true,
  xp: 14250,
  level: 34,
  streakDays: 24,
  lastActiveDate: new Date().toISOString().split('T')[0],
  isFreshStart: false,
  decayPenaltyActive: false
};

export const DEMO_METRICS: UserMetricsState = {
  vo2Max: 61.5,
  run15Mile: 548,
  benchPressKg: 145,
  deadliftKg: 215,
  bodyWeightKg: 78,
  bodyFatPercent: 9.6,
  benchPressBW: 1.859,
  deadliftBW: 2.756,
  financialModeling: 91,
  transactionStructuring: 87,
  quantitativeDerivatives: 81
};

export function generateDemoHistory(): HistoricalSnapshot[] {
  const snapshots: HistoricalSnapshot[] = [];
  const today = new Date();
  const startPGlobal = 86.4;
  const targetPGlobal = 98.6;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const progressFactor = (30 - i) / 30;
    const curve = Math.pow(progressFactor, 0.85);
    const baseP = startPGlobal + (targetPGlobal - startPGlobal) * curve;
    const jitter = Math.sin(i * 1.7) * 0.35;
    const pGlobal = Math.min(99.4, Math.max(85.0, Number((baseP + jitter).toFixed(2))));
    const pPhysique = Math.min(99.2, Number((pGlobal - 0.4 + Math.cos(i * 0.9) * 0.5).toFixed(2)));
    const pFinance = Math.min(99.7, Number((pGlobal + 0.5 + Math.sin(i * 1.2) * 0.4).toFixed(2)));

    snapshots.push({
      date: dateStr,
      percentileGlobal: pGlobal,
      percentilePhysique: pPhysique,
      percentileFinance: pFinance,
      zGlobal: Number(((pGlobal / 100) * 3 - 0.5).toFixed(3)),
      gainsRecorded: true,
      dayIndex: 30 - i
    });
  }

  return snapshots;
}

export const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'q-1',
    title: '1-Hour Endurance Base (Zone 2)',
    category: 'PHYSIQUE',
    description: 'Execute a 60-min continuous aerobic conditioning session to optimize mitochondrial density.',
    targetMetricKey: 'vo2Max',
    xpReward: 350,
    completed: false,
    difficulty: 'HARD'
  },
  {
    id: 'q-2',
    title: '1-Hour Heavy Strength Session',
    category: 'PHYSIQUE',
    description: 'Complete 60-min heavy compound resistance session targeting upper/lower relative power.',
    targetMetricKey: 'deadliftBW',
    xpReward: 350,
    completed: false,
    difficulty: 'HARD'
  },
  {
    id: 'q-3',
    title: 'LBO Waterfall & Debt Sizing Master Drill',
    category: 'FINANCE',
    description: 'Structure 3-tranche debt schedule with cash sweeps and calculate 5-year MoIC / IRR matrix.',
    targetMetricKey: 'transactionStructuring',
    xpReward: 400,
    completed: false,
    difficulty: 'TITAN'
  },
  {
    id: 'q-4',
    title: 'Quantitative Volatility Skew Calibration',
    category: 'FINANCE',
    description: 'Score 90%+ in the Black-Scholes Greeks and Vol Surface evaluation drill.',
    targetMetricKey: 'quantitativeDerivatives',
    xpReward: 450,
    completed: false,
    difficulty: 'TITAN'
  },
  {
    id: 'q-5',
    title: 'Statistical Arbitrage & Cointegration Drill',
    category: 'FINANCE',
    description: 'Master Ornstein-Uhlenbeck mean-reversion modeling and pairs hedge ratio calculations.',
    targetMetricKey: 'quantitativeDerivatives',
    xpReward: 400,
    completed: false,
    difficulty: 'HARD'
  }
];

/**
 * 8 TOP 1% INSTITUTIONAL FINANCE MASTER CURRICULUM
 */
export const SYLLABUS_TOPICS: SyllabusTopic[] = [
  {
    id: 'syl-01',
    discipline: 'PRIVATE_EQUITY',
    targetDimension: 'transactionStructuring',
    title: 'LBO Debt Structuring, Unitranche & Excess Cash Sweeps',
    level: 'TOP_1_PERCENT',
    subtopics: [
      'Senior Term Loan A/B Amortization & SOFR Spread Step-downs',
      'Excess Cash Flow (ECF) Sweep Calculation with CapEx/NWC Deductions',
      'Circular Interest Rate Calculation & Cash Breaker Logic',
      'Returns Attribution: EBITDA Expansion vs Deleveraging vs Multiple Expansion'
    ],
    keyFormulas: [
      'ECF = EBITDA - Cash Interest - Taxes - Mandatory Amortization - CapEx - ΔNWC',
      'MoIC = Total Equity Returned / Initial Equity Invested',
      'IRR = (MoIC)^(1/t) - 1'
    ],
    benchmarkZTarget: 2.33,
    quizQuestions: [
      {
        question: 'In an institutional LBO model, how is Excess Cash Flow (ECF) typically calculated for debt sweeps?',
        options: [
          'EBITDA minus CapEx only',
          'Cash Flow from Operations minus Mandatory Debt Amortization, CapEx, and Tax distributions',
          'Net Income plus Depreciation',
          'Gross Revenue minus Interest Expense'
        ],
        correctIndex: 1,
        explanation: 'ECF is the cash remaining after working capital requirements, mandatory debt service, CapEx, and taxes that can legally and contractually be swept to prepay debt.'
      },
      {
        question: 'If Sponsor equity is $400M on entry and returns $1,200M after 5 years, what is the approximate MoIC and IRR?',
        options: [
          '2.0x MoIC and 15.0% IRR',
          '3.0x MoIC and ~24.6% IRR',
          '3.0x MoIC and ~35.0% IRR',
          '4.0x MoIC and ~31.9% IRR'
        ],
        correctIndex: 1,
        explanation: 'MoIC = 1200 / 400 = 3.0x. IRR = (3.0)^(1/5) - 1 = 1.2457 - 1 = 24.57%.'
      },
      {
        question: 'Why do senior credit agreements require a minimum cash balance floor before triggering a mandatory cash sweep?',
        options: [
          'To inflate sponsor IRR artificially',
          'To ensure operating working capital liquidity and avoid technical default during cyclical troughs',
          'To satisfy SEC equity underwriting regulations',
          'To increase mezzanine coupon rates'
        ],
        correctIndex: 1,
        explanation: 'The borrower must retain adequate operational cash (working capital buffer) to cover payroll, inventory, and operational volatility.'
      }
    ]
  },
  {
    id: 'syl-02',
    discipline: 'QUANT_DERIVATIVES',
    targetDimension: 'quantitativeDerivatives',
    title: 'Black-Scholes, High-Order Greeks & Volatility Surfaces',
    level: 'APEX_TRADING',
    subtopics: [
      'Delta, Gamma, Vega, Theta, Vanna, Volga & Charm High-Order Greeks',
      'Implied Volatility Smile / Skew & Put-Call Parity',
      'Dynamic Delta Hedging & Gamma Scalping PnL Formulation',
      'SABR & SVI Parametric Volatility Surface Calibration'
    ],
    keyFormulas: [
      'd1 = [ln(S/K) + (r + 0.5*σ^2)*t] / (σ*√t)',
      'Gamma = N\'(d1) / (S * σ * √t)',
      'Vanna = dVega/dS = -N\'(d1) * d2 / σ',
      'Volga = dVega/dσ = Vega * (d1 * d2) / σ'
    ],
    benchmarkZTarget: 2.33,
    quizQuestions: [
      {
        question: 'What does the Vanna Greek measure in an institutional options book?',
        options: [
          'The rate of change of Delta with respect to changes in Implied Volatility (dDelta / dVol)',
          'The third derivative of option price with respect to spot price',
          'The decay of Vega over time',
          'The sensitivity of dividend yield to interest rate shocks'
        ],
        correctIndex: 0,
        explanation: 'Vanna (dDelta/dVol or dVega/dSpot) measures how much your delta hedge changes when implied volatility moves, crucial for FX and index options trading desks.'
      },
      {
        question: 'What is the relationship between Gamma and Theta for an ATM European option under Black-Scholes with zero interest rate?',
        options: [
          'Theta is independent of Gamma',
          'Theta = -0.5 * σ^2 * S^2 * Gamma',
          'Gamma and Theta always have the exact same positive sign',
          'Theta equals 1/Gamma'
        ],
        correctIndex: 1,
        explanation: 'From the Black-Scholes PDE: Theta + 0.5 * sigma^2 * S^2 * Gamma = r * (Option - S*Delta). When r=0, Theta = -0.5 * sigma^2 * S^2 * Gamma.'
      },
      {
        question: 'Why does equity index options skew typically slope downwards (higher implied volatility for OTM puts)?',
        options: [
          'Retail investors buy more calls than institutions',
          'Crashophobia / tail-risk hedging demand and corporate leverage effect (falling prices increase leverage and asset volatility)',
          'Clearinghouses fix put prices higher by mandate',
          'Interest rates increase as stock prices drop'
        ],
        correctIndex: 1,
        explanation: 'Downside crash risk protection creates heavy institutional demand for OTM puts, while structural leverage increases volatility as market equity value declines.'
      }
    ]
  },
  {
    id: 'syl-03',
    discipline: 'INVESTMENT_BANKING',
    targetDimension: 'financialModeling',
    title: 'Dynamic 3-Statement Architecture & Advanced DCF',
    level: 'INSTITUTIONAL',
    subtopics: [
      'Unlevered Free Cash Flow (FCFF) vs Levered FCF (FCFE)',
      'Mid-Year Discounting Convention & Stub Period Fractions',
      'Circularity Breakers in Debt Interest, Cash Balances & Tax Shields',
      'Terminal Value: Gordon Growth vs Normalized EBITDA Exit Multiples'
    ],
    keyFormulas: [
      'UFCF = EBIT * (1 - t) + D&A - CapEx - ΔNWC',
      'WACC = (E/V)*Re + (D/V)*Rd*(1 - t)',
      'Enterprise Value = Σ [UFCF_t / (1 + WACC)^(t - 0.5)] + PV(Terminal Value)'
    ],
    benchmarkZTarget: 2.33,
    quizQuestions: [
      {
        question: 'How is Unlevered Free Cash Flow (FCFF) calculated starting from Operating Income (EBIT)?',
        options: [
          'EBIT - Taxes + CapEx - Change in NWC',
          'EBIT * (1 - Tax Rate) + D&A - CapEx - Change in Non-Cash Working Capital',
          'Net Income + D&A - Mandatory Debt Repayment',
          'EBITDA - Interest Expense - Dividends Paid'
        ],
        correctIndex: 1,
        explanation: 'UFCF (FCFF) = NOPAT [EBIT * (1 - t)] + D&A (non-cash) - CapEx - Change in NWC. This represents cash generated available to all capital providers.'
      },
      {
        question: 'Why is mid-year discounting applied in institutional DCF valuations?',
        options: [
          'To artificially boost enterprise valuation by 10%',
          'Because cash flows are received evenly throughout the year rather than lump-sum at year-end',
          'To align with quarterly SEC 10-Q filing deadlines',
          'Because taxes are paid in June only'
        ],
        correctIndex: 1,
        explanation: 'In reality, companies generate revenues and pay expenses continuously across the entire year, so discounting from year midpoint (t - 0.5) is more realistic.'
      },
      {
        question: 'If a company has Enterprise Value of $1,000M, Total Debt of $350M, Cash of $50M, and Minority Interest of $20M, what is Equity Value?',
        options: [
          '$680M',
          '$720M',
          '$1,320M',
          '$600M'
        ],
        correctIndex: 0,
        explanation: 'Equity Value = EV - Net Debt - Minority Interest. Net Debt = 350 - 50 = $300M. Equity Value = 1,000 - 300 - 20 = $680M.'
      }
    ]
  },
  {
    id: 'syl-04',
    discipline: 'INVESTMENT_BANKING',
    targetDimension: 'transactionStructuring',
    title: 'M&A Merger Modeling, Accretion/Dilution & PPA',
    level: 'TOP_1_PERCENT',
    subtopics: [
      'EPS Accretion / Dilution Mechanics & Pro-Forma Share Count',
      'Purchase Price Allocation (PPA), Fair Value Asset Write-ups & Deferred Tax Liabilities (DTL)',
      'Synergy Phasing (Cost vs Revenue Synergies & Integration Costs)',
      'Cash vs Stock vs Debt Consideration Sensitivity & Breakeven P/E Rule'
    ],
    keyFormulas: [
      'Pro-Forma EPS = (Acquirer Net Income + Target Net Income + Post-Tax Synergies - Post-Tax Interest) / Pro-Forma Shares',
      'Created Goodwill = Purchase Price - Fair Value of Net Identifiable Assets Acquired',
      'DTL Created = Asset Write-up * Acquirer Tax Rate'
    ],
    benchmarkZTarget: 2.33,
    quizQuestions: [
      {
        question: 'In an all-stock M&A transaction with no synergies, what is the golden rule for EPS accretion?',
        options: [
          'Acquirer P/E must be lower than Target P/E',
          'Acquirer P/E must be higher than Target P/E (or Acquirer cost of equity lower than Target earnings yield)',
          'Acquirer market cap must be at least 3x Target market cap',
          'Target debt-to-equity ratio must exceed 2.0x'
        ],
        correctIndex: 1,
        explanation: 'In an all-stock deal, if the Acquirer P/E is higher than the Target P/E, the Acquirer pays fewer shares per dollar of target earnings, resulting in immediate EPS accretion.'
      },
      {
        question: 'Why does an asset write-up in an M&A purchase price allocation create a Deferred Tax Liability (DTL)?',
        options: [
          'Because GAAP book value of the asset increases while its tax basis remains unchanged, creating higher book depreciation than tax depreciation',
          'Because the IRS levies an immediate 35% excise tax on mergers',
          'To offset target executive severance golden parachutes',
          'DTLs are only created in all-cash tender offers'
        ],
        correctIndex: 0,
        explanation: 'Book asset value is written up to fair market value, but tax basis is not stepped up in stock deals. Higher book depreciation means future GAAP taxes will be higher than actual cash taxes paid.'
      }
    ]
  },
  {
    id: 'syl-05',
    discipline: 'QUANT_DERIVATIVES',
    targetDimension: 'quantitativeDerivatives',
    title: 'Statistical Arbitrage, Cointegration & OU Processes',
    level: 'APEX_TRADING',
    subtopics: [
      'Engle-Granger & Johansen Cointegration Tests on Asset Spreads',
      'Ornstein-Uhlenbeck (OU) Mean-Reverting SDE Calibration',
      'Hedge Ratio Calculation via Dynamic Kalman Filtering vs OLS',
      'Z-Score Entry/Exit Thresholds & Half-Life of Mean Reversion (ln(2)/θ)'
    ],
    keyFormulas: [
      'dX_t = θ*(μ - X_t)*dt + σ*dW_t',
      'Half-Life = ln(2) / θ',
      'Spread Z-score = (Spread_t - Rolling_Mean) / Rolling_StdDev'
    ],
    benchmarkZTarget: 2.33,
    quizQuestions: [
      {
        question: 'What is the key difference between Correlation and Cointegration in quantitative pairs trading?',
        options: [
          'Correlation measures short-term co-movement of returns; Cointegration tests whether a linear combination of non-stationary price series forms a stationary, mean-reverting spread',
          'Cointegration only applies to crypto assets',
          'Correlation requires cointegration to exist first',
          'Cointegrated series cannot have zero correlation'
        ],
        correctIndex: 0,
        explanation: 'Two series can be strongly correlated but drift apart over time. Cointegration guarantees that the price spread is stationary I(0) and will mean-revert to its long-run equilibrium.'
      },
      {
        question: 'In an Ornstein-Uhlenbeck mean-reverting process dX = θ(μ - X)dt + σdW, if the mean-reversion speed θ = 0.05 per day, what is the half-life?',
        options: [
          '~5 days',
          '~13.86 days (ln(2) / 0.05)',
          '~20 days',
          '~50 days'
        ],
        correctIndex: 1,
        explanation: 'Half-Life = ln(2) / θ = 0.69315 / 0.05 = 13.86 days. This tells the quant desk how long it takes for a deviation to revert halfway back to mean.'
      }
    ]
  },
  {
    id: 'syl-06',
    discipline: 'FIXED_INCOME_MACRO',
    targetDimension: 'financialModeling',
    title: 'Fixed Income Mathematics, Key Rate Durations & SOFR Swaps',
    level: 'TOP_1_PERCENT',
    subtopics: [
      'Macaulay, Modified & Effective Duration vs Convexity',
      'Key Rate Duration (KRD) Bucket Decomposition for Yield Curve Twists/Butterflies',
      'OIS Swaps, Term SOFR Curve Bootstrapping & Cross-Currency Basis',
      'Zero-Coupon Spot Rates & Forward-Forward Rate Calculus'
    ],
    keyFormulas: [
      'Modified Duration = Macaulay Duration / (1 + y/m)',
      'ΔPrice / Price ≈ -ModDur * Δy + 0.5 * Convexity * (Δy)^2',
      'Forward Rate f(t1, t2) = [(1 + r2)^t2 / (1 + r1)^t1]^(1/(t2-t1)) - 1'
    ],
    benchmarkZTarget: 2.33,
    quizQuestions: [
      {
        question: 'Why is positive convexity considered an advantageous property for a fixed income portfolio manager?',
        options: [
          'When yields fall, bond price rises more than duration predicts; when yields rise, bond price drops less than duration predicts',
          'It guarantees zero default risk from sovereign issuers',
          'It eliminates inflation risk completely',
          'It doubles coupon payment frequency'
        ],
        correctIndex: 0,
        explanation: 'Convexity provides beneficial asymmetry (positive second derivative): capital gains are magnified when rates decline, while capital losses are cushioned when rates increase.'
      },
      {
        question: 'If a 10-year Treasury bond has a Modified Duration of 8.2 years and Convexity of 75, what is the estimated price change for a +100 bps (+0.01) rate shock?',
        options: [
          '-8.20%',
          '-7.825% [-8.20% + 0.5 * 75 * (0.01)^2 = -8.20% + 0.375%]',
          '-8.575%',
          '-6.500%'
        ],
        correctIndex: 1,
        explanation: 'ΔP/P ≈ -D*Δy + 0.5*C*(Δy)^2 = -8.2 * 0.01 + 0.5 * 75 * 0.0001 = -0.082 + 0.00375 = -0.07825 (-7.825%).'
      }
    ]
  },
  {
    id: 'syl-07',
    discipline: 'FACTOR_RISK',
    targetDimension: 'transactionStructuring',
    title: 'Credit Risk, Structural Default & CDS Mechanics',
    level: 'TOP_1_PERCENT',
    subtopics: [
      'Merton Structural Default Model (Equity as a Call Option on Firm Assets)',
      'Credit Default Swap (CDS) Par Spreads & Hazard Rate λ Calibration',
      'Collateralized Debt Obligation (CDO) Tranche Loss Waterfall & Gaussian Copula',
      'Recovery Rates & Jump-to-Default Exposure Formulation'
    ],
    keyFormulas: [
      'Hazard Rate λ ≈ CDS Spread / (1 - Recovery Rate R)',
      'Cumulative Default Probability Q(t) = 1 - e^(-λ*t)',
      'Merton Equity Value = Call(Assets, Strike=Debt, Vol=σ_assets, T)'
    ],
    benchmarkZTarget: 2.33,
    quizQuestions: [
      {
        question: 'In Robert Merton’s structural credit model, how is a firm’s equity viewed?',
        options: [
          'As a risk-free perpetuity',
          'As a European Call Option on the total asset value of the firm with strike price equal to the face value of debt',
          'As a short put option on treasury yields',
          'As a subordinated mezzanine loan'
        ],
        correctIndex: 1,
        explanation: 'If total firm assets exceed debt at maturity, equity holders pay off debt (exercise strike) and keep residual assets. If assets are below debt, equity is worthless ($0) and bondholders take the firm.'
      },
      {
        question: 'If a corporate 5-year CDS spread is trading at 180 bps (0.018) with an assumed 40% recovery rate, what is the approximate annual hazard default rate λ?',
        options: [
          '1.08% per year',
          '3.00% per year (0.018 / [1 - 0.40])',
          '4.50% per year',
          '0.72% per year'
        ],
        correctIndex: 1,
        explanation: 'Hazard Rate λ ≈ Spread / (1 - R) = 0.018 / (1 - 0.40) = 0.018 / 0.60 = 0.030 (3.0% annual default probability density).'
      }
    ]
  },
  {
    id: 'syl-08',
    discipline: 'FACTOR_RISK',
    targetDimension: 'quantitativeDerivatives',
    title: 'Cross-Asset Factor Models & Black-Litterman Optimization',
    level: 'APEX_TRADING',
    subtopics: [
      'Fama-French 5-Factor Model (Market, SMB, HML, RMW, CMA)',
      'Barra Risk Model Covariance Matrix Factor Decomposition',
      'Black-Litterman Asset Allocation (Blending Implied Equilibrium with Subjective Views)',
      'Minimum Variance Portfolio & Max Sharpe Tangency Portfolio Calculus'
    ],
    keyFormulas: [
      'R_i - R_f = α_i + β_m*(R_m - R_f) + β_s*SMB + β_h*HML + β_r*RMW + β_c*CMA + ε_i',
      'Implied Equilibrium Returns Π = λ * Σ * w_market',
      'Optimal Weights w* = (1/γ) * Σ^(-1) * μ'
    ],
    benchmarkZTarget: 2.33,
    quizQuestions: [
      {
        question: 'Why does Black-Litterman portfolio optimization overcome standard Markowitz Mean-Variance optimization instability?',
        options: [
          'It eliminates the need for a covariance matrix',
          'It uses the market portfolio equilibrium returns as the neutral starting baseline and only tilts weights based on investor views and confidence intervals',
          'It only invests in risk-free sovereign bonds',
          'It restricts portfolio weights to equal weights (1/N)'
        ],
        correctIndex: 1,
        explanation: 'Markowitz optimization is notoriously sensitive to small errors in expected returns, often producing extreme long/short weights. Black-Litterman stabilizes this by reverse-optimizing market weights as the prior.'
      },
      {
        question: 'What factor risk does the RMW factor represent in the Fama-French 5-factor model?',
        options: [
          'Robust Minus Weak: return spread between firms with robust profitability vs weak operating profitability',
          'Real Estate Market Weighting',
          'Residual Momentum Weight',
          'Repo Margin Waterfall'
        ],
        correctIndex: 0,
        explanation: 'RMW (Robust Minus Weak) captures the profitability anomaly: companies with high robust operating margins consistently outperform companies with weak profitability on a risk-adjusted basis.'
      }
    ]
  }
];
