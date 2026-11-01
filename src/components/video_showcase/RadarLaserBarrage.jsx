import React, { useEffect, useRef } from 'react';

/**
 * RadarLaserBarrage
 * High-density rapid-fire plasma projectile streams firing from the 3D Astro-Van's
 * radar dish to Card 1 and Card 2 in multi-bolt chevron clusters (arcade bullet-hell style).
 * 
 * Dynamic color reaction:
 * - Failure / Threat: Blazing Crimson-Red plasma bolts (#ff1744, #ff5252, #ffffff)
 * - Success / Verified: Blazing Emerald-Green plasma bolts (#00ff88, #10b981, #ffffff)
 */
export default function RadarLaserBarrage({ isCvScam, isQrPhishing }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle system state
    // Array of active bullet waves
    // Each wave has: streamId (1 or 2), progress t: 0..1, speed, colorType
    const waves = [];
    const impactSparks = []; // Sparks generated at impact
    const muzzleRings = [];  // Shockwave rings at radar dish

    let lastSpawnTime1 = 0;
    let lastSpawnTime2 = 0;
    let lastMuzzleTime = 0;

    // Cubic Bezier helper
    const getCubicPoint = (p0, p1, p2, p3, t) => {
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;
      const t2 = t * t;
      const t3 = t2 * t;

      const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
      const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;

      // Derivative for tangent vector (direction)
      const dx = 3 * mt2 * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t2 * (p3.x - p2.x);
      const dy = 3 * mt2 * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t2 * (p3.y - p2.y);

      const angle = Math.atan2(dy, dx);
      return { x, y, angle };
    };

    // Draw single glowing fiery bullet matching user's reference image
    const drawFieryBullet = (x, y, angle, colorType, scale = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const isRed = colorType === 'red';
      const mainColor = isRed ? '#FF1E42' : '#00FF88';
      const glowColor = isRed ? 'rgba(255, 30, 66, 0.75)' : 'rgba(0, 255, 136, 0.75)';
      const auraColor = isRed ? 'rgba(255, 100, 50, 0.35)' : 'rgba(0, 240, 255, 0.35)';

      // 1. Tapered Flaming Tail (Extending backward along negative X)
      const tailLength = 34 * scale;
      const tailWidth = 9 * scale;

      const tailGrad = ctx.createLinearGradient(0, 0, -tailLength, 0);
      tailGrad.addColorStop(0, mainColor);
      tailGrad.addColorStop(0.3, isRed ? '#FF5500' : '#00E5FF');
      tailGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.moveTo(3 * scale, 0);
      ctx.lineTo(0, tailWidth * 0.5);
      ctx.lineTo(-tailLength, 0);
      ctx.lineTo(0, -tailWidth * 0.5);
      ctx.closePath();
      ctx.fillStyle = tailGrad;
      ctx.fill();

      // 2. Wide Outer Plasma Bloom
      ctx.shadowColor = mainColor;
      ctx.shadowBlur = 18 * scale;

      ctx.beginPath();
      ctx.arc(0, 0, 7.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = glowColor;
      ctx.fill();

      // 3. Vibrant Saturated Colored Body Ring
      ctx.beginPath();
      ctx.arc(0, 0, 5.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = mainColor;
      ctx.fill();

      // 4. Incandescent Blazing White-Hot Core
      ctx.beginPath();
      ctx.arc(0.5 * scale, 0, 3 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 8 * scale;
      ctx.fill();

      ctx.restore();
    };

    // Spawn an impact spark explosion
    const triggerImpact = (x, y, colorType) => {
      const isRed = colorType === 'red';
      const color = isRed ? '#FF2A4D' : '#00FF88';
      const count = 12;

      for (let i = 0; i < count; i++) {
        const speed = 2 + Math.random() * 4.5;
        const ang = Math.random() * Math.PI * 2;
        impactSparks.push({
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 1.0,
          decay: 0.04 + Math.random() * 0.04,
          size: 2 + Math.random() * 2.5,
          color: Math.random() > 0.3 ? color : '#FFFFFF'
        });
      }
    };

    let lastTime = performance.now();

    const loop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Trajectory 1: Radar dish -> Card 1
      // Radar dish on 3D Astro-Van is approx at X: 33.5%, Y: 26.5%
      const startP = { x: width * 0.335, y: height * 0.265 };

      // Card 1 impact point (left edge anchor node of top card)
      const end1P = { x: width * 0.505, y: height * 0.215 };
      const cp1_1 = { x: width * 0.40, y: height * 0.24 };
      const cp1_2 = { x: width * 0.46, y: height * 0.21 };

      // Trajectory 2: Radar dish -> Card 2 (bottom card)
      const end2P = { x: width * 0.505, y: height * 0.705 };
      const cp2_1 = { x: width * 0.41, y: height * 0.38 };
      const cp2_2 = { x: width * 0.46, y: height * 0.62 };

      const color1 = isCvScam ? 'red' : 'green';
      const color2 = isQrPhishing ? 'red' : 'green';

      // 1. Spawn Muzzle Shockwaves at Radar Origin
      if (now - lastMuzzleTime > 380) {
        lastMuzzleTime = now;
        muzzleRings.push({
          x: startP.x,
          y: startP.y,
          radius: 6,
          maxRadius: 26,
          opacity: 0.85,
          color: (isCvScam || isQrPhishing) ? '#FF2A4D' : '#00FF88'
        });
      }

      // 2. Controlled, Measured Fire Spawner (Clean 3-Bolt Arrowhead Waves)
      // Slower cadence: fires rhythmically every ~380ms
      if (now - lastSpawnTime1 > 380) {
        lastSpawnTime1 = now;
        waves.push({
          stream: 1,
          t: 0,
          speed: 0.88, // Smooth, visible flight (~1.14s)
          colorType: color1
        });
      }

      if (now - lastSpawnTime2 > 380) {
        lastSpawnTime2 = now;
        waves.push({
          stream: 2,
          t: 0,
          speed: 0.84, // Smooth, visible flight (~1.19s)
          colorType: color2
        });
      }

      // 3. Render Muzzle Shockwave Rings
      for (let i = muzzleRings.length - 1; i >= 0; i--) {
        const ring = muzzleRings[i];
        ring.radius += 45 * dt;
        ring.opacity -= 1.8 * dt;

        if (ring.opacity <= 0 || ring.radius >= ring.maxRadius) {
          muzzleRings.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = Math.max(0, ring.opacity);
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Render Radar Dish Origin Energy Core
      ctx.save();
      const originColor = (isCvScam || isQrPhishing) ? '#FF1E42' : '#00FF88';
      ctx.beginPath();
      ctx.arc(startP.x, startP.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = originColor;
      ctx.shadowColor = originColor;
      ctx.shadowBlur = 22;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(startP.x, startP.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();

      // 5. Render Waves of Sleek 3-Bolt Arrowhead Formations (Leader + 2 Wings)
      const CHEVRON_OFFSETS = [
        { tOffset: 0.032, perpOffset: 0, scale: 1.2 },       // Center Blazing Leader
        { tOffset: 0.000, perpOffset: -10, scale: 0.9 },     // Left Wing Bolt
        { tOffset: 0.000, perpOffset: 10, scale: 0.9 }       // Right Wing Bolt
      ];

      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.t += wave.speed * dt;

        const isStream1 = wave.stream === 1;
        const p0 = startP;
        const p1 = isStream1 ? cp1_1 : cp2_1;
        const p2 = isStream1 ? cp1_2 : cp2_2;
        const p3 = isStream1 ? end1P : end2P;

        // Check if wave hit target
        if (wave.t >= 1.0) {
          triggerImpact(p3.x, p3.y, wave.colorType);
          waves.splice(i, 1);
          continue;
        }

        // Draw each bolt in the chevron cluster
        CHEVRON_OFFSETS.forEach(offset => {
          const boltT = wave.t + offset.tOffset;
          if (boltT > 0 && boltT < 1.0) {
            const point = getCubicPoint(p0, p1, p2, p3, boltT);

            // Calculate perpendicular normal vector
            const normX = -Math.sin(point.angle);
            const normY = Math.cos(point.angle);

            const bx = point.x + normX * offset.perpOffset;
            const by = point.y + normY * offset.perpOffset;

            drawFieryBullet(bx, by, point.angle, wave.colorType, offset.scale);
          }
        });
      }

      // 6. Render Impact Sparks & Burst Shockwaves at Target Nodes
      for (let i = impactSparks.length - 1; i >= 0; i--) {
        const spark = impactSparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.94;
        spark.vy *= 0.94;
        spark.life -= spark.decay;

        if (spark.life <= 0) {
          impactSparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = Math.max(0, spark.life);
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      // 7. Render Continuous Impact Glow on Cards
      [
        { pt: end1P, col: color1 },
        { pt: end2P, col: color2 }
      ].forEach(node => {
        const isRed = node.col === 'red';
        const color = isRed ? '#FF1E42' : '#00FF88';

        ctx.save();
        // Pulsing impact halo
        const pulse = 1.0 + Math.sin(now * 0.012) * 0.25;
        ctx.beginPath();
        ctx.arc(node.pt.x, node.pt.y, 11 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = isRed ? 'rgba(255, 30, 66, 0.35)' : 'rgba(0, 255, 136, 0.35)';
        ctx.shadowColor = color;
        ctx.shadowBlur = 25;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.pt.x, node.pt.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isCvScam, isQrPhishing]);

  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none z-30 overflow-visible">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />
    </div>
  );
}

