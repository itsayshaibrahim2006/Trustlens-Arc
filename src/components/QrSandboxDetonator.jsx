import React, { useState } from 'react';
import { 
  QrCode, 
  Terminal, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink, 
  AlertTriangle, 
  Search, 
  Play, 
  RotateCcw, 
  Globe, 
  Lock, 
  Server, 
  CheckCircle2, 
  XCircle,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

const PRESETS = [
  {
    id: 'google-scam',
    name: 'Google Recruiter Quishing QR',
    url: 'https://careers-google-verify.net/onboarding/candidate-tl8924',
    risk: 95,
    isMalicious: true,
    category: 'Credential Harvesting & Advance-Fee Quishing',
    ip: '194.87.139.24 (AS44050, RU Bulletproof)',
    redirects: ['https://careers-google-verify.net/onboarding', 'https://auth-sentinel-gate.ru/login'],
    findings: [
      'Deceptive top-level domain spoofing Google Careers brand identity',
      'Hosted on AS44050 bulletproof infrastructure known for evasion',
      'HTML DOM contains hidden form forwarding entered credentials to Telegram Bot API'
    ]
  },
  {
    id: 'vendor-check',
    name: 'Equipment Stipend Payment Portal',
    url: 'http://equipment-sentinel-logistics.com/pay?invoice=9921',
    risk: 92,
    isMalicious: true,
    category: 'Unregistered Payment Interception',
    ip: '185.220.101.5 (AS200651, Tor Exit Node / Proxy)',
    redirects: ['http://equipment-sentinel-logistics.com/pay', 'http://pay-direct-crypto.onion/wire'],
    findings: [
      'Domain registered 3 days ago with privacy guard masking owner',
      'Insecure HTTP protocol used for financial wire instructions',
      'Check clearing delay pattern matching advance-fee fraud'
    ]
  },
  {
    id: 'legit-stripe',
    name: 'Legitimate Stripe Auth Portal (Safe Control)',
    url: 'https://dashboard.stripe.com/login',
    risk: 0,
    isMalicious: false,
    category: 'Authenticated Enterprise SaaS',
    ip: '199.60.103.28 (AS13335, Cloudflare Anycast)',
    redirects: ['https://dashboard.stripe.com/login (Direct 200 OK)'],
    findings: [
      'DigiCert Extended Validation (EV) TLS Certificate verified',
      'Strict HTTP Strict Transport Security (HSTS) with 2-year max-age',
      'Zero phishing signatures or malicious DOM scripts detected'
    ]
  }
];

export default function QrSandboxDetonator() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [customUrl, setCustomUrl] = useState(PRESETS[0].url);
  const [isDetonating, setIsDetonating] = useState(false);
  const [detonationStep, setDetonationStep] = useState(0);
  const [hasDetonated, setHasDetonated] = useState(false);

  const startDetonation = () => {
    setIsDetonating(true);
    setHasDetonated(false);
    setDetonationStep(1);

    setTimeout(() => setDetonationStep(2), 700);
    setTimeout(() => setDetonationStep(3), 1500);
    setTimeout(() => setDetonationStep(4), 2300);
    setTimeout(() => {
      setDetonationStep(5);
      setIsDetonating(false);
      setHasDetonated(true);
    }, 3100);
  };

  const handleSelectPreset = (p) => {
    setSelectedPreset(p);
    setCustomUrl(p.url);
    setIsDetonating(false);
    setHasDetonated(false);
    setDetonationStep(0);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
      
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all ${
        selectedPreset.isMalicious ? 'bg-red-500/10' : 'bg-emerald-500/10'
      }`} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono mb-2">
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive Link Sandbox & QR Scanner</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Quishing Matrix & Sandboxed Payload Detonator
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Unpack QR matrices, resolve redirect chains, and isolate malicious payloads in a secure headless Chromium environment.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedPreset.id === p.id
                  ? p.isMalicious
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.name.split(' ')[0]} {p.isMalicious ? '⚠️' : '🛡️'}
            </button>
          ))}
        </div>
      </div>

      {/* URL Input Bar & Detonate Trigger */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <div className="relative w-full flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste suspicious URL or QR redirect string to detonate..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 shadow-inner"
          />
        </div>

        <button
          onClick={startDetonation}
          disabled={isDetonating}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase font-mono transition-all flex items-center justify-center gap-2 shadow-lg shrink-0 ${
            isDetonating 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-slate-950 shadow-cyan-500/25 active:scale-95'
          }`}
        >
          {isDetonating ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
              <span>Detonating Payload...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Detonate in Sandbox</span>
            </>
          )}
        </button>
      </div>

      {/* Main 2-Column Sandbox Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: QR Matrix Visual & Terminal Live Execution Log */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-5">
            {/* Visual Animated QR Frame */}
            <div className="relative w-28 h-28 bg-slate-900 rounded-xl border border-cyan-500/40 p-2 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
              <QrCode className="w-full h-full text-cyan-400" />
              {/* Animated Laser Scanner */}
              <div className="absolute inset-x-0 h-1 bg-cyan-400/80 shadow-[0_0_12px_#00F0FF] animate-scanline" />
            </div>

            <div className="space-y-1 font-mono text-xs">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">
                Target Payload Decoded
              </span>
              <p className="text-white font-bold text-sm truncate max-w-xs sm:max-w-sm">
                {selectedPreset.name}
              </p>
              <p className="text-slate-400 text-[11px] truncate max-w-xs">
                {selectedPreset.category}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedPreset.isMalicious ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                }`}>
                  Risk Score: {selectedPreset.risk}/100
                </span>
                <span className="text-slate-500 text-[11px]">|</span>
                <span className="text-slate-400 text-[11px]">{selectedPreset.ip.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Live Step-by-Step Detonation Terminal */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>sandbox_isolation_pipeline.sh</span>
              </div>
              <span className="text-cyan-400">Headless Chromium 124</span>
            </div>

            <div className="space-y-2">
              <div className={`flex items-start gap-2 ${detonationStep >= 1 ? 'text-slate-200' : 'text-slate-600'}`}>
                <span className="text-cyan-400 font-bold">[STEP 1]</span>
                <span>Decoded QR Matrix. Resolving Authoritative DNS...</span>
                {detonationStep === 1 && <span className="text-cyan-400 animate-pulse">Running...</span>}
                {detonationStep > 1 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
              </div>

              <div className={`flex items-start gap-2 ${detonationStep >= 2 ? 'text-slate-200' : 'text-slate-600'}`}>
                <span className="text-cyan-400 font-bold">[STEP 2]</span>
                <span>Tracing HTTP Redirect Chain (Hops: {selectedPreset.redirects.length})...</span>
                {detonationStep === 2 && <span className="text-cyan-400 animate-pulse">Running...</span>}
                {detonationStep > 2 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
              </div>

              <div className={`flex items-start gap-2 ${detonationStep >= 3 ? 'text-slate-200' : 'text-slate-600'}`}>
                <span className="text-cyan-400 font-bold">[STEP 3]</span>
                <span>Autonomous System GeoIP Lookup ({selectedPreset.ip})...</span>
                {detonationStep === 3 && <span className="text-cyan-400 animate-pulse">Running...</span>}
                {detonationStep > 3 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
              </div>

              <div className={`flex items-start gap-2 ${detonationStep >= 4 ? 'text-slate-200' : 'text-slate-600'}`}>
                <span className="text-cyan-400 font-bold">[STEP 4]</span>
                <span>DOM Sandbox Snapshot & Heuristic Quishing Evaluation...</span>
                {detonationStep === 4 && <span className="text-cyan-400 animate-pulse">Running...</span>}
                {detonationStep >= 4 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
              </div>

              {(detonationStep >= 5 || hasDetonated) && (
                <div className={`pt-2 border-t border-slate-800 font-bold flex items-center justify-between ${
                  selectedPreset.isMalicious ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  <span>[VERDICT]: {selectedPreset.isMalicious ? 'CRITICAL QUISHING HARVESTER DETECTED' : 'SAFE CONTROL VERIFIED'}</span>
                  <span>{selectedPreset.risk}/100</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Quarantined Headless Browser Sandbox Viewport */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Isolated DOM Snapshot Preview</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                QUARANTINED CONTAINER
              </span>
            </div>

            {/* Simulated Browser Viewport */}
            <div className="rounded-xl border border-slate-800 bg-[#060A12] overflow-hidden p-4 min-h-[160px] relative shadow-inner">
              <div className="flex items-center gap-1.5 pb-3 border-b border-slate-800/80 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <div className="ml-2 px-3 py-0.5 rounded-md bg-slate-900 text-[10px] font-mono text-slate-400 truncate max-w-xs">
                  {selectedPreset.url}
                </div>
              </div>

              {selectedPreset.isMalicious ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300">
                    <span className="font-bold block mb-1">⚠️ Quishing Form Intercepted:</span>
                    <span className="text-[11px] text-slate-300 block">
                      Target form attempts to harvest Google Workspace SSO passwords and redirect victim to Telegram bot @google_careers_emea.
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>Redirect Unwrapped: {selectedPreset.redirects[0]}</div>
                    <div className="text-red-400">Payload Destination: {selectedPreset.redirects[1]}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                    <span className="font-bold block mb-1">🛡️ Authentic Enterprise Authentication:</span>
                    <span className="text-[11px] text-slate-300 block">
                      Valid DigiCert EV TLS Session. Subresource Integrity (SRI) hashes match Stripe production builds.
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    <div>Direct Endpoint: {selectedPreset.redirects[0]}</div>
                    <div className="text-emerald-400 font-semibold">Zero Malicious Scripts Detected</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Findings List */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase font-bold">
              Automated Forensic Evidence:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {selectedPreset.findings.map((f, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={`mt-0.5 text-xs ${selectedPreset.isMalicious ? 'text-red-400' : 'text-emerald-400'}`}>•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}

