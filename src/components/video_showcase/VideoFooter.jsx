import React, { useState } from 'react';
import { 
  Search, 
  ArrowUp, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  ExternalLink,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Send,
  CheckCircle2
} from 'lucide-react';

export default function VideoFooter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Scroll to features and trigger alert or highlight
    const el = document.getElementById('core-features-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-section" className="relative bg-[#04070D] border-t border-cyan-500/20 text-slate-300 pt-20 pb-12 overflow-hidden select-none">
      
      {/* Background cyber radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF05_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* =========================================================================
            TOP SECTION: EMBLEM + SEARCH BAR + STATUS
            ========================================================================= */}
        <div className="flex flex-col items-center text-center pb-16 border-b border-slate-900/80">
          
          {/* Central Glowing TrustLens Arc Emblem */}
          <div className="relative mb-5 group cursor-pointer" onClick={scrollToTop}>
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-purple-500/30 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-16 h-16 rounded-2xl bg-slate-950 border border-cyan-400/50 p-2 shadow-2xl flex items-center justify-center">
              <img 
                src="/trustlens_mark_transparent.png" 
                alt="TrustLens Arc" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]"
              />
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans mb-2">
            TrustLens <span className="text-cyan-400">Arc</span>
          </h3>
          
          <p className="max-w-xl text-xs sm:text-sm text-slate-400 font-light mb-8">
            Autonomous multi-modal forensic verification for deepfakes, synthetic documents, and weaponized payloads.
          </p>

          {/* Interactive Case ID / IOC Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-xl relative flex items-center mb-8">
            <div className="absolute left-4 text-cyan-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forensic case ID, SHA-256 hash, or domain IOC..."
              className="w-full pl-11 pr-32 py-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono shadow-inner"
            />
            <button 
              type="submit"
              className="absolute right-2 px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wider uppercase font-mono transition-all flex items-center gap-1 active:scale-95"
            >
              <span>Verify</span>
              <Terminal className="w-3 h-3" />
            </button>
          </form>

          {/* Social Network Follow Buttons */}
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, label: 'Twitter / X', href: '#' },
              { icon: Github, label: 'GitHub', href: '#' },
              { icon: Linkedin, label: 'LinkedIn', href: '#' },
              { icon: Youtube, label: 'YouTube Demo', href: '#' },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                title={item.label}
                className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400/60 hover:text-cyan-300 text-slate-400 flex items-center justify-center transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                <item.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* =========================================================================
            MIDDLE SECTION: SITEMAP & TELEMETRY COLUMNS
            ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-slate-900/80 text-xs">
          
          {/* Column 1 */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Forensic Test Beds
            </h4>
            <ul className="space-y-2.5 text-slate-400 font-sans">
              <li><a href="#core-features-section" className="hover:text-cyan-300 transition-colors">Google Job Scam PDF</a></li>
              <li><a href="#core-features-section" className="hover:text-cyan-300 transition-colors">Legitimate Stripe Baseline</a></li>
              <li><a href="#core-features-section" className="hover:text-cyan-300 transition-colors">CEO Voice Wire Detonator</a></li>
              <li><a href="#core-features-section" className="hover:text-cyan-300 transition-colors">Interactive QR Sandbox</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Neural Architecture
            </h4>
            <ul className="space-y-2.5 text-slate-400 font-sans">
              <li><a href="#deepfakes-section" className="hover:text-cyan-300 transition-colors">Biometric Facial Scanner</a></li>
              <li><a href="#scanbay-section" className="hover:text-cyan-300 transition-colors">Autonomous Vehicle Bay</a></li>
              <li><a href="#telemetry-section" className="hover:text-cyan-300 transition-colors">Live Reactive Telemetry</a></li>
              <li><a href="#telemetry-section" className="hover:text-cyan-300 transition-colors">Audio Resonance Canvas</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Intelligence Feeds
            </h4>
            <ul className="space-y-2.5 text-slate-400 font-sans">
              <li><span className="text-slate-300 font-mono">Gemini 1.5 Pro</span> LLM/Vision</li>
              <li><span className="text-slate-300 font-mono">VirusTotal</span> Threat Mesh</li>
              <li><span className="text-slate-300 font-mono">DigiCert EV</span> Certificate PKI</li>
              <li><span className="text-slate-300 font-mono">ICANN WHOIS</span> ASN Verification</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-slate-300 font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              SecOps Sentinel
            </h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">SYSTEM STATUS</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                  OPERATIONAL
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                Latency: <span className="text-cyan-300">38ms</span> • Uptime: <span className="text-emerald-400">99.99%</span>
              </p>
            </div>
          </div>

        </div>

        {/* =========================================================================
            BOTTOM BAR: COPYRIGHT + BACK TO TOP
            ========================================================================= */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>© 2026 TrustLens Arc Sentinel. All multi-modal forensic channels active.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Security Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Attestation</span>
            <button 
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
