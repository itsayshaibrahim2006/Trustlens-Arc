import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  QrCode, 
  FileSearch, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Layers, 
  Lock, 
  Zap, 
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Radio
} from 'lucide-react';

export default function BentoGridSection({ onExploreFeature }) {
  const [pulseMetric, setPulseMetric] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseMetric(prev => (prev === 42 ? 39 : 42));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="bento-grid-section"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070B13] border-b border-cyan-500/15 overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wide mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold tracking-wider uppercase">Architecture & Telemetry</span>
            <span className="text-cyan-600">|</span>
            <span className="text-slate-400">Asymmetric Forensics Bento</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-sans">
            Engineered for Autonomous{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              Forensic Precision
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every layer of TrustLens Arc runs specialized neural verifiers built to catch advance-fee scams, voice clones, and quishing before execution.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* =========================================================================
              CARD 1 (LARGE HERO BENTO: 8 COLS, 2 ROWS) - Real-time Threat Matrix
              ========================================================================= */}
          <div className="lg:col-span-8 p-7 sm:p-9 rounded-3xl bg-slate-900/60 hover:bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 shadow-xl backdrop-blur-md relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />

            <div>
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block">
                      Core Forensic Pipeline
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                      Multi-Modal Threat Decomposition Engine
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Engine Online</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-2xl">
                Simultaneously ingests PDF documents, audio spectrograms, and suspicious URLs. Cross-verifies extracted tokens against 12 enterprise threat feeds, Autonomous System databases, and cryptographic certificate registries.
              </p>

              {/* Live Terminal / Telemetry Preview */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 mb-6 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>live_forensic_stream.log</span>
                  </div>
                  <span className="text-cyan-400">v2.4.2-PROD</span>
                </div>
                <p className="text-emerald-400 flex items-center gap-2">
                  <span>[00:01.04]</span>
                  <span className="text-slate-200">PDF OCR Parser:</span>
                  <span>Extracted 1,420 tokens • Canva Producer Header identified</span>
                </p>
                <p className="text-amber-400 flex items-center gap-2">
                  <span>[00:01.22]</span>
                  <span className="text-slate-200">Channel Guard:</span>
                  <span>Unsanctioned Telegram handle @google_careers_emea detected</span>
                </p>
                <p className="text-cyan-300 flex items-center gap-2">
                  <span>[00:01.39]</span>
                  <span className="text-slate-200">Gemini 1.5 Pro:</span>
                  <span>Multi-modal reasoning synthesis generated with 96.8% confidence</span>
                </p>
              </div>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Median Latency</span>
                <span className="text-xl sm:text-2xl font-extrabold text-cyan-300 font-mono flex items-center gap-1">
                  {pulseMetric} <span className="text-xs text-slate-400 font-sans">ms</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Synthetic Accuracy</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                  99.4%
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Safe Control FP</span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
                  0.00%
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Threat Presets</span>
                <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">
                  5 Active
                </span>
              </div>
            </div>

          </div>

          {/* =========================================================================
              CARD 2 (TOP RIGHT: 4 COLS) - Audio Deepfake Spectrogram
              ========================================================================= */}
          <div 
            onClick={() => onExploreFeature && onExploreFeature('AUDIO_SCANNER')}
            className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-slate-900/60 hover:bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 shadow-xl backdrop-blur-md relative overflow-hidden group cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Radio className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  Biometric Voice
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 font-sans flex items-center justify-between">
                <span>Audio Deepfake Spectrogram</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Detects synthetic neural voice clones by analyzing acoustic formant consistency, absence of micro-tremors, and zero-floor background artifacts.
              </p>

              {/* Visual Audio Spectrogram Bars */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 mb-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Pitch Jitter Stability:</span>
                  <span className="text-red-400 font-bold">0.04% (Unnatural)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="w-[96%] bg-gradient-to-r from-red-500 to-amber-500 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>Synthetic Probability:</span>
                  <span className="text-cyan-400 font-bold">96.8%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-cyan-300 pt-2 border-t border-slate-800/80">
              <span>Interactive Audio Player</span>
              <span>Launch Scanner →</span>
            </div>
          </div>

          {/* =========================================================================
              CARD 3 (BOTTOM LEFT: 4 COLS) - Quishing & Sandbox Link Detonator
              ========================================================================= */}
          <div 
            onClick={() => onExploreFeature && onExploreFeature('QR_DETONATOR')}
            className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-slate-900/60 hover:bg-slate-900/80 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 shadow-xl backdrop-blur-md relative overflow-hidden group cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-[10px] font-mono text-blue-300 font-bold uppercase tracking-wider">
                  Link Detonator
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-2 font-sans flex items-center justify-between">
                <span>Quishing & Sandbox Isolation</span>
                <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Decodes deceptive QR codes, unwraps 302 redirect loops, and detonates targets inside an isolated browser to screenshot phishing forms safely.
              </p>

              {/* Visual URL Sandbox Unpack Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-[11px] mb-4">
                <div className="text-slate-400 truncate">Target: careers-google-verify.net</div>
                <div className="text-cyan-400 flex items-center gap-1.5">
                  <span className="text-slate-500">↳</span>
                  <span>AS44050 (Bulletproof Hosting)</span>
                </div>
                <div className="text-red-400 font-semibold flex items-center gap-1.5">
                  <span className="text-slate-500">↳</span>
                  <span>Credential Harvesting Kit: DETECTED</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-blue-400 group-hover:text-blue-300 pt-2 border-t border-slate-800/80">
              <span>Step-by-step Sandbox</span>
              <span>Test Detonator →</span>
            </div>
          </div>

          {/* =========================================================================
              CARD 4 (BOTTOM MIDDLE: 4 COLS) - Canva Template & PDF Geometry
              ========================================================================= */}
          <div 
            onClick={() => onExploreFeature && onExploreFeature('JOB_SCAM')}
            className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-slate-900/60 hover:bg-slate-900/80 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 shadow-xl backdrop-blur-md relative overflow-hidden group cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/20 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400">
                  <FileSearch className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-[10px] font-mono text-red-300 font-bold uppercase tracking-wider">
                  Document Forensics
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-300 transition-colors mb-2 font-sans flex items-center justify-between">
                <span>Canva Forgery & Raster OCR</span>
                <ArrowUpRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Extracts hidden PDF metadata, detects rasterized company logos pasted over public templates, and flags advance-fee cashier check scam patterns.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-[11px] mb-4">
                <div className="text-slate-400">PDF Producer: Canva/Skia 2.1</div>
                <div className="text-amber-400">Kerning Anomaly: 14.8px shift</div>
                <div className="text-red-400 font-semibold">Advance-Fee Stipend Check: $2,450 USD</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-red-400 group-hover:text-red-300 pt-2 border-t border-slate-800/80">
              <span>Google Job Scam PDF</span>
              <span>Inspect Proof →</span>
            </div>
          </div>

          {/* =========================================================================
              CARD 5 (BOTTOM RIGHT: 4 COLS) - Safe Control Baseline
              ========================================================================= */}
          <div 
            onClick={() => onExploreFeature && onExploreFeature('LEGIT_STRIPE')}
            className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-slate-900/60 hover:bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-300 shadow-xl backdrop-blur-md relative overflow-hidden group cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                  Safe Control
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 font-sans flex items-center justify-between">
                <span>Cryptographic Safe Baseline</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Validates authentic corporate contracts with zero false positives. Confirms DigiCert EV SSL certificates, sanctioned domains, and legitimate legal entities.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-[11px] mb-4">
                <div className="text-slate-400">Domain: stripe.com (EV Validated)</div>
                <div className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Risk Score: 0 / 100 (Safe)</span>
                </div>
                <div className="text-cyan-400">Cryptographic Root: DigiCert Global CA</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 group-hover:text-emerald-300 pt-2 border-t border-slate-800/80">
              <span>Legitimate Stripe Contract</span>
              <span>Verify Baseline →</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

