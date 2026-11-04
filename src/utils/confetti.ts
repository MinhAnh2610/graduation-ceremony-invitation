/**
 * Lightweight, high-performance canvas confetti celebration with neon EDM hues.
 */
export function triggerCelebrationConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = [
    '#00f0ff', // electric cyan
    '#f000ff', // neon magenta
    '#ffd700', // gold
    '#00ffaa', // neon mint
    '#ff3366', // coral rose
    '#ffffff'  // bright white
  ];

  interface Particle {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    rot: number;
    vrot: number;
    alpha: number;
  }

  const particles: Particle[] = [];
  const count = 120;

  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI) - (Math.PI / 2);
    const speed = 7 + Math.random() * 12;
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 100,
      y: height * 0.45,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 6,
      vy: Math.sin(angle) * speed - (5 + Math.random() * 6),
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 14,
      alpha: 1
    });
  }

  let animationFrameId: number;
  let frameCount = 0;

  function render() {
    frameCount++;
    ctx?.clearRect(0, 0, width, height);

    let activeParticles = 0;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.985;
      p.rot += p.vrot;

      if (frameCount > 40) {
        p.alpha -= 0.015;
      }

      if (p.alpha > 0) {
        activeParticles++;
        ctx?.save();
        ctx?.translate(p.x, p.y);
        ctx?.rotate((p.rot * Math.PI) / 180);
        if (ctx) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx?.restore();
      }
    }

    if (activeParticles > 0 && frameCount < 180) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  render();
}
