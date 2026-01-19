'use client';

import { useRef, useEffect, useCallback } from 'react';
import { FourierSettings, FourierCoefficient } from '@/types/fourier';

interface FourierCanvasProps {
  settings: FourierSettings;
  coefficients: FourierCoefficient[];
  onTimeUpdate?: (time: number) => void;
}

export function FourierCanvas({ settings, coefficients, onTimeUpdate }: FourierCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);
  const waveRef = useRef<number[]>([]);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { amplitude, showCircles, showVectors, trailLength, speed } = settings;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Setup
    const centerX = width * 0.25;
    const centerY = height * 0.5;
    const scale = Math.min(width, height) * 0.002 * amplitude;

    ctx.save();
    ctx.translate(centerX, centerY);

    let x = 0;
    let y = 0;

    // Draw epicycles
    for (let i = 0; i < coefficients.length; i++) {
      const prevX = x;
      const prevY = y;
      const coeff = coefficients[i];
      const radius = coeff.amplitude * scale * 75;

      x += radius * Math.cos(coeff.n * timeRef.current + coeff.phase);
      y += radius * Math.sin(coeff.n * timeRef.current + coeff.phase);

      // Draw circle
      if (showCircles && radius > 0.5) {
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 - i * 0.02})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw vector
      if (showVectors) {
        ctx.strokeStyle = `rgba(167, 139, 250, ${0.8 - i * 0.05})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Draw point at end
        if (i === coefficients.length - 1) {
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Add to wave
    waveRef.current.unshift(y);
    if (waveRef.current.length > trailLength) {
      waveRef.current.pop();
    }

    // Draw connector line
    const waveStartX = width * 0.4;
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(waveStartX - centerX, waveRef.current[0]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();

    // Draw wave
    ctx.save();
    ctx.translate(waveStartX, centerY);

    // Wave background grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
    ctx.lineWidth = 1;
    const gridSpacing = 50;
    for (let gx = 0; gx < width * 0.55; gx += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(gx, -height * 0.4);
      ctx.lineTo(gx, height * 0.4);
      ctx.stroke();
    }
    for (let gy = -height * 0.4; gy <= height * 0.4; gy += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width * 0.55, gy);
      ctx.stroke();
    }

    // Zero line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width * 0.55, 0);
    ctx.stroke();

    // Draw wave trail
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < waveRef.current.length; i++) {
      const wx = i * 2;
      const wy = waveRef.current[i];
      if (i === 0) {
        ctx.moveTo(wx, wy);
      } else {
        ctx.lineTo(wx, wy);
      }
    }
    ctx.stroke();

    // Draw glow effect
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (let i = 0; i < Math.min(50, waveRef.current.length); i++) {
      const wx = i * 2;
      const wy = waveRef.current[i];
      if (i === 0) {
        ctx.moveTo(wx, wy);
      } else {
        ctx.lineTo(wx, wy);
      }
    }
    ctx.stroke();

    ctx.restore();

    // Update time
    timeRef.current += speed * 0.02;
    onTimeUpdate?.(timeRef.current);
  }, [settings, coefficients, onTimeUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  // Reset wave when settings change significantly
  useEffect(() => {
    waveRef.current = [];
  }, [settings.waveType, settings.numTerms]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{ minHeight: '400px' }}
    />
  );
}
