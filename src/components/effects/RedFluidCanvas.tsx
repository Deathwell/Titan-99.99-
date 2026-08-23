import React, { useEffect, useRef } from 'react';

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

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const RedFluidCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;

    // Mobile / Low-Power Device Detection & Resolution Scaling
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    // Scale down internal buffer resolution on mobile to guarantee locked 60fps
    const renderScale = isMobile ? 0.65 : 1.0;
    const maxParticles = isMobile ? 75 : 240;

    let width = (canvas.width = Math.round(window.innerWidth * renderScale));
    let height = (canvas.height = Math.round(window.innerHeight * renderScale));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = Math.round(window.innerWidth * renderScale);
      height = canvas.height = Math.round(window.innerHeight * renderScale);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const particles: FluidParticle[] = [];
    const shockwaves: Shockwave[] = [];

    let currentPointerX = width / 2;
    let currentPointerY = height / 2;
    let lastPointerX = currentPointerX;
    let lastPointerY = currentPointerY;
    let hasPointerMoved = false;

    // Ambient floating nebula filaments (3 on mobile, 5 on desktop)
    const blobCount = isMobile ? 3 : 5;
    const ambientBlobs = Array.from({ length: blobCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: (isMobile ? 120 : 180) + Math.random() * 160,
      hue: 348 + (i % 2 === 0 ? 0 : 8),
      alpha: 0.04 + Math.random() * 0.025,
      pulse: Math.random() * Math.PI * 2
    }));

    const createSplat = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      count: number = 3,
      isClick: boolean = false
    ) => {
      const speed = Math.sqrt(vx * vx + vy * vy);

      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) {
          particles.shift();
        }

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (isClick ? 24 : 14);
        const pSpeed =
          (Math.random() * 1.5 + 0.5) * (isClick ? 3.0 : Math.min(speed * 0.35, 3.8));

        // Color: Velvet Crimson & Deep Ruby
        const isWarmAccent = Math.random() < 0.15;
        const hue = isWarmAccent ? 356 + Math.random() * 8 : 346 + Math.random() * 12;
        const sat = 94 + Math.random() * 6;
        const light = isWarmAccent ? 60 + Math.random() * 12 : 46 + Math.random() * 14;

        const size = isClick
          ? Math.random() * 45 + 22
          : Math.random() * 36 + 12 + Math.min(speed * 2.2, 30);

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
          alpha: isClick ? 0.6 : 0.44,
          decay: isClick ? 0.01 + Math.random() * 0.005 : 0.012 + Math.random() * 0.006,
          spin: (Math.random() - 0.5) * 0.05,
          angle: Math.random() * Math.PI * 2,
          curl: (Math.random() - 0.5) * 0.08
        });
      }
    };

    // Coalesced Event Handlers (High efficiency for 120Hz/240Hz touch devices)
    const onMove = (clientX: number, clientY: number) => {
      currentPointerX = clientX * renderScale;
      currentPointerY = clientY * renderScale;
      hasPointerMoved = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      onMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
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

      const scaledX = clientX * renderScale;
      const scaledY = clientY * renderScale;

      createSplat(
        scaledX,
        scaledY,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        isMobile ? 10 : 16,
        true
      );

      // Plasma shockwave ripple
      shockwaves.push({
        x: scaledX,
        y: scaledY,
        radius: 8,
        maxRadius: (isMobile ? 130 : 190) + Math.random() * 50,
        alpha: 0.75
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    let lastTime = performance.now();

    const render = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      lastTime = now;

      // Sample Coalesced Pointer Movement smoothly once per animation frame
      if (hasPointerMoved) {
        const dx = currentPointerX - lastPointerX;
        const dy = currentPointerY - lastPointerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1.5) {
          const vx = (dx / dt) * 16;
          const vy = (dy / dt) * 16;
          const splatCount = Math.min(
            isMobile ? 3 : 5,
            Math.max(1, Math.floor(dist / (isMobile ? 14 : 10)))
          );
          createSplat(currentPointerX, currentPointerY, vx, vy, splatCount, false);
        }

        lastPointerX = currentPointerX;
        lastPointerY = currentPointerY;
        hasPointerMoved = false;
      }

      // Dark trail fade for fluid smoke persistence
      ctx.fillStyle = 'rgba(6, 7, 11, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Ambient Organic Crimson Nebula
      for (let b = 0; b < ambientBlobs.length; b++) {
        const blob = ambientBlobs[b];
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.pulse += 0.016;

        if (blob.x < -blob.radius) blob.x = width + blob.radius;
        if (blob.x > width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = height + blob.radius;
        if (blob.y > height + blob.radius) blob.y = -blob.radius;

        const currentRadius = blob.radius + Math.sin(blob.pulse) * 28;
        const currentAlpha = blob.alpha + Math.sin(blob.pulse * 0.8) * 0.012;

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

      // 2. Render Shockwave Ripples
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

        ctx.lineWidth = isMobile ? 2.0 : 2.5;
        ctx.strokeStyle = `hsla(350, 100%, 65%, ${wave.alpha})`;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Render Fluid Plasma Splats (Gaseous Swirling Smoke)
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

        radGrad.addColorStop(
          0,
          `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight + 14}%, ${p.alpha * 0.95})`
        );
        radGrad.addColorStop(
          0.4,
          `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight}%, ${p.alpha * 0.55})`
        );
        radGrad.addColorStop(
          0.75,
          `hsla(${p.colorHue - 6}, ${p.colorSat}%, ${p.colorLight - 14}%, ${p.alpha * 0.2})`
        );
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{
        opacity: 0.94,
        mixBlendMode: 'screen',
        willChange: 'transform'
      }}
    />
  );
};
