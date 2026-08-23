import React, { useEffect, useRef } from 'react';

interface Particle {
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
  ringWidth: number;
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

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const particles: Particle[] = [];
    const shockwaves: Shockwave[] = [];
    const MAX_PARTICLES = isMobile ? 110 : 280;

    let lastPointerX = width / 2;
    let lastPointerY = height / 2;
    let hasPointer = false;

    // Ambient floating filaments for gentle living background depth
    const blobCount = isMobile ? 2 : 4;
    const ambientBlobs = Array.from({ length: blobCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: (isMobile ? 130 : 200) + Math.random() * 100,
      hue: 348 + (i % 2 === 0 ? 0 : 8),
      alpha: 0.02 + Math.random() * 0.012,
      pulse: Math.random() * Math.PI * 2
    }));

    const createSplat = (
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
      const dist = Math.random() * (isClick ? 18 : 7);
      const pSpeed = (Math.random() * 1.3 + 0.3) * (isClick ? 2.8 : Math.min(speed * 0.32, 3.4));

      // Velocity-reactive bioluminescence: fast sweeps glow with neon ruby energy
      const isFast = speed > 6.0 || isClick;
      const hue = isFast ? 352 + Math.random() * 10 : 346 + Math.random() * 12;
      const sat = 96 + Math.random() * 4;
      const light = isFast ? 50 + Math.random() * 8 : 42 + Math.random() * 8;

      // Perfectly balanced volumetric scale: dense silky ribbons without oversized fog
      const size = isClick
        ? Math.random() * 38 + 20
        : Math.random() * 26 + 12 + Math.min(speed * 1.6, 22);

      particles.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: vx * 0.2 + Math.cos(angle) * pSpeed,
        vy: vy * 0.2 + Math.sin(angle) * pSpeed,
        size: size * 0.3,
        maxSize: size,
        colorHue: hue,
        colorSat: sat,
        colorLight: light,
        alpha: isClick ? 0.62 : 0.44,
        decay: isClick ? 0.011 + Math.random() * 0.005 : 0.014 + Math.random() * 0.006,
        spin: (Math.random() - 0.5) * 0.07,
        angle: Math.random() * Math.PI * 2,
        curl: (Math.random() - 0.5) * 0.09
      });
    };

    // Sub-Pixel Path Interpolation: Creates continuous unbroken silky liquid ribbon
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

      if (dist > 1.2) {
        const vx = dx * 0.75;
        const vy = dy * 0.75;

        // Smooth interpolation step
        const stepDist = isMobile ? 8 : 6;
        const steps = Math.max(1, Math.floor(dist / stepDist));

        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const interpX = lastPointerX + dx * t;
          const interpY = lastPointerY + dy * t;
          createSplat(interpX, interpY, vx, vy, false);
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
      for (let i = 0; i < (isMobile ? 10 : 16); i++) {
        createSplat(
          clientX,
          clientY,
          (Math.random() - 0.5) * 4.2,
          (Math.random() - 0.5) * 4.2,
          true
        );
      }

      // Dual-ring expanding shockwave pressure ripple
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 6,
        maxRadius: (isMobile ? 120 : 170) + Math.random() * 40,
        alpha: 0.8,
        ringWidth: isMobile ? 2.0 : 2.5
      });
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 2,
        maxRadius: (isMobile ? 80 : 110) + Math.random() * 25,
        alpha: 0.5,
        ringWidth: 1.5
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    const render = () => {
      // Inky Pitch-Black dark backdrop trail (Pristine contrast)
      ctx.fillStyle = 'rgba(4, 6, 10, 0.24)';
      ctx.fillRect(0, 0, width, height);

      // 1. Ambient Background Drifting Glows (Subtle, organic depth)
      for (let b = 0; b < ambientBlobs.length; b++) {
        const blob = ambientBlobs[b];
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.pulse += 0.015;

        if (blob.x < -blob.radius) blob.x = width + blob.radius;
        if (blob.x > width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = height + blob.radius;
        if (blob.y > height + blob.radius) blob.y = -blob.radius;

        const currentRadius = blob.radius + Math.sin(blob.pulse) * 22;
        const currentAlpha = blob.alpha + Math.sin(blob.pulse * 0.8) * 0.006;

        const grad = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          currentRadius
        );
        grad.addColorStop(0, `hsla(${blob.hue}, 95%, 48%, ${currentAlpha})`);
        grad.addColorStop(0.5, `hsla(${blob.hue}, 90%, 28%, ${currentAlpha * 0.3})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 2. Render Shockwave Pressure Rings
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const wave = shockwaves[i];
        wave.radius += (wave.maxRadius - wave.radius) * 0.095;
        wave.alpha -= 0.026;

        if (wave.alpha <= 0 || wave.radius >= wave.maxRadius - 2) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.lineWidth = wave.ringWidth;
        ctx.strokeStyle = `hsla(350, 100%, 62%, ${wave.alpha})`;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Render Perfectly Balanced Volumetric Fluid Smoke Ribbons
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Vorticity curl eddy physics
        p.vx += Math.cos(p.angle) * p.curl;
        p.vy += Math.sin(p.angle) * p.curl;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        p.angle += p.spin * 1.5;
        p.size += (p.maxSize - p.size) * 0.14;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        // Multi-Stop Volumetric Glow: Luminous Core -> Velvet Crimson -> Dark Cabernet
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
          `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight + 8}%, ${p.alpha * 0.95})`
        );
        radGrad.addColorStop(
          0.3,
          `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight}%, ${p.alpha * 0.55})`
        );
        radGrad.addColorStop(
          0.65,
          `hsla(${p.colorHue - 6}, ${p.colorSat}%, ${p.colorLight - 14}%, ${p.alpha * 0.18})`
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
        opacity: 0.95,
        mixBlendMode: 'screen',
        willChange: 'transform'
      }}
    />
  );
};
