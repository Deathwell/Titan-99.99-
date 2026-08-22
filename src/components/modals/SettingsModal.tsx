import React, { useState } from 'react';
import {
  X,
  Settings,
  User,
  Sliders,
  RotateCcw,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { DEFAULT_WEIGHTS } from '../../lib/statsEngine';
import { DimensionWeights, UserProfile } from '../../types/titan';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    profile,
    updateProfile,
    weights,
    updateWeights,
    metrics,
    updateMetrics
  } = useTitan();

  const [callsign, setCallsign] = useState(profile.callsign);
  const [age, setAge] = useState(profile.age);
  const [heightCm, setHeightCm] = useState(profile.heightCm);
  const [bodyWeightKg, setBodyWeightKg] = useState(profile.bodyWeightKg);
  const [targetPercentile, setTargetPercentile] = useState(profile.targetPercentile);

  const [tempWeights, setTempWeights] = useState<DimensionWeights>(weights);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      callsign,
      age: Number(age),
      heightCm: Number(heightCm),
      bodyWeightKg: Number(bodyWeightKg),
      targetPercentile: Number(targetPercentile)
    });

    updateMetrics({
      bodyWeightKg: Number(bodyWeightKg)
    });

    updateWeights(tempWeights);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  const handleResetWeights = () => {
    setTempWeights(DEFAULT_WEIGHTS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-titan-cardBorder bg-titan-surface p-6 shadow-2xl font-mono text-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-800 text-titan-cyan">
              <Settings className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider">
              OPERATOR BASELINE & SYSTEM CONFIGURATION
            </h3>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-6">
          {/* Operator Demographics */}
          <div>
            <h4 className="text-xs font-bold text-titan-cyan mb-3 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> 1. OPERATOR BIOMETRIC BASELINES
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">CALLSIGN</label>
                <input
                  type="text"
                  value={callsign}
                  onChange={e => setCallsign(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">BODYWEIGHT (KG)</label>
                <input
                  type="number"
                  step="0.5"
                  value={bodyWeightKg}
                  onChange={e => setBodyWeightKg(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">HEIGHT (CM)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={e => setHeightCm(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">AGE</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">TARGET PERCENTILE</label>
                <input
                  type="number"
                  step="0.1"
                  min="50"
                  max="99.99"
                  value={targetPercentile}
                  onChange={e => setTargetPercentile(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-purple-400 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Dimension Weighting Allocator */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-titan-emerald flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" /> 2. STATISTICAL DIMENSION WEIGHTING MATRIX
              </h4>
              <button
                type="button"
                onClick={handleResetWeights}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Reset Defaults
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Global Dimension Split */}
              <div className="p-3 rounded-lg bg-titan-card border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 font-bold">Global Split (Physique vs Finance)</span>
                  <span className="text-titan-cyan">
                    {(tempWeights.global.physique * 100).toFixed(0)}% / {(tempWeights.global.finance * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={tempWeights.global.physique}
                  onChange={e => {
                    const p = parseFloat(e.target.value);
                    setTempWeights(prev => ({
                      ...prev,
                      global: { physique: p, finance: Number((1 - p).toFixed(2)) }
                    }));
                  }}
                  className="w-full"
                />
              </div>

              {/* Physical Sub-weights */}
              <div className="p-3 rounded-lg bg-titan-card border border-slate-800 space-y-2">
                <span className="text-slate-300 font-bold block">Physique Component Weights</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <label className="text-slate-400 block">VO2 Max: {(tempWeights.physique.vo2Max * 100).toFixed(0)}%</label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={tempWeights.physique.vo2Max}
                      onChange={e => setTempWeights(prev => ({
                        ...prev,
                        physique: { ...prev.physique, vo2Max: parseFloat(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block">1.5-Mi Run: {(tempWeights.physique.run15Mile * 100).toFixed(0)}%</label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={tempWeights.physique.run15Mile}
                      onChange={e => setTempWeights(prev => ({
                        ...prev,
                        physique: { ...prev.physique, run15Mile: parseFloat(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block">Bench / BW: {(tempWeights.physique.benchPressBW * 100).toFixed(0)}%</label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={tempWeights.physique.benchPressBW}
                      onChange={e => setTempWeights(prev => ({
                        ...prev,
                        physique: { ...prev.physique, benchPressBW: parseFloat(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block">Deadlift / BW: {(tempWeights.physique.deadliftBW * 100).toFixed(0)}%</label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={tempWeights.physique.deadliftBW}
                      onChange={e => setTempWeights(prev => ({
                        ...prev,
                        physique: { ...prev.physique, deadliftBW: parseFloat(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block">Body Fat %: {(tempWeights.physique.bodyFatPercent * 100).toFixed(0)}%</label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={tempWeights.physique.bodyFatPercent}
                      onChange={e => setTempWeights(prev => ({
                        ...prev,
                        physique: { ...prev.physique, bodyFatPercent: parseFloat(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-titan-cyan hover:bg-cyan-400 text-black font-bold text-xs shadow-glow-cyan"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-black" />
                  <span>Config Saved!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
