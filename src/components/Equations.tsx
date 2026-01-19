'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import { WaveType, FourierCoefficient } from '@/types/fourier';

interface EquationsProps {
  waveType: WaveType;
  numTerms: number;
  coefficients: FourierCoefficient[];
}

function renderLatex(element: HTMLElement, latex: string) {
  katex.render(latex, element, {
    throwOnError: false,
    displayMode: true,
  });
}

const waveEquations: Record<WaveType, { general: string; coefficient: string; name: string }> = {
  square: {
    name: 'Square Wave',
    general: 'f(t) = \\frac{4}{\\pi} \\sum_{n=1,3,5,...}^{N} \\frac{1}{n} \\sin(n \\omega t)',
    coefficient: 'b_n = \\frac{4}{n\\pi} \\quad (n \\text{ odd})',
  },
  sawtooth: {
    name: 'Sawtooth Wave',
    general: 'f(t) = \\frac{2}{\\pi} \\sum_{n=1}^{N} \\frac{(-1)^{n+1}}{n} \\sin(n \\omega t)',
    coefficient: 'b_n = \\frac{2(-1)^{n+1}}{n\\pi}',
  },
  triangle: {
    name: 'Triangle Wave',
    general: 'f(t) = \\frac{8}{\\pi^2} \\sum_{n=1,3,5,...}^{N} \\frac{(-1)^{(n-1)/2}}{n^2} \\sin(n \\omega t)',
    coefficient: 'b_n = \\frac{8(-1)^{(n-1)/2}}{n^2\\pi^2} \\quad (n \\text{ odd})',
  },
  custom: {
    name: 'Custom Wave',
    general: 'f(t) = \\frac{a_0}{2} + \\sum_{n=1}^{N} [a_n \\cos(n \\omega t) + b_n \\sin(n \\omega t)]',
    coefficient: 'a_n, b_n = \\frac{1}{n\\pi}',
  },
};

export function Equations({ waveType, numTerms, coefficients }: EquationsProps) {
  const generalRef = useRef<HTMLDivElement>(null);
  const coeffRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eq = waveEquations[waveType];

    if (generalRef.current) {
      renderLatex(generalRef.current, eq.general);
    }

    if (coeffRef.current) {
      renderLatex(coeffRef.current, eq.coefficient);
    }

    // Build expanded form with actual coefficients
    if (expandedRef.current && coefficients.length > 0) {
      const terms = coefficients
        .slice(0, Math.min(4, coefficients.length))
        .map((c) => {
          const ampStr = c.amplitude.toFixed(3);
          return `${ampStr}\\sin(${c.n}\\omega t)`;
        });

      const expandedLatex =
        numTerms > 4
          ? `f(t) \\approx ${terms.join(' + ')} + \\cdots`
          : `f(t) \\approx ${terms.join(' + ')}`;

      renderLatex(expandedRef.current, expandedLatex);
    }
  }, [waveType, numTerms, coefficients]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          {waveEquations[waveType].name}
        </h3>
        <div
          ref={generalRef}
          className="bg-slate-800/50 p-4 rounded-lg overflow-x-auto text-slate-100"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          Fourier Coefficients
        </h3>
        <div
          ref={coeffRef}
          className="bg-slate-800/50 p-4 rounded-lg overflow-x-auto text-slate-100"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          Expanded Form (N={numTerms})
        </h3>
        <div
          ref={expandedRef}
          className="bg-slate-800/50 p-4 rounded-lg overflow-x-auto text-slate-100 text-sm"
        />
      </div>

      {/* Coefficient Table */}
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          First {Math.min(5, coefficients.length)} Harmonics
        </h3>
        <div className="bg-slate-800/50 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="px-3 py-2 text-left">n</th>
                <th className="px-3 py-2 text-right">Amplitude</th>
                <th className="px-3 py-2 text-right">Frequency</th>
                <th className="px-3 py-2 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {coefficients.slice(0, 5).map((c, i) => {
                const totalAmp = coefficients.reduce((s, x) => s + x.amplitude, 0);
                const percent = totalAmp > 0 ? (c.amplitude / totalAmp) * 100 : 0;
                return (
                  <tr
                    key={c.n}
                    className={`border-b border-slate-700/50 ${
                      i === 0 ? 'text-cyan-400' : 'text-slate-300'
                    }`}
                  >
                    <td className="px-3 py-2">{c.n}</td>
                    <td className="px-3 py-2 text-right font-mono">
                      {c.amplitude.toFixed(4)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">{c.n}f</td>
                    <td className="px-3 py-2 text-right font-mono">
                      {percent.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
