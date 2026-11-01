import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  PhoneCall, 
  Activity, 
  QrCode, 
  Sparkles, 
  Terminal, 
  ShieldAlert,
  Sliders,
  Layers,
  ChevronRight
} from 'lucide-react';
import TrustLensArc from '../TrustLensArc.jsx';
import AudioDeepfakeScanner from './AudioDeepfakeScanner.jsx';
import QrSandboxDetonator from './QrSandboxDetonator.jsx';

export default function ForensicsLabSection({ activeFeature, onFeatureChange }) {
  const [currentTab, setCurrentTab] = useState(activeFeature || 'JOB_SCAM');

  useEffect(() => {
    if (activeFeature) {
      setCurrentTab(activeFeature);
    }
  }, [activeFeature]);

  const handleTabChange = (key) => {
    setCurrentTab(key);
    if (onFeatureChange) onFeatureChange(key);
  };

  return (
    <section 
      id="forensics-lab-section"
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-[#070B13] border-t border-cyan-500/20"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wide mb-3 shadow-sm">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Modal Forensics Testing Suite</span>
            <span className="text-cyan-600">|</span>
            <span className="text-slate-400">Interactive Lab</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3 font-sans">
            Interactive Threat{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-emerald-400 bg-clip-text text-transparent">
              Forensic Lab
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Test all 5 enterprise forensic engines live. Inspect Canva template kerning, audio formant spectrograms, and sandboxed link detonations.
          </p>
        </div>

        {/* 5-Tab Navigation Bar */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-4 mb-10 gap-3 scrollbar-none">
          
          {/* Tab 1: Google Job Scam PDF */}
          <button
            onClick={() => handleTabChange('JOB_SCAM')}
            className={`px-4 py-3 rounded-2xl border text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2.5 shadow-md ${
              currentTab === 'JOB_SCAM'
                ? 'bg-red-500/15 border-red-500 text-white shadow-red-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <FileText className={`w-4 h-4 ${currentTab === 'JOB_SCAM' ? 'text-red-400' : 'text-slate-500'}`} />
            <span>1. Google Job Scam PDF</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-500/40">
              Risk: 88
            </span>
          </button>

          {/* Tab 2: Legitimate Stripe Contract */}
          <button
            onClick={() => handleTabChange('LEGIT_STRIPE')}
            className={`px-4 py-3 rounded-2xl border text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2.5 shadow-md ${
              currentTab === 'LEGIT_STRIPE'
                ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${currentTab === 'LEGIT_STRIPE' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>2. Legitimate Stripe Contract</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              Safe Control
            </span>
          </button>

          {/* Tab 3: CEO Deepfake Voice Wire */}
          <button
            onClick={() => handleTabChange('DEEPFAKE_WIRE')}
            className={`px-4 py-3 rounded-2xl border text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2.5 shadow-md ${
              currentTab === 'DEEPFAKE_WIRE'
                ? 'bg-amber-500/15 border-amber-500 text-white shadow-amber-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <PhoneCall className={`w-4 h-4 ${currentTab === 'DEEPFAKE_WIRE' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>3. CEO Deepfake Voice Wire</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40">
              Risk: 94
            </span>
          </button>

          {/* Tab 4: Audio Deepfake Spectrogram */}
          <button
            onClick={() => handleTabChange('AUDIO_SCANNER')}
            className={`px-4 py-3 rounded-2xl border text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2.5 shadow-md ${
              currentTab === 'AUDIO_SCANNER'
                ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-cyan-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Activity className={`w-4 h-4 ${currentTab === 'AUDIO_SCANNER' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>4. Audio Deepfake Spectrogram</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              Live Scanner
            </span>
          </button>

          {/* Tab 5: Interactive QR Code / Sandbox Detonator */}
          <button
            onClick={() => handleTabChange('QR_DETONATOR')}
            className={`px-4 py-3 rounded-2xl border text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2.5 shadow-md ${
              currentTab === 'QR_DETONATOR'
                ? 'bg-blue-500/15 border-blue-400 text-white shadow-blue-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <QrCode className={`w-4 h-4 ${currentTab === 'QR_DETONATOR' ? 'text-blue-400' : 'text-slate-500'}`} />
            <span>5. QR Code & Sandbox Detonator</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-500/40">
              Live Sandbox
            </span>
          </button>

        </div>

        {/* Dynamic Interactive Test View */}
        <div>
          {currentTab === 'AUDIO_SCANNER' && (
            <div className="animate-in fade-in duration-300">
              <AudioDeepfakeScanner />
            </div>
          )}

          {currentTab === 'QR_DETONATOR' && (
            <div className="animate-in fade-in duration-300">
              <QrSandboxDetonator />
            </div>
          )}

          {['JOB_SCAM', 'LEGIT_STRIPE', 'DEEPFAKE_WIRE'].includes(currentTab) && (
            <div className="animate-in fade-in duration-300 rounded-3xl overflow-hidden border border-slate-800">
              <TrustLensArc externalPresetKey={currentTab} />
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

