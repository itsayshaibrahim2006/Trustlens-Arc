import React from 'react';
import { 
  Shield, 
  Lock, 
  Terminal, 
  Server, 
  Cpu, 
  Layers, 
  Radio, 
  Zap, 
  Cloud, 
  Key,
  Globe2,
  Database
} from 'lucide-react';

const ROW_1_PARTNERS = [
  { name: 'CrowdStrike', category: 'Falcon Intelligence', icon: Shield, color: 'text-red-400', border: 'border-red-500/20' },
  { name: 'Palo Alto Networks', category: 'Cortex XDR', icon: Lock, color: 'text-amber-400', border: 'border-amber-500/20' },
  { name: 'Google Cloud Security', category: 'Chronicle SecOps', icon: Cloud, color: 'text-blue-400', border: 'border-blue-500/20' },
  { name: 'Cloudflare', category: 'Zero Trust Network', icon: Globe2, color: 'text-orange-400', border: 'border-orange-500/20' },
  { name: 'Splunk SIEM', category: 'Telemetry Pipeline', icon: Database, color: 'text-emerald-400', border: 'border-emerald-500/20' },
  { name: 'Okta Identity', category: 'Workforce Auth', icon: Key, color: 'text-cyan-400', border: 'border-cyan-500/20' },
];

const ROW_2_PARTNERS = [
  { name: 'Stripe Sentinel', category: 'Identity & Fraud Shield', icon: Zap, color: 'text-indigo-400', border: 'border-indigo-500/20' },
  { name: 'Darktrace', category: 'Self-Learning AI', icon: Cpu, color: 'text-purple-400', border: 'border-purple-500/20' },
  { name: 'SentinelOne', category: 'Autonomous Endpoint', icon: Radio, color: 'text-pink-400', border: 'border-pink-500/20' },
  { name: 'Mandiant', category: 'Advanced Threat Intel', icon: Terminal, color: 'text-red-400', border: 'border-red-500/20' },
  { name: 'AWS GuardDuty', category: 'Cloud Anomaly Engine', icon: Server, color: 'text-amber-400', border: 'border-amber-500/20' },
  { name: 'Microsoft Defender', category: 'Enterprise XDR', icon: Layers, color: 'text-cyan-400', border: 'border-cyan-500/20' },
];

export default function LogoCarousel() {
  return (
    <section className="relative py-20 bg-[#070B13] overflow-hidden border-t border-b border-cyan-500/15">
      
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Header Label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400/80 mb-2">
          Enterprise Security Ecosystem & Telemetry Feeds
        </p>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Validated Against Global SecOps Infrastructure
        </h3>
      </div>

      {/* Infinite Carousel Container */}
      <div className="relative w-full space-y-6">
        
        {/* Left & Right Edge Vignette Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-r from-[#070B13] via-[#070B13]/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 bg-gradient-to-l from-[#070B13] via-[#070B13]/90 to-transparent z-20 pointer-events-none" />

        {/* Row 1: Right -> Left */}
        <div className="flex overflow-hidden">
          <div className="flex gap-5 shrink-0 animate-marquee-left hover:[animation-play-state:paused]">
            {[...ROW_1_PARTNERS, ...ROW_1_PARTNERS, ...ROW_1_PARTNERS].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={`r1-${idx}`}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border ${item.border} backdrop-blur-md shadow-md transition-all cursor-default select-none shrink-0 group`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-white block font-sans">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Left -> Right */}
        <div className="flex overflow-hidden">
          <div className="flex gap-5 shrink-0 animate-marquee-right hover:[animation-play-state:paused]">
            {[...ROW_2_PARTNERS, ...ROW_2_PARTNERS, ...ROW_2_PARTNERS].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={`r2-${idx}`}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border ${item.border} backdrop-blur-md shadow-md transition-all cursor-default select-none shrink-0 group`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-white block font-sans">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
}

