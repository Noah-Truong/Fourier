export type WaveType = 'square' | 'sawtooth' | 'triangle' | 'custom';

export interface FourierSettings {
  waveType: WaveType;
  numTerms: number;
  speed: number;
  amplitude: number;
  showCircles: boolean;
  showVectors: boolean;
  trailLength: number;
}

export interface FourierMetrics {
  currentAmplitude: number;
  fundamentalFrequency: number;
  totalHarmonics: number;
  convergenceError: number;
  thd: number; // Total Harmonic Distortion
}

export interface FourierCoefficient {
  n: number;
  an: number;
  bn: number;
  amplitude: number;
  phase: number;
}
