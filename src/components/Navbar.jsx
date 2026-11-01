import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview-section', label: 'Overview' },
  { id: 'deepfakes-section', label: 'Sentinel Hub' },
  { id: 'scanbay-section', label: 'Scan Bay 3D' },
  { id: 'telemetry-section', label: 'VoiceCheck 3D' },
  { id: 'footer-section', label: 'Forensics Lab' }
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('overview-section');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      // Scroll Spy to highlight the current section with glowing dot
      const sections = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id)
      }));

      // If at the very top, overview is active
      if (scrollY < 300) {
        setActiveSection('overview-section');
        return;
      }

      // Find section currently in view
      const scrollCenter = scrollY + window.innerHeight * 0.35;
      for (let i = sections.length - 1; i >= 0; i--) {
        const { id, el } = sections[i];
        if (el) {
          const top = el.offsetTop;
          if (scrollCenter >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (id === 'overview-section') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#070B13]/85 backdrop-blur-xl border-b border-cyan-500/15 py-3 shadow-2xl shadow-black/50' 
          : 'bg-gradient-to-b from-[#070B13]/90 via-[#070B13]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Brand Left: Glowing Lens Logo + Typography */}
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => scrollToSection('overview-section')}
        >
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

        {/* Center Floating Navigation Links (Exact Match to Reference with Active Indicator Dot) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-sans tracking-wide">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`transition-colors flex flex-col items-center group relative py-1 ${
                  isActive ? 'text-white font-medium' : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                <span>{item.label}</span>
                {isActive ? (
                  <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1 shadow-[0_0_6px_#00F0FF] transition-all animate-pulse" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-transparent mt-1 group-hover:bg-cyan-500/40 transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/60 border border-slate-700/60 backdrop-blur-md text-cyan-400 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          </div>

          <button
            onClick={() => scrollToSection('deepfakes-section')}
            className="px-5 py-2 rounded-full bg-white hover:bg-cyan-100 text-slate-950 text-xs font-semibold tracking-wide shadow-lg shadow-white/10 hover:shadow-cyan-400/25 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070B13]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-6 py-4 flex flex-col gap-3 shadow-2xl">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-sm py-2 px-3 rounded-lg flex items-center justify-between ${
                  isActive 
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
