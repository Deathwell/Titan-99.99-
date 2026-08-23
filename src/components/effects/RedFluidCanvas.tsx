import React, { useEffect, useRef } from 'react';
import { fluidThemeManager, FluidThemeConfig } from '../../lib/fluidThemeEngine';

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
  coreOffset: number;
  midOffset: number;
  outerOffset: number;
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
  colorHue: number;
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

    let currentTheme: FluidThemeConfig = fluidThemeManager.getTheme();
    const unsubscribeTheme = fluidThemeManager.subscribe(newTheme => {
      currentTheme = newTheme;
    });

    const particles: Particle[] = [];
    const shockwaves: Shockwave[] = [];
    const MAX_PARTICLES = isMobile ? 120 : 300;

    let lastPointerX = width / 2;
    let lastPointerY = height / 2;
    let hasPointer = false;

    // Ambient floating filaments with active theme color
    const blobCount = isMobile ? 2 : 4;
    const ambientBlobs = Array.from({ length: blobCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: (isMobile ? 140 : 210) + Math.random() * 100,
      hueOffset: (i % 2 === 0 ? 0 : 6),
      alpha: 0.022 + Math.random() * 0.012,
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
      const dist = Math.random() * (isClick ? 18 : 8);
      const pSpeed = (Math.random() * 1.35 + 0.35) * (isClick ? 2.9 : Math.min(speed * 0.34, 3.6));

      // Velocity-reactive luminescence
      const isFast = speed > 5.5 || isClick;
      const hue = currentTheme.baseHue + Math.random() * currentTheme.hueRange;
      const sat = currentTheme.sat;
      const light = currentTheme.baseLight + (isFast ? 8 + Math.random() * 8 : Math.random() * 6);

      // Calibrated Volumetric Scale ("A tiny more volume but less than before"):
      // Base size: 16-24px expanding on motion to 30-42px
      const size = isClick
        ? Math.random() * 42 + 24
        : Math.random() * 28 + 14 + Math.min(speed * 1.9, 26);

      particles.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        vx: vx * 0.2 + Math.cos(angle) * pSpeed,
        vy: vy * 0.2 + Math.sin(angle) * pSpeed,
        size: size * 0.28,
        maxSize: size,
        colorHue: hue,
        colorSat: sat,
        colorLight: light,
        coreOffset: currentTheme.gradientCoreOffset,
        midOffset: currentTheme.gradientMidOffset,
        outerOffset: currentTheme.gradientOuterOffset,
        alpha: isClick ? 0.65 : 0.46,
        decay: isClick ? 0.01 + Math.random() * 0.005 : 0.013 + Math.random() * 0.006,
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

      // Dual-ring expanding shockwave pressure ripple with active theme color
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 6,
        maxRadius: (isMobile ? 125 : 180) + Math.random() * 40,
        alpha: 0.8,
        colorHue: currentTheme.shockwaveHue,
        ringWidth: isMobile ? 2.0 : 2.5
      });
      shockwaves.push({
        x: clientX,
        y: clientY,
        radius: 2,
        maxRadius: (isMobile ? 80 : 115) + Math.random() * 25,
        alpha: 0.5,
        colorHue: currentTheme.shockwaveHue + 6,
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

      // 1. Ambient Background Drifting Glows with active theme hue
      for (let b = 0; b < ambientBlobs.length; b++) {
        const blob = ambientBlobs[b];
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.pulse += 0.015;

        if (blob.x < -blob.radius) blob.x = width + blob.radius;
        if (blob.x > width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = height + blob.radius;
        if (blob.y > height + blob.radius) blob.y = -blob.radius;

        const currentRadius = blob.radius + Math.sin(blob.pulse) * 24;
        const currentAlpha = blob.alpha + Math.sin(blob.pulse * 0.8) * 0.007;

        const grad = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          currentRadius
        );
        const hue = currentTheme.ambientHue + blob.hueOffset;
        grad.addColorStop(0, `hsla(${hue}, ${currentTheme.sat}%, ${currentTheme.baseLight + 4}%, ${currentAlpha})`);
        grad.addColorStop(0.5, `hsla(${hue}, ${currentTheme.sat}%, ${currentTheme.baseLight - 14}%, ${currentAlpha * 0.3})`);
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
        ctx.strokeStyle = `hsla(${wave.colorHue}, 100%, 62%, ${wave.alpha})`;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Render Multi-Stop Volumetric Fluid Smoke Ribbons
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

        // Multi-Stop Volumetric Glow: Luminous Core -> Rich Mid-Tone -> Deep Ambient Falloff
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
          `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight + p.coreOffset}%, ${p.alpha * 0.95})`
        );
        radGrad.addColorStop(
          0.32,
          `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight + p.midOffset}%, ${p.alpha * 0.55})`
        );
        radGrad.addColorStop(
          0.68,
          `hsla(${p.colorHue - 5}, ${p.colorSat}%, ${p.colorLight + p.outerOffset}%, ${p.alpha * 0.18})`
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
      unsubscribeTheme();
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
