/* ═══════════════════════════════════════════════════════════
   JOHNY CAR DETAILING — 3D BMW E30 M3 Engine
   Three.js scene, scroll-driven rotation, dramatic lighting
   ═══════════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class Car3DEngine {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.car = null;
    this.isLoaded = false;
    this.animationId = null;
    this.canvas = null;
    this._lastMaterialOpacity = -1;
  }


  /* ─────────────────────────────────────────────
     INIT — Create scene, camera, renderer
     ───────────────────────────────────────────── */
  init() {
    // HMR CLEANUP — smazat starý canvas pokud existuje (Vite hot reload)
    const oldCanvas = document.getElementById('car3dCanvas');
    if (oldCanvas) {
      oldCanvas.remove();
      console.log('🧹 Removed old car3d canvas (HMR cleanup)');
    }

    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'car3dCanvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 4;
      pointer-events: none;
      opacity: 0;
    `;
    document.body.prepend(this.canvas);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    this.scene = new THREE.Scene();

    // Camera — cinematic telephoto
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0.3, 6);
    this.camera.lookAt(0, 0.6, 0);

    // Lighting
    this._setupLighting();

    // Start render loop
    this._animate();

    // Resize handler
    window.addEventListener('resize', () => this._onResize());

    return this;
  }


  /* ─────────────────────────────────────────────
     LIGHTING — Dramatic studio setup
     ───────────────────────────────────────────── */
  _setupLighting() {
    // 1. Ambient
    const ambient = new THREE.AmbientLight(0xf0e8dd, 0.4);
    this.scene.add(ambient);

    // 2. Hemisphere
    const hemi = new THREE.HemisphereLight(0xffeedd, 0xddccaa, 0.35);
    hemi.position.set(0, 10, 0);
    this.scene.add(hemi);

    // 3. Sunset backlight
    const sunBack = new THREE.DirectionalLight(0xffaa44, 2.5);
    sunBack.position.set(0, 4, -10);
    sunBack.castShadow = true;
    sunBack.shadow.mapSize.width = 2048;
    sunBack.shadow.mapSize.height = 2048;
    sunBack.shadow.camera.near = 0.5;
    sunBack.shadow.camera.far = 25;
    sunBack.shadow.camera.left = -5;
    sunBack.shadow.camera.right = 5;
    sunBack.shadow.camera.top = 4;
    sunBack.shadow.camera.bottom = -1;
    sunBack.shadow.bias = -0.0005;
    this.scene.add(sunBack);

    // 4. Secondary backlight
    const sunBack2 = new THREE.DirectionalLight(0xffcc66, 1.2);
    sunBack2.position.set(2, 3, -8);
    this.scene.add(sunBack2);

    // 5. Front overhead
    const frontOverhead = new THREE.DirectionalLight(0xfff5ee, 0.5);
    frontOverhead.position.set(0, 5, 4);
    this.scene.add(frontOverhead);

    // 6. Front fill
    const frontFill = new THREE.DirectionalLight(0xeee8dd, 0.35);
    frontFill.position.set(0, 1.5, 8);
    this.scene.add(frontFill);

    // 7. Floor bounce
    const floorBounce = new THREE.DirectionalLight(0xeeddbb, 0.2);
    floorBounce.position.set(0, -1, 3);
    this.scene.add(floorBounce);

    // 8. Left wall bounce
    const leftBounce = new THREE.PointLight(0xeeddcc, 0.4);
    leftBounce.position.set(-4, 2, 2);
    leftBounce.decay = 2;
    leftBounce.distance = 12;
    this.scene.add(leftBounce);

    // 9. Right wall bounce
    const rightBounce = new THREE.PointLight(0xeeddcc, 0.4);
    rightBounce.position.set(4, 2, 2);
    rightBounce.decay = 2;
    rightBounce.distance = 12;
    this.scene.add(rightBounce);
  }


  /* ─────────────────────────────────────────────
     LOAD MODEL — BMW E30 M3
     ───────────────────────────────────────────── */
  loadModel(url, onProgress) {
    return new Promise((resolve, reject) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      dracoLoader.setDecoderConfig({ type: 'js' });

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        url,
        (gltf) => {
          this.car = gltf.scene;

          // Normalize scale
          const box = new THREE.Box3().setFromObject(this.car);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const targetLength = 3.5;
          const scaleFactor = targetLength / maxDim;
          this.car.scale.setScalar(scaleFactor);

          // Center
          const scaledBox = new THREE.Box3().setFromObject(this.car);
          const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
          const scaledSize = scaledBox.getSize(new THREE.Vector3());

          this.car.position.x = -scaledCenter.x;
          this.car.position.y = -scaledBox.min.y - 0.65;
          this.car.position.z = -scaledCenter.z;

          // Store center for X positioning
          this.car.userData.centerX = scaledCenter.x;

          // Store for scroll animation
          this.car.userData.centerZ = scaledCenter.z;
          this.car.userData.initialY = this.car.position.y;
          this.car.userData.baseScale = scaleFactor;

          // Face camera
          this.car.rotation.y = 0;

          // Shadows + materials
          this.car.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material && child.material.metalness !== undefined) {
                child.material.envMapIntensity = 1.5;
              }
            }
          });

          // Start invisible
          this.car.visible = false;
          this.scene.add(this.car);
          this.isLoaded = true;

          console.log(`🚗 BMW E30 M3 loaded — scale: ${scaleFactor.toFixed(3)}, dimensions: ${scaledSize.x.toFixed(2)}×${scaledSize.y.toFixed(2)}×${scaledSize.z.toFixed(2)}`);

          // GPU WARM-UP — render 3 frames with car visible but canvas opacity 0
          // Forces shader compilation BEFORE user sees the car → no stutter
          this.car.visible = true;
          let warmupFrames = 0;
          const doWarmup = () => {
            this.renderer.render(this.scene, this.camera);
            warmupFrames++;
            if (warmupFrames < 3) {
              requestAnimationFrame(doWarmup);
            } else {
              // Warm-up done — hide car again, scroll handler will show it
              this.car.visible = false;
              console.log('✅ GPU warm-up complete (3 frames)');
              dracoLoader.dispose();
              resolve(this.car);
            }
          };
          requestAnimationFrame(doWarmup);
        },
        (progress) => {
          if (onProgress && progress.total) {
            onProgress(progress.loaded / progress.total);
          }
        },
        (error) => {
          console.error('❌ Failed to load BMW model:', error);
          reject(error);
        }
      );
    });
  }


  /* ─────────────────────────────────────────────
     SET OPACITY — Jediný zdroj pravdy pro viditelnost
     ───────────────────────────────────────────── */
  setOpacity(v) {
    if (!this.canvas) return;
    v = Math.max(0, Math.min(1, v));

    this.canvas.style.opacity = String(v);

    if (this.car && this.isLoaded) {
      this.car.visible = v > 0.001;

      if (Math.abs(v - this._lastMaterialOpacity) > 0.01 || v === 0 || v === 1) {
        this.car.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = v < 1;
            child.material.opacity = v;
          }
        });
        this._lastMaterialOpacity = v;
      }
    }
  }


  /* ─────────────────────────────────────────────
     UPDATE — Rotace + pozice (voláno ze scroll handleru)
     ───────────────────────────────────────────── */
  update(state) {
    if (!this.car || !this.isLoaded) return;

    if (state.rotationY !== undefined) {
      this.car.rotation.y = state.rotationY;
    }

    if (state.rotationX !== undefined) {
      this.car.rotation.x = state.rotationX;
    }

    if (state.positionX !== undefined) {
      this.car.position.x = -this.car.userData.centerX + state.positionX;
    }

    if (state.positionY !== undefined) {
      this.car.position.y = this.car.userData.initialY + state.positionY;
    }

    if (state.positionZ !== undefined) {
      this.car.position.z = -this.car.userData.centerZ + state.positionZ;
    }

    if (state.scale !== undefined) {
      const base = this.car.userData.baseScale || 1;
      this.car.scale.setScalar(base * state.scale);
    }
  }


  /* ─────────────────────────────────────────────
     RENDER LOOP
     ───────────────────────────────────────────── */
  _animate() {
    this.animationId = requestAnimationFrame(() => this._animate());
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  _onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }
}
