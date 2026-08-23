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
    const MAX_PARTICLES = isMobile ? 90 : 240;

    let lastPointerX = width / 2;
    let lastPointerY = height / 2;
    let hasPointer = false;

    // Deep Velvet Dark Ambient Blobs (Zero white/fog, pure rich cabernet & ruby glow)
    const blobCount = isMobile ? 2 : 4;
    const ambientBlobs = Array.from({ length: blobCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: (isMobile ? 140 : 220) + Math.random() * 120,
      hue: 348 + (i % 2 === 0 ? 0 : 8),
      alpha: 0.022 + Math.random() * 0.015,
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
      const dist = Math.random() * (isClick ? 22 : 10);
      const pSpeed = (Math.random() * 1.5 + 0.4) * (isClick ? 3.0 : Math.min(speed * 0.35, 3.8));

      // Deep Velvet Crimson & Blood Ruby Hues (Never white/washed out)
      const hue = 346 + Math.random() * 14; // 346 - 360 (Rich velvet crimson)
      const sat = 96 + Math.random() * 4;
      const light = 44 + Math.random() * 10; // 44 - 54 (Deep saturated blood red)

      const size = isClick
        ? Math.random() * 50 + 26
        : Math.random() * 38 + 16 + Math.min(speed * 2.2, 36);

      particles.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: vx * 0.22 + Math.cos(angle) * pSpeed,
        vy: vy * 0.22 + Math.sin(angle) * pSpeed,
        size: size * 0.22,
        maxSize: size,
        colorHue: hue,
        colorSat: sat,
        colorLight: light,
        alpha: isClick ? 0.65 : 0.48,
        decay: isClick ? 0.009 + Math.random() * 0.005 : 0.011 + Math.random() * 0.006,
        spin: (Math.random() - 0.5) * 0.05,
        angle: Math.random() * Math.PI * 2,
        curl: (Math.random() - 0.5) * 0.08
      });
    };

    // Sub-Pixel Path Interpolation: Creates continuous unbroken liquid ribbon
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

      if (dist > 1.5) {
        const vx = dx * 0.8;
        const vy = dy * 0.8;

        const stepDist = isMobile ? 10 : 7;
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

      // Burst of volumetric liquid particles on click/tap
      for (let i = 0; i < (isMobile ? 10 : 16); i++) {
        createSplat(
          clientX,
          clientY,
          (Math.random() - 0.5) * 4.5,
          (Math.random() - 0.5) * 4.5,
          true
        );
      }

      // Smooth expanding shockwave pressure ripple
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 8,
        maxRadius: (isMobile ? 130 : 180) + Math.random() * 40,
        alpha: 0.75
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    const render = () => {
      // Inky Pitch-Black backdrop trail (Zero fog or milky residue)
      ctx.fillStyle = 'rgba(4, 6, 10, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // 1. Render Deep Velvet Ambient Crimson Glows (Low opacity, high contrast)
      for (let b = 0; b < ambientBlobs.length; b++) {
        const blob = ambientBlobs[b];
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.pulse += 0.016;

        if (blob.x < -blob.radius) blob.x = width + blob.radius;
        if (blob.x > width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = height + blob.radius;
        if (blob.y > height + blob.radius) blob.y = -blob.radius;

        const currentRadius = blob.radius + Math.sin(blob.pulse) * 24;
        const currentAlpha = blob.alpha + Math.sin(blob.pulse * 0.8) * 0.008;

        const grad = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          currentRadius
        );
        grad.addColorStop(0, `hsla(${blob.hue}, 95%, 48%, ${currentAlpha})`);
        grad.addColorStop(0.5, `hsla(${blob.hue}, 90%, 30%, ${currentAlpha * 0.35})`);
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
        wave.radius += (wave.maxRadius - wave.radius) * 0.09;
        wave.alpha -= 0.024;

        if (wave.alpha <= 0 || wave.radius >= wave.maxRadius - 2) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.lineWidth = isMobile ? 2.0 : 2.5;
        ctx.strokeStyle = `hsla(350, 100%, 60%, ${wave.alpha})`;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Render Rich Volumetric Liquid Crimson Smoke Splats
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

        // 4-Stop Deep Saturated Volumetric Gradient (Pure velvet ruby smoke, zero white fog)
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
          `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight + 6}%, ${p.alpha * 0.92})`
        );
        radGrad.addColorStop(
          0.35,
          `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight}%, ${p.alpha * 0.55})`
        );
        radGrad.addColorStop(
          0.7,
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
