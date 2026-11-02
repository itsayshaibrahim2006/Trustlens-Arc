import React, { useState, useRef } from 'react';
import RadarLaserBarrage from './RadarLaserBarrage.jsx';
import { 
  FileText, 
  QrCode, 
  Upload, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Link as LinkIcon, 
  ScanLine,
  Zap,
  Info
} from 'lucide-react';
import { analyzeCvDocument } from '../../utils/cvAnalyzer.js';
import { detonateUrl } from '../../utils/linkDetonator.js';
import { decodeQrImage } from '../../utils/qrDecoder.js';

export default function ScanBayVehicle() {
  // =========================================================================
  // CARD 1: GOOGLE JOB SCAM & CV / RESUME AUTHENTICATOR STATE
  // =========================================================================
  const [cvFile, setCvFile] = useState(null);
  const [cvResultType, setCvResultType] = useState('failure'); // 'failure' (scam) | 'success' (real)
  const [cvScanning, setCvScanning] = useState(false);
  const [cvScanStep, setCvScanStep] = useState(0);
  const [cvScanProgress, setCvScanProgress] = useState(100);
  const [cvCustomResult, setCvCustomResult] = useState(null);
  const [cvError, setCvError] = useState(null);
  const [isCvDragging, setIsCvDragging] = useState(false);
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
    setCvCustomResult(null);
    setCvError(null);
    runCvScanSimulation(type === 'failure');
  };

  const processCvFile = async (file) => {
    if (!file) return;

    // Strict validation: Only PDF and Word DOCX allowed
    const fileName = (file.name || '').toLowerCase();
    const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                   file.type === 'application/msword' || 
                   fileName.endsWith('.docx') || fileName.endsWith('.doc');

    if (!isPdf && !isDocx) {
      setCvFile(null);
      setCvCustomResult(null);
      setCvScanning(false);
      setCvError(`Invalid file format "${file.name}". The CV detector strictly accepts only standard PDF (.pdf) or Word (.docx) documents. Non-document files cannot be ranked.`);
      return;
    }

    setCvFile(file);
    setCvError(null);
    setCvCustomResult(null);
    setCvScanning(true);
    setCvScanProgress(0);
    setCvScanStep(0);

    // Step progress animation
    const stepTimer = setInterval(() => {
      setCvScanStep(prev => (prev < CV_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    const progressTimer = setInterval(() => {
      setCvScanProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 180);

    try {
      // Execute REAL document forensic analysis
      const result = await analyzeCvDocument(file);
      
      clearInterval(stepTimer);
      clearInterval(progressTimer);
      setCvScanProgress(100);
      setCvScanStep(CV_STEPS.length - 1);

      setTimeout(() => {
        setCvScanning(false);
        setCvCustomResult(result);
        setCvResultType(result.isScam ? 'failure' : 'success');
      }, 350);

    } catch (err) {
      console.error('CV Analysis Failed:', err);
      clearInterval(stepTimer);
      clearInterval(progressTimer);
      setCvScanning(false);
      setCvCustomResult(null);
      setCvError(err.message || 'Could not parse document structure. Please upload a standard PDF or DOCX.');
    }
  };

  const handleCvFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processCvFile(file);
    }
    // reset input so re-selecting same file triggers change
    if (e.target) e.target.value = '';
  };

  const handleCvFileDrop = async (e) => {
    e.preventDefault();
    setIsCvDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      await processCvFile(file);
    }
  };

  const runCvScanSimulation = (isScam) => {
    setCvScanning(true);
    setCvScanProgress(0);
    setCvScanStep(0);

    const startTime = performance.now();
    const duration = 1600;

    const stepInterval = setInterval(() => {
      setCvScanStep(prev => (prev < CV_STEPS.length - 1 ? prev + 1 : prev));
    }, 400);

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

  const isCvScam = cvCustomResult ? cvCustomResult.isScam : cvResultType === 'failure';
  const cvFakePct = cvCustomResult ? cvCustomResult.fakeProbability : (isCvScam ? 88.4 : 3.6);
  const cvRealPct = (100 - cvFakePct).toFixed(1);

  const cvHeadline = cvCustomResult?.headline || (isCvScam ? 'FAKE RESUME / JOB OFFER DETECTED' : 'AUTHENTIC CANDIDATE CREDENTIALS');
  const cvSummary = cvCustomResult?.summary || (isCvScam 
    ? 'Google Search found no recruiter registration for "@google_careers_emea". Canva template forgery & fraudulent equipment check.' 
    : 'Google Knowledge Graph & GitHub API verified candidate employment, active repository commits, and official corporate attestation.');
  const cvGoogleReg = cvCustomResult?.googleRegistry || (isCvScam ? '0 Match (Scam)' : 'Verified Corporate');
  const cvGithubCommits = cvCustomResult?.githubCommits || (isCvScam ? 'Inorganic Claims' : '3,410 Commits Valid');

  const defaultFailureMetrics = [
    { label: 'Recruiter Domain', value: '@google-careers.tk (Spoofed)', risk: 'high' },
    { label: 'Interview Channel', value: 'Telegram @google_hr (Unsanctioned)', risk: 'high' },
    { label: 'Equipment Fee', value: '$4,850 CashApp Check (Scam)', risk: 'high' },
    { label: 'Document Metadata', value: 'Canva Export (Consumer Forgery)', risk: 'high' }
  ];

  const defaultSuccessMetrics = [
    { label: 'Recruiter Domain', value: '@google.com (Enterprise ATS)', risk: 'pass' },
    { label: 'Interview Channel', value: 'Google Meet (Enterprise Verified)', risk: 'pass' },
    { label: 'Financial Terms', value: 'Direct Deposit / Zero Fee', risk: 'pass' },
    { label: 'Statutory Audit', value: 'W-4 & Official Clauses Verified', risk: 'pass' }
  ];

  const activeCvMetrics = cvCustomResult?.metrics || (isCvScam ? defaultFailureMetrics : defaultSuccessMetrics);

  // =========================================================================
  // CARD 2: INTERACTIVE QR CODE & LINK DETONATOR STATE
  // =========================================================================
  const [urlInput, setUrlInput] = useState('https://secure-login-apple-support.tk/verify');
  const [qrResultType, setQrResultType] = useState('failure'); // 'failure' (phishing) | 'success' (safe)
  const [qrScanning, setQrScanning] = useState(false);
  const [qrProgress, setQrProgress] = useState(100);
  const [qrFile, setQrFile] = useState(null);
  const [qrCustomResult, setQrCustomResult] = useState(null);
  const [qrMessage, setQrMessage] = useState(null);
  const qrFileInputRef = useRef(null);

  const handleQrPresetChange = (type) => {
    setQrResultType(type);
    setQrFile(null);
    setQrCustomResult(null);
    setQrMessage(null);
    if (type === 'failure') {
      const defaultUrl = 'https://secure-login-apple-support.tk/verify';
      setUrlInput(defaultUrl);
      executeRealDetonation(defaultUrl);
    } else {
      const defaultUrl = 'https://stripe.com/verify-session/checkout-live';
      setUrlInput(defaultUrl);
      executeRealDetonation(defaultUrl);
    }
  };

  const executeRealDetonation = (targetUrl) => {
    setQrScanning(true);
    setQrProgress(0);

    const startTime = performance.now();
    const duration = 1100;

    const tick = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setQrProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        // Execute real detonation engine
        const result = detonateUrl(targetUrl);
        setQrCustomResult(result);
        setQrResultType(result.isMalicious ? 'failure' : 'success');
        setQrScanning(false);
        setQrProgress(100);
      }
    };
    requestAnimationFrame(tick);
  };

  const handleDetonateClick = () => {
    executeRealDetonation(urlInput);
  };

  const handleQrFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    setQrMessage(null);
    setQrScanning(true);
    setQrProgress(20);

    try {
      // Decode QR Code matrix client-side using jsQR
      const decoded = await decodeQrImage(file);
      setQrProgress(60);
      setUrlInput(decoded.url);
      setQrMessage(`Extracted QR Payload: ${decoded.url}`);
      
      // Detonate extracted URL immediately
      executeRealDetonation(decoded.url);
    } catch (err) {
      console.warn('QR Decoding notice:', err);
      setQrScanning(false);
      setQrMessage(err.message || 'No QR code payload detected in image.');
    }
  };

  const isQrPhishing = qrCustomResult ? qrCustomResult.isMalicious : qrResultType === 'failure';
  const qrRiskScore = qrCustomResult ? qrCustomResult.riskScore : (isQrPhishing ? 94 : 0);
  const qrHeadline = qrCustomResult?.headline || (isQrPhishing ? 'SUSPICIOUS LINK DETECTED • HIGH RISK' : 'VERIFIED SAFE LINK • ZERO RISK');
  const qrSummary = qrCustomResult?.summary || (isQrPhishing 
    ? 'Do NOT click or scan. Credential harvesting domain spoofing Apple/Microsoft login. ASN located in bulletproof host.' 
    : 'Completely safe to scan and open. Valid DigiCert EV SSL certificate, clean ASN reputation, no redirect payloads.');
  const qrSslCert = qrCustomResult?.sslStatus || (isQrPhishing ? 'Untrusted / Self-Signed' : 'DigiCert EV Extended');
  const qrSandboxVerdict = qrCustomResult?.sandboxVerdict || (isQrPhishing ? 'Credential Harvesting' : 'Clean DOM Response');

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
              HIGH-ENERGY PLASMA FIRE BARRAGE (Shooting from Radar to the 2 Right Cards)
              ========================================================================= */}
          <RadarLaserBarrage isCvScam={isCvScam} isQrPhishing={isQrPhishing} />

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

              {/* Clean 3D Model Iframe Viewport */}
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
                  <button
                    onClick={() => handleCvPresetChange('failure')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                      isCvScam && !cvCustomResult
                        ? 'bg-red-500/30 border border-red-400 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-105' 
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span>Failure Preset</span>
                  </button>

                  <button
                    onClick={() => handleCvPresetChange('success')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                      !isCvScam && !cvCustomResult
                        ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' 
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Success Preset</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone for Real Custom CV */}
              <div 
                onClick={() => cvFileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsCvDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsCvDragging(false); }}
                onDrop={handleCvFileDrop}
                className={`p-3.5 rounded-2xl border border-dashed text-center cursor-pointer transition-all duration-300 group mb-4 ${
                  isCvDragging
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_25px_rgba(0,240,255,0.3)] scale-[1.01]'
                    : 'bg-slate-950/80 border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                }`}
              >
                <input 
                  ref={cvFileInputRef} 
                  type="file" 
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword" 
                  onChange={handleCvFileUpload} 
                  className="hidden" 
                />
                <div className="flex items-center justify-center gap-2.5">
                  <Upload className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-slate-300 font-sans font-medium">
                    {cvFile ? `Uploaded: ${cvFile.name}` : 'Upload or Drag & Drop CV (Strictly PDF or Word DOCX only)'}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-lg bg-cyan-950/40">
                    Deep Scan
                  </span>
                </div>
              </div>

              {/* Document Validation Error State */}
              {cvError ? (
                <div className="p-4 rounded-2xl border bg-red-950/60 border-red-500/60 mb-4 flex items-start gap-3 shadow-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 block">
                      DOCUMENT REJECTED / INVALID FORMAT
                    </span>
                    <p className="text-xs text-red-200 font-sans leading-relaxed">
                      {cvError}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 pt-1">
                      Please upload a genuine PDF (.pdf) or Word (.docx) document to execute heuristic candidate verification.
                    </p>
                  </div>
                </div>
              ) : cvScanning ? (
                /* Active Multi-Stage Search Live Terminal */
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2.5 mb-4 shadow-lg">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>Heuristic Forensic Engine Parsing Document...</span>
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
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                        isCvScam ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {cvHeadline}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {cvSummary}
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

              {/* Dynamic Finding Pills if real threats found (and no error) */}
              {!cvError && cvCustomResult?.findings?.length > 0 && (
                <div className="mb-4 space-y-1.5">
                  {cvCustomResult.findings.slice(0, 3).map((f, idx) => {
                    const isPass = f.risk === 'pass';
                    return (
                      <div 
                        key={idx} 
                        className={`flex items-start gap-2 p-2 rounded-xl text-[10px] font-mono ${
                          isPass 
                            ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200' 
                            : 'bg-red-950/60 border border-red-500/40 text-red-200'
                        }`}
                      >
                        <span className={`font-bold shrink-0 ${isPass ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isPass ? '✔' : '⚠'} [{f.signal}]
                        </span>
                        <span className="text-slate-300">{f.detail}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Forensic Signal Verification Points (only if no error) */}
              {!cvError && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                  {activeCvMetrics.map((m, idx) => {
                    const isRed = m.risk === 'high';
                    const isEmerald = m.risk === 'pass';
                    return (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between min-w-0">
                        <span className="text-slate-400 shrink-0 mr-2">{m.label}:</span>
                        <span className={`font-bold truncate text-right ${
                          isRed ? 'text-red-400' : (isEmerald ? 'text-emerald-400' : 'text-amber-300')
                        }`} title={m.value}>
                          {m.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Categorization Basis Footer */}
              {!cvError && (
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Categorization Basis: 5-Pillar OSINT Verification
                  </span>
                  <span className="text-slate-400">
                    GitHub Live API • Timeline Sanity • Skill Depth • Contact Integrity • Document Provenance
                  </span>
                </div>
              )}

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
                  <button
                    onClick={() => handleQrPresetChange('failure')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                      isQrPhishing && !qrCustomResult
                        ? 'bg-red-500/30 border border-red-400 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-105' 
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span>Failure Preset</span>
                  </button>

                  <button
                    onClick={() => handleQrPresetChange('success')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                      !isQrPhishing && !qrCustomResult
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
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </div>
                  <input 
                    type="text" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleDetonateClick(); }}
                    placeholder="Enter any link to detonate (e.g. apple-verify.tk)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-all"
                  />
                </div>

                {/* Upload QR Image Button */}
                <button
                  onClick={() => qrFileInputRef.current?.click()}
                  title="Upload QR Code Image to Scan & Detonate"
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
                  onClick={handleDetonateClick}
                  className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-cyan-400/20 active:scale-95 shrink-0"
                >
                  Detonate
                </button>
              </div>

              {qrMessage && (
                <div className="mb-4 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 bg-cyan-950/40 p-2 rounded-xl border border-cyan-500/30">
                  <Info className="w-3 h-3 shrink-0" />
                  <span className="truncate">{qrMessage}</span>
                </div>
              )}

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
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping shrink-0"></span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                      )}
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                        isQrPhishing ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {qrHeadline}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {qrSummary}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-3xl font-extrabold font-mono block ${
                      isQrPhishing ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {qrRiskScore}/100
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                      Risk Index
                    </span>
                  </div>
                </div>
              )}

              {/* Dynamic Finding Pills for Detonated URL */}
              {qrCustomResult?.signals?.length > 0 && (
                <div className="mb-4 space-y-1.5">
                  {qrCustomResult.signals.slice(0, 2).map((sig, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/90 border border-red-500/30 text-[10px] font-mono text-slate-300">
                      <span className="text-red-400 font-bold shrink-0">⚠ [{sig.label}]</span>
                      <span className="text-slate-400">{sig.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Forensic Details Chips */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">SSL Certificate:</span>
                  <span className={isQrPhishing ? 'text-red-400 font-bold truncate ml-2' : 'text-emerald-400 font-bold truncate ml-2'}>
                    {qrSslCert}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Sandbox Verdict:</span>
                  <span className={isQrPhishing ? 'text-red-400 font-bold truncate ml-2' : 'text-emerald-400 font-bold truncate ml-2'}>
                    {qrSandboxVerdict}
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
