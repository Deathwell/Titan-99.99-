import React from 'react';
import {
  Compass,
  Target,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { SYLLABUS_TOPICS } from '../../lib/defaultData';
import { calculateCompositeState } from '../../lib/statsEngine';

export const CurriculumEngine: React.FC = () => {
  const { composite, metrics, weights, setActiveTab, setActiveQuizTopic } = useTitan();
  const { weakestMetric, strongestMetric, percentileGlobal } = composite;

  // Calculate marginal percentile gain if weakest metric improves by +0.5 std dev
  const simulatedMetrics = { ...metrics };
  const wKey = weakestMetric.key;

  if (wKey === 'vo2Max') simulatedMetrics.vo2Max += 4.25;
  else if (wKey === 'run15Mile') simulatedMetrics.run15Mile -= 45;
  else if (wKey === 'benchPressBW') simulatedMetrics.benchPressKg += Math.round(0.5 * 0.38 * (metrics.bodyWeightKg || 75));
  else if (wKey === 'deadliftBW') simulatedMetrics.deadliftKg += Math.round(0.5 * 0.45 * (metrics.bodyWeightKg || 75));
  else if (wKey === 'bodyFatPercent') simulatedMetrics.bodyFatPercent = Math.max(5, simulatedMetrics.bodyFatPercent - 2.25);
  else if (wKey === 'financialModeling') simulatedMetrics.financialModeling = Math.min(100, simulatedMetrics.financialModeling + 9);
  else if (wKey === 'transactionStructuring') simulatedMetrics.transactionStructuring = Math.min(100, simulatedMetrics.transactionStructuring + 10);
  else if (wKey === 'quantitativeDerivatives') simulatedMetrics.quantitativeDerivatives = Math.min(100, simulatedMetrics.quantitativeDerivatives + 10);

  const simulatedComposite = calculateCompositeState(simulatedMetrics, weights);
  const marginalGain = Math.max(0, simulatedComposite.percentileGlobal - percentileGlobal);

  // Recommendations mapping
  const getPrescription = () => {
    switch (weakestMetric.key) {
      case 'vo2Max':
      case 'run15Mile':
        return {
          title: '1-HOUR ENDURANCE & AEROBIC THRESHOLD PROTOCOL',
          category: 'PHYSIQUE',
          timeEstimate: '60 Minutes',
          steps: [
            '10-min easy progressive warm-up ramping into Zone 2 (130-140 BPM).',
            '40-min sustained steady aerobic base work (running, rowing, or assault bike).',
            '4x 60-second high-cadence surges @ Zone 5 to challenge peak VO2 stroke volume.',
            '10-min cool-down walk & rehydration protocol.'
          ],
          actionLabel: 'Open Physique Hub to Log 1-Hr Endurance',
          action: () => setActiveTab('physique')
        };
      case 'benchPressBW':
      case 'deadliftBW':
        return {
          title: '1-HOUR HEAVY COMPOUND STRENGTH SESSION',
          category: 'PHYSIQUE',
          timeEstimate: '60 Minutes',
          steps: [
            'Joint mobility & progressive ramp-up sets.',
            '45 mins dedicated to heavy compound resistance focusing on relative bodyweight strength.',
            'Rest 2.5 to 3 minutes between working sets to prioritize maximal neural recruitment.',
            'Finisher: 15 mins posterior chain & core stabilization.'
          ],
          actionLabel: 'Open Physique Hub to Log 1-Hr Strength',
          action: () => setActiveTab('physique')
        };
      case 'bodyFatPercent':
        return {
          title: '1-HOUR METABOLIC ZONE 2 & RECOMPOSITION PROTOCOL',
          category: 'PHYSIQUE',
          timeEstimate: '60 Minutes',
          steps: [
            '60 mins continuous low-intensity steady-state cardio (Zone 2) to maximize lipid oxidation.',
            'Maintain caloric awareness: high protein intake (2.0g/kg BW) with clean nutrient density.',
            'Hydrate with 3.5L water daily & ensure 8 hours restorative sleep.'
          ],
          actionLabel: 'Open Physique Hub to Log Session',
          action: () => setActiveTab('physique')
        };
      case 'financialModeling':
        return {
          title: 'DYNAMIC 3-STATEMENT & ADVANCED DCF ARCHITECTURE',
          category: 'FINANCE',
          timeEstimate: '45 Minutes',
          steps: [
            'Master Unlevered Free Cash Flow (FCFF) calculation starting from Operating Income (EBIT).',
            'Implement circularity breakers in debt interest schedules and cash balances.',
            'Execute mid-year discounting conventions and terminal EBITDA multiple sensitivities.',
            'Verify zero balance sheet discrepancy tolerance.'
          ],
          actionLabel: 'Launch 3-Statement & DCF Drill',
          action: () => {
            const syl = SYLLABUS_TOPICS.find(s => s.id === 'syl-03') || SYLLABUS_TOPICS[0];
            setActiveQuizTopic(syl);
          }
        };
      case 'transactionStructuring':
        return {
          title: 'LBO DEBT STRUCTURING & EXCESS CASH SWEEP MASTERY',
          category: 'FINANCE',
          timeEstimate: '45 Minutes',
          steps: [
            'Structure multi-tranche debt schedules (Senior Secured, Subordinated, Mezzanine).',
            'Model mandatory excess cash flow (ECF) sweeps with minimum cash balance liquidity floors.',
            'Calculate Returns Attribution bridge (EBITDA growth vs Debt paydown vs Multiple expansion).',
            'Derive 5-year Sponsor MoIC and IRR across sensitivity exit multiple grids.'
          ],
          actionLabel: 'Launch LBO Structuring Drill',
          action: () => {
            const syl = SYLLABUS_TOPICS.find(s => s.id === 'syl-01') || SYLLABUS_TOPICS[0];
            setActiveQuizTopic(syl);
          }
        };
      case 'quantitativeDerivatives':
      default:
        return {
          title: 'BLACK-SCHOLES, HIGH-ORDER GREEKS & VOLATILITY SURFACES',
          category: 'FINANCE',
          timeEstimate: '45 Minutes',
          steps: [
            'Isolate Gamma-Theta trade-off under zero drift and derive Delta-neutral hedging PnL.',
            'Understand high-order Greeks: Vanna (dDelta/dVol) and Volga (dVega/dVol).',
            'Analyze equity index downside put skew vs commodity call skew.',
            'Calibrate SVI / SABR parametric volatility surface models.'
          ],
          actionLabel: 'Launch Greeks & Vol Surface Drill',
          action: () => {
            const syl = SYLLABUS_TOPICS.find(s => s.id === 'syl-02') || SYLLABUS_TOPICS[0];
            setActiveQuizTopic(syl);
          }
        };
    }
  };

  const prescription = getPrescription();

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-950/70 border border-amber-800/40 text-amber-400">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wider">
              INTELLIGENT CURRICULUM RECOMMENDER
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Algorithmic Weakest Link Principle: Identifies the single metric with the highest marginal percentile return on investment.
            </p>
          </div>
        </div>
      </div>

      {/* Weakest Link Diagnostic Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl border border-amber-500/40 bg-titan-surface/90 p-6 shadow-glow-amber relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold text-amber-400 tracking-wider">
                TODAY'S HIGH-ROI PRIORITY OBJECTIVE
              </span>
            </div>
            <span className="text-xs text-slate-400">
              EST. TIME: <strong className="text-white">{prescription.timeEstimate}</strong>
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600 text-amber-300 text-[10px] font-bold">
                {prescription.category} DISCIPLINE
              </span>
              <span className="text-xs text-slate-400">
                CURRENT VECTOR: <strong className="text-white">{weakestMetric.benchmark.label}</strong>
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mt-2">
              {prescription.title}
            </h3>

            {/* Tactical Execution Steps */}
            <div className="mt-4 space-y-2.5">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-titan-cyan" /> TACTICAL DIRECTIVES:
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                {prescription.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-titan-card/60 border border-slate-800">
                    <span className="text-titan-cyan font-bold shrink-0">[{idx + 1}]</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs">
                <span className="text-slate-400">Projected Gain: </span>
                <strong className="text-emerald-400 font-bold">+{marginalGain.toFixed(2)}% Global %ile</strong>
              </div>

              <button
                onClick={prescription.action}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-glow-amber transition-all"
              >
                <span>{prescription.actionLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Marginal Analysis Side Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/70 p-5">
            <h4 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> SENSITIVITY & MARGINAL GAIN
            </h4>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">CURRENT GLOBAL PERCENTILE</div>
                <div className="text-xl font-bold text-white font-mono">
                  {percentileGlobal.toFixed(2)}%
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px]">PROJECTED AFTER +0.5σ DRILL</div>
                <div className="text-xl font-bold text-emerald-400 font-mono">
                  {simulatedComposite.percentileGlobal.toFixed(2)}%
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                Because percentile distributions are non-linear (normal bell curve), elevating your lowest Z-score yields the highest marginal boost to overall rank.
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/70 p-5">
            <h4 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-titan-cyan" /> STRONGEST VECTOR ANCHOR
            </h4>

            <div className="mt-3 text-xs space-y-1">
              <div className="text-slate-200 font-bold">{strongestMetric.benchmark.label}</div>
              <div className="text-titan-cyan font-bold text-sm">
                {strongestMetric.percentile.toFixed(2)}%ile (Z = +{strongestMetric.zScore.toFixed(2)}σ)
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Your highest performing domain. Maintain consistency while aggressively shoring up the bottleneck.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
