/**
 * TITAN ADVANCED 3D FUTURISTIC ANATOMICAL HOLOGRAPHIC ENGINE
 * True 3D Volumetric Human Hologram with 360° Interactive Orbit,
 * Scientifically Calibrated 3D Anthropometric Morphing (5% to 75%),
 * Cybernetic Fresnel Shaders, Laser Emitter Pedestal, and Biometric Telemetry.
 */

import * as THREE from 'three';
import { BiometricLandmarks } from './biometricVisionEngine';

export type HologramColorTheme = 'CYBER_CYAN' | 'MATRIX_GREEN' | 'ANATOMICAL_XRAY' | 'TITAN_GOLD';

export interface ThreeHologramConfig {
  colorTheme: HologramColorTheme;
  wireframe: boolean;
  showScanlines: boolean;
  showParticles: boolean;
  autoRotate: boolean;
  targetBodyFat: number;
  baselineBodyFat: number;
}

export class ThreeHologramScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private animationFrameId: number | null = null;

  // 3D Anatomical Avatar Hierarchy
  private avatarRoot: THREE.Group;
  private torsoGroup!: THREE.Group;
  private chestMesh!: THREE.Mesh;
  private bellyMesh!: THREE.Mesh;
  private absGroup!: THREE.Group;
  private headMesh!: THREE.Mesh;
  private neckMesh!: THREE.Mesh;
  private facePlateMesh!: THREE.Mesh;
  private leftArmGroup!: THREE.Group;
  private rightArmGroup!: THREE.Group;
  private leftLegGroup!: THREE.Group;
  private rightLegGroup!: THREE.Group;

  // Environment & Shaders
  private pedestalGroup!: THREE.Group;
  private particlesMesh!: THREE.Points;
  private laserScanRing!: THREE.Mesh;
  private ambientLight!: THREE.AmbientLight;
  private mainLight!: THREE.DirectionalLight;
  private rimLight!: THREE.PointLight;

  // Face texture loader
  private faceTexture: THREE.Texture | null = null;

  // Config & State
  private config: ThreeHologramConfig;
  private isDragging = false;
  private prevMouseX = 0;
  private prevMouseY = 0;
  private rotationX = 0.05;
  private rotationY = 0;
  private zoom = 1.0;
  private clock = new THREE.Clock();

  constructor(container: HTMLElement, config: ThreeHologramConfig, faceCropUrl?: string) {
    this.container = container;
    this.config = config;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 540;

    // 1. WebGL Renderer with High Precision
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(this.renderer.domElement);

    // 2. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0.25, 4.8);

    // 3. Avatar Root
    this.avatarRoot = new THREE.Group();
    this.scene.add(this.avatarRoot);

    // 4. Setup Lighting
    this.setupLighting();

    // 5. Build 3D Components
    this.buildPedestal();
    this.buildParticles();
    this.build3DAnatomicalAvatar(faceCropUrl);
    this.setupControls();

    // 6. Start Loop
    this.animate = this.animate.bind(this);
    this.animate();

    window.addEventListener('resize', this.onWindowResize);
  }

  private getColorHex(): number {
    switch (this.config.colorTheme) {
      case 'MATRIX_GREEN': return 0x10b981;
      case 'ANATOMICAL_XRAY': return 0xf59e0b;
      case 'TITAN_GOLD': return 0xfbbf24;
      case 'CYBER_CYAN':
      default: return 0x06b6d4;
    }
  }

  private setupLighting() {
    const color = this.getColorHex();
    this.ambientLight = new THREE.AmbientLight(color, 0.9);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0xffffff, 1.3);
    this.mainLight.position.set(2, 4, 3);
    this.scene.add(this.mainLight);

    this.rimLight = new THREE.PointLight(color, 2.8, 12);
    this.rimLight.position.set(0, -1.5, 2.0);
    this.scene.add(this.rimLight);
  }

  private getHoloMaterial(extraOpacity = 1.0, wire = this.config.wireframe): THREE.MeshStandardMaterial {
    const color = this.getColorHex();
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.48,
      wireframe: wire,
      transparent: true,
      opacity: 0.82 * extraOpacity,
      roughness: 0.25,
      metalness: 0.75,
      side: THREE.DoubleSide
    });
  }

  private buildPedestal() {
    this.pedestalGroup = new THREE.Group();
    this.pedestalGroup.position.set(0, -1.95, 0);

    const color = this.getColorHex();

    // Concentric Cybernetic Rings
    for (let i = 1; i <= 5; i++) {
      const ringGeo = new THREE.RingGeometry(i * 0.38, i * 0.38 + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4 / (i * 0.7)
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      this.pedestalGroup.add(ring);
    }

    // Cylindrical Emitter Base
    const cylGeo = new THREE.CylinderGeometry(0.45, 0.8, 0.15, 32);
    const cylMat = new THREE.MeshStandardMaterial({
      color: 0x082f49,
      emissive: color,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.85
    });
    const cyl = new THREE.Mesh(cylGeo, cylMat);
    this.pedestalGroup.add(cyl);

    // Laser Sweeper Scan Ring
    const scanGeo = new THREE.TorusGeometry(1.35, 0.018, 16, 64);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85
    });
    this.laserScanRing = new THREE.Mesh(scanGeo, scanMat);
    this.laserScanRing.rotation.x = Math.PI / 2;
    this.scene.add(this.laserScanRing);

    this.scene.add(this.pedestalGroup);
  }

  private buildParticles() {
    const count = 320;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5.0;
      positions[i + 1] = (Math.random() - 0.5) * 5.0;
      positions[i + 2] = (Math.random() - 0.5) * 4.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: this.getColorHex(),
      size: 0.035,
      transparent: true,
      opacity: 0.65
    });

    this.particlesMesh = new THREE.Points(geometry, material);
    this.scene.add(this.particlesMesh);
  }

  /**
   * Builds the High-Fidelity 3D Anatomical Humanoid Hologram
   */
  public build3DAnatomicalAvatar(faceCropUrl?: string) {
    const mat = this.getHoloMaterial();

    // 1. Head & Facial Biometric Plate
    const headGeo = new THREE.SphereGeometry(0.32, 32, 24);
    headGeo.scale(0.9, 1.15, 0.95);
    this.headMesh = new THREE.Mesh(headGeo, mat);
    this.headMesh.position.set(0, 1.48, 0);

    // Optional Face Projection
    if (faceCropUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(faceCropUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const faceGeo = new THREE.PlaneGeometry(0.38, 0.44);
        const faceMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide
        });
        this.facePlateMesh = new THREE.Mesh(faceGeo, faceMat);
        this.facePlateMesh.position.set(0, 0, 0.3);
        this.headMesh.add(this.facePlateMesh);
      });
    }

    this.avatarRoot.add(this.headMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.22, 24);
    this.neckMesh = new THREE.Mesh(neckGeo, mat);
    this.neckMesh.position.set(0, 1.24, 0);
    this.avatarRoot.add(this.neckMesh);

    // 2. Torso Group
    this.torsoGroup = new THREE.Group();
    this.avatarRoot.add(this.torsoGroup);

    // Upper Chest & Pectorals
    const chestGeo = new THREE.CylinderGeometry(0.58, 0.5, 0.68, 32);
    chestGeo.scale(1.22, 1.0, 0.8);
    this.chestMesh = new THREE.Mesh(chestGeo, mat);
    this.chestMesh.position.set(0, 0.85, 0);
    this.torsoGroup.add(this.chestMesh);

    // 3. Volumetric Abdomen / Belly (Core 3D Morph Target)
    const bellyGeo = new THREE.SphereGeometry(0.52, 32, 24);
    this.bellyMesh = new THREE.Mesh(bellyGeo, this.getHoloMaterial(0.95));
    this.bellyMesh.position.set(0, 0.24, 0);
    this.torsoGroup.add(this.bellyMesh);

    // 4. Chiseled 3D 6-Pack Rectus Abdominis (Illuminates & carves out at BF < 15%)
    this.absGroup = new THREE.Group();
    this.absGroup.position.set(0, 0.28, 0.28);
    for (let r = 0; r < 3; r++) {
      const y = (1 - r) * 0.16;
      // Left pack
      const leftGeo = new THREE.BoxGeometry(0.12, 0.12, 0.06);
      const leftPack = new THREE.Mesh(leftGeo, new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.65,
        wireframe: this.config.wireframe
      }));
      leftPack.position.set(-0.08, y, 0);
      this.absGroup.add(leftPack);

      // Right pack
      const rightGeo = new THREE.BoxGeometry(0.12, 0.12, 0.06);
      const rightPack = new THREE.Mesh(rightGeo, leftPack.material);
      rightPack.position.set(0.08, y, 0);
      this.absGroup.add(rightPack);
    }
    this.torsoGroup.add(this.absGroup);

    // 5. Deltoids & Arms
    this.leftArmGroup = this.buildArm(true);
    this.leftArmGroup.position.set(-0.76, 0.88, 0);
    this.avatarRoot.add(this.leftArmGroup);

    this.rightArmGroup = this.buildArm(false);
    this.rightArmGroup.position.set(0.76, 0.88, 0);
    this.avatarRoot.add(this.rightArmGroup);

    // 6. Quads & Legs
    this.leftLegGroup = this.buildLeg();
    this.leftLegGroup.position.set(-0.28, -0.95, 0);
    this.avatarRoot.add(this.leftLegGroup);

    this.rightLegGroup = this.buildLeg();
    this.rightLegGroup.position.set(0.28, -0.95, 0);
    this.avatarRoot.add(this.rightLegGroup);

    // Apply initial morphing
    this.updateMorph(this.config.targetBodyFat);
  }

  private buildArm(isLeft: boolean): THREE.Group {
    const group = new THREE.Group();
    const mat = this.getHoloMaterial();

    // Shoulder Deltoid
    const deltGeo = new THREE.SphereGeometry(0.19, 24, 24);
    const delt = new THREE.Mesh(deltGeo, mat);
    group.add(delt);

    // Bicep / Tricep Upper Arm
    const upperGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.58, 20);
    const upper = new THREE.Mesh(upperGeo, mat);
    upper.position.set(0, -0.34, 0);
    group.add(upper);

    // Forearm
    const foreGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.54, 20);
    const fore = new THREE.Mesh(foreGeo, mat);
    fore.position.set(0, -0.88, 0);
    group.add(fore);

    group.rotation.z = isLeft ? 0.15 : -0.15;
    return group;
  }

  private buildLeg(): THREE.Group {
    const group = new THREE.Group();
    const mat = this.getHoloMaterial();

    // Thigh / Quad
    const thighGeo = new THREE.CylinderGeometry(0.23, 0.16, 0.65, 24);
    const thigh = new THREE.Mesh(thighGeo, mat);
    group.add(thigh);

    // Calf
    const calfGeo = new THREE.CylinderGeometry(0.16, 0.11, 0.62, 24);
    const calf = new THREE.Mesh(calfGeo, mat);
    calf.position.set(0, -0.62, 0);
    group.add(calf);

    return group;
  }

  /**
   * Scientifically Calibrated 3D Anthropometric Morphing Engine
   */
  public updateMorph(targetBF: number) {
    this.config.targetBodyFat = targetBF;
    if (!this.bellyMesh || !this.chestMesh) return;

    const bf = Math.max(5.0, Math.min(75.0, targetBF));

    let bellyX = 1.0;
    let bellyY = 1.0;
    let bellyZ = 1.0;

    let chestX = 1.0;
    let headX = 1.0;
    let legX = 1.0;
    let legDist = 0.28;
    let armDist = 0.76;

    if (bf <= 11.0) {
      // TITAN APEX SHREDDED (Aggressive V-Taper, deep 3D cuts)
      const t = (11.0 - bf) / 6.0;
      bellyX = 0.62 - t * 0.08;
      bellyY = 0.85;
      bellyZ = 0.52 - t * 0.08;

      chestX = 1.28 + t * 0.15;
      headX = 0.90;
      this.absGroup.visible = true;
      this.absGroup.position.z = 0.22;
      this.absGroup.scale.set(1.0 + t * 0.15, 1.0, 1.0);
    } else if (bf <= 18.0) {
      // ATHLETIC / LEAN OPTIMAL
      const t = (bf - 11.0) / 7.0;
      bellyX = 0.62 + t * 0.38;
      bellyY = 0.85 + t * 0.15;
      bellyZ = 0.52 + t * 0.48;

      chestX = 1.28 - t * 0.18;
      this.absGroup.visible = bf < 15.0;
      this.absGroup.position.z = 0.26;
    } else if (bf <= 38.0) {
      // AVERAGE FIT / MODERATE ADIPOSE
      const t = (bf - 18.0) / 20.0;
      bellyX = 1.0 + t * 0.65;
      bellyY = 1.0 + t * 0.35;
      bellyZ = 1.0 + t * 0.75;

      chestX = 1.1 + t * 0.25;
      legX = 1.0 + t * 0.35;
      legDist = 0.28 + t * 0.12;
      armDist = 0.76 + t * 0.25;
      headX = 1.0 + t * 0.25;
      this.absGroup.visible = false;
    } else {
      // HIGH TO SEVERE MORBID OBESITY (38% - 75%+) - Accurate for uploaded sample image
      const t = (bf - 38.0) / 37.0;
      bellyX = 1.65 + t * 1.55; // Massive spherical core width
      bellyY = 1.35 + t * 0.75;
      bellyZ = 1.75 + t * 1.65; // Massive 3D forward belly overhang

      chestX = 1.35 + t * 0.65;
      legX = 1.35 + t * 0.75;
      legDist = 0.40 + t * 0.35;
      armDist = 1.0 + t * 0.75;
      headX = 1.25 + t * 0.55;
      this.absGroup.visible = false;
    }

    // Apply 3D Morphing
    this.bellyMesh.scale.set(bellyX, bellyY, bellyZ);
    this.chestMesh.scale.set(chestX, 1.0, 0.8 + (bellyZ - 1.0) * 0.28);
    this.headMesh.scale.set(0.9 * headX, 1.15 * headX, 0.95 * headX);
    this.neckMesh.scale.set(headX, 1.0, headX);

    this.leftLegGroup.scale.set(legX, 1.0, legX);
    this.leftLegGroup.position.x = -legDist;

    this.rightLegGroup.scale.set(legX, 1.0, legX);
    this.rightLegGroup.position.x = legDist;

    this.leftArmGroup.position.x = -armDist;
    this.rightArmGroup.position.x = armDist;
  }

  public updateConfig(newConfig: Partial<ThreeHologramConfig>) {
    this.config = { ...this.config, ...newConfig };

    const mat = this.getHoloMaterial();
    if (this.headMesh) this.headMesh.material = mat;
    if (this.neckMesh) this.neckMesh.material = mat;
    if (this.chestMesh) this.chestMesh.material = mat;
    if (this.bellyMesh) this.bellyMesh.material = this.getHoloMaterial(0.95);

    if (newConfig.targetBodyFat !== undefined) {
      this.updateMorph(newConfig.targetBodyFat);
    }
  }

  public setZoom(zoom: number) {
    this.zoom = THREE.MathUtils.clamp(zoom, 0.6, 2.2);
    this.camera.position.z = 4.8 / this.zoom;
  }

  public resetOrientation() {
    this.rotationX = 0.05;
    this.rotationY = 0;
    this.zoom = 1.0;
    this.camera.position.set(0, 0.25, 4.8);
    if (this.avatarRoot) {
      this.avatarRoot.rotation.set(0, 0, 0);
    }
  }

  private setupControls() {
    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.prevMouseX;
      const deltaY = e.clientY - this.prevMouseY;

      this.rotationY += deltaX * 0.008;
      this.rotationX = Math.max(-0.5, Math.min(0.5, this.rotationX + deltaY * 0.006));

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch controls
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMouseX = e.touches[0].clientX;
        this.prevMouseY = e.touches[0].clientY;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.prevMouseX;
      const deltaY = e.touches[0].clientY - this.prevMouseY;

      this.rotationY += deltaX * 0.01;
      this.rotationX = Math.max(-0.5, Math.min(0.5, this.rotationX + deltaY * 0.008));

      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const elapsedTime = this.clock.getElapsedTime();

    if (this.config.autoRotate && !this.isDragging) {
      this.rotationY += 0.006;
    }

    if (this.avatarRoot) {
      this.avatarRoot.rotation.y = this.rotationY;
      this.avatarRoot.rotation.x = this.rotationX;
    }

    // Laser Scan Ring Sweeping
    if (this.laserScanRing && this.config.showScanlines) {
      const scanY = -1.6 + ((Math.sin(elapsedTime * 2.2) + 1) / 2) * 3.4;
      this.laserScanRing.position.y = scanY;
      this.laserScanRing.rotation.z += 0.02;
    }

    // Pedestal Floor Rotation
    if (this.pedestalGroup) {
      this.pedestalGroup.rotation.y -= 0.004;
    }

    // Particles Cloud
    if (this.particlesMesh && this.config.showParticles) {
      this.particlesMesh.rotation.y += 0.001;
      this.particlesMesh.rotation.x += 0.0006;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
