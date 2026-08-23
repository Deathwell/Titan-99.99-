import React, { useEffect, useRef } from 'react';

interface FluidParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  spriteIndex: number;
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

// Pre-render GPU texture sprites once for ultra-fast 120fps hardware blitting
function createSmokeSprite(hue: number, sat: number, light: number, size: number = 128): HTMLCanvasElement {
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = size;
  spriteCanvas.height = size;
  const sCtx = spriteCanvas.getContext('2d');
  if (!sCtx) return spriteCanvas;

  const center = size / 2;
  const grad = sCtx.createRadialGradient(center, center, 0, center, center, center);
  grad.addColorStop(0, `hsla(${hue}, ${sat}%, ${light + 16}%, 1.0)`);
  grad.addColorStop(0.35, `hsla(${hue}, ${sat}%, ${light}%, 0.65)`);
  grad.addColorStop(0.7, `hsla(${hue - 6}, ${sat}%, ${light - 14}%, 0.22)`);
  grad.addColorStop(1, 'transparent');

  sCtx.fillStyle = grad;
  sCtx.beginPath();
  sCtx.arc(center, center, center, 0, Math.PI * 2);
  sCtx.fill();

  return spriteCanvas;
}

export const RedFluidCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    // Pre-cache 3 GPU gradient sprites (Crimson, Ruby, Warm Rose)
    const sprites = [
      createSmokeSprite(348, 96, 50, 128), // Velvet Crimson
      createSmokeSprite(356, 98, 58, 128), // Neon Ruby
      createSmokeSprite(342, 92, 42, 128)  // Deep Burgundy
    ];

    // Ambient Nebula Pre-cached Sprite (256x256)
    const ambientSprite = createSmokeSprite(350, 94, 46, 256);

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const particles: FluidParticle[] = [];
    const shockwaves: Shockwave[] = [];
    const MAX_PARTICLES = isMobile ? 120 : 260;

    let lastPointerX = width / 2;
    let lastPointerY = height / 2;
    let hasPointer = false;

    // Ambient background drifting filaments
    const blobCount = isMobile ? 3 : 5;
    const ambientBlobs = Array.from({ length: blobCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      size: (isMobile ? 260 : 380) + Math.random() * 200,
      alpha: 0.04 + Math.random() * 0.025,
      pulse: Math.random() * Math.PI * 2
    }));

    const createParticle = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      isClick: boolean = false
    ) => {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }

      const speed = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (isClick ? 20 : 8);
      const pSpeed = (Math.random() * 1.4 + 0.3) * (isClick ? 2.8 : Math.min(speed * 0.3, 3.5));
      const size = isClick
        ? Math.random() * 45 + 24
        : Math.random() * 32 + 14 + Math.min(speed * 1.8, 28);

      particles.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: vx * 0.2 + Math.cos(angle) * pSpeed,
        vy: vy * 0.2 + Math.sin(angle) * pSpeed,
        size: size * 0.25,
        maxSize: size,
        spriteIndex: Math.floor(Math.random() * sprites.length),
        alpha: isClick ? 0.65 : 0.48,
        decay: isClick ? 0.01 + Math.random() * 0.005 : 0.012 + Math.random() * 0.006,
        spin: (Math.random() - 0.5) * 0.05,
        angle: Math.random() * Math.PI * 2,
        curl: (Math.random() - 0.5) * 0.07
      });
    };

    // Sub-Pixel Path Interpolator: Spawns dense, continuous fluid ribbon along finger/pointer track
    const handleMove = (clientX: number, clientY: number) => {
      if (!hasPointer) {
        lastPointerX = clientX;
        lastPointerY = clientY;
        hasPointer = true;
        return;
      }

      const dx = clientX - lastPointerX;
      const dy = clientY - lastPointerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1.0) {
        const vx = dx * 0.8;
        const vy = dy * 0.8;

        // Interpolate every 6-8 pixels along the stroke vector so it never looks stepped or jagged!
        const stepDist = isMobile ? 8 : 6;
        const steps = Math.max(1, Math.floor(dist / stepDist));

        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const interpX = lastPointerX + dx * t;
          const interpY = lastPointerY + dy * t;
          createParticle(interpX, interpY, vx, vy, false);
        }

        lastPointerX = clientX;
        lastPointerY = clientY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
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

      lastPointerX = clientX;
      lastPointerY = clientY;
      hasPointer = true;

      // Burst of fluid particles on click/tap
      for (let i = 0; i < (isMobile ? 12 : 18); i++) {
        createParticle(
          clientX,
          clientY,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          true
        );
      }

      // Smooth expanding shockwave pressure ripple
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 8,
        maxRadius: (isMobile ? 140 : 200) + Math.random() * 50,
        alpha: 0.75
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    const render = () => {
      // Smooth dark trail fade
      ctx.fillStyle = 'rgba(6, 7, 11, 0.2)';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 1. Draw Ambient Organic Crimson Nebula via GPU cached sprite blits
      for (let b = 0; b < ambientBlobs.length; b++) {
        const blob = ambientBlobs[b];
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.pulse += 0.016;

        if (blob.x < -blob.size) blob.x = width + blob.size;
        if (blob.x > width + blob.size) blob.x = -blob.size;
        if (blob.y < -blob.size) blob.y = height + blob.size;
        if (blob.y > height + blob.size) blob.y = -blob.size;

        const currentSize = blob.size + Math.sin(blob.pulse) * 30;
        const currentAlpha = blob.alpha + Math.sin(blob.pulse * 0.8) * 0.012;

        ctx.globalAlpha = currentAlpha;
        ctx.drawImage(
          ambientSprite,
          blob.x - currentSize / 2,
          blob.y - currentSize / 2,
          currentSize,
          currentSize
        );
      }

      // 2. Render Shockwave Pressure Rings
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const wave = shockwaves[i];
        wave.radius += (wave.maxRadius - wave.radius) * 0.09;
        wave.alpha -= 0.022;

        if (wave.alpha <= 0 || wave.radius >= wave.maxRadius - 2) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = wave.alpha;
        ctx.lineWidth = isMobile ? 2.0 : 2.5;
        ctx.strokeStyle = '#ff2e4d';
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Render Fluid Smoke using Hardware Sprite Texture Blitting (1000x faster than dynamic gradients!)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Vorticity curl physics
        p.vx += Math.cos(p.angle) * p.curl;
        p.vy += Math.sin(p.angle) * p.curl;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy;

        p.angle += p.spin;
        p.size += (p.maxSize - p.size) * 0.12;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        const sprite = sprites[p.spriteIndex];
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(
          sprite,
          p.x - p.size / 2,
          p.y - p.size / 2,
          p.size,
          p.size
        );
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
        opacity: 0.96,
        mixBlendMode: 'screen',
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden'
      }}
    />
  );
};
