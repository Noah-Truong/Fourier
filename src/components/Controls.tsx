'use client';

import { FourierSettings, WaveType } from '@/types/fourier';

interface ControlsProps {
  settings: FourierSettings;
  onSettingsChange: (settings: FourierSettings) => void;
}

const waveTypes: { value: WaveType; label: string; description: string }[] = [
  { value: 'square', label: 'Square', description: 'Odd harmonics only' },
  { value: 'sawtooth', label: 'Sawtooth', description: 'All harmonics' },
  { value: 'triangle', label: 'Triangle', description: 'Odd harmonics, 1/n\u00b2' },
  { value: 'custom', label: 'Custom', description: 'Mixed harmonics' },
];

export function Controls({ settings, onSettingsChange }: ControlsProps) {
  const updateSetting = <K extends keyof FourierSettings>(
    key: K,
    value: FourierSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Wave Type Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Wave Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {waveTypes.map((wave) => (
            <button
              key={wave.value}
              onClick={() => updateSetting('waveType', wave.value)}
              className={`p-3 rounded-lg text-left transition-all ${
                settings.waveType === wave.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <div className="font-medium">{wave.label}</div>
              <div className="text-xs opacity-70">{wave.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Number of Terms */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Number of Terms: <span className="text-indigo-400">{settings.numTerms}</span>
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={settings.numTerms}
          onChange={(e) => updateSetting('numTerms', parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>1</span>
          <span>25</span>
          <span>50</span>
        </div>
      </div>

      {/* Animation Speed */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Animation Speed: <span className="text-indigo-400">{settings.speed.toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={settings.speed}
          onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0.1x</span>
          <span>1.5x</span>
          <span>3x</span>
        </div>
      </div>

      {/* Amplitude */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Amplitude: <span className="text-indigo-400">{settings.amplitude.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={settings.amplitude}
          onChange={(e) => updateSetting('amplitude', parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0.5</span>
          <span>1.25</span>
          <span>2.0</span>
        </div>
      </div>

      {/* Trail Length */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Trail Length: <span className="text-indigo-400">{settings.trailLength}</span>
        </label>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={settings.trailLength}
          onChange={(e) => updateSetting('trailLength', parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>50</span>
          <span>275</span>
          <span>500</span>
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-3 pt-2">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-slate-300">Show Circles</span>
          <div
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.showCircles ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
            onClick={() => updateSetting('showCircles', !settings.showCircles)}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.showCircles ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </div>
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-slate-300">Show Vectors</span>
          <div
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.showVectors ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
            onClick={() => updateSetting('showVectors', !settings.showVectors)}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.showVectors ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </div>
        </label>
      </div>
    </div>
  );
}
