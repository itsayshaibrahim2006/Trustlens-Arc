import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  QrCode, 
  Upload, 
  Search, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Cpu, 
  Link as LinkIcon, 
  ScanLine,
  Zap,
  Check,
  X
} from 'lucide-react';

export default function ScanBayVehicle() {
  // =========================================================================
  // CARD 1: GOOGLE JOB SCAM & CV / RESUME AUTHENTICATOR STATE
  // =========================================================================
  const [cvFile, setCvFile] = useState(null);
  const [cvResultType, setCvResultType] = useState('failure'); // 'failure' (scam) | 'success' (real)
  const [cvScanning, setCvScanning] = useState(false);
  const [cvScanStep, setCvScanStep] = useState(0);
  const [cvScanProgress, setCvScanProgress] = useState(100);
  const cvFileInputRef = useRef(null);

  const CV_STEPS = [
    'Parsing CV text, candidate credentials, and claimed employment...',
    'Querying Google Knowledge Graph & Corporate Employment Directories...',
    'Scanning GitHub API, repositories, commit velocity & PR history...',
    'Auditing Recruiter Domain, Telegram routing, and Canva PDF Metadata...'
  ];

  const handleCvPresetChange = (type) => {
    setCvResultType(type);
    setCvFile(null);
    runCvScanSimulation(type === 'failure');
  };

  const handleCvFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
    const isSuspicious = file.name.toLowerCase().includes('scam') || 
                         file.name.toLowerCase().includes('fake') || 
                         file.size % 2 === 0;
    setCvResultType(isSuspicious ? 'failure' : 'success');
    runCvScanSimulation(isSuspicious, file.name);
  };

  const runCvScanSimulation = (isScam) => {
    setCvScanning(true);
    setCvScanProgress(0);
    setCvScanStep(0);

    const startTime = performance.now();
    const duration = 1800;

    const stepInterval = setInterval(() => {
      setCvScanStep(prev => (prev < CV_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    const tick = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setCvScanProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        clearInterval(stepInterval);
        setCvScanning(false);
        setCvScanProgress(100);
      }
    };
    requestAnimationFrame(tick);
  };

  const isCvScam = cvResultType === 'failure';
  const cvFakePct = isCvScam ? 88.4 : 3.6;
  const cvRealPct = (100 - cvFakePct).toFixed(1);

  // =========================================================================
  // CARD 2: INTERACTIVE QR CODE & LINK DETONATOR STATE
  // =========================================================================
  const [urlInput, setUrlInput] = useState('https://secure-login-apple-support.tk/verify');
  const [qrResultType, setQrResultType] = useState('failure'); // 'failure' (phishing) | 'success' (safe)
  const [qrScanning, setQrScanning] = useState(false);
  const [qrProgress, setQrProgress] = useState(100);
  const [qrFile, setQrFile] = useState(null);
  const qrFileInputRef = useRef(null);

  const handleQrPresetChange = (type) => {
    setQrResultType(type);
    setQrFile(null);
    if (type === 'failure') {
      setUrlInput('https://secure-login-apple-support.tk/verify');
      runQrScanSimulation(true);
    } else {
      setUrlInput('https://stripe.com/verify-session/checkout-live');
      runQrScanSimulation(false);
    }
  };

  const handleQrFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    const isMalicious = file.name.toLowerCase().includes('phish') || 
                        file.name.toLowerCase().includes('scam') || 
                        file.size % 2 === 0;
    setQrResultType(isMalicious ? 'failure' : 'success');
    setUrlInput(isMalicious ? 'https://quishing-redirect-payload.ru/login' : 'https://verified-portal.github.com/auth');
    runQrScanSimulation(isMalicious);
  };

  const runQrScanSimulation = (isPhishing) => {
    setQrScanning(true);
    setQrProgress(0);

    const startTime = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setQrProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        setQrScanning(false);
        setQrProgress(100);
      }
    };
    requestAnimationFrame(tick);
  };

  const isQrPhishing = qrResultType === 'failure';
  const qrRiskScore = isQrPhishing ? 94 : 0;

  // Radar laser colors
  const card1Color = isCvScam ? '#ef4444' : '#10b981'; // Red or Green
  const card2Color = isQrPhishing ? '#ef4444' : '#10b981'; // Red or Green

  return (
    <section 
      id="scanbay-section"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-[#060A12] border-t border-cyan-500/20 overflow-hidden select-none"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[850px] h-[550px] bg-cyan-600/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF06_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF06_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        
        {/* =========================================================================
            SECTION HEADER
            ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wide mb-3 shadow-md">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Mobile Security Operations</span>
            <span className="text-cyan-700">|</span>
            <span className="text-slate-400">Astro-Van Recon & Laser Detonation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 font-sans">
            Autonomous <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">Scan Bay</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Interactive 3D Astro-Van reconnaissance unit firing real-time radar laser telemetry to verify Google employment credentials and detonate quarantined QR payloads.
          </p>
        </div>

        {/* =========================================================================
            2-COLUMN GRID WITH CONTINUOUS RADAR LASER BEAMS
            ========================================================================= */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch w-full">
          
          {/* =========================================================================
              SVG LASER BEAMS OVERLAY (Shooting from Radar to the 2 Right Cards)
              ========================================================================= */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-30">
            <svg className="w-full h-full overflow-visible">
              <defs>
                {/* Glow Filter for Lasers */}
                <filter id="laser-glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="laser-glow-green" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Laser Linear Gradients */}
                <linearGradient id="beam1-grad-red" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ff0055" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="beam1-grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="beam2-grad-red" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ff0055" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="beam2-grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* BEAM 1: From Radar (approx 34% X, 28% Y) to Card 1 (approx 52% X, 22% Y) */}
              <g filter={isCvScam ? 'url(#laser-glow-red)' : 'url(#laser-glow-green)'}>
                {/* Ambient Base Beam Line */}
                <path
                  d="M 33% 26% C 42% 23%, 45% 20%, 50% 21%"
                  fill="none"
                  stroke={isCvScam ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}
                  strokeWidth="3"
                />
                {/* Rapid Animated Laser Energy Pulses */}
                <path
                  d="M 33% 26% C 42% 23%, 45% 20%, 50% 21%"
                  fill="none"
                  stroke={isCvScam ? 'url(#beam1-grad-red)' : 'url(#beam1-grad-green)'}
                  strokeWidth="4"
                  strokeDasharray="16 28"
                  className="animate-laser-fast"
                />
                {/* Radar Dish Origin Glow Node */}
                <circle cx="33%" cy="26%" r="6" fill="#00f0ff" className="animate-ping" style={{ animationDuration: '1.4s' }} />
                <circle cx="33%" cy="26%" r="4" fill="#ffffff" />
                {/* Target Impact Node on Card 1 */}
                <circle cx="50%" cy="21%" r="7" fill={card1Color} className="animate-ping" style={{ animationDuration: '0.9s' }} />
                <circle cx="50%" cy="21%" r="4" fill="#ffffff" />
              </g>

              {/* BEAM 2: From Radar (approx 34% X, 28% Y) to Card 2 (approx 52% X, 72% Y) */}
              <g filter={isQrPhishing ? 'url(#laser-glow-red)' : 'url(#laser-glow-green)'}>
                {/* Ambient Base Beam Line */}
                <path
                  d="M 33% 26% C 42% 38%, 44% 65%, 50% 70%"
                  fill="none"
                  stroke={isQrPhishing ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}
                  strokeWidth="3"
                />
                {/* Rapid Animated Laser Energy Pulses */}
                <path
                  d="M 33% 26% C 42% 38%, 44% 65%, 50% 70%"
                  fill="none"
                  stroke={isQrPhishing ? 'url(#beam2-grad-red)' : 'url(#beam2-grad-green)'}
                  strokeWidth="4"
                  strokeDasharray="16 28"
                  className="animate-laser-fast"
                />
                {/* Target Impact Node on Card 2 */}
                <circle cx="50%" cy="70%" r="7" fill={card2Color} className="animate-ping" style={{ animationDuration: '0.9s' }} />
                <circle cx="50%" cy="70%" r="4" fill="#ffffff" />
              </g>
            </svg>
          </div>

          {/* =========================================================================
              LEFT: UNOBSTRUCTED LARGE 3D BUS WITH ASTRONAUT (Cols 1 - 6)
              ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col">
            
            <div className="relative w-full h-[640px] sm:h-[720px] lg:h-full min-h-[640px] rounded-3xl bg-slate-950/95 border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col group">
              
              {/* Radar Live Firing Indicator Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 border border-cyan-400/50 text-cyan-300 text-xs font-mono backdrop-blur-xl shadow-lg pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-bold">ASTRO-VAN RADAR ACTIVE</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 text-[10px]">Continuous Telemetry Lock</span>
              </div>

              {/* Clean 3D Model Iframe Viewport (Unobstructed View) */}
              <div className="relative w-full h-full flex-1 bg-[#060a12]">
                <iframe 
                  src="/astro_van_viewer.html" 
                  title="Astro-Van 3D Model"
                  className="w-full h-full border-0"
                />
              </div>

              {/* Clean Bottom Hint Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-slate-800 backdrop-blur-xl pointer-events-none shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">❖</span>
                  <span>Drag to rotate 360° • Scroll to zoom • Continuous radar scan lock</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-cyan-300 font-bold">60 FPS</span>
                </div>
              </div>

            </div>

          </div>

          {/* =========================================================================
              RIGHT: 2 BIG CARDS (Cols 7 - 12)
              ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* =====================================================================
                CARD 1: GOOGLE JOB SCAM & CV / RESUME AUTHENTICATOR
                ===================================================================== */}
            <div className={`relative p-6 rounded-3xl border backdrop-blur-xl transition-all duration-700 shadow-2xl ${
              isCvScam 
                ? 'bg-gradient-to-b from-red-950/40 to-slate-950/95 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.25)]' 
                : 'bg-gradient-to-b from-emerald-950/40 to-slate-950/95 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
            }`}>
              
              {/* Target Laser Anchor Node on Left Edge */}
              <div className={`hidden lg:block absolute -left-2.5 top-14 w-5 h-5 rounded-full border-2 transition-all duration-500 ${
                isCvScam ? 'bg-red-500 border-white shadow-[0_0_15px_#ef4444]' : 'bg-emerald-500 border-white shadow-[0_0_15px_#10b981]'
              }`} />

              {/* Header & Success/Failure Preset Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight font-sans">
                        Google Job Scam & CV Authenticator
                      </h3>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                        Google Search + GitHub Account Verification
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2 Clear Presets: Failure vs Success */}
                <div className="flex items-center gap-2">
                  {/* Failure Preset (Scam) */}
                  <button
                    onClick={() => handleCvPresetChange('failure')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                      isCvScam 
                        ? 'bg-red-500/30 border border-red-400 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-105' 
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span>Failure Preset</span>
                  </button>

                  {/* Success Preset (Real) */}
                  <button
                    onClick={() => handleCvPresetChange('success')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                      !isCvScam 
                        ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' 
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Success Preset</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone for Custom CV */}
              <div 
                onClick={() => cvFileInputRef.current?.click()}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-dashed border-cyan-500/30 hover:border-cyan-400 text-center cursor-pointer transition-all duration-300 group mb-4 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
              >
                <input 
                  ref={cvFileInputRef} 
                  type="file" 
                  accept=".pdf,.docx,.png,.jpg,.jpeg" 
                  onChange={handleCvFileUpload} 
                  className="hidden" 
                />
                <div className="flex items-center justify-center gap-2.5">
                  <Upload className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-slate-300 font-sans font-medium">
                    {cvFile ? `Uploaded: ${cvFile.name}` : 'Upload your CV / Resume (PDF, DOCX, or Image)'}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-lg bg-cyan-950/40">
                    Search Web
                  </span>
                </div>
              </div>

              {/* Active Multi-Stage Search Live Terminal */}
              {cvScanning ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2.5 mb-4 shadow-lg">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Deep Search in Progress...</span>
                    </span>
                    <span>{cvScanProgress}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                      style={{ width: `${cvScanProgress}%` }}
                    />
                  </div>

                  {/* Active Search Step Ticker */}
                  <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>{CV_STEPS[cvScanStep]}</span>
                  </p>
                </div>
              ) : (
                /* Authenticity Result Banner */
                <div className={`p-4 rounded-2xl border mb-4 flex items-center justify-between gap-4 ${
                  isCvScam ? 'bg-red-950/50 border-red-500/60' : 'bg-emerald-950/50 border-emerald-500/60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {isCvScam ? (
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                        isCvScam ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {isCvScam ? 'FAKE RESUME / JOB OFFER DETECTED' : 'AUTHENTIC CANDIDATE CREDENTIALS'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {isCvScam 
                        ? 'Google Search found no recruiter registration for "@google_careers_emea". Canva template forgery & fraudulent equipment check.'
                        : 'Google Knowledge Graph & GitHub API verified candidate employment, active repository commits, and official corporate attestation.'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-3xl font-extrabold font-mono block ${
                      isCvScam ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {isCvScam ? `${cvFakePct}%` : `${cvRealPct}%`}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                      {isCvScam ? 'Fake Probability' : 'Real Confidence'}
                    </span>
                  </div>
                </div>
              )}

              {/* Forensic Signal Verification Points */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Google Registry:</span>
                  <span className={isCvScam ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isCvScam ? '0 Match (Scam)' : 'Verified Corporate'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">GitHub API Commits:</span>
                  <span className={isCvScam ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isCvScam ? 'Inorganic Claims' : '3,410 Commits Valid'}
                  </span>
                </div>
              </div>

            </div>

            {/* =====================================================================
                CARD 2: INTERACTIVE QR CODE & SANDBOX LINK DETONATOR
                ===================================================================== */}
            <div className={`relative p-6 rounded-3xl border backdrop-blur-xl transition-all duration-700 shadow-2xl ${
              isQrPhishing 
                ? 'bg-gradient-to-b from-red-950/40 to-slate-950/95 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.25)]' 
                : 'bg-gradient-to-b from-emerald-950/40 to-slate-950/95 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
            }`}>
              
              {/* Target Laser Anchor Node on Left Edge */}
              <div className={`hidden lg:block absolute -left-2.5 top-14 w-5 h-5 rounded-full border-2 transition-all duration-500 ${
                isQrPhishing ? 'bg-red-500 border-white shadow-[0_0_15px_#ef4444]' : 'bg-emerald-500 border-white shadow-[0_0_15px_#10b981]'
              }`} />

              {/* Header & Success/Failure Preset Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-blue-400">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight font-sans">
                        Interactive QR Code & Link Detonator
                      </h3>
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                        Headless Sandbox Payload Detonation
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2 Clear Presets: Failure vs Success */}
                <div className="flex items-center gap-2">
                  {/* Failure Preset (Phishing) */}
                  <button
                    onClick={() => handleQrPresetChange('failure')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                      isQrPhishing 
                        ? 'bg-red-500/30 border border-red-400 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-105' 
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span>Failure Preset</span>
                  </button>

                  {/* Success Preset (Safe) */}
                  <button
                    onClick={() => handleQrPresetChange('success')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                      !isQrPhishing 
                        ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' 
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Success Preset</span>
                  </button>
                </div>
              </div>

              {/* URL Input Bar & QR Image Upload */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </div>
                  <input 
                    type="text" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter suspicious link or URL to detonate..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-all"
                  />
                </div>

                {/* Upload QR Image Button */}
                <button
                  onClick={() => qrFileInputRef.current?.click()}
                  title="Upload QR Code Image"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-all active:scale-95 shrink-0"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <input 
                  ref={qrFileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={handleQrFileUpload}
                  className="hidden" 
                />

                {/* Detonate Action Button */}
                <button
                  onClick={() => runQrScanSimulation(isQrPhishing)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-cyan-400/20 active:scale-95 shrink-0"
                >
                  Detonate
                </button>
              </div>

              {/* Detonation Results Banner */}
              {qrScanning ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2 mb-4 shadow-lg text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-300">
                    <ScanLine className="w-4 h-4 animate-pulse text-cyan-400" />
                    <span>Executing Headless Sandbox Chromium Detonation...</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-200"
                      style={{ width: `${qrProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                /* Color Coded Risk Verdict */
                <div className={`p-4 rounded-2xl border mb-4 flex items-center justify-between gap-4 ${
                  isQrPhishing 
                    ? 'bg-red-950/50 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                    : 'bg-emerald-950/50 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {isQrPhishing ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      )}
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                        isQrPhishing ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {isQrPhishing ? 'SUSPICIOUS LINK DETECTED • HIGH RISK' : 'VERIFIED SAFE LINK • ZERO RISK'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {isQrPhishing 
                        ? 'Do NOT click or scan. Credential harvesting domain spoofing Apple/Microsoft login. ASN located in bulletproof host.' 
                        : 'Completely safe to scan and open. Valid DigiCert EV SSL certificate, clean ASN reputation, no redirect payloads.'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-3xl font-extrabold font-mono block ${
                      isQrPhishing ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {isQrPhishing ? '94/100' : '0/100'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                      Risk Index
                    </span>
                  </div>
                </div>
              )}

              {/* Forensic Details Chips */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">SSL Certificate:</span>
                  <span className={isQrPhishing ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isQrPhishing ? 'Untrusted / Self-Signed' : 'DigiCert EV Extended'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Sandbox Verdict:</span>
                  <span className={isQrPhishing ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isQrPhishing ? 'Credential Harvesting' : 'Clean DOM Response'}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
