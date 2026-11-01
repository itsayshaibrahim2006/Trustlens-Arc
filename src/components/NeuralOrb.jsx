import React, { useEffect, useRef } from 'react';

export const NeuralOrb = ({ size = 460, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    // Static base orientation - orb does NOT rotate continuously on its axis
    const baseAngleX = 0.16;
    const baseAngleY = 0.22;
    let angleX = baseAngleX;
    let angleY = baseAngleY;
    let targetAngleX = baseAngleX;
    let targetAngleY = baseAngleY;

    let mouseX = -9999;
    let mouseY = -9999;
    let isHovering = false;

    // Viewport dimensions: extra margin on left, right, top, bottom so debris flows naturally
    // outside the square, over surrounding elements
    const extraX = Math.round(Math.min(300, Math.max(40, size * 0.3)));
    const extraY = Math.round(Math.min(200, Math.max(30, size * 0.2)));
    const canvasWidth = size + extraX;
    const canvasHeight = size + extraY;
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // Noticeably bigger orb radius for commanding visual presence
    const baseRadius = size * 0.385;

    // Dense node count matching Technometics (~380 nodes)
    const numPoints = 380;
    const points = [];

    // Fibonacci sphere distribution for uniform, perfectly circular 3D geodesic lattice
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y: 1 to -1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Color distribution: ~50% Dark Navy/Teal, ~35% Ocean Cyan, ~15% Aqua Highlight
      const rand = Math.random();
      const colorType = rand < 0.50 ? 0 : (rand < 0.85 ? 1 : 2);

      points.push({
        x,
        y,
        z,
        phase: Math.random() * Math.PI * 2,
        colorType,
        currentScale: 1.0,
        targetScale: 1.0,
        baseRadius: (size / 380) * (2.6 + (colorType === 2 ? 0.6 : 0) + Math.random() * 0.5),
      });
    }

    // Pre-calculate nearest neighbors for fine geodesic triangulation mesh
    const neighbors = [];
    const maxNeighborDist = 0.22; // optimal for 380 points to give 5-6 connections per node
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dz = points[i].z - points[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxNeighborDist) {
          neighbors.push([i, j, dist]);
        }
      }
    }

    // Saturn-like Asteroid Ring System with Wide Natural Flow (700 particles)
    const numDebris = 700;
    const debris = [];
    const debrisColorPairs = [
      { dark: '#a855f7', light: '#8b5cf6' }, // electric violet
      { dark: '#9333ea', light: '#a855f7' }, // radiant purple
      { dark: '#c084fc', light: '#7c3aed' }, // vivid royal violet
      { dark: '#d946ef', light: '#d946ef' }, // bright neon fuchsia
      { dark: '#ec4899', light: '#ec4899' }, // luminous pink
      { dark: '#06b6d4', light: '#06b6d4' }, // vibrant electric cyan
      { dark: '#22d3ee', light: '#0284c7' }, // vivid cerulean cyan
      { dark: '#38bdf8', light: '#0ea5e9' }, // bright azure sky
      { dark: '#00f2fe', light: '#14b8a6' }, // radiant bright teal
      { dark: '#ffffff', light: '#3b82f6' }, // bright electric sapphire
    ];

    for (let i = 0; i < numDebris; i++) {
      const randR = Math.random();
      let rDist;
      // Realistic Saturn Ring Banding Structure with outer debris flowing wide:
      if (randR < 0.35) {
        // Dense Main Inner Ring (Ring B): 1.14 to 1.34
        rDist = 1.14 + Math.random() * 0.20;
      } else if (randR < 0.40) {
        // Cassini Division (sparse gap): 1.34 to 1.38
        rDist = 1.34 + Math.random() * 0.04;
      } else if (randR < 0.72) {
        // Broad Outer Ring (Ring A): 1.38 to 1.68
        rDist = 1.38 + Math.random() * 0.30;
      } else if (randR < 0.86) {
        // Outer F-Ring & Resonant Band: 1.68 to 1.98
        rDist = 1.68 + Math.random() * 0.30;
      } else {
        // Wide Natural Drift Swarm: 1.98 to 2.45
        rDist = 1.98 + Math.random() * 0.47;
      }

      // Keplerian motion: inner particles orbit faster (v ~ 1 / sqrt(r))
      const speed = (0.0036 / Math.sqrt(rDist)) * (0.85 + Math.random() * 0.3);
      const colPair = debrisColorPairs[Math.floor(Math.random() * debrisColorPairs.length)];

      debris.push({
        orbitRadius: rDist,
        angle: Math.random() * Math.PI * 2,
        speed: speed * (Math.random() > 0.08 ? 1 : 1.08),
        verticalOffset: (Math.random() - 0.5) * 0.042 * (1.2 / rDist), // razor thin Saturn planetary disc profile
        radialJitter: (Math.random() - 0.5) * 0.025,
        size: (size / 380) * (Math.random() > 0.92 ? 3.6 : (Math.random() > 0.45 ? 2.3 : 1.4)),
        darkColor: colPair.dark,
        lightColor: colPair.light,
      });
    }

    // Classic tilted Saturn ring inclination angles
    const beltTiltZ = -0.42; // ~24 degrees tilt
    const beltTiltX = 0.46;  // ~26 degrees tilt

    // Single wave impulse state: at one time ONLY ONE wave!
    let waveOriginX = -9999;
    let waveOriginY = -9999;
    let waveStartTime = -9999;
    let isWaveActive = false;
    let lastTriggerX = -9999;
    let lastTriggerY = -9999;

    let time = 0;

    const triggerSingleWave = (x, y) => {
      waveOriginX = x;
      waveOriginY = y;
      waveStartTime = time;
      isWaveActive = true;
      lastTriggerX = x;
      lastTriggerY = y;
    };

    // Pointer calculation for interactive hover & single wave propagation
    const updatePointer = (clientX, clientY) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / (rect.width || canvasWidth);
      const scaleY = canvasHeight / (rect.height || canvasHeight);
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      const wasHovering = isHovering;

      // Distance to the center of the 3D orb
      const dx = x - cx;
      const dy = y - cy;
      const distToCenter = Math.sqrt(dx * dx + dy * dy);

      // Detect hover when cursor is within or near the orb (baseRadius * 1.25)
      if (distToCenter <= baseRadius * 1.25) {
        mouseX = x;
        mouseY = y;
        isHovering = true;

        const moveDx = mouseX - lastTriggerX;
        const moveDy = mouseY - lastTriggerY;
        const moveDist = Math.sqrt(moveDx * moveDx + moveDy * moveDy);

        // The moment user moves cursor over the orb, immediately launch a single wave from that place.
        if (!wasHovering || moveDist > 8) {
          triggerSingleWave(mouseX, mouseY);
        }

        // Subtle parallax tilt without spinning
        const normX = dx / (baseRadius * 1.5);
        const normY = dy / (baseRadius * 1.5);
        targetAngleY = baseAngleY + normX * 0.28;
        targetAngleX = baseAngleX + normY * 0.22;
      } else {
        isHovering = false;
        mouseX = -9999;
        mouseY = -9999;
        targetAngleY = baseAngleY;
        targetAngleX = baseAngleX;
      }
    };

    const handleWindowMouseMove = (e) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleGlobalClick = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / (rect.width || canvasWidth);
      const scaleY = canvasHeight / (rect.height || canvasHeight);
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const dx = x - cx;
      const dy = y - cy;
      if (Math.sqrt(dx * dx + dy * dy) <= baseRadius * 1.25) {
        triggerSingleWave(x, y);
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleGlobalClick);

    const render = () => {
      time += 0.020;

      // Smooth lerp towards parallax tilt (NO continuous spin)
      angleY += (targetAngleY - angleY) * 0.08;
      angleX += (targetAngleX - angleX) * 0.08;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const fov = 440;

      // Long, deep, relaxing breathing cycle (takes ~5.5s for full slow breath in and breath out)
      const breatheFactor = 1 + 0.038 * Math.sin(time * 1.05);
      const currentSphereRadius = baseRadius * breatheFactor;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Rotate and project nodes
      const projected = new Array(points.length);
      const hoverRadius = size * 0.28; // refined hover lens radius

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Clean, perfect round 3D sphere geometry (NO vertex distortion)
        const px = p.x * currentSphereRadius;
        const py = p.y * currentSphereRadius;
        const pz = p.z * currentSphereRadius;

        // Fixed 3D orientation rotation
        const x1 = px * cosY - pz * sinY;
        const z1 = pz * cosY + px * sinY;
        const y1 = py * cosX - z1 * sinX;
        const z2 = z1 * cosX + py * sinX;

        const scale = fov / (fov + z2);
        const screenX = cx + x1 * scale;
        const screenY = cy + y1 * scale;

        // Magnification & Flow Animation Wave:
        // 1. Direct magnification of nodes under cursor made larger (~2.85x max)
        // 2. Single wave: at one time ONLY ONE wave expanding across all nodes
        let targetScale = 1.0;

        // 1. Direct magnification of nodes under cursor
        let directScale = 0;
        if (isHovering) {
          const dx = screenX - mouseX;
          const dy = screenY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const frontFactor = z2 > 0 ? 1.0 : Math.max(0.35, (z2 + currentSphereRadius) / currentSphereRadius);

          // Direct magnification under cursor
          if (dist < hoverRadius) {
            const normDist = 1 - (dist / hoverRadius);
            const smooth = normDist * normDist * (3 - 2 * normDist);
            directScale = smooth * 1.85 * frontFactor; // Nodes under cursor expand up to ~2.85x
          }
        }

        // 2. Single wave: precisely ONE wave crest traveling across all nodes
        let waveScale = 0;
        if (isWaveActive) {
          const elapsed = time - waveStartTime;
          const waveSpeedPx = size * 0.52; // Smooth travel speed (~2.4s to cross orb)
          const waveRadius = elapsed * waveSpeedPx;
          const waveWidth = size * 0.22; // Thickness of the wave crest band (~100px)

          const dx = screenX - waveOriginX;
          const dy = screenY - waveOriginY;
          const distFromWaveOrigin = Math.sqrt(dx * dx + dy * dy);
          const distFromCrest = Math.abs(distFromWaveOrigin - waveRadius);

          if (distFromCrest < waveWidth) {
            // Cosine bell curve for this solitary wave crest
            const norm = distFromCrest / waveWidth; // 0 at peak, 1 at edges
            const bell = Math.cos(norm * (Math.PI / 2)); // 1.0 at peak, 0.0 at edges
            const wavePulse = Math.pow(bell, 1.8);
            const frontFactor = z2 > 0 ? 1.0 : Math.max(0.40, (z2 + currentSphereRadius) / currentSphereRadius);

            // Makes whichever nodes come in the wave bigger (~2.55x), then smaller as the wave passes
            waveScale = wavePulse * 1.55 * frontFactor;
          }
        }

        targetScale = 1.0 + directScale + waveScale;

        // Fluid, smooth lerp for dynamic swelling to big and returning smaller
        p.currentScale += (targetScale - p.currentScale) * 0.22;

        // Gentle, slow breathing pulse per node (speed 1.3)
        const nodePulse = 1 + 0.038 * Math.sin(time * 1.3 + p.phase);
        const safeScale = Math.max(0.01, scale);
        const finalRadius = Math.max(1.4, p.baseRadius * safeScale * p.currentScale * nodePulse);

        projected[i] = {
          screenX,
          screenY,
          z: z2,
          scale,
          radius: finalRadius,
          currentScale: p.currentScale,
          colorType: p.colorType,
        };
      }

      // Conclude single wave once it has reached beyond the sphere boundary
      if (isWaveActive) {
        const elapsed = time - waveStartTime;
        const waveSpeedPx = size * 0.52;
        const waveRadius = elapsed * waveSpeedPx;
        if (waveRadius > size * 1.4) {
          isWaveActive = false;
        }
      }

      // 3. Update & project Saturn Asteroid Belt particles (continuous orbital rotation)
      const projectedDebris = new Array(debris.length);
      const cosBeltZ = Math.cos(beltTiltZ);
      const sinBeltZ = Math.sin(beltTiltZ);
      const cosBeltX = Math.cos(beltTiltX);
      const sinBeltX = Math.sin(beltTiltX);

      for (let i = 0; i < debris.length; i++) {
        const d = debris[i];
        d.angle += d.speed; // Orbital rotation around the orb
        const rOrbit = currentSphereRadius * (d.orbitRadius + d.radialJitter);
        const lx = Math.cos(d.angle) * rOrbit;
        const lz = Math.sin(d.angle) * rOrbit;
        const ly = d.verticalOffset * currentSphereRadius;

        // Rotate into inclined belt plane (tilt Z, then tilt X)
        const bx1 = lx * cosBeltZ - ly * sinBeltZ;
        const by1 = ly * cosBeltZ + lx * sinBeltZ;
        const by2 = by1 * cosBeltX - lz * sinBeltX;
        const bz2 = lz * cosBeltX + by1 * sinBeltX;

        // Apply subtle view parallax rotation
        const vx1 = bx1 * cosY - bz2 * sinY;
        const vz1 = bz2 * cosY + bx1 * sinY;
        const vy1 = by2 * cosX - vz1 * sinX;
        const vz2 = vz1 * cosX + by2 * sinX;

        const dScale = fov / (fov + vz2);
        const dx = cx + vx1 * dScale;
        const dy = cy + vy1 * dScale;
        const dSize = d.size * dScale;

        projectedDebris[i] = {
          screenX: dx,
          screenY: dy,
          z: vz2,
          size: dSize,
          darkColor: d.darkColor,
          lightColor: d.lightColor,
        };
      }

      // Check current theme dynamically every frame
      const isLight = document.documentElement.classList.contains('light') || document.body.classList.contains('light');

      // 4. Draw back-layer debris particles (behind orb: z < 0)
      for (let i = 0; i < projectedDebris.length; i++) {
        const d = projectedDebris[i];
        if (d.z < 0) {
          const depthNorm = (d.z + currentSphereRadius * 1.8) / (currentSphereRadius * 2.5);
          ctx.globalAlpha = isLight
            ? Math.max(0.60, Math.min(0.92, depthNorm * 0.95))
            : Math.max(0.12, Math.min(0.55, depthNorm));
          ctx.fillStyle = isLight ? d.lightColor : d.darkColor;
          const sz = isLight ? d.size * 1.30 : d.size;
          ctx.fillRect(d.screenX - sz / 2, d.screenY - sz / 2, sz, sz);
        }
      }
      ctx.globalAlpha = 1;

      // 5. Draw fine geodesic mesh connecting lines
      for (let k = 0; k < neighbors.length; k++) {
        const [i, j] = neighbors[k];
        const p1 = projected[i];
        const p2 = projected[j];
        const dx = p1.screenX - p2.screenX;
        const dy = p1.screenY - p2.screenY;
        const dist2D = Math.sqrt(dx * dx + dy * dy);

        if (dist2D < size * 0.16) {
          const avgZ = (p1.z + p2.z) / 2;
          const depthNorm = (avgZ + currentSphereRadius) / (currentSphereRadius * 2);
          const alpha = Math.max(0.06, Math.min(0.65, depthNorm * 0.65));
          const hoverBoost = Math.max(p1.currentScale, p2.currentScale);

          if (hoverBoost > 1.2) {
            ctx.lineWidth = 0.9 + (hoverBoost - 1) * 0.6;
            ctx.strokeStyle = `rgba(0, 180, 216, ${Math.min(0.85, alpha * 1.6)})`;
          } else {
            ctx.lineWidth = 0.75;
            ctx.strokeStyle = `rgba(10, 120, 138, ${alpha})`;
          }
          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(p2.screenX, p2.screenY);
          ctx.stroke();
        }
      }

      // 6. Draw 3D nodes sorted back-to-front for proper depth occlusion
      const sortedNodeIndices = projected
        .map((_, i) => i)
        .sort((a, b) => projected[a].z - projected[b].z);

      for (let k = 0; k < sortedNodeIndices.length; k++) {
        const idx = sortedNodeIndices[k];
        const pt = projected[idx];
        const r = pt.radius;

        // 3D Spherical Radial Gradient with Top-Left Specular Highlight
        const glintOffsetX = r * 0.35;
        const glintOffsetY = r * 0.35;

        const grad = ctx.createRadialGradient(
          pt.screenX - glintOffsetX,
          pt.screenY - glintOffsetY,
          r * 0.04,
          pt.screenX,
          pt.screenY,
          r
        );

        if (pt.colorType === 2) {
          // Color 2: Luminous Bright Aqua / Sky Blue Highlight (~15%)
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.20, '#BAE6FD');
          grad.addColorStop(0.55, '#38BDF8');
          grad.addColorStop(0.85, '#0284C7');
          grad.addColorStop(1, '#034560');
          ctx.globalAlpha = pt.z > 0 ? 1 : Math.max(0.35, (pt.z + currentSphereRadius) / currentSphereRadius + 0.3);
        } else if (pt.colorType === 1) {
          // Color 1: Ocean Teal / Vibrant Cyan (~35%)
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.18, '#67E8F9');
          grad.addColorStop(0.48, '#0891B2');
          grad.addColorStop(0.80, '#0E4E5C');
          grad.addColorStop(1, '#03252E');
          ctx.globalAlpha = pt.z > 0 ? 1 : Math.max(0.28, (pt.z + currentSphereRadius) / currentSphereRadius + 0.25);
        } else {
          // Color 0: Dark Midnight Navy / Teal (~50%)
          grad.addColorStop(0, '#7DD3FC');
          grad.addColorStop(0.25, '#0C4A60');
          grad.addColorStop(0.65, '#072430');
          grad.addColorStop(0.92, '#03141C');
          grad.addColorStop(1, '#010A0F');
          ctx.globalAlpha = pt.z > 0 ? 0.95 : Math.max(0.22, (pt.z + currentSphereRadius) / currentSphereRadius + 0.2);
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, Math.max(0.1, r), 0, Math.PI * 2);
        ctx.fill();

        // Extra specular glint on front-facing highlighted/magnified nodes
        if (pt.currentScale > 1.2 && pt.z > -10) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
          ctx.beginPath();
          ctx.arc(pt.screenX - glintOffsetX, pt.screenY - glintOffsetY, Math.max(0.1, r * 0.22), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 7. Draw front-layer debris particles (in front of orb: z >= 0)
      for (let i = 0; i < projectedDebris.length; i++) {
        const d = projectedDebris[i];
        if (d.z >= 0) {
          const depthNorm = (d.z + currentSphereRadius * 0.5) / (currentSphereRadius * 1.5);
          ctx.globalAlpha = isLight
            ? Math.min(1.0, Math.max(0.85, depthNorm * 1.05))
            : Math.min(0.92, Math.max(0.45, depthNorm));
          ctx.fillStyle = isLight ? d.lightColor : d.darkColor;
          const sz = isLight ? d.size * 1.35 : d.size;
          ctx.fillRect(d.screenX - sz / 2, d.screenY - sz / 2, sz, sz);

          // Specular glint on prominent debris particles for sparkling brightness in light mode
          if (isLight && sz > 2.5) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(d.screenX - sz * 0.22, d.screenY - sz * 0.22, sz * 0.44, sz * 0.44);
          }
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [size]);

  const extraX = Math.round(Math.min(300, Math.max(40, size * 0.3)));
  const extraY = Math.round(Math.min(200, Math.max(30, size * 0.2)));
  const canvasWidth = size + extraX;
  const canvasHeight = size + extraY;

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          left: -(canvasWidth - size) / 2,
          top: -(canvasHeight - size) / 2,
        }}
        className="absolute pointer-events-none z-20"
      />
      {/* Interactive circular hit target for pointer cursor feel over the orb */}
      <div
        className="absolute inset-0 rounded-full cursor-pointer pointer-events-auto z-10"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default NeuralOrb;
