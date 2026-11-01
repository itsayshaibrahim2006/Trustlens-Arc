import React, { useEffect, useRef } from 'react';

export const NeuralOrb = ({ size = 580, className = '' }) => {
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
    const extraX = Math.round(Math.min(360, Math.max(50, size * 0.32)));
    const extraY = Math.round(Math.min(260, Math.max(40, size * 0.22)));
    const canvasWidth = size + extraX;
    const canvasHeight = size + extraY;
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // Bigger orb radius for commanding, cinematic presence
    const baseRadius = size * 0.395;

    // Dense node count (380 nodes)
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

      // Color distribution:
      // Type 0: Radiant Cyber Violet / Magenta (~35%)
      // Type 1: Hyper-Luminous Electric Cyan / Aqua (~35%)
      // Type 2: Radiant Solar Gold / Amber Highlight (~30%)
      const rand = Math.random();
      const colorType = rand < 0.35 ? 0 : (rand < 0.70 ? 1 : 2);

      points.push({
        x,
        y,
        z,
        phase: Math.random() * Math.PI * 2,
        colorType,
        currentScale: 1.0,
        targetScale: 1.0,
        baseRadius: (size / 380) * (2.8 + (colorType === 2 ? 0.7 : 0.2) + Math.random() * 0.6),
      });
    }

    // Pre-calculate nearest neighbors for fine geodesic triangulation mesh
    const neighbors = [];
    const maxNeighborDist = 0.22;
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

    // Saturn-like Asteroid Ring System with Wide Natural Flow (750 particles)
    const numDebris = 750;
    const debris = [];
    const debrisColorPairs = [
      { dark: '#c084fc', light: '#9333ea' }, // Vivid royal violet
      { dark: '#e879f9', light: '#c026d3' }, // Radiant neon fuchsia
      { dark: '#38bdf8', light: '#0284c7' }, // Electric sky cyan
      { dark: '#00f0ff', light: '#0891b2' }, // Hyper neon cyan
      { dark: '#fde047', light: '#d97706' }, // Blazing gold amber
      { dark: '#ffffff', light: '#38bdf8' }, // Incandescent white diamond
      { dark: '#f43f5e', light: '#e11d48' }, // Vivid ruby laser
      { dark: '#2dd4bf', light: '#0d9488' }, // Vivid seafoam teal
    ];

    for (let i = 0; i < numDebris; i++) {
      const randR = Math.random();
      let rDist;
      // Realistic Saturn Ring Banding Structure:
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
        verticalOffset: (Math.random() - 0.5) * 0.042 * (1.2 / rDist),
        radialJitter: (Math.random() - 0.5) * 0.025,
        size: (size / 380) * (Math.random() > 0.90 ? 3.8 : (Math.random() > 0.45 ? 2.5 : 1.5)),
        darkColor: colPair.dark,
        lightColor: colPair.light,
      });
    }

    // Classic tilted Saturn ring inclination angles
    const beltTiltZ = -0.42; // ~24 degrees tilt
    const beltTiltX = 0.46;  // ~26 degrees tilt

    // Single wave impulse state
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

      const dx = x - cx;
      const dy = y - cy;
      const distToCenter = Math.sqrt(dx * dx + dy * dy);

      if (distToCenter <= baseRadius * 1.30) {
        mouseX = x;
        mouseY = y;
        isHovering = true;

        const moveDx = mouseX - lastTriggerX;
        const moveDy = mouseY - lastTriggerY;
        const moveDist = Math.sqrt(moveDx * moveDx + moveDy * moveDy);

        if (!wasHovering || moveDist > 8) {
          triggerSingleWave(mouseX, mouseY);
        }

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

    const handleWindowMouseMove = (e) => updatePointer(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
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
      if (Math.sqrt(dx * dx + dy * dy) <= baseRadius * 1.30) {
        triggerSingleWave(x, y);
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleGlobalClick);

    const render = () => {
      time += 0.020;

      // Smooth lerp towards parallax tilt
      angleY += (targetAngleY - angleY) * 0.08;
      angleX += (targetAngleX - angleX) * 0.08;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const fov = 440;

      // Slow, deep sinusoidal breathing cycle (~5.5s)
      const breatheFactor = 1 + 0.038 * Math.sin(time * 1.05);
      const currentSphereRadius = baseRadius * breatheFactor;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const projected = new Array(points.length);
      const hoverRadius = size * 0.28;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        const px = p.x * currentSphereRadius;
        const py = p.y * currentSphereRadius;
        const pz = p.z * currentSphereRadius;

        const x1 = px * cosY - pz * sinY;
        const z1 = pz * cosY + px * sinY;
        const y1 = py * cosX - z1 * sinX;
        const z2 = z1 * cosX + py * sinX;

        const safeZ = Math.max(-fov + 10, z2);
        const scale = fov / (fov + safeZ);
        const screenX = cx + x1 * scale;
        const screenY = cy + y1 * scale;

        let targetScale = 1.0;
        let directScale = 0;

        if (isHovering) {
          const dx = screenX - mouseX;
          const dy = screenY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const frontFactor = z2 > 0 ? 1.0 : Math.max(0.40, (z2 + currentSphereRadius) / currentSphereRadius);

          if (dist < hoverRadius) {
            const normDist = 1 - (dist / hoverRadius);
            const smooth = normDist * normDist * (3 - 2 * normDist);
            directScale = smooth * 1.95 * frontFactor;
          }
        }

        let waveScale = 0;
        if (isWaveActive) {
          const elapsed = time - waveStartTime;
          const waveSpeedPx = size * 0.52;
          const waveRadius = elapsed * waveSpeedPx;
          const waveWidth = size * 0.22;

          const dx = screenX - waveOriginX;
          const dy = screenY - waveOriginY;
          const distFromWaveOrigin = Math.sqrt(dx * dx + dy * dy);
          const distFromCrest = Math.abs(distFromWaveOrigin - waveRadius);

          if (distFromCrest < waveWidth) {
            const norm = distFromCrest / waveWidth;
            const bell = Math.cos(norm * (Math.PI / 2));
            const wavePulse = Math.pow(bell, 1.8);
            const frontFactor = z2 > 0 ? 1.0 : Math.max(0.45, (z2 + currentSphereRadius) / currentSphereRadius);
            waveScale = wavePulse * 1.65 * frontFactor;
          }
        }

        targetScale = 1.0 + directScale + waveScale;
        p.currentScale += (targetScale - p.currentScale) * 0.22;

        const nodePulse = 1 + 0.038 * Math.sin(time * 1.3 + p.phase);
        const safeScale = Math.max(0.1, scale);
        const finalRadius = Math.max(1.5, p.baseRadius * safeScale * p.currentScale * nodePulse);

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

      if (isWaveActive) {
        const elapsed = time - waveStartTime;
        const waveSpeedPx = size * 0.52;
        const waveRadius = elapsed * waveSpeedPx;
        if (waveRadius > size * 1.4) {
          isWaveActive = false;
        }
      }

      // 3. Update & project Saturn Asteroid Belt particles
      const projectedDebris = new Array(debris.length);
      const cosBeltZ = Math.cos(beltTiltZ);
      const sinBeltZ = Math.sin(beltTiltZ);
      const cosBeltX = Math.cos(beltTiltX);
      const sinBeltX = Math.sin(beltTiltX);

      for (let i = 0; i < debris.length; i++) {
        const d = debris[i];
        d.angle += d.speed;
        const rOrbit = currentSphereRadius * (d.orbitRadius + d.radialJitter);
        const lx = Math.cos(d.angle) * rOrbit;
        const lz = Math.sin(d.angle) * rOrbit;
        const ly = d.verticalOffset * currentSphereRadius;

        const bx1 = lx * cosBeltZ - ly * sinBeltZ;
        const by1 = ly * cosBeltZ + lx * sinBeltZ;
        const by2 = by1 * cosBeltX - lz * sinBeltX;
        const bz2 = lz * cosBeltX + by1 * sinBeltX;

        const vx1 = bx1 * cosY - bz2 * sinY;
        const vz1 = bz2 * cosY + bx1 * sinY;
        const vy1 = by2 * cosX - vz1 * sinX;
        const vz2 = vz1 * cosX + by2 * sinX;

        const safeDkZ = Math.max(-fov + 10, vz2);
        const dScale = fov / (fov + safeDkZ);
        const dx = cx + vx1 * dScale;
        const dy = cy + vy1 * dScale;
        const dSize = Math.max(0.5, d.size * dScale);

        projectedDebris[i] = {
          screenX: dx,
          screenY: dy,
          z: vz2,
          size: dSize,
          darkColor: d.darkColor,
          lightColor: d.lightColor,
        };
      }

      // 4. Draw back-layer debris particles (behind orb: z < 0) - Highly visible electric hues
      for (let i = 0; i < projectedDebris.length; i++) {
        const d = projectedDebris[i];
        if (d.z < 0) {
          const depthNorm = (d.z + currentSphereRadius * 1.8) / (currentSphereRadius * 2.5);
          ctx.globalAlpha = Math.max(0.35, Math.min(0.85, depthNorm * 0.95));
          ctx.fillStyle = d.darkColor;
          ctx.fillRect(d.screenX - d.size / 2, d.screenY - d.size / 2, d.size, d.size);
        }
      }
      ctx.globalAlpha = 1;

      // 5. Draw luminous geodesic mesh connecting lines
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
          const alpha = Math.max(0.18, Math.min(0.85, depthNorm * 0.85));
          const hoverBoost = Math.max(p1.currentScale, p2.currentScale);

          if (hoverBoost > 1.2) {
            ctx.lineWidth = 1.1 + (hoverBoost - 1) * 0.8;
            ctx.strokeStyle = `rgba(240, 171, 252, ${Math.min(0.95, alpha * 2.0)})`; // Electric magenta flare
          } else {
            ctx.lineWidth = 0.85;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`; // Crisp luminous cyan
          }
          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(p2.screenX, p2.screenY);
          ctx.stroke();
        }
      }

      // 6. Draw 3D nodes sorted back-to-front with High-Visibility Electric Palette
      const sortedNodeIndices = projected
        .map((_, i) => i)
        .sort((a, b) => projected[a].z - projected[b].z);

      for (let k = 0; k < sortedNodeIndices.length; k++) {
        const idx = sortedNodeIndices[k];
        const pt = projected[idx];
        const r = Math.max(0.2, pt.radius);

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
          // Color 2: Solar Gold & Incandescent Amber (~30%)
          // Extreme contrast against dark blue room!
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.20, '#FEF08A'); // bright starlight yellow
          grad.addColorStop(0.55, '#FACC15'); // rich cyber gold
          grad.addColorStop(0.85, '#F59E0B'); // radiant amber
          grad.addColorStop(1, '#B45309');    // warm bronze edge
          ctx.globalAlpha = pt.z > 0 ? 1 : Math.max(0.50, (pt.z + currentSphereRadius) / currentSphereRadius + 0.4);
        } else if (pt.colorType === 1) {
          // Color 1: Hyper-Luminous Electric Cyan & Aqua (~35%)
          // Signature neon cyan that shines brilliantly on dark background
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.18, '#A5F3FC'); // crystal white-cyan
          grad.addColorStop(0.48, '#00F0FF'); // blazing electric cyan
          grad.addColorStop(0.80, '#0284C7'); // deep ocean azure
          grad.addColorStop(1, '#0369A1');    // deep edge
          ctx.globalAlpha = pt.z > 0 ? 1 : Math.max(0.45, (pt.z + currentSphereRadius) / currentSphereRadius + 0.35);
        } else {
          // Color 0: Radiant Cyber Violet & Fuchsia (~35%)
          // Vivid purple that adds deep dimensional contrast without turning black!
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.22, '#F0ABFC'); // neon lilac
          grad.addColorStop(0.58, '#C084FC'); // radiant violet
          grad.addColorStop(0.85, '#9333EA'); // electric purple
          grad.addColorStop(1, '#6B21A8');    // royal indigo edge
          ctx.globalAlpha = pt.z > 0 ? 1 : Math.max(0.45, (pt.z + currentSphereRadius) / currentSphereRadius + 0.35);
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, r, 0, Math.PI * 2);
        ctx.fill();

        // Extra specular glint on front-facing highlighted/magnified nodes
        if (pt.currentScale > 1.2 && pt.z > -10) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(pt.screenX - glintOffsetX, pt.screenY - glintOffsetY, Math.max(0.1, r * 0.25), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 7. Draw front-layer debris particles (in front of orb: z >= 0)
      for (let i = 0; i < projectedDebris.length; i++) {
        const d = projectedDebris[i];
        if (d.z >= 0) {
          const depthNorm = (d.z + currentSphereRadius * 0.5) / (currentSphereRadius * 1.5);
          ctx.globalAlpha = Math.min(1.0, Math.max(0.80, depthNorm * 1.15));
          ctx.fillStyle = d.darkColor;
          const sz = Math.max(0.8, d.size * 1.30);
          ctx.fillRect(d.screenX - sz / 2, d.screenY - sz / 2, sz, sz);

          // Specular sparkle on prominent particles
          if (sz > 2.2) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(d.screenX - sz * 0.2, d.screenY - sz * 0.2, sz * 0.4, sz * 0.4);
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

  const extraX = Math.round(Math.min(360, Math.max(50, size * 0.32)));
  const extraY = Math.round(Math.min(260, Math.max(40, size * 0.22)));
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
