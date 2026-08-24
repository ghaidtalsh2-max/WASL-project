'use client';

import React, { useEffect, useRef } from 'react';
import { Plane, Sparkles } from 'lucide-react';
import { CountryInfo } from '@/lib/data/countries';

interface NetworkTransitMeshProps {
  origin: CountryInfo | null;
  destination: CountryInfo | null;
  destinationCity?: string;
  isRtl?: boolean;
}

interface HubNode {
  id: string;
  labelEn: string;
  labelAr: string;
  flag: string;
  xPct: number; // 0 to 1
  yPct: number; // 0 to 1
  isPrimaryOrigin?: boolean;
  isPrimaryDest?: boolean;
}

interface PulsePacket {
  fromNode: number;
  toNode: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
  size: number;
}

export default function NetworkTransitMesh({
  origin,
  destination,
  destinationCity,
  isRtl = true,
}: NetworkTransitMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const originNameAr = origin?.nameAr || 'المملكة العربية السعودية';
  const originNameEn = origin?.name || 'Saudi Arabia';
  const originFlag = origin?.flag || '🇸🇦';
  const originCityAr = origin?.capitalAr || origin?.capital || 'الرياض';

  const destNameAr = destination?.nameAr || 'اليابان';
  const destNameEn = destination?.name || 'Japan';
  const destFlag = destination?.flag || '🇯🇵';
  const destCityAr = destinationCity || destination?.capitalAr || destination?.capital || 'طوكيو';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 130);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 130;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic Network Hub Nodes
    const nodes: HubNode[] = [
      // 0: Origin (Left / Right depending on RTL)
      {
        id: 'origin',
        labelEn: originNameEn,
        labelAr: originNameAr,
        flag: originFlag,
        xPct: isRtl ? 0.88 : 0.12,
        yPct: 0.5,
        isPrimaryOrigin: true,
      },
      // 1: Transit Hub A (Top Mid-Left)
      {
        id: 'hub_a',
        labelEn: 'Dubai / UAE',
        labelAr: 'دبي',
        flag: '🇦🇪',
        xPct: isRtl ? 0.68 : 0.32,
        yPct: 0.22,
      },
      // 2: Transit Hub B (Bottom Mid-Left)
      {
        id: 'hub_b',
        labelEn: 'Cairo',
        labelAr: 'القاهرة',
        flag: '🇪🇬',
        xPct: isRtl ? 0.65 : 0.35,
        yPct: 0.78,
      },
      // 3: Central Nexus
      {
        id: 'nexus',
        labelEn: 'Istanbul / Nexus',
        labelAr: 'إسطنبول',
        flag: '🇹🇷',
        xPct: 0.5,
        yPct: 0.48,
      },
      // 4: Transit Hub C (Top Mid-Right)
      {
        id: 'hub_c',
        labelEn: 'London / Paris',
        labelAr: 'لندن',
        flag: '🇬🇧',
        xPct: isRtl ? 0.32 : 0.68,
        yPct: 0.22,
      },
      // 5: Transit Hub D (Bottom Mid-Right)
      {
        id: 'hub_d',
        labelEn: 'Bangkok / Singapore',
        labelAr: 'سنغافورة',
        flag: '🇸🇬',
        xPct: isRtl ? 0.35 : 0.65,
        yPct: 0.78,
      },
      // 6: Destination
      {
        id: 'dest',
        labelEn: destNameEn,
        labelAr: destNameAr,
        flag: destFlag,
        xPct: isRtl ? 0.12 : 0.88,
        yPct: 0.5,
        isPrimaryDest: true,
      },
    ];

    // Connection network edges between nodes: [fromIndex, toIndex, isMainCorridor]
    const edges: Array<[number, number, boolean]> = [
      [0, 1, false],
      [0, 2, false],
      [1, 3, false],
      [2, 3, false],
      [3, 4, false],
      [3, 5, false],
      [4, 6, false],
      [5, 6, false],
      [1, 4, false],
      [2, 5, false],
      [0, 3, true], // Main direct corridor arc
      [3, 6, true], // Main direct corridor arc
      [0, 6, true], // Primary direct transit beam
    ];

    // Live continuous traffic packets traveling along the edges
    const packets: PulsePacket[] = [];
    for (let i = 0; i < 18; i++) {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      packets.push({
        fromNode: Math.random() > 0.5 ? edge[0] : edge[1],
        toNode: Math.random() > 0.5 ? edge[1] : edge[0],
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.009,
        color: edge[2] ? '#EC4899' : '#818CF8',
        size: edge[2] ? 3.5 : 2.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Network Edges (Constellation & Flight Tracks)
      edges.forEach(([fromIdx, toIdx, isMain]) => {
        const n1 = nodes[fromIdx];
        const n2 = nodes[toIdx];

        const x1 = n1.xPct * width;
        const y1 = n1.yPct * height;
        const x2 = n2.xPct * width;
        const y2 = n2.yPct * height;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        if (isMain && fromIdx === 0 && toIdx === 6) {
          // Curved main trajectory arc
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 - 25;
          ctx.quadraticCurveTo(midX, midY, x2, y2);

          // Glow for main corridor
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.45)';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();

          // Outer halo
          ctx.strokeStyle = 'rgba(129, 140, 248, 0.2)';
          ctx.lineWidth = 6;
          ctx.setLineDash([]);
          ctx.stroke();
        } else {
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = isMain ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = isMain ? 1.5 : 0.9;
          ctx.setLineDash(isMain ? [3, 3] : [2, 4]);
          ctx.stroke();
        }

        ctx.restore();
      });

      // 2. Draw Moving Traffic Energy Packets / Light Pulses
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          const newEdge = edges[Math.floor(Math.random() * edges.length)];
          p.fromNode = newEdge[0];
          p.toNode = newEdge[1];
        }

        const n1 = nodes[p.fromNode];
        const n2 = nodes[p.toNode];

        let currX: number;
        let currY: number;

        if (p.fromNode === 0 && p.toNode === 6) {
          // Travel along curved arc
          const x1 = n1.xPct * width;
          const y1 = n1.yPct * height;
          const x2 = n2.xPct * width;
          const y2 = n2.yPct * height;
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 - 25;

          const t = p.progress;
          currX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
          currY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;
        } else {
          currX = n1.xPct * width + (n2.xPct * width - n1.xPct * width) * p.progress;
          currY = n1.yPct * height + (n2.yPct * height - n1.yPct * height) * p.progress;
        }

        ctx.save();
        // Glowing particle
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(currX, currY, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Particle trail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(currX, currY, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Draw Network Hub Nodes with Radar Ripples
      nodes.forEach((n, idx) => {
        const x = n.xPct * width;
        const y = n.yPct * height;

        ctx.save();

        if (n.isPrimaryOrigin || n.isPrimaryDest) {
          // Pulsing radar ripple for primary origin & destination
          const rippleRadius = 8 + (Math.sin(time * 2 + idx) + 1) * 6;
          ctx.strokeStyle = n.isPrimaryOrigin ? 'rgba(236, 72, 153, 0.4)' : 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, rippleRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Core beacon
          ctx.fillStyle = n.isPrimaryOrigin ? '#EC4899' : '#38BDF8';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Secondary intermediate network hub node
          const nodePulse = Math.sin(time + idx) * 0.8 + 2.5;
          ctx.fillStyle = 'rgba(129, 140, 248, 0.85)';
          ctx.shadowColor = '#818CF8';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(x, y, nodePulse, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [origin, destination, destinationCity, isRtl]);

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-r from-pink-500/10 via-[#11172A] to-indigo-500/10 border border-white/15 p-3.5 space-y-2 overflow-hidden shadow-inner backdrop-blur-md">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 text-pink-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          <span className="text-[11px] font-sans">
            {isRtl ? 'شبكة مسارات السير والاتصال الجوي الحي' : 'Live Global Transit Corridor'}
          </span>
        </div>

        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-gray-300 font-mono">
          <Sparkles className="w-2.5 h-2.5 text-pink-400" />
          <span>{isRtl ? 'حركة انتقال مستمرة' : 'Active Traffic Mesh'}</span>
        </div>
      </div>

      {/* Network Transit Canvas Display */}
      <div className="relative w-full h-[120px] rounded-xl bg-[#080D1B]/80 border border-white/10 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Origin Overlay Label on Node */}
        <div
          className={`absolute top-2 ${isRtl ? 'end-3 text-end' : 'start-3 text-start'} pointer-events-none`}
        >
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-pink-500/30 shadow-md">
            <span className="text-base">{originFlag}</span>
            <div className="flex flex-col">
              <span className="text-[9px] text-pink-400 font-bold uppercase tracking-wider">
                {isRtl ? 'الانطلاق' : 'Departure'}
              </span>
              <span className="text-[11px] font-bold text-white leading-none truncate max-w-[110px]">
                {isRtl ? originNameAr : originNameEn}
              </span>
            </div>
          </div>
        </div>

        {/* Center Live Corridor Indicator */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
          <div className="px-2.5 py-0.5 rounded-full bg-[#121829]/90 border border-indigo-400/30 text-indigo-200 text-[10px] flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
            <Plane className={`w-3 h-3 text-pink-400 animate-pulse ${isRtl ? 'rotate-180' : ''}`} />
            <span className="font-mono font-bold text-[9px]">
              {originCityAr} ➔ {destCityAr}
            </span>
          </div>
        </div>

        {/* Destination Overlay Label on Node */}
        <div
          className={`absolute top-2 ${isRtl ? 'start-3 text-start' : 'end-3 text-end'} pointer-events-none`}
        >
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-indigo-400/30 shadow-md">
            <div className="flex flex-col">
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">
                {isRtl ? 'الوصول' : 'Arrival'}
              </span>
              <span className="text-[11px] font-bold text-white leading-none truncate max-w-[110px]">
                {isRtl ? destNameAr : destNameEn}
              </span>
            </div>
            <span className="text-base">{destFlag}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
