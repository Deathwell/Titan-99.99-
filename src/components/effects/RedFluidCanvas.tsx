import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../../lib/audio';

interface FluidParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  colorHue: number;
  colorSat: number;
  colorLight: number;
  alpha: number;
  decay: number;
  spin: number;
  angle: number;
  curl: number;
}

interface SparkEmber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  colorHue: number; // 38-48 (Gold) or 348-358 (Ruby)
  sparkleSpeed: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  colorHue: number;
}

export const RedFluidCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: FluidParticle[] = [];
    const embers: SparkEmber[] = [];
    const shockwaves: Shockwave[] = [];

    const MAX_PARTICLES = 280;
    const MAX_EMBERS = 120;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let lastTime = performance.now();
    let moveTimeout: number;

    // Ambient floating filaments
    const ambientBlobs = Array.from({ length: 6 }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: 190 + Math.random() * 220,
      hue: 348 + (i % 2 === 0 ? 0 : 8),
      alpha: 0.045 + Math.random() * 0.03,
      pulse: Math.random() * Math.PI * 2
    }));

    // Update global CSS variables on root for 3D card spotlight illumination
    const updateCSSPointer = (x: number, y: number) => {
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    };

    const spawnEmbers = (x: number, y: number, vx: number, vy: number, count: number = 8) => {
      for (let i = 0; i < count; i++) {
        if (embers.length >= MAX_EMBERS) {
          embers.shift();
        }

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const isGold = Math.random() > 0.45;

        embers.push({
          x,
          y,
          vx: vx * 0.35 + Math.cos(angle) * speed,
          vy: vy * 0.35 + Math.sin(angle) * speed - 1.2, // slight upward buoyancy
          size: Math.random() * 2.2 + 1.0,
          alpha: 1.0,
          life: 0,
          maxLife: Math.random() * 40 + 25,
          colorHue: isGold ? 42 + Math.random() * 12 : 352 + Math.random() * 8,
          sparkleSpeed: Math.random() * 0.3 + 0.15
        });
      }
    };

    const createSplat = (x: number, y: number, vx: number, vy: number, count: number = 4, isClick: boolean = false) => {
      const speed = Math.sqrt(vx * vx + vy * vy);

      // Fast flick triggers sparkling ember shower & micro acoustic whoosh!
      if (speed > 7.5 || isClick) {
        spawnEmbers(x, y, vx, vy, isClick ? 14 : Math.min(8, Math.floor(speed * 0.8)));
        if (speed > 10 && !isClick) {
          soundEngine.playFluidWhoosh(0.9 + Math.min(1.0, speed / 25));
        }
      }

      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) {
          particles.shift();
        }

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (isClick ? 32 : 16);
        const pSpeed = (Math.random() * 1.6 + 0.4) * (isClick ? 3.2 : Math.min(speed * 0.4, 4.5));

        const isEmber = Math.random() < 0.14 || (speed > 8 && Math.random() < 0.3);
        const hue = isEmber ? 40 + Math.random() * 14 : 348 + Math.random() * 14;
        const sat = isEmber ? 100 : 94 + Math.random() * 6;
        const light = isEmber ? 70 + Math.random() * 18 : 50 + Math.random() * 18;

        const size = isClick ? Math.random() * 55 + 25 : Math.random() * 42 + 14 + Math.min(speed * 2.8, 38);

        particles.push({
          x: x + Math.cos(angle) * dist,
          y: y + Math.sin(angle) * dist,
          vx: vx * 0.22 + Math.cos(angle) * pSpeed,
          vy: vy * 0.22 + Math.sin(angle) * pSpeed,
          size: size * 0.2,
          maxSize: size,
          colorHue: hue,
          colorSat: sat,
          colorLight: light,
          alpha: isClick ? 0.65 : 0.48,
          decay: isClick ? 0.009 + Math.random() * 0.005 : 0.011 + Math.random() * 0.007,
          spin: (Math.random() - 0.5) * 0.06,
          angle: Math.random() * Math.PI * 2,
          curl: (Math.random() - 0.5) * 0.09
        });
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      lastTime = now;

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      } else {
        return;
      }

      mouseX = clientX;
      mouseY = clientY;

      // Update 3D card spotlight CSS coordinates
      updateCSSPointer(clientX, clientY);

      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2) {
        const vx = (dx / dt) * 16;
        const vy = (dy / dt) * 16;

        const splatCount = Math.min(6, Math.max(2, Math.floor(dist / 10)));
        createSplat(mouseX, mouseY, vx, vy, splatCount, false);

        window.clearTimeout(moveTimeout);
        moveTimeout = window.setTimeout(() => {}, 150);
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      updateCSSPointer(clientX, clientY);

      // Acoustic sub-bass shockwave haptic pulse
      soundEngine.playShockwaveHaptic();

      createSplat(clientX, clientY, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, 16, true);

      // Dual shockwave pressure ring
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 8,
        maxRadius: 200 + Math.random() * 60,
        alpha: 0.8,
        colorHue: 350
      });
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 4,
        maxRadius: 140 + Math.random() * 40,
        alpha: 0.6,
        colorHue: 42
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    const render = () => {
      // Smooth dark trail
      ctx.fillStyle = 'rgba(6, 7, 11, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // 1. Render Ambient Organic Crimson Nebula
      ambientBloBlobs:
      for (let b = 0; b < ambientBlobs.length; b++) {
        const blob = ambientBlobs[b];
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.pulse += 0.018;

        if (blob.x < -blob.radius) blob.x = width + blob.radius;
        if (blob.x > width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = height + blob.radius;
        if (blob.y > height + blob.radius) blob.y = -blob.radius;

        const currentRadius = blob.radius + Math.sin(blob.pulse) * 35;
        const currentAlpha = blob.alpha + Math.sin(blob.pulse * 0.8) * 0.015;

        const grad = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          currentRadius
        );
        grad.addColorStop(0, `hsla(${blob.hue}, 95%, 52%, ${currentAlpha})`);
        grad.addColorStop(0.5, `hsla(${blob.hue}, 90%, 35%, ${currentAlpha * 0.4})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render Shockwave Pressure Rings
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const wave = shockwaves[i];
        wave.radius += (wave.maxRadius - wave.radius) * 0.09;
        wave.alpha -= 0.024;

        if (wave.alpha <= 0 || wave.radius >= wave.maxRadius - 2) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = `hsla(${wave.colorHue}, 100%, 65%, ${wave.alpha})`;
        ctx.shadowColor = `hsla(${wave.colorHue}, 100%, 60%, 0.8)`;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Render Fluid Plasma Splats (Silky Velvet Smoke)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vx += Math.cos(p.angle) * p.curl;
        p.vy += Math.sin(p.angle) * p.curl;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy;

        p.angle += p.spin;
        p.size += (p.maxSize - p.size) * 0.1;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        const radGrad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size
        );

        radGrad.addColorStop(0, `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight + 16}%, ${p.alpha * 0.95})`);
        radGrad.addColorStop(0.35, `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight}%, ${p.alpha * 0.55})`);
        radGrad.addColorStop(0.7, `hsla(${p.colorHue - 6}, ${p.colorSat}%, ${p.colorLight - 14}%, ${p.alpha * 0.22})`);
        radGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Render Spark Embers (Golden & Ruby Parabolic Sparks)
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;
        e.x += e.vx;
        e.y += e.vy;
        e.vy += 0.08; // subtle gravity
        e.vx *= 0.97;
        e.vy *= 0.97;

        const progress = e.life / e.maxLife;
        e.alpha = (1 - progress) * (0.6 + Math.sin(e.life * e.sparkleSpeed) * 0.4);

        if (progress >= 1.0 || e.alpha <= 0) {
          embers.splice(i, 1);
          continue;
        }

        ctx.shadowColor = `hsla(${e.colorHue}, 100%, 75%, ${e.alpha})`;
        ctx.shadowBlur = 8;
        ctx.fillStyle = `hsla(${e.colorHue}, 100%, 80%, ${e.alpha})`;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{
        opacity: 0.95,
        mixBlendMode: 'screen',
        willChange: 'transform'
      }}
    />
  );
};
