import { useEffect, useRef } from 'react';

export function FutureBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Layer 3: Agricultural Particles (Leaves, Pollen, Seeds, Water Drops)
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      type: 'leaf' | 'seed' | 'pollen' | 'drop';
      rotation: number;
      rotSpeed: number;
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);
    const particles: Particle[] = [];

    const types: ('leaf' | 'seed' | 'pollen' | 'drop')[] = ['leaf', 'seed', 'pollen', 'drop'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.1, // Float upward slowly
        opacity: Math.random() * 0.5 + 0.15,
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y < -20) p.y = height + 20;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'leaf') {
          // Draw leaf particle
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'drop') {
          // Draw water droplet
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'seed') {
          // Draw warm soil seed
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Pollen particle
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Layer 1: Animated Aurora Mesh */}
      <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark opacity-80 animate-auroraDrift" />

      {/* Satellite Imagery Ambient Backdrop */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] bg-cover bg-center filter blur-[2px] pointer-events-none mix-blend-luminosity"
        style={{ backgroundImage: `url('/images/satellite_field_monitoring.png')` }}
      />

      {/* Layer 2: Floating Organic Color Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/15 dark:bg-brand-500/20 rounded-full filter blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-sky-500/15 dark:bg-sky-500/20 rounded-full filter blur-3xl animate-float [animation-delay:2s]" />
      <div className="absolute -bottom-40 left-1/4 w-[30rem] h-[30rem] bg-amber-500/10 dark:bg-amber-500/15 rounded-full filter blur-3xl animate-float [animation-delay:4s]" />

      {/* Layer 3: Interactive Agricultural Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Layer 4: Field Terrain SVG Wave Grid */}
      <div className="absolute bottom-0 inset-x-0 opacity-15 dark:opacity-10 h-64 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full text-brand-500 fill-current">
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Layer 5: Subtle Sunlight Ray Beams */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] bg-gradient-to-b from-amber-400/10 via-brand-500/5 to-transparent filter blur-2xl animate-sunbeam pointer-events-none" />

      {/* Layer 6: Subtle Noise Texture */}
      <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay" />
    </div>
  );
}
