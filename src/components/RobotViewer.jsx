import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ChevronDown, ShieldCheck } from 'lucide-react';

export default function RobotViewer({ onEnterDashboard, isVisible = true }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId;
    let isDisposed = false;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    // Camera fixed at depth 3.5 looking straight ahead at origin
    camera.position.set(0, 0, 3.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Cyber Command Room Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    mainKeyLight.position.set(2, 4, 3.5);
    scene.add(mainKeyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    cyanRimLight.position.set(-2.5, 1, 2.5);
    scene.add(cyanRimLight);

    const floorRimLight = new THREE.PointLight(0x00f0ff, 3.5, 10);
    floorRimLight.position.set(0, -1.2, 1.2);
    scene.add(floorRimLight);

    const backRimLight = new THREE.PointLight(0x0077ff, 2.5, 8);
    backRimLight.position.set(0, 1.0, -2);
    scene.add(backRimLight);

    // 3. Load GLB Model and Position Still in Center
    const loader = new GLTFLoader();
    loader.load(
      '/mini_robot.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;
        model.updateMatrixWorld(true);

        // Ensure front face (screen) points towards camera (+Z)
        const screenObj = model.getObjectByName('screen');
        const bagObj = model.getObjectByName('bag') || model.getObjectByName('bag.001');
        if (screenObj && bagObj) {
          const sPos = new THREE.Vector3();
          const bPos = new THREE.Vector3();
          screenObj.getWorldPosition(sPos);
          bagObj.getWorldPosition(bPos);
          if (sPos.z < bPos.z) {
            model.rotation.y = Math.PI;
            model.updateMatrixWorld(true);
          }
        }

        // Measure true bounding box
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Target height in world units to span ~78% of viewport height (matching user's blue box)
        const TARGET_HEIGHT = 2.26;
        const scale = TARGET_HEIGHT / (size.y || 1);

        const rootGroup = new THREE.Group();
        rootGroup.scale.set(scale, scale, scale);

        // Center horizontally and align feet to local y = 0
        model.position.x = -center.x;
        model.position.y = -box.min.y;
        model.position.z = -center.z;
        rootGroup.add(model);

        // Position feet on the command center floor (y = -1.26 in world units)
        rootGroup.position.set(0, -1.26, 0);
        scene.add(rootGroup);

        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadPct(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => {
        console.error('Error loading 3D robot model:', err);
        setLoading(false);
      }
    );

    // 4. Still Animation Loop (No jumping, no rotating)
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none pointer-events-auto">
      
      {/* Subtle Holographic Glowing Ring at Robot's Feet on the Floor */}
      <div className="absolute bottom-8 sm:bottom-10 w-72 sm:w-96 h-16 rounded-[100%] bg-gradient-to-r from-cyan-500/0 via-cyan-400/20 to-cyan-500/0 blur-xl pointer-events-none" />
      <div className="absolute bottom-9 sm:bottom-11 w-60 sm:w-80 h-10 rounded-[100%] border border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.3)] pointer-events-none" />

      {/* 3D Canvas Mount (Full Screen) */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />

      {/* Loading state indicator */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/40 backdrop-blur-sm z-20">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
          <span className="text-[11px] font-mono text-cyan-300">
            Materializing 3D Sentinel... {loadPct > 0 ? `${loadPct}%` : ''}
          </span>
        </div>
      )}

      {/* Sleek Bottom Action Pill (Unobstructed at bottom) */}
      {!loading && (
        <div className="absolute bottom-6 sm:bottom-8 z-30 flex items-center justify-center pointer-events-auto">
          <button
            onClick={onEnterDashboard}
            className="group px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_45px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-cyan-300/40"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Enter Forensics Lab</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

    </div>
  );
}
