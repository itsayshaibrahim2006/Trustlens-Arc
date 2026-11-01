import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Shield, 
  ChevronDown, 
  Sparkles, 
  ArrowRight,
  Play,
  ArrowUpRight,
  ExternalLink,
  Lock,
  Activity
} from 'lucide-react';

const TOTAL_FRAMES = 240;
const ANIMATION_DURATION_MS = 4800;

const getFrameUrl = (index) => {
  const num = String(index + 1).padStart(3, '0');
  return `/frames_hd/frame_${num}.webp`;
};

export default function HeroSection({ onEnterDashboard }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES));
  const currentFrameRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const stateRef = useRef('corridor'); // 'corridor' | 'animating' | 'command_center'
  const animFrameIdRef = useRef(null);
  const touchStartYRef = useRef(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0); // 0.0 to 1.0

  // 1. Progressive Image Preloader for all 240 frames
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const images = imagesRef.current;

    // Load Frame 1 immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      if (isCancelled) return;
      images[0] = firstImg;
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      setIsReady(true);
      drawFrame(0);
    };

    // Load keyframes every 8th frame first for rapid scrub availability
    const keyframes = [];
    for (let i = 7; i < TOTAL_FRAMES; i += 8) keyframes.push(i);
    const others = [];
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (!keyframes.includes(i)) others.push(i);
    }

    const queue = [...keyframes, ...others];
    let queueIdx = 0;
    const MAX_CONCURRENT = 6;
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
          loadedCount++;
          activeWorkers--;
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

          const cur = currentFrameRef.current;
          if (Math.abs(cur - frameIdx) <= 2) {
            drawFrame(cur);
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

  const getLoadedImage = (index) => {
    const images = imagesRef.current;
    if (images[index] && images[index].complete && images[index].naturalWidth > 0) {
      return images[index];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = images[index - offset];
      if (prev && prev.complete && prev.naturalWidth > 0) return prev;
      const next = images[index + offset];
      if (next && next.complete && next.naturalWidth > 0) return next;
    }
    return images[0] || null;
  };

  // 2. High-DPI Canvas Rendering with Sub-Frame Cross-Dissolve
  const drawFrame = (frameFloat) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const cW = canvas.width;
    const cH = canvas.height;

    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameFloat));
    const floorIdx = Math.floor(clamped);
    const ceilIdx = Math.min(floorIdx + 1, TOTAL_FRAMES - 1);
    const fraction = clamped - floorIdx;

    const imgFloor = getLoadedImage(floorIdx);
    if (!imgFloor) return;

    // Cover math
    const iW = imgFloor.naturalWidth;
    const iH = imgFloor.naturalHeight;
    const scale = Math.max(cW / iW, cH / iH);
    const sW = iW * scale;
    const sH = iH * scale;
    const sX = (cW - sW) / 2;
    const sY = (cH - sH) / 2;

    // Draw floor frame
    ctx.globalAlpha = 1.0;
    ctx.drawImage(imgFloor, sX, sY, sW, sH);

    // Sub-frame optical cross-fade
    if (fraction > 0.005) {
      const imgCeil = getLoadedImage(ceilIdx);
      if (imgCeil && imgCeil !== imgFloor) {
        ctx.globalAlpha = fraction;
        ctx.drawImage(imgCeil, sX, sY, sW, sH);
        ctx.globalAlpha = 1.0;
      }
    }
  };

  // 3. Cinematic Camera Push: Smooth Slow Start, Steady Glide, and Gentle Slow Ending
  const playForwardTransition = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    stateRef.current = 'animating';

    const startFrame = currentFrameRef.current;
    const targetFrame = TOTAL_FRAMES - 1;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / ANIMATION_DURATION_MS, 1);

      // Symmetrical Cosine Ease-In-Out
      const easeT = 0.5 * (1.0 - Math.cos(Math.PI * t));

      const current = startFrame + (targetFrame - startFrame) * easeT;
      currentFrameRef.current = current;
      setSequenceProgress(easeT);
      drawFrame(current);

      if (t < 1) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
        stateRef.current = 'command_center';
        setSequenceProgress(1);
        drawFrame(targetFrame);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  }, []);

  // Smooth Reverse Transition back to Corridor
  const playReverseTransition = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    stateRef.current = 'animating';

    const startFrame = currentFrameRef.current;
    const targetFrame = 0;
    const startTime = performance.now();
    const duration = 3500;

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);

      const easeT = 0.5 * (1.0 - Math.cos(Math.PI * t));

      const current = startFrame + (targetFrame - startFrame) * easeT;
      currentFrameRef.current = current;
      setSequenceProgress(1 - easeT);
      drawFrame(current);

      if (t < 1) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
        stateRef.current = 'corridor';
        setSequenceProgress(0);
        drawFrame(0);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  }, []);

  // 4. Intercept Single Scroll to trigger the sequence
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      // If at corridor (top), a single scroll down triggers the sequence
      if (stateRef.current === 'corridor' && e.deltaY > 5) {
        e.preventDefault();
        playForwardTransition();
      } 
      // If at command center and scrolling up into the hero, trigger reverse
      else if (stateRef.current === 'command_center' && e.deltaY < -15 && window.scrollY <= 10) {
        e.preventDefault();
        playReverseTransition();
      }
    };

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;

      if (stateRef.current === 'corridor' && deltaY > 20) {
        e.preventDefault();
        playForwardTransition();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [playForwardTransition, playReverseTransition]);

  useEffect(() => {
    const handleResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToApp = () => {
    if (onEnterDashboard) {
      onEnterDashboard();
    } else {
      const target = document.getElementById('robot-sentinel-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  // Text fades out smoothly over the first 35% of the movement
  const bottomTextOpacity = Math.max(0, 1 - sequenceProgress * 2.8);
  const bottomTextTranslateY = sequenceProgress * 40;

  // Arrival status cue appears at the end when sequence reaches 85% to 100%
  const arrivalCueOpacity = Math.min(1, Math.max(0, (sequenceProgress - 0.85) * 6.6));

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full bg-[#070B13] overflow-hidden select-none"
    >
      {/* Full-Screen Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Atmospheric Vignette & Contrast Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070B13]/85 via-transparent to-[#070B13]/90 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#070B13_100%)] pointer-events-none z-10 opacity-70" />

      {/* =========================================================================
          TOP FLOATING NAVBAR (Inspired by Reference: Brand Left | Center Nav | Right CTA)
          ========================================================================= */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
        
        {/* Brand Left: Glowing Lens Logo + Typography */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative w-9 h-9 rounded-xl bg-slate-900/80 border border-cyan-400/30 flex items-center justify-center backdrop-blur-md shadow-lg shadow-cyan-500/15 overflow-hidden p-0.5 group-hover:border-cyan-400/60 transition-all">
            <img 
              src="/trustlens_mark_transparent.png" 
              alt="TrustLens Arc Logo" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-transform" 
            />
          </div>
          <span className="font-editorial text-lg tracking-[0.2em] uppercase text-white font-semibold">
            TrustLens <span className="text-cyan-400 font-bold">Arc</span>
          </span>
        </div>

        {/* Center Floating Navigation Links (with active indicator dot) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-sans tracking-wide text-slate-300">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="text-white font-medium hover:text-cyan-300 transition-colors flex flex-col items-center"
          >
            <span>Overview</span>
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1 shadow-[0_0_6px_#00F0FF]"></span>
          </button>
          <button 
            onClick={() => scrollToSection('robot-sentinel-section')} 
            className="hover:text-cyan-300 transition-colors"
          >
            Sentinel Hub
          </button>
          <button 
            onClick={() => scrollToSection('logo-carousel-section')} 
            className="hover:text-cyan-300 transition-colors"
          >
            Ecosystem
          </button>
          <button 
            onClick={() => scrollToSection('bento-grid-section')} 
            className="hover:text-cyan-300 transition-colors"
          >
            Bento Intel
          </button>
          <button 
            onClick={() => scrollToSection('forensics-lab-section')} 
            className="hover:text-cyan-300 transition-colors"
          >
            Forensics Lab
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/60 border border-slate-700/60 backdrop-blur-md text-cyan-400 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          </div>

          <button
            onClick={scrollToApp}
            className="px-5 py-2 rounded-full bg-white/95 hover:bg-cyan-100 text-slate-950 text-xs font-semibold tracking-wide shadow-lg shadow-white/10 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          LEFT-ALIGNED EDITORIAL HERO BLOCK (Exact Match to Reference Layout)
          ========================================================================= */}
      <div 
        className="absolute top-[24%] sm:top-[26%] left-6 sm:left-12 lg:left-20 z-20 max-w-xl lg:max-w-2xl transition-all duration-500 pointer-events-auto"
        style={{
          opacity: bottomTextOpacity,
          transform: `translateY(${bottomTextTranslateY}px)`,
          pointerEvents: bottomTextOpacity < 0.1 ? 'none' : 'auto'
        }}
      >
        {/* Eyebrow: Dash line + uppercase tracking */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-mono text-cyan-300/80">
          <span className="w-8 sm:w-12 h-[1px] bg-cyan-400/60 inline-block"></span>
          <span>A New Era of Autonomous Forensics</span>
        </div>

        {/* High-Contrast Editorial Serif Headline: Dream Bigger. Explore Further. */}
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
            onClick={scrollToApp}
            className="px-7 py-3 rounded-full bg-white hover:bg-cyan-100 text-slate-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center gap-2 active:scale-95"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div 
            onClick={playForwardTransition}
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
          TOP-RIGHT FLOATING GLASS CARD (Like 'Sky City' Card in Reference)
          ========================================================================= */}
      <div 
        onClick={playForwardTransition}
        className="hidden md:flex absolute top-28 right-8 sm:right-16 z-20 p-2.5 pr-4 rounded-2xl bg-slate-950/40 border border-white/15 backdrop-blur-xl shadow-2xl items-center gap-3 max-w-xs transition-all hover:border-cyan-400/40 cursor-pointer group pointer-events-auto"
        style={{
          opacity: bottomTextOpacity,
          transform: `translateY(${bottomTextTranslateY * 0.7}px)`,
          pointerEvents: bottomTextOpacity < 0.1 ? 'none' : 'auto'
        }}
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
          RIGHT VERTICAL STEPPER / PAGINATION (01, 02, 03 in Reference)
          ========================================================================= */}
      <div 
        className="hidden lg:flex absolute right-8 sm:right-12 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-5 text-xs font-mono select-none pointer-events-none transition-opacity duration-300"
        style={{ opacity: Math.max(0.2, bottomTextOpacity) }}
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-white font-bold">01</span>
          <div className="w-[1.5px] h-8 bg-cyan-400 shadow-[0_0_8px_#00F0FF]"></div>
        </div>
        <span className="text-slate-500 hover:text-slate-300 transition-colors">02</span>
        <span className="text-slate-600 hover:text-slate-400 transition-colors">03</span>
      </div>

      {/* =========================================================================
          BOTTOM-LEFT FLOATING MICRO-WIDGET (Like 'Explore New Realms' in Reference)
          ========================================================================= */}
      <div 
        className="hidden sm:flex absolute bottom-8 sm:bottom-10 left-6 sm:left-12 lg:left-20 z-20 items-center gap-3.5 max-w-md transition-all duration-300 pointer-events-auto"
        style={{
          opacity: bottomTextOpacity,
          transform: `translateY(${bottomTextTranslateY}px)`,
          pointerEvents: bottomTextOpacity < 0.1 ? 'none' : 'auto'
        }}
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
          BOTTOM-RIGHT MICRO CAPTION (Like 'More than a destination' in Reference)
          ========================================================================= */}
      <div 
        className="hidden md:flex absolute bottom-8 sm:bottom-10 right-6 sm:right-12 lg:right-20 z-20 items-center gap-3 text-xs text-slate-400 font-light transition-all duration-300 select-none pointer-events-none"
        style={{
          opacity: bottomTextOpacity,
          transform: `translateY(${bottomTextTranslateY}px)`
        }}
      >
        <span className="w-6 h-[1px] bg-slate-600"></span>
        <span>More than security — <span className="text-slate-200 italic font-editorial text-sm">it&apos;s mathematical truth.</span></span>
        <Sparkles className="w-3.5 h-3.5 text-cyan-400/70" />
      </div>

      {/* =========================================================================
          COMMAND ROOM ARRIVAL OVERLAY (Reveals when flight reaches 100%)
          ========================================================================= */}
      <div 
        className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-10 sm:pb-14 px-6 text-center transition-all duration-700 pointer-events-auto"
        style={{
          opacity: arrivalCueOpacity,
          transform: `translateY(${(1 - arrivalCueOpacity) * 25}px)`,
          pointerEvents: arrivalCueOpacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Status Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono backdrop-blur-xl shadow-lg shadow-cyan-950/60 mb-3.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold tracking-wider uppercase text-[11px]">
              Command Center Online • All Sensors Active
            </span>
            <span className="text-cyan-700">|</span>
            <span className="text-slate-400 text-[10px]">Zero Latency Stream</span>
          </div>

          {/* Dramatic Command Center Editorial Headline */}
          <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-white tracking-tight leading-[1.08] mb-3 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            Autonomous Threat Intel.<br />
            <span className="italic font-light bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Every Vector Under Watch.
            </span>
          </h2>

          {/* Forensic Mission Brief */}
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-5 drop-shadow-md">
            Multi-modal verification engines continuously scanning biometric voice streams, synthetic PDF contracts, and quarantined quishing URLs. Threat readiness at 99.8%.
          </p>

          {/* Telemetry Micro-Stat Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-6 text-xs font-mono">
            <div className="px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 backdrop-blur-md text-slate-200 flex items-center gap-2 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-slate-400 uppercase text-[10px]">Latency:</span>
              <span className="text-cyan-300 font-bold">42 ms</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 backdrop-blur-md text-slate-200 flex items-center gap-2 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400 uppercase text-[10px]">Defense Vectors:</span>
              <span className="text-emerald-300 font-bold">5 Active</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 backdrop-blur-md text-slate-200 flex items-center gap-2 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span className="text-slate-400 uppercase text-[10px]">Global Feeds:</span>
              <span className="text-blue-300 font-bold">12 Connected</span>
            </div>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToApp}
              className="group px-7 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Explore Sentinel Hub</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('forensics-lab-section')}
              className="px-6 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-white font-semibold text-xs tracking-wider uppercase backdrop-blur-md transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Launch Forensics Lab</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Reverse Scroll Indicator Hint */}
          <div 
            onClick={playReverseTransition}
            className="mt-4 flex items-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
          >
            <span>↑ Scroll up or click here to return to corridor</span>
          </div>

        </div>
      </div>

      {/* Live sequence progress indicator during flight */}
      {sequenceProgress > 0 && sequenceProgress < 1 && (
        <div className="absolute right-6 bottom-8 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Entering: {Math.round(sequenceProgress * 100)}%</span>
        </div>
      )}

    </section>
  );
}
