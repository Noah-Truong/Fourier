import { useMemo } from 'react';
import { WaveType, FourierCoefficient, FourierMetrics } from '@/types/fourier';

export function useFourierCoefficients(waveType: WaveType, numTerms: number): FourierCoefficient[] {
  return useMemo(() => {
    const coefficients: FourierCoefficient[] = [];

    for (let i = 0; i < numTerms; i++) {
      let n: number;
      let an = 0;
      let bn = 0;

      switch (waveType) {
        case 'square':
          // Square wave: only odd harmonics, bn = 4/(n*pi)
          n = 2 * i + 1;
          bn = 4 / (n * Math.PI);
          break;

        case 'sawtooth':
          // Sawtooth wave: all harmonics, bn = 2*(-1)^(n+1)/(n*pi)
          n = i + 1;
          bn = 2 * Math.pow(-1, n + 1) / (n * Math.PI);
          break;

        case 'triangle':
          // Triangle wave: only odd harmonics, bn = 8*(-1)^((n-1)/2)/(n^2*pi^2)
          n = 2 * i + 1;
          bn = 8 * Math.pow(-1, i) / (n * n * Math.PI * Math.PI);
          break;

        case 'custom':
          // Custom: mix of harmonics
          n = i + 1;
          an = (i % 2 === 0) ? 1 / (n * Math.PI) : 0;
          bn = 1 / (n * Math.PI);
          break;

        default:
          n = 2 * i + 1;
          bn = 4 / (n * Math.PI);
      }

      const amplitude = Math.sqrt(an * an + bn * bn);
      const phase = Math.atan2(an, bn);

      coefficients.push({ n, an, bn, amplitude, phase });
    }

    return coefficients;
  }, [waveType, numTerms]);
}

export function calculateMetrics(
  coefficients: FourierCoefficient[],
  waveType: WaveType,
  amplitude: number
): FourierMetrics {
  if (coefficients.length === 0) {
    return {
      currentAmplitude: 0,
      fundamentalFrequency: 1,
      totalHarmonics: 0,
      convergenceError: 1,
      thd: 0,
    };
  }

  // Calculate total amplitude from all harmonics
  const totalAmplitude = coefficients.reduce((sum, c) => sum + c.amplitude, 0) * amplitude;

  // Fundamental amplitude (first term)
  const fundamentalAmp = coefficients[0]?.amplitude || 0;

  // Calculate THD (Total Harmonic Distortion)
  const harmonicPower = coefficients
    .slice(1)
    .reduce((sum, c) => sum + c.amplitude * c.amplitude, 0);
  const thd = fundamentalAmp > 0
    ? Math.sqrt(harmonicPower) / fundamentalAmp * 100
    : 0;

  // Estimate convergence error (simplified)
  let idealPeak: number;
  switch (waveType) {
    case 'square':
    case 'sawtooth':
      idealPeak = 1;
      break;
    case 'triangle':
      idealPeak = 1;
      break;
    default:
      idealPeak = 1;
  }

  const approximatedPeak = totalAmplitude / amplitude;
  const convergenceError = Math.abs(idealPeak - approximatedPeak / idealPeak);

  return {
    currentAmplitude: totalAmplitude,
    fundamentalFrequency: 1,
    totalHarmonics: coefficients.length,
    convergenceError: Math.min(convergenceError, 1),
    thd,
  };
}
