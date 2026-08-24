'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/lib/theme/ThemeContext';

export default function LiveAmbientBackground() {
  const { destinationTheme, isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = 55;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 1.2,
      speedX: (Math.random() - 0.5) * 0.45,
      speedY: (Math.random() - 0.5) * 0.45,
      opacity: Math.random() * 0.5 + 0.25,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Active transit packets flowing between particles
    interface FlowPacket {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
    }
    const flowPackets: FlowPacket[] = [];
    for (let i = 0; i < 15; i++) {
      flowPackets.push({
        fromIdx: Math.floor(Math.random() * count),
        toIdx: Math.floor(Math.random() * count),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
      });
    }

    let time = 0;
    const maxConnectDistance = 140;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const primaryColor = isDark
        ? destinationTheme?.particleColor || '#EC4899'
        : '#F59E0B'; // Golden solar dust in light mode
      const secondaryColor = isDark ? '#818CF8' : '#FB923C';

      // 1. Update Particle Positions
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      });

      // 2. Draw Constellation / Traffic Network Lines between nearby nodes
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            const lineAlpha = (1 - dist / maxConnectDistance) * 0.18;
            ctx.save();
            ctx.strokeStyle = primaryColor;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.85;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 3. Draw Flowing Light Packets / Energy Beams across connected nodes
      flowPackets.forEach((fp) => {
        fp.progress += fp.speed;
        if (fp.progress >= 1) {
          fp.progress = 0;
          fp.fromIdx = Math.floor(Math.random() * count);
          // Find a nearby node
          let bestTo = (fp.fromIdx + 1) % count;
          let minDist = 9999;
          for (let k = 0; k < count; k++) {
            if (k === fp.fromIdx) continue;
            const d = Math.hypot(particles[fp.fromIdx].x - particles[k].x, particles[fp.fromIdx].y - particles[k].y);
            if (d < maxConnectDistance && d < minDist) {
              minDist = d;
              bestTo = k;
            }
          }
          fp.toIdx = bestTo;
        }

        const p1 = particles[fp.fromIdx];
        const p2 = particles[fp.toIdx];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < maxConnectDistance) {
          const curX = p1.x + (p2.x - p1.x) * fp.progress;
          const curY = p1.y + (p2.y - p1.y) * fp.progress;

          ctx.save();
          ctx.globalAlpha = (1 - dist / maxConnectDistance) * 0.85;
          ctx.fillStyle = secondaryColor;
          ctx.shadowColor = secondaryColor;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // 4. Draw Waypoint Particle Nodes
      particles.forEach((p, idx) => {
        const pulseAlpha = p.opacity + Math.sin(time + p.pulse) * 0.15;
        const finalAlpha = Math.max(0.1, Math.min(0.8, pulseAlpha));

        ctx.save();
        ctx.globalAlpha = finalAlpha;
        ctx.fillStyle = idx % 2 === 0 ? primaryColor : secondaryColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow halo
        ctx.globalAlpha = finalAlpha * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [destinationTheme, isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {isDark ? (
        <>
          {/* Deep Celestial Night Aurora Orbs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-600/15 via-rose-500/10 to-transparent blur-3xl animate-pulse duration-10000" />
          <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-indigo-600/15 via-purple-500/10 to-transparent blur-3xl animate-pulse duration-7000" />
          <div className="absolute -bottom-32 left-1/4 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-pink-500/10 via-amber-500/5 to-transparent blur-3xl animate-pulse duration-9000" />
        </>
      ) : (
        <>
          {/* Radiant Cosmic Sun & Solar Dawn Horizon in Space */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[42rem] h-[28rem] rounded-full bg-gradient-to-b from-amber-400/25 via-rose-400/15 to-transparent blur-3xl" />
          <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/20 via-amber-300/15 to-transparent blur-3xl animate-pulse duration-7000" />
          <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-rose-300/20 via-amber-200/15 to-transparent blur-3xl" />
        </>
      )}

      {/* Subtle Star / Particle Floating Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
}
