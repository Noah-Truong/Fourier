'use client';

import { FourierMetrics } from '@/types/fourier';

interface MetricsProps {
  metrics: FourierMetrics;
  time: number;
}

export function Metrics({ metrics, time }: MetricsProps) {
  const formatNumber = (n: number, decimals = 2) => {
    if (isNaN(n) || !isFinite(n)) return '0.00';
    return n.toFixed(decimals);
  };

  const convergencePercent = Math.max(0, (1 - metrics.convergenceError) * 100);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-800/50 p-4 rounded-lg">
        <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
          Harmonics
        </div>
        <div className="text-2xl font-bold text-white">
          {metrics.totalHarmonics}
        </div>
        <div className="text-xs text-slate-500">active terms</div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg">
        <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
          Time
        </div>
        <div className="text-2xl font-bold text-cyan-400 font-mono">
          {formatNumber(time % (2 * Math.PI), 2)}
        </div>
        <div className="text-xs text-slate-500">radians</div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg">
        <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
          THD
        </div>
        <div className="text-2xl font-bold text-purple-400">
          {formatNumber(metrics.thd, 1)}%
        </div>
        <div className="text-xs text-slate-500">total harmonic distortion</div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg">
        <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
          Convergence
        </div>
        <div className="text-2xl font-bold text-green-400">
          {formatNumber(convergencePercent, 1)}%
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all"
            style={{ width: `${convergencePercent}%` }}
          />
        </div>
      </div>

      <div className="col-span-2 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-4 rounded-lg border border-indigo-800/50">
        <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
          Mathematical Insight
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {metrics.totalHarmonics < 5 ? (
            <>
              With only <span className="text-cyan-400">{metrics.totalHarmonics}</span> terms,
              the approximation shows significant deviation from the ideal waveform.
              Add more terms to improve accuracy.
            </>
          ) : metrics.totalHarmonics < 15 ? (
            <>
              Using <span className="text-cyan-400">{metrics.totalHarmonics}</span> harmonics
              provides a reasonable approximation. The Gibbs phenomenon is visible at
              discontinuities.
            </>
          ) : (
            <>
              With <span className="text-cyan-400">{metrics.totalHarmonics}</span> terms,
              the series converges well ({formatNumber(convergencePercent, 0)}%).
              The Gibbs overshoot at discontinuities remains at ~9%.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
