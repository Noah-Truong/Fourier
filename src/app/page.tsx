'use client';

import { useState, useCallback } from 'react';
import { FourierCanvas } from '@/components/FourierCanvas';
import { Controls } from '@/components/Controls';
import { Equations } from '@/components/Equations';
import { Metrics } from '@/components/Metrics';
import { useFourierCoefficients, calculateMetrics } from '@/hooks/useFourier';
import { FourierSettings } from '@/types/fourier';

const defaultSettings: FourierSettings = {
  waveType: 'square',
  numTerms: 10,
  speed: 1,
  amplitude: 1,
  showCircles: true,
  showVectors: true,
  trailLength: 300,
};

export default function Home() {
  const [settings, setSettings] = useState<FourierSettings>(defaultSettings);
  const [time, setTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'equations' | 'metrics'>('equations');

  const coefficients = useFourierCoefficients(settings.waveType, settings.numTerms);
  const metrics = calculateMetrics(coefficients, settings.waveType, settings.amplitude);

  const handleTimeUpdate = useCallback((t: number) => {
    setTime(t);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-cyan-400">
              Fourier Series Visualizer
            </h1>
            <p className="text-sm text-slate-400">
              Interactive mathematical exploration
            </p>
          </div>
          <a
            href="https://github.com/Noah-Truong/Fourier"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            View Source
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visualization */}
          <div className="lg:col-span-8 space-y-6">
            {/* Canvas Container */}
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-xl">
              <div className="aspect-[16/9] relative">
                <FourierCanvas
                  settings={settings}
                  coefficients={coefficients}
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>
            </div>

            {/* Equations & Metrics Tabs */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="flex border-b border-slate-800">
                <button
                  onClick={() => setActiveTab('equations')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'equations'
                      ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Equations
                </button>
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'metrics'
                      ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Metrics
                </button>
              </div>
              <div className="p-4">
                {activeTab === 'equations' ? (
                  <Equations
                    waveType={settings.waveType}
                    numTerms={settings.numTerms}
                    coefficients={coefficients}
                  />
                ) : (
                  <Metrics metrics={metrics} time={time} />
                )}
              </div>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-xl sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Parameters
              </h2>
              <Controls settings={settings} onSettingsChange={setSettings} />

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h3 className="text-sm font-medium text-slate-400 mb-3">About</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A Fourier series decomposes periodic functions into sums of sines
                  and cosines. Each rotating circle (epicycle) represents a harmonic.
                  The more terms added, the better the approximation.
                </p>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => setSettings(defaultSettings)}
                className="mt-4 w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>
            Built with Next.js, TypeScript, and Tailwind CSS.
            Mathematical rendering powered by KaTeX.
          </p>
          <p className="mt-2">
            Inspired by 3Blue1Brown&apos;s Fourier series visualizations.
          </p>
        </footer>
      </div>
    </main>
  );
}
