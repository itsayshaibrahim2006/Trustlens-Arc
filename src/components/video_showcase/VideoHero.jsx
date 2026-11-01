import React from 'react';
import { Sparkles, ArrowRight, User, Shield, Lock, Terminal, Cpu } from 'lucide-react';
import RobotViewer from '../RobotViewer.jsx';

const MARQUEE_ROW_1 = [
  'WHOIS', 'DNSSEC', 'Tesseract OCR', 'VirusTotal Mesh', 'Gemini 1.5 Pro', 'DocuSign PKI', 'DigiCert EV'
];

const MARQUEE_ROW_2 = [
  'AS44050 Lookup', 'Let\'s Encrypt', 'Okta Verify', 'Cortex XDR', 'CrowdStrike Intel', 'Cloudflare Zero Trust'
];

export default function VideoHero({ onExplore }) {
  return (
    <section className="relative min-h-screen bg-[#060A12] text-white overflow-hidden flex flex-col justify-between select-none">
      
      {/* Background Holographic Cyber Globe with Shield (From Video Frame 0) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none scale-105"
        style={{ backgroundImage: `url('/video_hero_bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#060A12]/90 via-transparent to-[#060A12] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#060A12_100%)] pointer-events-none" />

      {/* =========================================================================
          TOP NAVBAR (Exact match to Video)
          ========================================================================= */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
        
        {/* Brand Left: Glowing Emblem + TrustLens Arc */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative w-8 h-8 rounded-lg bg-slate-900 border border-cyan-400/40 p-0.5 overflow-hidden flex items-center justify-center">
            <img src="/trustlens_mark_transparent.png" alt="TrustLens Arc" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1 font-sans">
            TrustLens <span className="text-cyan-400">Arc</span>
          </span>
        </div>

        {/* Center Nav Links with Active Indicator */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-sans text-slate-300">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white font-medium flex flex-col items-center">
            <span>Home</span>
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1 shadow-[0_0_6px_#00F0FF]"></span>
          </button>
          <a href="#deepfakes-section" className="hover:text-cyan-300 transition-colors">Deepfakes</a>
          <a href="#scanbay-section" className="hover:text-cyan-300 transition-colors">Scan Bay</a>
          <a href="#telemetry-section" className="hover:text-cyan-300 transition-colors">Telemetry</a>
          <a href="#core-features-section" className="hover:text-cyan-300 transition-colors">Features</a>
        </nav>

        {/* Right Auth Controls: Log in + Cyan Sign Up Pill */}
        <div className="flex items-center gap-4">
          <button className="text-xs text-slate-300 hover:text-white transition-colors font-sans hidden sm:block">
            Log In
          </button>
          <button 
            onClick={onExplore}
            className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-400/25 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Sign Up</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO CENTERPIECE (Exact match to Video Scene 1)
          ========================================================================= */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center pt-8 pb-4 flex flex-col items-center">
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight font-sans drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          Prove <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">the Evidence</span><br />
          and Verify in 1-Click
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
          Multi-modal forensic evidence engine decoding advance-fee employment scams, synthetic voice wires, and infrastructure spoofing before payload execution.
        </p>

        {/* Center Pill Badge: ARC SENTINEL v3.8 */}
        <div 
          onClick={onExplore}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-950/80 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 text-xs font-mono tracking-wider uppercase cursor-pointer transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,240,255,0.2)] mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="font-bold">ARC SENTINEL v3.8</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 text-[10px]">Active Sentinel Core</span>
        </div>

        {/* 3D Mini Robot Mascot in Center */}
        <div className="relative w-full max-w-md h-72 sm:h-80 mx-auto flex items-center justify-center">
          <RobotViewer isVisible={true} />
        </div>
      </div>

      {/* =========================================================================
          INFINITE LOGO MARQUEE (Exact match to Video Frame 60)
          ========================================================================= */}
      <div className="relative z-20 w-full py-6 bg-slate-950/80 border-t border-cyan-500/20 backdrop-blur-md overflow-hidden space-y-3">
        
        {/* Left & Right Edge Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#060A12] via-[#060A12]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#060A12] via-[#060A12]/90 to-transparent z-10 pointer-events-none" />

        {/* Row 1 Marquee */}
        <div className="flex overflow-hidden">
          <div className="flex gap-4 shrink-0 animate-marquee-left">
            {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((tag, i) => (
              <div 
                key={`m1-${i}`}
                className="px-5 py-2 rounded-xl bg-slate-900/70 border border-slate-700/60 text-slate-200 font-mono text-xs tracking-wider uppercase font-semibold shrink-0 shadow-sm flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 Marquee */}
        <div className="flex overflow-hidden">
          <div className="flex gap-4 shrink-0 animate-marquee-right">
            {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((tag, i) => (
              <div 
                key={`m2-${i}`}
                className="px-5 py-2 rounded-xl bg-slate-900/70 border border-slate-700/60 text-slate-200 font-mono text-xs tracking-wider uppercase font-semibold shrink-0 shadow-sm flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}

