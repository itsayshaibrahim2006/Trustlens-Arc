import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  PhoneCall, 
  Activity, 
  QrCode, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Radio,
  Cpu,
  Layers,
  Zap,
  Lock
} from 'lucide-react';
import RobotViewer from './RobotViewer.jsx';

export default function RobotSentinelHub({ onSelectFeature }) {
  const handleCardClick = (featureId) => {
    if (onSelectFeature) {
      onSelectFeature(featureId);
    }
    const labEl = document.getElementById('forensics-lab-section');
    if (labEl) {
      labEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="robot-sentinel-section"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-[#070B13] overflow-hidden border-t border-cyan-500/20"
    >
      {/* Cyber Grid Background & Ambient Lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF08_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wide mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span className="font-semibold tracking-wider uppercase">AI Sentinel Command Hub</span>
            <span className="text-cyan-600">|</span>
            <span className="text-slate-400">5 Live Forensics Engines</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-sans">
            Autonomous Threat{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-emerald-400 bg-clip-text text-transparent">
              Verification Grid
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Multi-modal security engines powered by Gemini 1.5 Pro reasoning. Select any forensic vector around the Sentinel to detonate threats and inspect cryptographic proofs.
          </p>
        </div>

        {/* 3-Column Command Layout: Cards Left | 3D Robot Center | Cards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* =========================================================================
              LEFT COLUMN (Cards 1 & 2)
              ========================================================================= */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-center order-2 lg:order-1">
            
            {/* Card 1: Google Job Scam PDF */}
            <div 
              onClick={() => handleCardClick('JOB_SCAM')}
              className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-red-500/30 hover:border-red-400/70 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-500/15 backdrop-blur-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-[10px] font-mono text-red-300 font-bold uppercase tracking-wider">
                  Risk: 88/100
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors mb-1.5 flex items-center gap-1.5">
                <span>Google Job Scam PDF</span>
                <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Counterfeit offer letter directing victim to an unsanctioned Telegram recruiter and advance-fee stipend check.
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-red-400">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Canva Forgery + AS44050</span>
                </span>
                <span className="text-slate-300 group-hover:text-white font-sans font-semibold">Test PDF →</span>
              </div>
            </div>

            {/* Card 2: Legitimate Stripe Contract */}
            <div 
              onClick={() => handleCardClick('LEGIT_STRIPE')}
              className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400/70 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/15 backdrop-blur-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                  Safe Control
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-1.5 flex items-center gap-1.5">
                <span>Legitimate Stripe Contract</span>
                <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Enterprise SaaS agreement demonstrating zero false positives, verified EV SSL, and authentic digital seals.
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Cryptographic Verified</span>
                </span>
                <span className="text-slate-300 group-hover:text-white font-sans font-semibold">Verify Safe →</span>
              </div>
            </div>

          </div>

          {/* =========================================================================
              CENTER COLUMN (3D Mini Robot Sentinel)
              ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-lg h-[500px] sm:h-[580px] rounded-3xl bg-slate-950/50 border border-cyan-500/30 backdrop-blur-md shadow-2xl shadow-cyan-950/40 flex flex-col items-center justify-center p-4">
              
              {/* Top Sentinel Badge */}
              <div className="absolute top-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-md backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Sentinel Core Online • Multi-Modal Active</span>
              </div>

              {/* 3D Robot Mount */}
              <div className="relative w-full h-full flex items-center justify-center">
                <RobotViewer isVisible={true} />
              </div>

              {/* Sentinel Bottom Status Indicator */}
              <div className="absolute bottom-4 z-20 flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-slate-800">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select any surrounding vector to launch live inspection</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN (Cards 3 & 4)
              ========================================================================= */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-center order-3">
            
            {/* Card 3: CEO Deepfake Voice Wire */}
            <div 
              onClick={() => handleCardClick('DEEPFAKE_WIRE')}
              className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/70 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-amber-500/15 backdrop-blur-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                  Risk: 94/100
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-1.5 flex items-center gap-1.5">
                <span>CEO Deepfake Voice Wire</span>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Emergency VOIP call synthesizing CEO voice to bypass dual-authorization for an urgent $48,500 wire diversion.
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-amber-400">
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3" />
                  <span>Spoofed Caller ID + BEC</span>
                </span>
                <span className="text-slate-300 group-hover:text-white font-sans font-semibold">Test Wire →</span>
              </div>
            </div>

            {/* Card 4: Audio Deepfake Spectrogram */}
            <div 
              onClick={() => handleCardClick('AUDIO_SCANNER')}
              className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/15 backdrop-blur-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  New Feature
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5 flex items-center gap-1.5">
                <span>Audio Deepfake Spectrogram</span>
                <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Real-time acoustic frequency scanner detecting robotic pitch consistency, unnatural formant phase, and synthetic jitter.
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span>96.8% Neural Probability</span>
                </span>
                <span className="text-slate-300 group-hover:text-white font-sans font-semibold">Open Scanner →</span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            BOTTOM SPAN (Card 5: Interactive QR Code & Sandbox Link Detonator)
            ========================================================================= */}
        <div className="mt-8">
          <div 
            onClick={() => handleCardClick('QR_DETONATOR')}
            className="group p-6 rounded-3xl bg-slate-900/60 hover:bg-slate-900/90 border border-blue-500/30 hover:border-blue-400/70 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-blue-500/15 backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-8 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-[10px] font-mono text-blue-300 font-bold uppercase tracking-wider">
                      Interactive Sandbox Engine
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Vector #5 • Quishing & Link Detonation
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-1">
                    Interactive QR Code / Sandbox Link Detonator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                    Unpacks malicious QR matrices and shorteners. Executes links inside an isolated headless Chromium sandbox to capture DOM redirects, SSL certificates, and credential harvesting kits.
                  </p>
                </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-end">
                <div className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:from-blue-500 group-hover:to-cyan-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all">
                  <span>Launch Live Detonator Lab</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

