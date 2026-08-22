/**
 * TITAN NEURAL HOLOGRAM MORPH ENGINE
 * Real-Time 60FPS Subject Deformation, V-Taper Tapering, Abdominal Muscle Bellies Synthesis,
 * and Cybernetic Hologram Shaders.
 */

import { BiometricLandmarks } from './biometricVisionEngine';

export type HologramRenderMode = 'CYBER_HOLO' | 'NEURAL_GREEN' | 'ANATOMICAL_XRAY' | 'PHOTOREALISTIC';

export interface MorphRenderOptions {
  baselineBodyFat: number;
  targetBodyFat: number;
  mode: HologramRenderMode;
  showScanlines: boolean;
  showHudRings: boolean;
  showWireframe: boolean;
  showMuscleOverlay: boolean;
  scanlineOffset: number;
  rotationAngle: number;
  zoomLevel: number;
  panX: number;
  panY: number;
}

export class HologramMorphEngine {
  /**
   * Render the morphed holographic subject onto target canvas
   */
  public renderMorphedHologram(
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    sourceImg: HTMLImageElement,
    landmarks: BiometricLandmarks,
    options: MorphRenderOptions
  ) {
    ctx.clearRect(0, 0, canvasW, canvasH);

    // 1. Draw 3D Sci-Fi Hologram Floor Pedestal Grid
    this.drawHologramPedestal(ctx, canvasW, canvasH, options);

    // 2. Compute Deformation Warp onto an Offscreen Canvas
    const offCanvas = document.createElement('canvas');
    const imgW = sourceImg.naturalWidth || sourceImg.width;
    const imgH = sourceImg.naturalHeight || sourceImg.height;
    offCanvas.width = imgW;
    offCanvas.height = imgH;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    this.applyMeshDeformation(offCtx, sourceImg, imgW, imgH, landmarks, options);

    // 3. Render Subject into Target Canvas with Holographic Lighting & Shaders
    ctx.save();
    ctx.translate(canvasW / 2 + options.panX, canvasH / 2 + options.panY);
    ctx.scale(options.zoomLevel, options.zoomLevel);

    // Fit image to canvas maintaining aspect ratio
    const scale = Math.min((canvasW * 0.85) / imgW, (canvasH * 0.85) / imgH);
    const renderW = imgW * scale;
    const renderH = imgH * scale;
    const drawX = -renderW / 2;
    const drawY = -renderH / 2;

    // Background Holographic Back-Glow Aura
    this.drawHologramAura(ctx, drawX, drawY, renderW, renderH, options);

    // Render deformed subject
    if (options.mode === 'CYBER_HOLO') {
      this.drawCyberHoloMode(ctx, offCanvas, drawX, drawY, renderW, renderH, options);
    } else if (options.mode === 'NEURAL_GREEN') {
      this.drawNeuralGreenMode(ctx, offCanvas, drawX, drawY, renderW, renderH, options);
    } else if (options.mode === 'ANATOMICAL_XRAY') {
      this.drawAnatomicalXRayMode(ctx, offCanvas, drawX, drawY, renderW, renderH, options);
    } else {
      // PHOTOREALISTIC
      ctx.drawImage(offCanvas, drawX, drawY, renderW, renderH);
    }

    // 4. Procedural Chiseled Muscle Definition Synthesis (Active when target BF < 16%)
    if (options.targetBodyFat <= 16.0 && options.showMuscleOverlay) {
      this.drawChiseledMuscleSynthesis(ctx, drawX, drawY, renderW, renderH, landmarks, imgW, imgH, options);
    }

    // 5. Wireframe Mesh Overlay
    if (options.showWireframe) {
      this.drawWireframeMesh(ctx, drawX, drawY, renderW, renderH, landmarks, imgW, imgH, options);
    }

    // 6. Laser Scanline Sweeper
    if (options.showScanlines) {
      this.drawScanlines(ctx, drawX, drawY, renderW, renderH, options);
    }

    ctx.restore();

    // 7. Futuristic Biometric HUD Rings & Telemetry Reticles
    if (options.showHudRings) {
      this.drawHudTelemetry(ctx, canvasW, canvasH, options);
    }
  }

  /**
   * 2D Volumetric Mesh Deformation Algorithm
   * Compresses waist into V-taper for lean BF% or expands core volume for high BF%
   */
  private applyMeshDeformation(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    imgW: number,
    imgH: number,
    landmarks: BiometricLandmarks,
    options: MorphRenderOptions
  ) {
    const { baselineBodyFat, targetBodyFat } = options;
    
    // Normalized morph delta (-1.0 is extreme cut, +1.0 is massive bulk)
    const bfDiff = targetBodyFat - baselineBodyFat;
    const morphFactor = Math.max(-0.65, Math.min(0.85, (bfDiff / 35.0)));

    const { waistBox, chestBox, headBox, centerLineX } = landmarks;
    const waistMidY = (waistBox.top + waistBox.bottom) / 2;
    const waistHalfH = Math.max(20, (waistBox.bottom - waistBox.top) / 2);

    const sliceHeight = 2;
    const totalSlices = Math.ceil(imgH / sliceHeight);

    for (let i = 0; i < totalSlices; i++) {
      const srcY = i * sliceHeight;
      const sliceH = Math.min(sliceHeight, imgH - srcY);
      const currentY = srcY + sliceH / 2;

      let scaleX = 1.0;

      // 1. Abdominal & Waist Zone Deformation
      const distToWaist = Math.abs(currentY - waistMidY);
      if (distToWaist < waistHalfH * 1.5) {
        const influence = Math.cos((distToWaist / (waistHalfH * 1.5)) * (Math.PI / 2));
        // Expand or shrink horizontally
        scaleX = 1.0 + morphFactor * 0.55 * influence;
      }

      // 2. Chest / Shoulder Zone (Slight inverse V-taper adjustment)
      const chestMidY = (chestBox.top + chestBox.bottom) / 2;
      const distToChest = Math.abs(currentY - chestMidY);
      if (distToChest < (chestBox.bottom - chestBox.top) / 2) {
        const influence = Math.cos((distToChest / ((chestBox.bottom - chestBox.top) / 2)) * (Math.PI / 2));
        if (morphFactor < 0) {
          // Keep chest wide during cut to enhance V-taper
          scaleX = 1.0 + Math.abs(morphFactor) * 0.12 * influence;
        } else {
          scaleX = 1.0 + morphFactor * 0.25 * influence;
        }
      }

      // 3. Facial Adiposity Zone (Cheek/Jaw morph)
      const headMidY = (headBox.top + headBox.bottom) / 2;
      const distToHead = Math.abs(currentY - headMidY);
      if (distToHead < (headBox.bottom - headBox.top) / 2) {
        const influence = Math.cos((distToHead / ((headBox.bottom - headBox.top) / 2)) * (Math.PI / 2));
        scaleX = 1.0 + morphFactor * 0.28 * influence;
      }

      const destW = imgW * scaleX;
      const destX = centerLineX - (centerLineX * scaleX);

      ctx.drawImage(
        img,
        0, srcY, imgW, sliceH,
        destX, srcY, destW, sliceH
      );
    }
  }

  /**
   * Procedural Chiseled Abdominal Muscle Synthesis
   * Projects rectus abdominis packs, linea alba, and oblique serratus cuts when BF < 16%
   */
  private drawChiseledMuscleSynthesis(
    ctx: CanvasRenderingContext2D,
    drawX: number,
    drawY: number,
    renderW: number,
    renderH: number,
    landmarks: BiometricLandmarks,
    imgW: number,
    imgH: number,
    options: MorphRenderOptions
  ) {
    const { targetBodyFat } = options;
    // Strength of muscle striation (0 at 16%, 1.0 at 8%)
    const intensity = Math.max(0, Math.min(1.0, (16.0 - targetBodyFat) / 8.0));
    if (intensity <= 0.05) return;

    ctx.save();
    ctx.globalAlpha = intensity * 0.75;
    ctx.strokeStyle = options.mode === 'NEURAL_GREEN' ? '#10b981' : '#06b6d4';
    ctx.fillStyle = options.mode === 'NEURAL_GREEN' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = options.mode === 'NEURAL_GREEN' ? '#10b981' : '#06b6d4';
    ctx.shadowBlur = 8 * intensity;

    const scaleX = renderW / imgW;
    const scaleY = renderH / imgH;

    const coreX = drawX + landmarks.centerLineX * scaleX;
    const waistTopY = drawY + landmarks.waistBox.top * scaleY;
    const waistBottomY = drawY + landmarks.waistBox.bottom * scaleY;
    const coreH = waistBottomY - waistTopY;
    const abWidth = (landmarks.waistBox.right - landmarks.waistBox.left) * scaleX * 0.35;

    // Linea Alba (Vertical Center Separation)
    ctx.beginPath();
    ctx.moveTo(coreX, waistTopY - 10);
    ctx.lineTo(coreX, waistBottomY - 15);
    ctx.stroke();

    // 3 Horizontal Tendinous Intersections (6-pack compartments)
    const packRows = [0.22, 0.48, 0.75];
    packRows.forEach((ratio, idx) => {
      const rowY = waistTopY + coreH * ratio;
      const rowW = abWidth * (1 - idx * 0.1);

      // Left Ab Pack
      ctx.beginPath();
      ctx.roundRect(coreX - rowW - 4, rowY - 14, rowW, 26, 4);
      ctx.stroke();
      ctx.fill();

      // Right Ab Pack
      ctx.beginPath();
      ctx.roundRect(coreX + 4, rowY - 14, rowW, 26, 4);
      ctx.stroke();
      ctx.fill();
    });

    // Serratus & Oblique cuts
    for (let s = 0; s < 3; s++) {
      const sY = waistTopY + coreH * (0.15 + s * 0.22);
      // Left serratus cut
      ctx.beginPath();
      ctx.moveTo(coreX - abWidth - 8, sY);
      ctx.lineTo(coreX - abWidth - 28, sY + 12);
      ctx.stroke();

      // Right serratus cut
      ctx.beginPath();
      ctx.moveTo(coreX + abWidth + 8, sY);
      ctx.lineTo(coreX + abWidth + 28, sY + 12);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Cyber Hologram Mode: Neon Electric Cyan Glow
   */
  private drawCyberHoloMode(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    w: number,
    h: number,
    options: MorphRenderOptions
  ) {
    ctx.save();
    // Base cyan silhouette with glow
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 18;
    ctx.drawImage(canvas, x, y, w, h);

    // Cyan color tint overlay
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
    ctx.fillRect(x, y, w, h);

    // High-tech holographic edge highlights
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(165, 243, 252, 0.25)';
    ctx.fillRect(x, y, w, h);

    ctx.restore();
  }

  /**
   * Neural Green Matrix Mode
   */
  private drawNeuralGreenMode(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    w: number,
    h: number,
    options: MorphRenderOptions
  ) {
    ctx.save();
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 20;
    ctx.drawImage(canvas, x, y, w, h);

    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.55)';
    ctx.fillRect(x, y, w, h);

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(110, 231, 183, 0.3)';
    ctx.fillRect(x, y, w, h);

    ctx.restore();
  }

  /**
   * Anatomical X-Ray / Subcutaneous Fat Density Mode
   */
  private drawAnatomicalXRayMode(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    w: number,
    h: number,
    options: MorphRenderOptions
  ) {
    ctx.save();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.drawImage(canvas, x, y, w, h);

    ctx.globalCompositeOperation = 'source-atop';
    // Heatmap gradient from deep blue (lean) to bright orange/yellow (adipose)
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
    grad.addColorStop(0.4, options.targetBodyFat > 20 ? 'rgba(245, 158, 11, 0.7)' : 'rgba(16, 185, 129, 0.6)');
    grad.addColorStop(0.7, options.targetBodyFat > 30 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(6, 182, 212, 0.6)');
    grad.addColorStop(1, 'rgba(139, 92, 246, 0.6)');

    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    ctx.restore();
  }

  /**
   * Background Holographic Aura
   */
  private drawHologramAura(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options: MorphRenderOptions
  ) {
    ctx.save();
    const color = options.mode === 'NEURAL_GREEN' ? '#10b981' : '#06b6d4';
    const radGrad = ctx.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, w * 0.85);
    radGrad.addColorStop(0, `${color}25`);
    radGrad.addColorStop(0.6, `${color}08`);
    radGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = radGrad;
    ctx.fillRect(x - w * 0.4, y - h * 0.4, w * 1.8, h * 1.8);
    ctx.restore();
  }

  /**
   * Laser Scanline Sweeper
   */
  private drawScanlines(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options: MorphRenderOptions
  ) {
    ctx.save();
    const color = options.mode === 'NEURAL_GREEN' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(6, 182, 212, 0.08)';

    // Fine static scanlines
    ctx.fillStyle = color;
    for (let sy = y; sy < y + h; sy += 4) {
      ctx.fillRect(x, sy, w, 1.5);
    }

    // Moving Laser Sweeper Line
    const sweepY = y + ((options.scanlineOffset % 100) / 100) * h;
    const sweepGrad = ctx.createLinearGradient(x, sweepY - 15, x, sweepY + 15);
    const laserColor = options.mode === 'NEURAL_GREEN' ? '#34d399' : '#38bdf8';
    sweepGrad.addColorStop(0, 'transparent');
    sweepGrad.addColorStop(0.5, laserColor);
    sweepGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = sweepGrad;
    ctx.fillRect(x - 20, sweepY - 6, w + 40, 12);

    ctx.restore();
  }

  /**
   * 3D Cybernetic Pedestal Base
   */
  private drawHologramPedestal(
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    options: MorphRenderOptions
  ) {
    ctx.save();
    const centerX = canvasW / 2 + options.panX;
    const baseY = canvasH * 0.86 + options.panY;
    const color = options.mode === 'NEURAL_GREEN' ? '#10b981' : '#06b6d4';

    ctx.translate(centerX, baseY);

    // Perspective Ellipses
    for (let r = 0; r < 4; r++) {
      const radiusX = (r + 1) * 70 * options.zoomLevel;
      const radiusY = radiusX * 0.28;

      ctx.beginPath();
      ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}${r === 0 ? '80' : '30'}`;
      ctx.lineWidth = r === 0 ? 2 : 1;
      ctx.stroke();
    }

    // Radial spokes
    const spokeCount = 12;
    for (let s = 0; s < spokeCount; s++) {
      const angle = (s / spokeCount) * Math.PI * 2 + options.rotationAngle;
      const x1 = Math.cos(angle) * 70 * options.zoomLevel;
      const y1 = Math.sin(angle) * 70 * 0.28 * options.zoomLevel;
      const x2 = Math.cos(angle) * 280 * options.zoomLevel;
      const y2 = Math.sin(angle) * 280 * 0.28 * options.zoomLevel;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `${color}20`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Wireframe Mesh Grid
   */
  private drawWireframeMesh(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    landmarks: BiometricLandmarks,
    imgW: number,
    imgH: number,
    options: MorphRenderOptions
  ) {
    ctx.save();
    const color = options.mode === 'NEURAL_GREEN' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(6, 182, 212, 0.22)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;

    const cols = 14;
    const rows = 24;
    const colStep = w / cols;
    const rowStep = h / rows;

    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(x + c * colStep, y);
      ctx.lineTo(x + c * colStep, y + h);
      ctx.stroke();
    }

    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(x, y + r * rowStep);
      ctx.lineTo(x + w, y + r * rowStep);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Futuristic Biometric HUD Rings & Reticles
   */
  private drawHudTelemetry(
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    options: MorphRenderOptions
  ) {
    ctx.save();
    const color = options.mode === 'NEURAL_GREEN' ? '#10b981' : '#06b6d4';
    ctx.font = '10px monospace';
    ctx.fillStyle = color;

    // Corner HUD Bracket Accents
    const bSize = 24;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(20, 20 + bSize); ctx.lineTo(20, 20); ctx.lineTo(20 + bSize, 20);
    ctx.stroke();
    ctx.fillText('TARGET: OPERATOR BIO-HOLOGRAM', 32, 28);
    ctx.fillText(`SIMULATED ADIPOSITY: ${options.targetBodyFat.toFixed(1)}%`, 32, 42);

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(canvasW - 20 - bSize, 20); ctx.lineTo(canvasW - 20, 20); ctx.lineTo(canvasW - 20, 20 + bSize);
    ctx.stroke();
    ctx.fillText(`RENDER MODE: ${options.mode}`, canvasW - 190, 28);
    ctx.fillText(`ZOOM: ${(options.zoomLevel * 100).toFixed(0)}%`, canvasW - 190, 42);

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(20, canvasH - 20 - bSize); ctx.lineTo(20, canvasH - 20); ctx.lineTo(20 + bSize, canvasH - 20);
    ctx.stroke();
    ctx.fillText(`BASELINE BF: ${options.baselineBodyFat.toFixed(1)}%`, 32, canvasH - 26);

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(canvasW - 20 - bSize, canvasH - 20); ctx.lineTo(canvasW - 20, canvasH - 20); ctx.lineTo(canvasW - 20, canvasH - 20 - bSize);
    ctx.stroke();
    ctx.fillText('TITAN V-TAPER SYNTHESIS v2.6', canvasW - 210, canvasH - 26);

    ctx.restore();
  }
}

export const hologramMorphEngine = new HologramMorphEngine();
