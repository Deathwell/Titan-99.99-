import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  colorHue: number; // 345 - 360 (Crimson/Ruby), occasionally 30-45 (Gold embers)
  colorSat: number;
  colorLight: number;
  alpha: number;
  decay: number;
  spin: number;
  angle: number;
  curl: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
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

    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    const MAX_PARTICLES = 300;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let lastTime = performance.now();
    let isMoving = false;
    let moveTimeout: number;

    // Ambient floating filaments
    const ambientBlobs = Array.from({ length: 5 }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 180 + Math.random() * 220,
      hue: 348 + (i % 2 === 0 ? 0 : 8),
      alpha: 0.04 + Math.random() * 0.03,
      pulse: Math.random() * Math.PI * 2
    }));

    const createSplat = (x: number, y: number, vx: number, vy: number, count: number = 3, isClick: boolean = false) => {
      const speed = Math.sqrt(vx * vx + vy * vy);
      
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) {
          particles.shift();
        }

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (isClick ? 35 : 18);
        const pSpeed = (Math.random() * 1.5 + 0.5) * (isClick ? 3.5 : Math.min(speed * 0.4, 4));

        // Color palette: Velvet Crimson, Neon Ruby, Deep Burgundy, and Gold Embers
        const isEmber = Math.random() < 0.12 || (speed > 8 && Math.random() < 0.25);
        const hue = isEmber ? 38 + Math.random() * 15 : 346 + Math.random() * 16;
        const sat = isEmber ? 100 : 92 + Math.random() * 8;
        const light = isEmber ? 68 + Math.random() * 20 : 48 + Math.random() * 18;

        const size = isClick ? Math.random() * 60 + 30 : Math.random() * 45 + 15 + Math.min(speed * 3, 40);

        particles.push({
          x: x + Math.cos(angle) * dist,
          y: y + Math.sin(angle) * dist,
          vx: vx * 0.25 + Math.cos(angle) * pSpeed,
          vy: vy * 0.25 + Math.sin(angle) * pSpeed,
          size: size * 0.2,
          maxSize: size,
          colorHue: hue,
          colorSat: sat,
          colorLight: light,
          alpha: isClick ? 0.65 : 0.45,
          decay: isClick ? 0.008 + Math.random() * 0.006 : 0.012 + Math.random() * 0.008,
          spin: (Math.random() - 0.5) * 0.05,
          angle: Math.random() * Math.PI * 2,
          curl: (Math.random() - 0.5) * 0.08
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

      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2) {
        const vx = (dx / dt) * 16;
        const vy = (dy / dt) * 16;

        // Splat density scales with velocity
        const splatCount = Math.min(6, Math.max(2, Math.floor(dist / 12)));
        createSplat(mouseX, mouseY, vx, vy, splatCount, false);

        isMoving = true;
        window.clearTimeout(moveTimeout);
        moveTimeout = window.setTimeout(() => {
          isMoving = false;
        }, 150);
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

      createSplat(clientX, clientY, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, 18, true);

      // Create plasma shockwave ripple
      ripples.push({
        x: clientX,
        y: clientY,
        radius: 10,
        maxRadius: 180 + Math.random() * 80,
        alpha: 0.7,
        color: 'hsla(350, 100%, 65%,'
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    let t = 0;
    const render = () => {
      t += 0.015;

      // Dark fade trail to produce glowing fluid smoke trails
      ctx.fillStyle = 'rgba(7, 7, 10, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Ambient Organic Crimson Nebula
      ambientBlobs.forEach(blob => {
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.pulse += 0.02;

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
      });

      // 2. Render Shockwave Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += (rip.maxRadius - rip.radius) * 0.08;
        rip.alpha -= 0.022;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius - 2) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = `${rip.color}${rip.alpha})`;
        ctx.shadowColor = 'rgba(255, 35, 75, 0.8)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Render Fluid Plasma Splats with Additive Luminescence
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Vorticity curl & fluid physics
        p.vx += Math.cos(p.angle) * p.curl;
        p.vy += Math.sin(p.angle) * p.curl;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        p.angle += p.spin;
        p.size += (p.maxSize - p.size) * 0.1;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        // Radiant multi-stop gaseous fluid gradient
        const radGrad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size
        );

        radGrad.addColorStop(0, `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight + 15}%, ${p.alpha * 0.95})`);
        radGrad.addColorStop(0.35, `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight}%, ${p.alpha * 0.6})`);
        radGrad.addColorStop(0.7, `hsla(${p.colorHue - 5}, ${p.colorSat}%, ${p.colorLight - 15}%, ${p.alpha * 0.25})`);
        radGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
        opacity: 0.92,
        mixBlendMode: 'screen',
        willChange: 'transform'
      }}
    />
  );
};
