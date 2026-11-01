import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  PhoneCall, 
  QrCode, 
  ArrowUpRight, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink,
  Lock,
  Globe,
  Radio,
  Activity,
  Layers,
  Terminal,
  ShieldAlert
} from 'lucide-react';

export default function CoreFeaturesShowcase() {
  // =========================================================================
  // CARD 1: GOOGLE JOB SCAM PDF STATE
  // =========================================================================
  const [pdfAnalyzed, setPdfAnalyzed] = useState(true);
  const [pdfScanning, setPdfScanning] = useState(false);

  const handleScanPdf = () => {
    setPdfScanning(true);
    setPdfAnalyzed(false);
    setTimeout(() => {
      setPdfScanning(false);
      setPdfAnalyzed(true);
    }, 900);
  };

  // =========================================================================
  // CARD 2: LEGITIMATE STRIPE CONTRACT STATE
  // =========================================================================
  const [stripeVerified, setStripeVerified] = useState(true);
  const [stripeVerifying, setStripeVerifying] = useState(false);

  const handleVerifyStripe = () => {
    setStripeVerifying(true);
    setStripeVerified(false);
    setTimeout(() => {
      setStripeVerifying(false);
      setStripeVerified(true);
    }, 800);
  };

  // =========================================================================
  // CARD 3: AUDIO DEEPFAKE & SPECTROGRAM STATE
  // =========================================================================
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMode, setAudioMode] = useState('SYNTHETIC'); // 'SYNTHETIC' | 'AUTHENTIC'
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // Animated Spectrogram Canvas
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += audioPlaying ? 0.06 : 0.015;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#060A14';
      ctx.fillRect(0, 0, w, h);

      const numBars = 48;
      const barWidth = w / numBars;

      for (let i = 0; i < numBars; i++) {
        let amp;
        if (audioMode === 'SYNTHETIC') {
          // Synthetic voice: unnaturally flat harmonics with robotic spikes
          const base = Math.sin(time * 3 + i * 0.4) * 0.4 + 0.45;
          const artificialSpike = (i % 6 === 0) ? 0.35 : 0;
          amp = audioPlaying ? (base + artificialSpike) : (base * 0.35 + 0.1);
        } else {
          // Authentic human: organic smooth decay curve
          const base = Math.sin(time * 2.2 + i * 0.25) * 0.35 + 0.4;
          const falloff = Math.exp(-(i / numBars) * 2.6);
          amp = audioPlaying ? (base * falloff * 1.5) : (base * falloff * 0.35 + 0.08);
        }

        const barHeight = Math.min(h * 0.9, Math.max(6, amp * h * 0.8));
        const x = i * barWidth;
        const y = h - barHeight;

        const grad = ctx.createLinearGradient(0, h, 0, y);
        if (audioMode === 'SYNTHETIC') {
          grad.addColorStop(0, '#00F0FF30');
          grad.addColorStop(0.6, '#F59E0B');
          grad.addColorStop(1, '#EF4444');
        } else {
          grad.addColorStop(0, '#00F0FF30');
          grad.addColorStop(0.6, '#06B6D4');
          grad.addColorStop(1, '#10B981');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [audioPlaying, audioMode]);

  const toggleAudio = () => {
    if (!audioPlaying) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = audioMode === 'SYNTHETIC' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(audioMode === 'SYNTHETIC' ? 140 : 125, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
      } catch (err) {}
      setAudioPlaying(true);
    } else {
      stopAudio();
      setAudioPlaying(false);
    }
  };

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  // =========================================================================
  // CARD 4: QR CODE & SANDBOX LINK DETONATOR STATE
  // =========================================================================
  const [qrDetonating, setQrDetonating] = useState(false);
  const [qrDetonated, setQrDetonated] = useState(true);
  const [qrStep, setQrStep] = useState(3);

  const handleDetonateQr = () => {
    setQrDetonating(true);
    setQrDetonated(false);
    setQrStep(1);

    setTimeout(() => setQrStep(2), 600);
    setTimeout(() => {
      setQrStep(3);
      setQrDetonating(false);
      setQrDetonated(true);
    }, 1300);
  };

  return (
    <section 
      id="core-features-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070B13] border-t border-cyan-500/20 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wide mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold tracking-wider uppercase">Enterprise Forensic Architecture</span>
            <span className="text-cyan-600">|</span>
            <span className="text-slate-400">4 Core Defense Pillars</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight mb-4 leading-tight">
            Autonomous Threat Intel.<br />
            <span className="italic font-light bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Simplified & Decoded.
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm lg:text-base font-light leading-relaxed max-w-2xl mx-auto">
            Zero complicated clutter. Interact directly with each core verification vector below to inspect advance-fee fraud, voice clones, and quishing payloads in real time.
          </p>
        </div>

        {/* 2x2 Clean Big Cards Grid (Exact Design Architecture from Reference Image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* =========================================================================
              CARD 1: GOOGLE JOB SCAM PDF
              ========================================================================= */}
          <div className="min-h-[500px] p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900/80 via-[#090D17]/90 to-slate-950/95 border border-red-500/30 hover:border-red-400/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-500 group">
            
            {/* Top Row: Pill Badge + Action Icon */}
            <div className="flex items-center justify-between mb-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                <span>Document Forgery Forensics</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/15 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Typography Content */}
            <div className="mb-8 z-10">
              <span className="text-[11px] font-mono tracking-[0.25em] text-red-400/90 uppercase block mb-3 font-semibold">
                Canva Template & Advance-Fee Decoder
              </span>
              <h3 className="font-editorial text-3xl sm:text-5xl font-normal text-white tracking-tight leading-[1.08] mb-4">
                Google Executive<br />
                <span className="text-red-400 font-bold">Job Scam PDF</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
                Decodes forged Canva PDF letterheads, identifies unsanctioned Telegram recruiter handles, and intercepts counterfeit $2,450 equipment cashier check schemes before deposit.
              </p>
            </div>

            {/* Interactive Testing Bed */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-4 z-10 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileText className="w-4 h-4 text-red-400" />
                  <span className="font-bold">Google_Offer_Letter_Q4.pdf</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 font-bold text-[10px] border border-red-500/50">
                  Risk: 88/100
                </span>
              </div>

              {/* Suspicious Tokens Chips */}
              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/30 border border-red-500/20 text-red-200">
                  <span>Recruiter: @google_careers_emea</span>
                  <span className="text-red-400 font-bold">Unsanctioned Telegram</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/30 border border-red-500/20 text-red-200">
                  <span>Vendor: equipment-sentinel-logistics.com</span>
                  <span className="text-red-400 font-bold">AS44050 Bulletproof</span>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleScanPdf}
                  disabled={pdfScanning}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wide uppercase transition-all shadow-md shadow-red-500/20 flex items-center gap-2 active:scale-95"
                >
                  {pdfScanning ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Scanning PDF...</span>
                    </>
                  ) : (
                    <span>Scan & Verify Document</span>
                  )}
                </button>
                <span className="text-[11px] font-mono text-slate-400">Canva/Skia 2.1 Kerning Shift</span>
              </div>
            </div>

            {/* Subtle Gradient Glow in background */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/15 transition-all" />
          </div>

          {/* =========================================================================
              CARD 2: LEGITIMATE STRIPE CONTRACT (SAFE CONTROL)
              ========================================================================= */}
          <div className="min-h-[500px] p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900/80 via-[#090D17]/90 to-slate-950/95 border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-500 group">
            
            {/* Top Row: Pill Badge + Action Icon */}
            <div className="flex items-center justify-between mb-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Safe Control Baseline</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/15 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Typography Content */}
            <div className="mb-8 z-10">
              <span className="text-[11px] font-mono tracking-[0.25em] text-emerald-400/90 uppercase block mb-3 font-semibold">
                Cryptographic Enterprise Verification
              </span>
              <h3 className="font-editorial text-3xl sm:text-5xl font-normal text-white tracking-tight leading-[1.08] mb-4">
                Legitimate Stripe<br />
                <span className="text-emerald-400 font-bold">Partner Agreement</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
                Guarantees zero false positives by validating genuine commercial agreements. Verifies DigiCert EV SSL certificate chains, sanctioned corporate roots, and cryptographic DocuSign envelopes.
              </p>
            </div>

            {/* Interactive Testing Bed */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-4 z-10 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Stripe_Connect_Agreement_2026.pdf</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-bold text-[10px] border border-emerald-500/50">
                  Safe Control (Risk 0)
                </span>
              </div>

              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-200">
                  <span>SSL Root: DigiCert EV TLS 1.3</span>
                  <span className="text-emerald-400 font-bold">100% Cryptographic Match</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-200">
                  <span>Signer: DocuSign Certified Key</span>
                  <span className="text-emerald-400 font-bold">Zero Tamper Artifacts</span>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleVerifyStripe}
                  disabled={stripeVerifying}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs tracking-wide uppercase transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
                >
                  {stripeVerifying ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-950/20 border-t-slate-950 animate-spin" />
                      <span>Validating Roots...</span>
                    </>
                  ) : (
                    <span>Certify Baseline</span>
                  )}
                </button>
                <span className="text-[11px] font-mono text-emerald-400">0.00% False Positive</span>
              </div>
            </div>

            {/* Subtle Gradient Glow in background */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />
          </div>

          {/* =========================================================================
              CARD 3: CEO DEEPFAKE VOICE WIRE & SPECTROGRAM
              ========================================================================= */}
          <div className="min-h-[500px] p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900/80 via-[#090D17]/90 to-slate-950/95 border border-cyan-500/30 hover:border-cyan-400/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-500 group">
            
            {/* Top Row: Pill Badge + Action Icon */}
            <div className="flex items-center justify-between mb-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Acoustic Biometrics</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/15 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Typography Content */}
            <div className="mb-8 z-10">
              <span className="text-[11px] font-mono tracking-[0.25em] text-cyan-400/90 uppercase block mb-3 font-semibold">
                Neural Formant Frequency Decomposition
              </span>
              <h3 className="font-editorial text-3xl sm:text-5xl font-normal text-white tracking-tight leading-[1.08] mb-4">
                CEO Deepfake Voice<br />
                <span className="text-cyan-400 font-bold">& Acoustic Scanner</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
                Real-time acoustic spectrogram analysis detecting AI-cloned executive speech. Intercepts urgent $48,500 wire diversion calls attempting to bypass dual-key treasury authorization.
              </p>
            </div>

            {/* Interactive Testing Bed: Live Spectrogram Canvas & Audio Player */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-3 z-10 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300 font-bold">FFT Frequency Waterfall (0 - 16 kHz)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <button
                    onClick={() => setAudioMode(audioMode === 'SYNTHETIC' ? 'AUTHENTIC' : 'SYNTHETIC')}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      audioMode === 'SYNTHETIC' 
                        ? 'bg-red-950 text-red-300 border border-red-500/50' 
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                    }`}
                  >
                    Mode: {audioMode === 'SYNTHETIC' ? 'AI Clone (96.8%)' : 'Human Control (1.4%)'}
                  </button>
                </div>
              </div>

              {/* Canvas Spectrogram */}
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={75} 
                className="w-full h-16 rounded-xl bg-[#060A14] object-cover block border border-slate-800"
              />

              {/* Action Trigger */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={toggleAudio}
                  className={`px-5 py-2 rounded-xl font-bold text-xs tracking-wide uppercase transition-all shadow-md flex items-center gap-2 active:scale-95 ${
                    audioPlaying 
                      ? 'bg-amber-500 text-slate-950 shadow-amber-500/20' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-cyan-500/20'
                  }`}
                >
                  {audioPlaying ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                  <span>{audioPlaying ? 'Pause Voice Stream' : 'Play & Scan Voice'}</span>
                </button>
                <span className="text-[11px] font-mono text-cyan-300">
                  Pitch Jitter: {audioMode === 'SYNTHETIC' ? '0.04% (Unnatural)' : '1.86% (Natural)'}
                </span>
              </div>
            </div>

            {/* Subtle Gradient Glow in background */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />
          </div>

          {/* =========================================================================
              CARD 4: INTERACTIVE QR CODE & SANDBOX LINK DETONATOR
              ========================================================================= */}
          <div className="min-h-[500px] p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900/80 via-[#090D17]/90 to-slate-950/95 border border-blue-500/30 hover:border-blue-400/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-500 group">
            
            {/* Top Row: Pill Badge + Action Icon */}
            <div className="flex items-center justify-between mb-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-mono tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span>Quishing & Link Detonation</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/15 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Typography Content */}
            <div className="mb-8 z-10">
              <span className="text-[11px] font-mono tracking-[0.25em] text-blue-400/90 uppercase block mb-3 font-semibold">
                Headless Chromium Isolation Pipeline
              </span>
              <h3 className="font-editorial text-3xl sm:text-5xl font-normal text-white tracking-tight leading-[1.08] mb-4">
                Quishing Matrix &<br />
                <span className="text-blue-400 font-bold">Sandbox Detonator</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
                Decodes deceptive QR matrices, unwraps multi-hop 302 redirect loops, and isolates suspicious URLs inside a headless sandbox to detect credential-harvesting phishing kits.
              </p>
            </div>

            {/* Interactive Testing Bed: QR Scan + Detonate */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-3 z-10 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-slate-300 truncate max-w-xs">
                  <QrCode className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">careers-google-verify.net</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 font-bold text-[10px] border border-blue-500/50">
                  Risk: 95/100
                </span>
              </div>

              {/* Sandbox Execution Status */}
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DNS Resolution:</span>
                  <span className="text-red-400 font-bold">194.87.139.24 (AS44050 Bulletproof)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Quarantined Form:</span>
                  <span className="text-amber-400 font-bold">Google SSO Credential Harvester</span>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleDetonateQr}
                  disabled={qrDetonating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wide uppercase transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 active:scale-95"
                >
                  {qrDetonating ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Detonating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Detonate in Sandbox</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] font-mono text-slate-400">Isolated Headless DOM</span>
              </div>
            </div>

            {/* Subtle Gradient Glow in background */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-all" />
          </div>

        </div>

      </div>
    </section>
  );
}

