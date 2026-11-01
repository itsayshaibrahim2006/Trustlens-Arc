import React, { useEffect, useRef, useState } from 'react';
import { 
  Sparkles, 
  ArrowRight,
  Play,
  ChevronDown
} from 'lucide-react';
import NeuralOrb from './NeuralOrb.jsx';

const TOTAL_FRAMES = 240;

const getFrameUrl = (index) => {
  const num = String(index + 1).padStart(3, '0');
  return `/frames_hd/frame_${num}.webp`;
};

export default function HeroSection({ onEnterDashboard }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES));
  
  // Animation & Physics Tracking (Ref-based for 120 FPS / 60 FPS zero-jank scrubbing)
  const smoothProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const rafIdRef = useRef(null);
  const canvasDimRef = useRef({ width: 0, height: 0 });

  // DOM Refs for Direct Style Mutation (Zero React Re-render Overhead)
  const corridorOverlayRef = useRef(null);
  const skyCardRef = useRef(null);
  const stepperRef = useRef(null);
  const bottomWidgetRef = useRef(null);
  const bottomCaptionRef = useRef(null);
  const commandCenterOverlayRef = useRef(null);
  const flightBadgeRef = useRef(null);
  const flightPctTextRef = useRef(null);

  // Stepper Indicator Refs
  const step01LineRef = useRef(null);
  const step01TextRef = useRef(null);
  const step02TextRef = useRef(null);
  const step03TextRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  // 1. High-Performance Progressive Image Preloader
  useEffect(() => {
    let isCancelled = false;
    const images = imagesRef.current;

    // Load Frame 1 immediately for instant first paint
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      if (isCancelled) return;
      images[0] = firstImg;
      setIsReady(true);
      drawFrame(0);
      lastDrawnFrameRef.current = 0;
    };

    // Prioritize keyframes every 4th frame for instant scrub response
    const keyframes = [];
    for (let i = 4; i < TOTAL_FRAMES; i += 4) keyframes.push(i);
    const others = [];
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (!keyframes.includes(i)) others.push(i);
    }

    const queue = [...keyframes, ...others];
    let queueIdx = 0;
    const MAX_CONCURRENT = 8;
    let activeWorkers = 0;

    const pumpQueue = () => {
      if (isCancelled) return;
      while (activeWorkers < MAX_CONCURRENT && queueIdx < queue.length) {
        const frameIdx = queue[queueIdx++];
        activeWorkers++;
        const img = new Image();
        img.src = getFrameUrl(frameIdx);

        img.onload = () => {
          if (isCancelled) return;
          images[frameIdx] = img;
          activeWorkers--;
          
          // If user is currently looking at this frame or nearby, render it
          const curFrame = lastDrawnFrameRef.current;
          if (curFrame >= 0 && Math.abs(curFrame - frameIdx) <= 1) {
            drawFrame(curFrame);
          }
          pumpQueue();
        };

        img.onerror = () => {
          if (isCancelled) return;
          activeWorkers--;
          pumpQueue();
        };
      }
    };

    pumpQueue();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Retrieve closest loaded frame fallback (Zero blank canvas)
  const getLoadedImage = (index) => {
    const images = imagesRef.current;
    if (images[index]?.complete && images[index]?.naturalWidth > 0) {
      return images[index];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = images[index - offset];
      if (prev?.complete && prev?.naturalWidth > 0) return prev;
      const next = images[index + offset];
      if (next?.complete && next?.naturalWidth > 0) return next;
    }
    return (images[0]?.complete && images[0]?.naturalWidth > 0) ? images[0] : null;
  };

  // 2. High-Performance Canvas Draw (No layout thrashing)
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let { width: cW, height: cH } = canvasDimRef.current;
    if (cW === 0 || cH === 0) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cW = Math.round((window.innerWidth || 1920) * dpr);
      cH = Math.round((window.innerHeight || 1080) * dpr);
      canvas.width = cW;
      canvas.height = cH;
      canvasDimRef.current = { width: cW, height: cH };
    }

    const img = getLoadedImage(frameIndex);
    if (!img) return;

    const iW = img.naturalWidth || 1920;
    const iH = img.naturalHeight || 1080;
    const scale = Math.max(cW / iW, cH / iH);
    const sW = iW * scale;
    const sH = iH * scale;
    const sX = (cW - sW) / 2;
    const sY = (cH - sH) / 2;

    ctx.drawImage(img, sX, sY, sW, sH);
  };

  // 3. Handle Canvas Resize (Dimensions cached, getBoundingClientRect never called in RAF)
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const targetW = Math.round(w * dpr);
      const targetH = Math.round(h * dpr);

      canvas.width = targetW;
      canvas.height = targetH;
      canvasDimRef.current = { width: targetW, height: targetH };

      drawFrame(lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 4. Update Overlays Directly in DOM (Bypasses React Reconciler for Pure 60/120 FPS)
  const updateDomOverlays = (p) => {
    // A. Corridor Editorial Overlay (Visible from 0% to ~35%)
    const corridorOpacity = Math.max(0, 1 - p * 2.8);
    const corridorY = p * 40;
    if (corridorOverlayRef.current) {
      corridorOverlayRef.current.style.opacity = corridorOpacity;
      corridorOverlayRef.current.style.transform = `translateY(${corridorY}px)`;
      corridorOverlayRef.current.style.pointerEvents = corridorOpacity < 0.05 ? 'none' : 'auto';
    }
    if (skyCardRef.current) {
      skyCardRef.current.style.opacity = corridorOpacity;
      skyCardRef.current.style.transform = `translateY(${corridorY * 0.7}px)`;
      skyCardRef.current.style.pointerEvents = corridorOpacity < 0.05 ? 'none' : 'auto';
    }
    if (bottomWidgetRef.current) {
      bottomWidgetRef.current.style.opacity = corridorOpacity;
      bottomWidgetRef.current.style.transform = `translateY(${corridorY}px)`;
      bottomWidgetRef.current.style.pointerEvents = corridorOpacity < 0.05 ? 'none' : 'auto';
    }
    if (bottomCaptionRef.current) {
      bottomCaptionRef.current.style.opacity = corridorOpacity;
      bottomCaptionRef.current.style.transform = `translateY(${corridorY}px)`;
    }

    // B. Stepper (01, 02, 03)
    if (step01TextRef.current && step02TextRef.current && step03TextRef.current) {
      if (p < 0.35) {
        step01TextRef.current.className = 'text-white font-bold';
        step02TextRef.current.className = 'text-slate-500 hover:text-slate-300 transition-colors';
        step03TextRef.current.className = 'text-slate-600 hover:text-slate-400 transition-colors';
      } else if (p < 0.70) {
        step01TextRef.current.className = 'text-slate-500 hover:text-slate-300 transition-colors';
        step02TextRef.current.className = 'text-white font-bold';
        step03TextRef.current.className = 'text-slate-600 hover:text-slate-400 transition-colors';
      } else {
        step01TextRef.current.className = 'text-slate-600 hover:text-slate-400 transition-colors';
        step02TextRef.current.className = 'text-slate-500 hover:text-slate-300 transition-colors';
        step03TextRef.current.className = 'text-white font-bold';
      }
    }

    // C. Command Center Overlay (Reveals from 70% to 100%)
    const commandOpacity = Math.min(1, Math.max(0, (p - 0.72) * 3.57));
    const commandY = (1 - commandOpacity) * 30;
    if (commandCenterOverlayRef.current) {
      commandCenterOverlayRef.current.style.opacity = commandOpacity;
      commandCenterOverlayRef.current.style.transform = `translateY(${commandY}px)`;
      commandCenterOverlayRef.current.style.pointerEvents = commandOpacity > 0.4 ? 'auto' : 'none';
    }

    // D. Flight Badge Indicator
    if (flightBadgeRef.current && flightPctTextRef.current) {
      if (p > 0.05 && p < 0.95) {
        flightBadgeRef.current.style.opacity = '1';
        flightBadgeRef.current.style.pointerEvents = 'auto';
        flightPctTextRef.current.innerText = `Entering: ${Math.round(p * 100)}%`;
      } else {
        flightBadgeRef.current.style.opacity = '0';
        flightBadgeRef.current.style.pointerEvents = 'none';
      }
    }
  };

  // 5. Native Smooth Scroll Tracker (Passive, zero-interception, butter-smooth native physics)
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      if (scrollableDist <= 0) return;

      const raw = -rect.top / scrollableDist;
      targetProgressRef.current = Math.max(0, Math.min(1, raw));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 6. Continuous Lerp (Linear Interpolation) Render Loop
  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;

      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const diff = target - current;

      // Silky smooth momentum dampening (0.16 = instantaneous yet buttery responsiveness)
      if (Math.abs(diff) > 0.0001) {
        smoothProgressRef.current += diff * 0.16;
      } else {
        smoothProgressRef.current = target;
      }

      const p = smoothProgressRef.current;
      const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(p * (TOTAL_FRAMES - 1))));

      // Only invoke canvas draw if frame index changed
      if (frameIdx !== lastDrawnFrameRef.current) {
        drawFrame(frameIdx);
        lastDrawnFrameRef.current = frameIdx;
      }

      // Fast direct style updates
      updateDomOverlays(p);

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Trigger flight sequence smoothly by native scroll
  const handleStartFlight = () => {
    const container = containerRef.current;
    if (!container) return;
    const targetY = container.offsetTop + (container.offsetHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleStartJourney = () => {
    if (onEnterDashboard) {
      onEnterDashboard();
    } else {
      const target = document.getElementById('deepfakes-section') || document.getElementById('scanbay-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="overview-section"
      ref={containerRef} 
      className="relative w-full h-[250vh] bg-[#070B13]"
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-[#070B13]">
        
        {/* Full-Screen Canvas Viewport */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Atmospheric Vignette & Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B13]/85 via-transparent to-[#070B13]/90 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#070B13_100%)] pointer-events-none z-10 opacity-70" />

        {/* =========================================================================
            LEFT-ALIGNED EDITORIAL HERO BLOCK (Corridor View: Frames 0 to ~80)
            ========================================================================= */}
        <div 
          ref={corridorOverlayRef}
          className="absolute top-[22%] sm:top-[25%] left-6 sm:left-12 lg:left-20 z-20 max-w-xl lg:max-w-2xl pointer-events-auto transition-transform will-change-transform"
        >
          {/* Eyebrow: Dash line + uppercase tracking */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-mono text-cyan-300/80">
            <span className="w-8 sm:w-12 h-[1px] bg-cyan-400/60 inline-block" />
            <span>A New Era of Autonomous Forensics</span>
          </div>

          {/* High-Contrast Editorial Serif Headline */}
          <h1 className="font-editorial text-5xl sm:text-7xl lg:text-[80px] text-white font-normal tracking-tight leading-[1.04] mb-5 sm:mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
            Verify the Truth.<br />
            <span className="italic font-light bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              At Machine Speed.
            </span>
          </h1>

          {/* Concise Supporting Description */}
          <p className="text-slate-300 text-xs sm:text-sm lg:text-base font-light leading-relaxed max-w-lg mb-8 drop-shadow-md">
            Autonomous threat forensics engine decoding advance-fee employment scams, synthetic voice wires, and infrastructure spoofing before payload execution.
          </p>

          {/* Action Button Row: White Primary Pill + Glass Circle Play Button */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={handleStartJourney}
              className="px-7 py-3 rounded-full bg-white hover:bg-cyan-100 text-slate-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-cyan-400/40 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div 
              onClick={handleStartFlight}
              className="group flex items-center gap-3 text-white text-xs font-mono cursor-pointer transition-colors hover:text-cyan-300 active:scale-95"
            >
              <div className="w-9 h-9 rounded-full bg-slate-900/70 border border-white/20 group-hover:border-cyan-400/60 flex items-center justify-center backdrop-blur-md shadow-md transition-all">
                <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5 group-hover:fill-cyan-300 group-hover:text-cyan-300 transition-colors" />
              </div>
              <span className="font-medium tracking-wide">Enter Flight Sequence</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TOP-RIGHT FLOATING GLASS CARD (Preview of Cyber Command Core)
            ========================================================================= */}
        <div 
          ref={skyCardRef}
          onClick={handleStartFlight}
          className="hidden md:flex absolute top-28 right-8 sm:right-16 z-20 p-2.5 pr-4 rounded-2xl bg-slate-950/40 border border-white/15 backdrop-blur-xl shadow-2xl items-center gap-3 max-w-xs transition-all hover:border-cyan-400/40 cursor-pointer group pointer-events-auto will-change-transform"
        >
          <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-cyan-400/30 bg-slate-900 shrink-0">
            <img 
              src="/cyber_command_center_4k.png" 
              alt="Command Center Preview" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="text-left font-sans">
            <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
              Cyber Command Core
            </span>
            <span className="text-[10px] text-cyan-300/80 font-mono block">
              A new security era awaits →
            </span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT VERTICAL STEPPER / PAGINATION (01, 02, 03)
            ========================================================================= */}
        <div 
          ref={stepperRef}
          className="hidden lg:flex absolute right-8 sm:right-12 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-5 text-xs font-mono select-none pointer-events-none transition-opacity duration-300"
        >
          <div className="flex flex-col items-center gap-1.5">
            <span ref={step01TextRef} className="text-white font-bold">01</span>
            <div ref={step01LineRef} className="w-[1.5px] h-8 bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
          </div>
          <span ref={step02TextRef} className="text-slate-500 hover:text-slate-300 transition-colors">02</span>
          <span ref={step03TextRef} className="text-slate-600 hover:text-slate-400 transition-colors">03</span>
        </div>

        {/* =========================================================================
            BOTTOM-LEFT FLOATING MICRO-WIDGET
            ========================================================================= */}
        <div 
          ref={bottomWidgetRef}
          className="hidden sm:flex absolute bottom-8 sm:bottom-10 left-6 sm:left-12 lg:left-20 z-20 items-center gap-3.5 max-w-md pointer-events-auto will-change-transform"
        >
          <div className="w-10 h-10 rounded-full border border-cyan-400/40 bg-slate-900/80 p-1 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <img 
              src="/trustlens_mark_transparent.png" 
              alt="Emblem" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="font-sans">
            <span className="text-xs font-bold text-white block">
              Explore Autonomous Verification
            </span>
            <span className="text-[11px] text-slate-300/80 font-light leading-tight block">
              From deepfake voice clones to advance-fee PDFs, your defense is one click away.
            </span>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM-RIGHT MICRO CAPTION
            ========================================================================= */}
        <div 
          ref={bottomCaptionRef}
          className="hidden md:flex absolute bottom-8 sm:bottom-10 right-6 sm:right-12 lg:right-20 z-20 items-center gap-3 text-xs text-slate-400 font-light select-none pointer-events-none will-change-transform"
        >
          <span className="w-6 h-[1px] bg-slate-600" />
          <span>More than security — <span className="text-slate-200 italic font-editorial text-sm">it&apos;s mathematical truth.</span></span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400/70" />
        </div>

        {/* =========================================================================
            COMMAND ROOM ARRIVAL OVERLAY (Reveals cleanly when flight reaches 100%)
            Pure Cinematic 3D Neural Art Orb Centerpiece (All text removed per instruction)
            ========================================================================= */}
        <div 
          ref={commandCenterOverlayRef}
          className="absolute inset-0 z-20 flex items-center justify-center p-4 will-change-transform pointer-events-none select-none"
          style={{ opacity: 0 }}
        >
          {/* Big Interactive 3D Neural Art Orb with Multi-Layer Volumetric Glow */}
          <div className="relative flex items-center justify-center pointer-events-auto transform scale-100 sm:scale-105 lg:scale-115 transition-transform">
            {/* Multi-layered radial ambient glow backdrop in Electric Cyan, Pure White & Cosmic Obsidian */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/35 via-blue-600/25 to-cyan-300/20 rounded-full blur-[110px] transform scale-125 pointer-events-none" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-[160px] transform scale-150 pointer-events-none" />
            
            {/* Big 3D Neural Orb Component */}
            <NeuralOrb size={560} className="relative z-20 drop-shadow-[0_0_80px_rgba(0,240,255,0.65)]" />
          </div>
        </div>

        {/* Live Sequence Progress Indicator Pill during flight */}
        <div 
          ref={flightBadgeRef}
          className="absolute right-6 bottom-8 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs shadow-lg backdrop-blur-md transition-opacity duration-300 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span ref={flightPctTextRef}>Entering: 0%</span>
        </div>

      </div>
    </section>
  );
}
