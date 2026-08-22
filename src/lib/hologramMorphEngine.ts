/**
 * TITAN CONTINUOUS HOLOGRAPHIC MORPH ENGINE
 * Smooth Gaussian Continuous Mesh Deformation of the ACTUAL PERSON,
 * Clean 60FPS Anti-Aliased Rendering, Procedural Muscle Synthesis, and 3D Pedestal.
 */

import { BiometricLandmarks } from './biometricVisionEngine';

export type HologramRenderMode = 'PHOTOREALISTIC' | 'CYBER_CYAN' | 'MATRIX_GREEN' | 'ANATOMICAL_XRAY';

export interface HologramRenderOptions {
  renderMode: HologramRenderMode;
  targetBodyFat: number;
  baselineBodyFat: number;
  showScanlines: boolean;
  showWireframeGrid: boolean;
  showMuscleSynthesis: boolean;
  zoomLevel: number;
  panOffset: { x: number; y: number };
}

export class HologramMorphEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private scanlineY: number = 0;
  private scanlineDirection: number = 1;
  private pedestalAngle: number = 0;
  private particleCloud: { x: number; y: number; speed: number; size: number; alpha: number }[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Could not initialize Hologram canvas context');
    this.ctx = context;

    // Initialize floating cyber particles
    for (let i = 0; i < 45; i++) {
      this.particleCloud.push({
        x: Math.random() * 800,
        y: Math.random() * 800,
        speed: 0.3 + Math.random() * 0.7,
        size: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.6
      });
    }
  }

  /**
   * Main 60FPS Hologram Render Pipeline
   */
  public renderHologramFrame(
    subjectImg: HTMLImageElement,
    landmarks: BiometricLandmarks,
    options: HologramRenderOptions
  ) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Dark Futuristic Cyber Backing
    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
    bgGradient.addColorStop(0, '#020b14');
    bgGradient.addColorStop(0.7, '#01050a');
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. 3D Rotating Floor Pedestal Emitter
    this.drawCyberPedestal(ctx, width, height, options.renderMode);

    // 3. Floating 3D Cyber Dust Particles
    this.drawFloatingParticles(ctx, width, height, options.renderMode);

    // 4. Save Transform & Apply Zoom/Pan
    ctx.save();
    ctx.translate(width / 2 + options.panOffset.x, height / 2 + options.panOffset.y);
    ctx.scale(options.zoomLevel, options.zoomLevel);
    ctx.translate(-width / 2, -height / 2);

    // 5. Draw the Smoothly Deformed ACTUAL PERSON
    this.drawSmoothMorphedSubject(ctx, subjectImg, landmarks, options, width, height);

    // 6. Optional Chiseled Muscle Definition (When BF < 16%)
    if (options.showMuscleSynthesis && options.targetBodyFat < 16.0) {
      this.drawChiseledMuscleSynthesis(ctx, landmarks, options, width, height);
    }

    // 7. Laser Scanline Sweeper
    if (options.showScanlines) {
      this.drawLaserScanline(ctx, width, height, options.renderMode);
    }

    ctx.restore();

    // 8. Viewport Telemetry HUD Reticles
    this.drawTelemetryHUD(ctx, width, height, options);
  }

  /**
   * Smooth, Continuous Gaussian 2D/2.5D Mesh Warp of the REAL Person
   * Slices at 1px resolution with smooth Gaussian bell scaling - zero slice tearing!
   */
  private drawSmoothMorphedSubject(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    landmarks: BiometricLandmarks,
    options: HologramRenderOptions,
    canvasW: number,
    canvasH: number
  ) {
    const bounds = landmarks.silhouetteBounds;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;

    // Calculate aspect scale to center the person inside the viewport
    const scale = Math.min((canvasW * 0.72) / imgW, (canvasH * 0.76) / imgH);
    const destW = imgW * scale;
    const destH = imgH * scale;
    const destX = (canvasW - destW) / 2;
    const destY = (canvasH - destH) / 2 - 15;

    // Morph parameters
    const baselineBF = options.baselineBodyFat || 30.0;
    const targetBF = options.targetBodyFat;
    const bfDelta = targetBF - baselineBF;

    // Scaling factor (-0.45 to +0.85)
    const morphIntensity = Math.max(-0.48, Math.min(0.85, bfDelta / 35.0));

    // Waist and chest centers in normalized image space (0.0 to 1.0)
    const waistNormY = ((landmarks.waistBox.top + landmarks.waistBox.bottom) / 2) / imgH;
    const chestNormY = ((landmarks.chestBox.top + landmarks.chestBox.bottom) / 2) / imgH;
    const jawNormY = ((landmarks.headBox.top + landmarks.headBox.bottom) / 2) / imgH;

    const waistSigma = 0.16; // Smooth vertical spread
    const chestSigma = 0.12;
    const jawSigma = 0.08;

    // Off-screen morph buffer
    const morphCanvas = document.createElement('canvas');
    morphCanvas.width = canvasW;
    morphCanvas.height = canvasH;
    const morphCtx = morphCanvas.getContext('2d');
    if (!morphCtx) return;

    // 1-pixel continuous slice warp
    const sliceCount = Math.round(destH);
    for (let i = 0; i < sliceCount; i++) {
      const normY = i / sliceCount;
      const srcY = Math.round(normY * imgH);
      const dy = destY + i;

      // 1. Waist Gaussian scaling
      const waistDist = normY - waistNormY;
      const waistInfluence = Math.exp(-(waistDist * waistDist) / (2 * waistSigma * waistSigma));
      let rowScale = 1.0 + morphIntensity * 0.75 * waistInfluence;

      // 2. Chest V-taper scaling
      if (morphIntensity < 0) {
        const chestDist = normY - chestNormY;
        const chestInfluence = Math.exp(-(chestDist * chestDist) / (2 * chestSigma * chestSigma));
        rowScale += Math.abs(morphIntensity) * 0.15 * chestInfluence;
      }

      // 3. Jawline scaling
      const jawDist = normY - jawNormY;
      const jawInfluence = Math.exp(-(jawDist * jawDist) / (2 * jawSigma * jawSigma));
      rowScale += morphIntensity * 0.22 * jawInfluence;

      const sliceW = destW * Math.max(0.4, rowScale);
      const sliceX = destX + (destW - sliceW) / 2;

      morphCtx.drawImage(
        img,
        0, srcY, imgW, 1,
        sliceX, dy, sliceW, 1.2
      );
    }

    // Apply Holographic Shaders & Tinting
    ctx.save();
    if (options.renderMode === 'CYBER_CYAN') {
      ctx.drawImage(morphCanvas, 0, 0);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(morphCanvas, 0, 0);
    } else if (options.renderMode === 'MATRIX_GREEN') {
      ctx.drawImage(morphCanvas, 0, 0);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(morphCanvas, 0, 0);
    } else if (options.renderMode === 'ANATOMICAL_XRAY') {
      ctx.drawImage(morphCanvas, 0, 0);
      ctx.globalCompositeOperation = 'source-atop';
      const xrayGrad = ctx.createLinearGradient(0, destY, 0, destY + destH);
      xrayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
      xrayGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.6)');
      xrayGrad.addColorStop(1, 'rgba(239, 68, 68, 0.5)');
      ctx.fillStyle = xrayGrad;
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(morphCanvas, 0, 0);
    } else {
      // PHOTOREALISTIC: Clean natural color with glowing holographic edges
      ctx.shadowColor = 'rgba(6, 182, 212, 0.65)';
      ctx.shadowBlur = 18;
      ctx.drawImage(morphCanvas, 0, 0);
    }
    ctx.restore();
  }

  /**
   * Procedural Chiseled Muscle Definition for Shredded Physiques
   */
  private drawChiseledMuscleSynthesis(
    ctx: CanvasRenderingContext2D,
    landmarks: BiometricLandmarks,
    options: HologramRenderOptions,
    canvasW: number,
    canvasH: number
  ) {
    const t = Math.max(0, (16.0 - options.targetBodyFat) / 10.0);
    const alpha = Math.min(0.65, t * 0.75);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.85)';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 1.8;

    const centerX = canvasW / 2;
    const waistY = canvasH / 2 + 10;

    // Linea Alba (Vertical Abdominal Centerline)
    ctx.beginPath();
    ctx.moveTo(centerX, waistY - 55);
    ctx.lineTo(centerX, waistY + 65);
    ctx.stroke();

    // 6-Pack Tendinous Intersections
    const packWidth = 28;
    const packHeight = 22;
    for (let row = 0; row < 3; row++) {
      const y = waistY - 35 + row * 32;

      // Left Belly
      ctx.beginPath();
      ctx.roundRect(centerX - packWidth - 4, y, packWidth, packHeight, 5);
      ctx.fill();
      ctx.stroke();

      // Right Belly
      ctx.beginPath();
      ctx.roundRect(centerX + 4, y, packWidth, packHeight, 5);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * 3D Cybernetic Floor Pedestal Emitter
   */
  private drawCyberPedestal(ctx: CanvasRenderingContext2D, width: number, height: number, mode: HologramRenderMode) {
    this.pedestalAngle += 0.008;
    const color = mode === 'MATRIX_GREEN' ? '#10b981' : mode === 'ANATOMICAL_XRAY' ? '#f59e0b' : '#06b6d4';

    ctx.save();
    const pedestalY = height - 60;

    // Concentric Elliptical Rings
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.ellipse(width / 2, pedestalY, i * 75, i * 22, this.pedestalAngle * (i % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.35 / (i * 0.7);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Upward Light Beam Gradient
    const beamGrad = ctx.createLinearGradient(width / 2, pedestalY, width / 2, pedestalY - 140);
    beamGrad.addColorStop(0, color);
    beamGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = beamGrad;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 90, pedestalY);
    ctx.lineTo(width / 2 + 90, pedestalY);
    ctx.lineTo(width / 2 + 50, pedestalY - 140);
    ctx.lineTo(width / 2 - 50, pedestalY - 140);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * Floating Cyber Particles
   */
  private drawFloatingParticles(ctx: CanvasRenderingContext2D, width: number, height: number, mode: HologramRenderMode) {
    const color = mode === 'MATRIX_GREEN' ? '#6ee7b7' : mode === 'ANATOMICAL_XRAY' ? '#fde68a' : '#67e8f9';

    ctx.save();
    ctx.fillStyle = color;
    this.particleCloud.forEach(p => {
      p.y -= p.speed;
      if (p.y < 0) p.y = height;

      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  /**
   * Laser Scanline Sweeper
   */
  private drawLaserScanline(ctx: CanvasRenderingContext2D, width: number, height: number, mode: HologramRenderMode) {
    const color = mode === 'MATRIX_GREEN' ? '#10b981' : mode === 'ANATOMICAL_XRAY' ? '#f59e0b' : '#38bdf8';

    this.scanlineY += 2.2 * this.scanlineDirection;
    if (this.scanlineY > height - 100) {
      this.scanlineDirection = -1;
    } else if (this.scanlineY < 80) {
      this.scanlineDirection = 1;
    }

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    const grad = ctx.createLinearGradient(0, this.scanlineY - 8, 0, this.scanlineY + 8);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(width * 0.15, this.scanlineY - 4, width * 0.7, 8);

    ctx.restore();
  }

  /**
   * Viewport Telemetry HUD
   */
  private drawTelemetryHUD(ctx: CanvasRenderingContext2D, width: number, height: number, options: HologramRenderOptions) {
    ctx.save();
    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';

    // Corner Reticles
    const s = 14;
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;

    // Top-left
    ctx.beginPath(); ctx.moveTo(20, 20 + s); ctx.lineTo(20, 20); ctx.lineTo(20 + s, 20); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(width - 20 - s, 20); ctx.lineTo(width - 20, 20); ctx.lineTo(width - 20, 20 + s); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(20, height - 20 - s); ctx.lineTo(20, height - 20); ctx.lineTo(20 + s, height - 20); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(width - 20 - s, height - 20); ctx.lineTo(width - 20, height - 20); ctx.lineTo(width - 20, height - 20 - s); ctx.stroke();

    ctx.restore();
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
