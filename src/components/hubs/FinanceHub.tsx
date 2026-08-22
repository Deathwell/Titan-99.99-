import React, { useState } from 'react';
import {
  LineChart,
  BookOpen,
  PlusCircle,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Sliders,
  Shield,
  Sparkles,
  Code,
  Filter
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { SYLLABUS_TOPICS } from '../../lib/defaultData';
import { SyllabusTopic } from '../../types/titan';

export const FinanceHub: React.FC = () => {
  const {
    metrics,
    updateMetrics,
    financeLogs,
    addFinanceLog,
    composite,
    setActiveQuizTopic
  } = useTitan();

  const [disciplineFilter, setDisciplineFilter] = useState<'ALL' | 'PRIVATE_EQUITY' | 'INVESTMENT_BANKING' | 'QUANT_DERIVATIVES' | 'FIXED_INCOME_MACRO' | 'FACTOR_RISK'>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [topicId, setTopicId] = useState<string>('syl-01');
  const [duration, setDuration] = useState<number>(45);
  const [score, setScore] = useState<number>(90);
  const [notes, setNotes] = useState<string>('');

  const bumpScore = (field: 'financialModeling' | 'transactionStructuring' | 'quantitativeDerivatives', delta: number) => {
    const current = metrics[field];
    const next = Math.min(100, Math.max(0, current + delta));
    updateMetrics({ [field]: next });
  };

  const handleStudySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedTopic = SYLLABUS_TOPICS.find(s => s.id === topicId) || SYLLABUS_TOPICS[0];

    addFinanceLog({
      discipline: selectedTopic.discipline,
      topicId: selectedTopic.id,
      topicName: selectedTopic.title,
      durationMinutes: Number(duration),
      scoreAchieved: Number(score),
      notes: notes || `Completed review drill for ${selectedTopic.title}.`
    });

    setNotes('');
    setIsFormOpen(false);
  };

  const filteredTopics = SYLLABUS_TOPICS.filter(t => {
    if (disciplineFilter === 'ALL') return true;
    return t.discipline === disciplineFilter;
  });

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-800/40 text-titan-emerald">
                <LineChart className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wider">
                  INSTITUTIONAL FINANCE MASTERY COMMAND
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  Comprehensive 8-Module Top 1% Institutional Curriculum: Private Equity, M&A, Quant Derivatives, Fixed Income & Factor Risk.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 font-mono text-xs">
              <span className="text-slate-400">DIMENSION SCORE: </span>
              <strong className="text-titan-emerald text-sm">{composite.percentileFinance.toFixed(2)}%</strong>
              <span className="text-slate-500 ml-1">({composite.zFinance >= 0 ? `+${composite.zFinance.toFixed(2)}` : composite.zFinance.toFixed(2)}σ)</span>
            </div>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-titan-emerald hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-glow-emerald"
            >
              <PlusCircle className="h-4 w-4" />
              {isFormOpen ? 'Close Logger' : 'Log Study Session'}
            </button>
          </div>
        </div>
      </div>

      {/* Study Log Form Accordion */}
      {isFormOpen && (
        <form
          onSubmit={handleStudySubmit}
          className="rounded-xl border border-titan-emerald/40 bg-slate-900/90 p-5 shadow-glow-emerald backdrop-blur-xl animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-titan-emerald" /> LOG INSTITUTIONAL FINANCE STUDY SESSION
            </h3>
            <span className="text-xs text-emerald-400">+300 XP REWARD</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">CURRICULUM TOPIC</label>
              <select
                value={topicId}
                onChange={e => setTopicId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-titan-emerald focus:outline-none"
              >
                {SYLLABUS_TOPICS.map(t => (
                  <option key={t.id} value={t.id}>
                    [{t.discipline.replace(/_/g, ' ')}] {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">DURATION (MINUTES)</label>
              <input
                type="number"
                min="10"
                max="300"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-titan-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">SELF-EVALUATION SCORE (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={e => setScore(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-titan-emerald focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-slate-400 block mb-1 text-xs">INSIGHTS / NOTES</label>
            <input
              type="text"
              placeholder="e.g. Mastered circularity breaker, derived Vanna & Volga Greeks, calculated hazard default rate..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-xs"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-titan-emerald hover:bg-emerald-400 text-black font-bold text-xs font-mono shadow-glow-emerald"
            >
              Log & Update Baseline
            </button>
          </div>
        </form>
      )}

      {/* 3 Core Dimension Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Core Financial Modeling */}
        <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">FINANCIAL MODELING</span>
              <span className="text-xs font-bold text-titan-emerald">
                {composite.metrics.financialModeling.percentile.toFixed(1)}%ile (Z = +{composite.metrics.financialModeling.zScore.toFixed(2)}σ)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              3-Statement, DCF, WACC & Working Capital. Top 1%: ≥ 95.0
            </p>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white">
                {metrics.financialModeling}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => bumpScore('financialModeling', -1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  -1
                </button>
                <button
                  onClick={() => bumpScore('financialModeling', 1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs"
                >
                  +1
                </button>
                <button
                  onClick={() => bumpScore('financialModeling', 5)}
                  className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700/50 hover:bg-emerald-900 text-emerald-300 font-bold text-xs"
                >
                  +5
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={metrics.financialModeling}
              onChange={e => updateMetrics({ financialModeling: parseInt(e.target.value, 10) })}
              className="w-full mt-4"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>ModelOff Benchmark</span>
            <span>{metrics.financialModeling >= 95 ? 'TITAN APEX' : `${95 - metrics.financialModeling} pts to Top 1%`}</span>
          </div>
        </div>

        {/* Transaction Structuring */}
        <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">TRANSACTION STRUCTURING</span>
              <span className="text-xs font-bold text-titan-emerald">
                {composite.metrics.transactionStructuring.percentile.toFixed(1)}%ile (Z = +{composite.metrics.transactionStructuring.zScore.toFixed(2)}σ)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              LBO Debt Tranches, M&A Accretion & PPA. Top 1%: ≥ 94.0
            </p>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white">
                {metrics.transactionStructuring}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => bumpScore('transactionStructuring', -1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  -1
                </button>
                <button
                  onClick={() => bumpScore('transactionStructuring', 1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs"
                >
                  +1
                </button>
                <button
                  onClick={() => bumpScore('transactionStructuring', 5)}
                  className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700/50 hover:bg-emerald-900 text-emerald-300 font-bold text-xs"
                >
                  +5
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={metrics.transactionStructuring}
              onChange={e => updateMetrics({ transactionStructuring: parseInt(e.target.value, 10) })}
              className="w-full mt-4"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>PE Associate Screener</span>
            <span>{metrics.transactionStructuring >= 94 ? 'TITAN APEX' : `${94 - metrics.transactionStructuring} pts to Top 1%`}</span>
          </div>
        </div>

        {/* Quant & Derivatives */}
        <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">QUANT & DERIVATIVES</span>
              <span className="text-xs font-bold text-titan-emerald">
                {composite.metrics.quantitativeDerivatives.percentile.toFixed(1)}%ile (Z = +{composite.metrics.quantitativeDerivatives.zScore.toFixed(2)}σ)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Option Greeks, StatArb, Factor Risk & Rates. Top 1%: ≥ 92.0
            </p>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white">
                {metrics.quantitativeDerivatives}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => bumpScore('quantitativeDerivatives', -1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  -1
                </button>
                <button
                  onClick={() => bumpScore('quantitativeDerivatives', 1)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs"
                >
                  +1
                </button>
                <button
                  onClick={() => bumpScore('quantitativeDerivatives', 5)}
                  className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-700/50 hover:bg-emerald-900 text-emerald-300 font-bold text-xs"
                >
                  +5
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={metrics.quantitativeDerivatives}
              onChange={e => updateMetrics({ quantitativeDerivatives: parseInt(e.target.value, 10) })}
              className="w-full mt-4"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Trading Desk Screener</span>
            <span>{metrics.quantitativeDerivatives >= 92 ? 'TITAN APEX' : `${92 - metrics.quantitativeDerivatives} pts to Top 1%`}</span>
          </div>
        </div>
      </div>

      {/* TOP 1% INSTITUTIONAL FINANCE MASTER CURRICULUM (8 MODULES) */}
      <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-titan-emerald" /> TOP 1% INSTITUTIONAL FINANCE MASTER CURRICULUM ({SYLLABUS_TOPICS.length} MODULES)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Launch interactive drill quizzes to test real institutional knowledge and elevate your global percentile.
            </p>
          </div>

          {/* Discipline Filter Tabs */}
          <div className="flex flex-wrap items-center rounded-lg border border-slate-800 bg-titan-card p-1 text-xs">
            {(['ALL', 'PRIVATE_EQUITY', 'INVESTMENT_BANKING', 'QUANT_DERIVATIVES', 'FIXED_INCOME_MACRO', 'FACTOR_RISK'] as const).map(f => (
              <button
                key={f}
                onClick={() => setDisciplineFilter(f)}
                className={`px-2.5 py-1 rounded transition-all text-[11px] font-bold ${
                  disciplineFilter === f
                    ? 'bg-titan-emerald text-black shadow-glow-emerald'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Concept Cards Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTopics.map(topic => (
            <div
              key={topic.id}
              className="rounded-xl border border-slate-800 bg-titan-card/60 p-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-[9px] font-bold">
                    {topic.discipline.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">
                    Target: +{topic.benchmarkZTarget}σ
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mt-2 group-hover:text-emerald-300 transition-colors leading-snug">
                  {topic.title}
                </h4>

                <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                  {topic.subtopics.slice(0, 2).map((sub, idx) => (
                    <div key={idx} className="flex items-start gap-1 truncate">
                      <span className="text-emerald-400">•</span>
                      <span className="truncate">{sub}</span>
                    </div>
                  ))}
                </div>

                {/* Key Formula Snippet */}
                {topic.keyFormulas.length > 0 && (
                  <div className="mt-3 p-2 rounded bg-slate-900/90 border border-slate-800/80 text-[10px] text-cyan-300 truncate">
                    <span className="text-slate-500 block text-[9px]">KEY FORMULA:</span>
                    <span className="truncate block font-bold">{topic.keyFormulas[0]}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {topic.quizQuestions.length} Questions Test
                </span>

                <button
                  onClick={() => setActiveQuizTopic(topic)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-950/70 border border-emerald-600 hover:bg-emerald-500 hover:text-black text-emerald-300 font-bold text-xs transition-all shadow-sm"
                >
                  <span>Launch Drill</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finance Log Archive */}
      <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-titan-emerald" /> FINANCE MASTERY LOG ARCHIVE
          </h3>
          <span className="text-xs text-slate-400">{financeLogs.length} DRILLS RECORDED</span>
        </div>

        {financeLogs.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">DATE</th>
                  <th className="pb-2">DISCIPLINE</th>
                  <th className="pb-2">TOPIC</th>
                  <th className="pb-2">DURATION</th>
                  <th className="pb-2">SCORE</th>
                  <th className="pb-2">NOTES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {financeLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 text-slate-300">{log.dateDisplay}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-[10px] font-bold">
                        {log.discipline ? log.discipline.replace(/_/g, ' ') : 'FINANCE'}
                      </span>
                    </td>
                    <td className="py-2.5 text-white font-medium">{log.topicName}</td>
                    <td className="py-2.5 text-slate-300">{log.durationMinutes} min</td>
                    <td className="py-2.5 font-bold text-emerald-400">{log.scoreAchieved} / 100</td>
                    <td className="py-2.5 text-slate-400 max-w-xs truncate" title={log.notes}>
                      {log.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            No finance drills logged yet. Select any of the 8 institutional modules above and click "Launch Drill" to start your first evaluation quiz!
          </div>
        )}
      </div>
    </div>
  );
};
