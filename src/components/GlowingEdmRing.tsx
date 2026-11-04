import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { VisualizerPreset } from '../types';

interface GlowingEdmRingProps {
  photoUrl: string;
  isPlaying: boolean;
  theme: VisualizerPreset;
  onToggleTheme: () => void;
}

export const VISUALIZER_THEMES: VisualizerPreset[] = [
  {
    id: 'fpt-orange-cyber',
    name: 'FPT Laser Orange & Cyan',
    primary: '#f26f21',
    secondary: '#ff9900',
    accent: '#00f0ff',
    ringGlow: 'rgba(242, 111, 33, 0.7)'
  },
  {
    id: 'cyber-cyan',
    name: 'Electric Cyan & Violet',
    primary: '#00f0ff',
    secondary: '#8a2be2',
    accent: '#ff8800',
    ringGlow: 'rgba(0, 240, 255, 0.7)'
  },
  {
    id: 'graduation-gold',
    name: 'Graduation Gold & Amber',
    primary: '#ffd700',
    secondary: '#f26f21',
    accent: '#00f0ff',
    ringGlow: 'rgba(255, 215, 0, 0.7)'
  },
  {
    id: 'sunset-neon',
    name: 'Sunset Magenta & Coral',
    primary: '#ff007f',
    secondary: '#f26f21',
    accent: '#00ffff',
    ringGlow: 'rgba(255, 0, 127, 0.7)'
  }
];

export const GlowingEdmRing: React.FC<GlowingEdmRingProps> = ({
  photoUrl,
  isPlaying,
  theme,
  onToggleTheme
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shockwaves, setShockwaves] = useState<{ id: number; scale: number; opacity: number }[]>([]);
  const nextShockwaveId = useRef(0);

  const triggerShockwave = () => {
    const id = nextShockwaveId.current++;
    setShockwaves((prev) => [...prev.slice(-3), { id, scale: 1, opacity: 1 }]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    interface RingParticle {
      x: number;
      y: number;
      angle: number;
      dist: number;
      speed: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: RingParticle[] = [];
    const numBars = 76;

    const render = () => {
      tick++;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Base radius scaled proportionally to surround the larger photo (photo radius ~150-210px)
      const baseRadius = Math.min(width, height) * 0.36;

      ctx.clearRect(0, 0, width, height);

      const beatFreq = isPlaying ? 0.085 : 0.035;
      const beatPulse = Math.sin(tick * beatFreq);
      const intensity = isPlaying ? (beatPulse > 0.3 ? 1.6 : 0.85) : 0.45;

      // 1. Clean ambient radial glow aura (reverted to previous subtle gradient)
      const radialGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.7,
        centerX,
        centerY,
        baseRadius * 1.55
      );
      radialGlow.addColorStop(0, `${theme.primary}22`);
      radialGlow.addColorStop(0.5, `${theme.secondary}15`);
      radialGlow.addColorStop(1, 'transparent');

      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.55, 0, Math.PI * 2);
      ctx.fill();

      // 2. Rotating segmented orbital dash tracks
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((tick * (isPlaying ? 0.012 : 0.005)) % (Math.PI * 2));

      ctx.strokeStyle = `${theme.primary}66`;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([8, 12, 2, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius + 22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(-(tick * 0.018) % (Math.PI * 2));
      ctx.strokeStyle = `${theme.accent}77`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([14, 18, 4, 14]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius + 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // 3. Crisp radiating audio visualizer frequency bars
      for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * Math.PI * 2 - Math.PI / 2;

        const wave1 = Math.sin(tick * 0.06 + i * 0.3);
        const wave2 = Math.cos(tick * 0.09 - i * 0.45);
        const wave3 = Math.sin(tick * 0.15 + i * 0.1);
        const rawHeight = Math.abs(wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);

        const barLength = 6 + rawHeight * (isPlaying ? 40 * intensity : 12);

        const x1 = centerX + Math.cos(angle) * (baseRadius + 4);
        const y1 = centerY + Math.sin(angle) * (baseRadius + 4);
        const x2 = centerX + Math.cos(angle) * (baseRadius + 4 + barLength);
        const y2 = centerY + Math.sin(angle) * (baseRadius + 4 + barLength);

        const barGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        barGrad.addColorStop(0, theme.primary);
        barGrad.addColorStop(1, i % 2 === 0 ? theme.secondary : theme.accent);

        ctx.strokeStyle = barGrad;
        ctx.lineWidth = ((2 * Math.PI * baseRadius) / numBars) * 0.45;
        ctx.lineCap = 'round';
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = isPlaying ? 10 : 4;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (rawHeight > 0.65 && isPlaying) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x2, y2, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0;

      // 4. Subtle floating particles
      if (isPlaying && Math.random() < 0.45) {
        const randAngle = Math.random() * Math.PI * 2;
        particles.push({
          x: centerX + Math.cos(randAngle) * (baseRadius + 10),
          y: centerY + Math.sin(randAngle) * (baseRadius + 10),
          angle: randAngle,
          dist: baseRadius + 10,
          speed: 1.2 + Math.random() * 2.5,
          size: 1 + Math.random() * 2.5,
          color: Math.random() > 0.5 ? theme.primary : theme.accent,
          life: 0,
          maxLife: 40 + Math.random() * 30
        });
      }

      for (let j = particles.length - 1; j >= 0; j--) {
        const p = particles[j];
        p.life++;
        p.dist += p.speed;
        p.x = centerX + Math.cos(p.angle) * p.dist;
        p.y = centerY + Math.sin(p.angle) * p.dist;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          particles.splice(j, 1);
        }
      }
      ctx.globalAlpha = 1;

      // 5. Update shockwaves
      setShockwaves((prev) =>
        prev
          .map((sw) => ({
            ...sw,
            scale: sw.scale + 0.045,
            opacity: sw.opacity - 0.035
          }))
          .filter((sw) => sw.opacity > 0)
      );

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying, theme]);

  return (
    <div
      className="relative flex items-center justify-center select-none w-full max-w-[620px] sm:max-w-[680px] h-[520px] sm:h-[600px] md:h-[640px]"
      onClick={triggerShockwave}
    >
      {/* Dynamic Visualizer Canvas (Scaled up around enlarged photo) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Shockwave Rings on click / beat drop */}
      {shockwaves.map((sw) => (
        <div
          key={sw.id}
          className="absolute rounded-full pointer-events-none transition-transform"
          style={{
            width: '420px',
            height: '420px',
            transform: `scale(${sw.scale})`,
            opacity: sw.opacity,
            border: `2px solid ${theme.primary}`,
            boxShadow: `0 0 24px ${theme.primary}`,
            zIndex: 1
          }}
        />
      ))}

      {/* Enlarged Pulsing Neon Ring (Sized to fit cleanly around the bigger photo) */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-700 ${
          isPlaying ? 'animate-pulse-glow' : 'opacity-75'
        }`}
        style={{
          width: 'clamp(330px, 48vw, 450px)',
          height: 'clamp(330px, 48vw, 450px)',
          border: `3px solid ${theme.primary}`,
          boxShadow: `0 0 45px ${theme.ringGlow}, inset 0 0 35px ${theme.ringGlow}`,
          zIndex: 2
        }}
      />

      {/* Clean Ambient Radial Blur Halo (Reverted to previous soft level) */}
      <div
        className="absolute rounded-full pointer-events-none opacity-40 blur-xl transition-all duration-500"
        style={{
          width: 'clamp(360px, 52vw, 500px)',
          height: 'clamp(360px, 52vw, 500px)',
          background: `radial-gradient(circle, ${theme.primary} 0%, ${theme.secondary} 50%, transparent 70%)`,
          zIndex: 1
        }}
      />

      {/* LARGER Central Graduate Photo Container (Noticeably bigger size for Minh Anh's picture) */}
      <div
        className="relative z-10 rounded-full p-2.5 sm:p-3 transition-transform duration-300 group cursor-pointer shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, rgba(15, 23, 42, 0.9) 50%, ${theme.secondary} 100%)`,
          boxShadow: `0 0 35px rgba(0,0,0,0.85), 0 0 25px ${theme.primary}55`
        }}
        title="Phạm Hoàng Minh Anh · Tân Cử Nhân Kỹ Thuật Phần Mềm"
      >
        {/* Significantly increased photo dimensions: 300px on mobile, 360px on tablet, 410px on desktop */}
        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden bg-slate-900 border-2 border-orange-400/40 shadow-2xl">
          {/* User's Authentic Graduate Photo */}
          <img
            src={photoUrl}
            alt="Phạm Hoàng Minh Anh - Tân Cử Nhân FPT University"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
          />

          {/* Academic Laurel / Gold Border Ring */}
          <div className="absolute inset-0 rounded-full border border-orange-400/40 pointer-events-none" />

          {/* FPT University & Student ID Badge (Fitted neatly inside circular perimeter) */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-950/92 backdrop-blur-md rounded-full border border-orange-500/50 shadow-xl flex items-center gap-1.5 z-20 whitespace-nowrap pointer-events-none">
            <span className="text-xs">🎓</span>
            <span className="text-[11px] sm:text-xs font-bold text-orange-400 tracking-wider font-mono">
              SE183496
            </span>
            <span className="text-slate-500 text-[10px]">·</span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-200 uppercase tracking-wide">
              FPT University
            </span>
          </div>
        </div>
      </div>

      {/* Floating Theme & Shockwave Controls */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleTheme();
          }}
          className="p-2.5 bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 hover:border-orange-400/60 rounded-full text-slate-300 hover:text-orange-400 transition-all shadow-md group cursor-pointer"
          title={`Đổi màu EDM: ${theme.name}`}
        >
          <Sparkles className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerShockwave();
          }}
          className="p-2.5 bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/60 rounded-full text-slate-300 hover:text-cyan-300 transition-all shadow-md group cursor-pointer"
          title="Chạm để phát sóng xung kích EDM"
        >
          <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
