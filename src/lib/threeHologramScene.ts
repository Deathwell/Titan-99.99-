/**
 * TITAN 3D WEBGL HOLOGRAPHIC SCENE ENGINE
 * True 3D Volumetric Anatomical Avatar, 360-Degree Orbit Controls,
 * Real-Time 3D Vertex Morphing (5% to 75%), Cybernetic Shaders, and Laser Pedestal.
 */

import * as THREE from 'three';

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

  // 3D Avatar & Morph Components
  private avatarGroup: THREE.Group;
  private torsoMesh!: THREE.Mesh;
  private headMesh!: THREE.Mesh;
  private chestMesh!: THREE.Mesh;
  private bellyMesh!: THREE.Mesh;
  private absGroup!: THREE.Group;
  private leftArmGroup!: THREE.Group;
  private rightArmGroup!: THREE.Group;
  private leftLegMesh!: THREE.Mesh;
  private rightLegMesh!: THREE.Mesh;

  // Pedestal & Particles
  private pedestalGroup!: THREE.Group;
  private particlesMesh!: THREE.Points;
  private scanRingMesh!: THREE.Mesh;

  // Configuration & Interaction State
  private config: ThreeHologramConfig;
  private isDragging = false;
  private prevMouseX = 0;
  private prevMouseY = 0;
  private rotationX = 0.1;
  private rotationY = 0;
  private zoom = 1.0;
  private clock = new THREE.Clock();

  constructor(container: HTMLElement, config: ThreeHologramConfig) {
    this.container = container;
    this.config = config;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. WebGL Renderer with Alpha Transparency
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = false;
    container.appendChild(this.renderer.domElement);

    // 2. Scene & Perspective Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 0.4, 4.8);

    // 3. Avatar Group
    this.avatarGroup = new THREE.Group();
    this.scene.add(this.avatarGroup);

    // 4. Build 3D Components
    this.setupLighting();
    this.buildPedestal();
    this.build3DAvatar();
    this.buildParticles();
    this.setupControls();

    // 5. Start Animation Loop
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
    const ambientLight = new THREE.AmbientLight(color, 0.85);
    this.scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(0, 5, 3);
    this.scene.add(topLight);

    const rimLight = new THREE.PointLight(color, 2.5, 10);
    rimLight.position.set(0, -2, 2);
    this.scene.add(rimLight);
  }

  private getHologramMaterial(extraOpacity = 1.0): THREE.MeshStandardMaterial {
    const color = this.getColorHex();
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.45,
      wireframe: this.config.wireframe,
      transparent: true,
      opacity: 0.82 * extraOpacity,
      roughness: 0.2,
      metalness: 0.8
    });
  }

  private buildPedestal() {
    this.pedestalGroup = new THREE.Group();
    this.pedestalGroup.position.set(0, -1.85, 0);

    const color = this.getColorHex();

    // Concentric Floor Rings
    for (let i = 1; i <= 4; i++) {
      const ringGeo = new THREE.RingGeometry(i * 0.45, i * 0.45 + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35 / (i * 0.7)
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      this.pedestalGroup.add(ring);
    }

    // Cylindrical Light Beacon
    const cylGeo = new THREE.CylinderGeometry(0.35, 0.7, 0.15, 32);
    const cylMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.75
    });
    const cyl = new THREE.Mesh(cylGeo, cylMat);
    this.pedestalGroup.add(cyl);

    // Laser Sweeper Scan Ring
    const scanGeo = new THREE.TorusGeometry(1.2, 0.015, 16, 64);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85
    });
    this.scanRingMesh = new THREE.Mesh(scanGeo, scanMat);
    this.scanRingMesh.rotation.x = Math.PI / 2;
    this.scene.add(this.scanRingMesh);

    this.scene.add(this.pedestalGroup);
  }

  private build3DAvatar() {
    const mat = this.getHologramMaterial();

    // 1. Head & Neck
    const headGeo = new THREE.SphereGeometry(0.32, 32, 24);
    headGeo.scale(0.9, 1.15, 0.95);
    this.headMesh = new THREE.Mesh(headGeo, mat);
    this.headMesh.position.set(0, 1.45, 0);
    this.avatarGroup.add(this.headMesh);

    // 2. Upper Chest & Shoulders
    const chestGeo = new THREE.CylinderGeometry(0.55, 0.48, 0.65, 32);
    chestGeo.scale(1.2, 1.0, 0.75);
    this.chestMesh = new THREE.Mesh(chestGeo, mat);
    this.chestMesh.position.set(0, 0.82, 0);
    this.avatarGroup.add(this.chestMesh);

    // 3. Volumetric Abdomen / Belly (Target for 3D BF Morphing)
    const bellyGeo = new THREE.SphereGeometry(0.5, 32, 24);
    this.bellyMesh = new THREE.Mesh(bellyGeo, this.getHologramMaterial(0.95));
    this.bellyMesh.position.set(0, 0.22, 0);
    this.avatarGroup.add(this.bellyMesh);

    // 4. Chiseled 6-Pack Rectus Abdominis Muscle Bellies (Fades in when BF < 15%)
    this.absGroup = new THREE.Group();
    this.absGroup.position.set(0, 0.25, 0.28);
    for (let r = 0; r < 3; r++) {
      const y = (1 - r) * 0.16;
      // Left pack
      const leftPackGeo = new THREE.BoxGeometry(0.12, 0.11, 0.05);
      const leftPack = new THREE.Mesh(leftPackGeo, new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.6,
        wireframe: this.config.wireframe
      }));
      leftPack.position.set(-0.08, y, 0);
      this.absGroup.add(leftPack);

      // Right pack
      const rightPackGeo = new THREE.BoxGeometry(0.12, 0.11, 0.05);
      const rightPack = new THREE.Mesh(rightPackGeo, leftPack.material);
      rightPack.position.set(0.08, y, 0);
      this.absGroup.add(rightPack);
    }
    this.avatarGroup.add(this.absGroup);

    // 5. Arms
    this.leftArmGroup = this.buildArm(true);
    this.leftArmGroup.position.set(-0.72, 0.85, 0);
    this.avatarGroup.add(this.leftArmGroup);

    this.rightArmGroup = this.buildArm(false);
    this.rightArmGroup.position.set(0.72, 0.85, 0);
    this.avatarGroup.add(this.rightArmGroup);

    // 6. Legs & Quads
    const legGeo = new THREE.CylinderGeometry(0.22, 0.14, 1.25, 24);
    legGeo.scale(1.05, 1.0, 1.1);

    this.leftLegMesh = new THREE.Mesh(legGeo, mat);
    this.leftLegMesh.position.set(-0.28, -0.95, 0);
    this.avatarGroup.add(this.leftLegMesh);

    this.rightLegMesh = new THREE.Mesh(legGeo, mat);
    this.rightLegMesh.position.set(0.28, -0.95, 0);
    this.avatarGroup.add(this.rightLegMesh);

    // Position entire avatar
    this.avatarGroup.position.set(0, 0, 0);
  }

  private buildArm(isLeft: boolean): THREE.Group {
    const group = new THREE.Group();
    const mat = this.getHologramMaterial();

    // Shoulder Deltoid
    const deltGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const delt = new THREE.Mesh(deltGeo, mat);
    group.add(delt);

    // Bicep / Tricep Upper Arm
    const upperGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.55, 16);
    const upper = new THREE.Mesh(upperGeo, mat);
    upper.position.set(0, -0.32, 0);
    group.add(upper);

    // Forearm
    const foreGeo = new THREE.CylinderGeometry(0.11, 0.08, 0.5, 16);
    const fore = new THREE.Mesh(foreGeo, mat);
    fore.position.set(0, -0.85, 0);
    group.add(fore);

    // Slight natural angle
    group.rotation.z = isLeft ? 0.18 : -0.18;
    return group;
  }

  private buildParticles() {
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4.5;
      positions[i + 1] = (Math.random() - 0.5) * 4.5;
      positions[i + 2] = (Math.random() - 0.5) * 4.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const color = this.getColorHex();
    const material = new THREE.PointsMaterial({
      color,
      size: 0.04,
      transparent: true,
      opacity: 0.65
    });

    this.particlesMesh = new THREE.Points(geometry, material);
    this.scene.add(this.particlesMesh);
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
      this.rotationX = Math.max(-0.6, Math.min(0.6, this.rotationX + deltaY * 0.006));

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch controls for mobile
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
      this.rotationX = Math.max(-0.6, Math.min(0.6, this.rotationX + deltaY * 0.008));

      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  /**
   * Apply True 3D Parametric Morphing based on Target Body Fat %
   */
  public updateMorph(targetBF: number) {
    this.config.targetBodyFat = targetBF;

    // Normalizing scale factors
    // 8% = extreme lean V-taper, 20% = standard, 60%+ = massive volumetric core
    const bf = Math.max(5.0, Math.min(75.0, targetBF));

    // Abdomen / Belly 3D Volumetric Scaling
    let bellyScaleX = 1.0;
    let bellyScaleY = 1.0;
    let bellyScaleZ = 1.0;

    let chestScaleX = 1.0;
    let legScaleX = 1.0;
    let legDistance = 0.28;
    let headScaleX = 1.0;

    if (bf <= 12.0) {
      // SHREDDED APEX (Tight V-Taper, narrow waist, broad chest)
      const t = (12.0 - bf) / 7.0;
      bellyScaleX = 0.65 - t * 0.08;
      bellyScaleY = 0.85;
      bellyScaleZ = 0.55 - t * 0.08;

      chestScaleX = 1.25 + t * 0.15;
      headScaleX = 0.92;
      this.absGroup.visible = true;
      // Fade in chiseled abs
      this.absGroup.position.z = 0.22;
      this.absGroup.scale.set(1.0, 1.0, 1.0);
    } else if (bf <= 22.0) {
      // ATHLETIC / AVERAGE (Smooth athletic frame)
      const t = (bf - 12.0) / 10.0;
      bellyScaleX = 0.65 + t * 0.35;
      bellyScaleY = 0.85 + t * 0.15;
      bellyScaleZ = 0.55 + t * 0.45;

      chestScaleX = 1.25 - t * 0.15;
      this.absGroup.visible = bf < 15.0;
    } else if (bf <= 45.0) {
      // HIGH ADIPOSITY (Bulging belly & widened stance)
      const t = (bf - 22.0) / 23.0;
      bellyScaleX = 1.0 + t * 0.85;
      bellyScaleY = 1.0 + t * 0.45;
      bellyScaleZ = 1.0 + t * 0.95;

      chestScaleX = 1.1 + t * 0.35;
      legScaleX = 1.0 + t * 0.45;
      legDistance = 0.28 + t * 0.18;
      headScaleX = 1.0 + t * 0.35;
      this.absGroup.visible = false;
    } else {
      // SEVERE / SUPER OBESITY (45% - 75%+) - Matches uploaded sample character
      const t = (bf - 45.0) / 30.0;
      bellyScaleX = 1.85 + t * 1.35; // Huge 3D width
      bellyScaleY = 1.45 + t * 0.65;
      bellyScaleZ = 1.95 + t * 1.45; // Huge 3D forward protrusion

      chestScaleX = 1.45 + t * 0.55;
      legScaleX = 1.45 + t * 0.65;
      legDistance = 0.46 + t * 0.32;
      headScaleX = 1.35 + t * 0.45;
      this.absGroup.visible = false;
    }

    // Apply 3D Transforms
    this.bellyMesh.scale.set(bellyScaleX, bellyScaleY, bellyScaleZ);
    this.chestMesh.scale.set(chestScaleX, 1.0, 0.75 + (bellyScaleZ - 1.0) * 0.3);
    this.headMesh.scale.set(0.9 * headScaleX, 1.15, 0.95 * headScaleX);

    this.leftLegMesh.scale.set(legScaleX, 1.0, legScaleX);
    this.leftLegMesh.position.x = -legDistance;

    this.rightLegMesh.scale.set(legScaleX, 1.0, legScaleX);
    this.rightLegMesh.position.x = legDistance;

    // Adjust arms outward to clear wider torso
    this.leftArmGroup.position.x = -0.72 - (bellyScaleX - 1.0) * 0.65;
    this.rightArmGroup.position.x = 0.72 + (bellyScaleX - 1.0) * 0.65;
  }

  public updateConfig(newConfig: Partial<ThreeHologramConfig>) {
    this.config = { ...this.config, ...newConfig };

    // Update materials
    const mat = this.getHologramMaterial();
    this.headMesh.material = mat;
    this.chestMesh.material = mat;
    this.bellyMesh.material = this.getHologramMaterial(0.95);
    this.leftLegMesh.material = mat;
    this.rightLegMesh.material = mat;

    if (newConfig.targetBodyFat !== undefined) {
      this.updateMorph(newConfig.targetBodyFat);
    }
  }

  public setZoom(zoom: number) {
    this.zoom = THREE.MathUtils.clamp(zoom, 0.6, 2.2);
    this.camera.position.z = 4.8 / this.zoom;
  }

  public resetOrientation() {
    this.rotationX = 0.1;
    this.rotationY = 0;
    this.zoom = 1.0;
    this.camera.position.set(0, 0.4, 4.8);
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const elapsedTime = this.clock.getElapsedTime();

    // Auto-spin if enabled or apply drag rotation
    if (this.config.autoRotate && !this.isDragging) {
      this.rotationY += 0.008;
    }

    this.avatarGroup.rotation.y = this.rotationY;
    this.avatarGroup.rotation.x = this.rotationX;

    // Laser Scan Ring sweeping vertically along Y axis
    if (this.scanRingMesh && this.config.showScanlines) {
      const scanY = -1.5 + ((Math.sin(elapsedTime * 2.2) + 1) / 2) * 3.2;
      this.scanRingMesh.position.y = scanY;
      this.scanRingMesh.rotation.z += 0.02;
    }

    // Pedestal Floor Rings rotation
    if (this.pedestalGroup) {
      this.pedestalGroup.rotation.y -= 0.005;
    }

    // Floating Particles pulse
    if (this.particlesMesh && this.config.showParticles) {
      this.particlesMesh.rotation.y += 0.0015;
      this.particlesMesh.rotation.x += 0.0008;
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
