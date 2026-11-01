import React, { useState, useEffect, useRef } from 'react';
import { Activity, ShieldAlert, ShieldCheck, AlertTriangle, Radio, Volume2, CheckCircle2 } from 'lucide-react';

export default function ReactiveTelemetry() {
  const [riskVal, setRiskVal] = useState(78);
  const canvasRef = useRef(null);

  // Animate soundwave in Card 2
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const renderWave = () => {
      time += 0.04;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#060A14';
      ctx.fillRect(0, 0, w, h);

      // Draw center audio wave
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#00F0FF';

      for (let x = 0; x < w; x += 3) {
        const norm = (x / w) * Math.PI * 4;
        const envelope = Math.sin((x / w) * Math.PI);
        const y = h / 2 + Math.sin(norm + time * 3) * Math.cos(norm * 1.5 - time) * (h * 0.38) * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw frequency vertical spikes in the center
      const centerX = w / 2;
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      for (let i = -12; i <= 12; i += 4) {
        const spikeHeight = (Math.sin(time * 5 + i) * 0.4 + 0.5) * (h * 0.7);
        ctx.beginPath();
        ctx.moveTo(centerX + i, (h - spikeHeight) / 2);
        ctx.lineTo(centerX + i, (h + spikeHeight) / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section 
      id="telemetry-section"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#060A12] border-t border-cyan-500/20 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wide mb-3">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reactive Telemetry & Threat Decomposition</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-sans">
            Autonomous <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Risk Scoring</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Every ingested incident is decomposed into verified enterprise signals, unverified claims, and critical red flags.
          </p>
        </div>

        {/* =========================================================================
            BENTO GRID (Exact Visual Match to Video Scene 4 - Frame 288)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* ===================== CARD 1: REACTIVE RISK SCORE (Gauges 78%) ===================== */}
          <div className="md:col-span-4 p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block mb-4 font-bold">
              Reactive Risk Score
            </span>

            {/* Circular Gauge Arc */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#1E293B"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  strokeLinecap="round"
                />
                {/* Active Gradient Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#riskGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 0.75 * (riskVal / 100))}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                  {riskVal}%
                </span>
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider mt-1">
                  High Risk Threat
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Threat Level: CRITICAL</span>
              <span className="text-cyan-400">Gemini 1.5 Pro</span>
            </div>
          </div>

          {/* ===================== CARD 2: AUDIO WAVEFORM VISUALIZER ===================== */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Active Resonance Waveform</span>
              </span>
              <span className="text-emerald-400 font-bold">16 kHz Stream</span>
            </div>

            <canvas 
              ref={canvasRef} 
              width={400} 
              height={120} 
              className="w-full h-32 rounded-2xl bg-[#060A14] object-cover block border border-slate-800/80 my-2"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span>Formant Phase Match: <strong className="text-red-400">0.04% Unnatural</strong></span>
              <span className="text-cyan-400">Voice Vector</span>
            </div>
          </div>

          {/* ===================== CARD 3: ACTIVE SIGNALS PROGRESS ===================== */}
          <div className="md:col-span-3 p-6 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block mb-2 font-bold">
              Active Signals
            </span>

            <div className="my-auto space-y-3">
              <span className="text-3xl font-extrabold text-white font-mono block">
                20,520
              </span>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-cyan-400 rounded-full animate-pulse" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 block font-bold">
                5% Variance Tolerance
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              Live Buffer Pipeline
            </div>
          </div>

          {/* ===================== ROW 2: 3-WAY EVIDENCE BREAKDOWN ===================== */}
          <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            
            {/* Box 1: Verified Signals */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 backdrop-blur-xl shadow-md">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold font-sans">Verified Signals</span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                100% Cryptographic Match • DigiCert EV TLS 1.3 certificate chain authenticated.
              </p>
            </div>

            {/* Box 2: Unverified Claims */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 backdrop-blur-xl shadow-md">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-bold font-sans">Unverified Claims</span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                Domain registered 3 days ago • Missing standard corporate ICANN registration data.
              </p>
            </div>

            {/* Box 3: Critical Red Flags */}
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 backdrop-blur-xl shadow-md">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <ShieldAlert className="w-5 h-5" />
                <span className="text-sm font-bold font-sans">Critical Red Flags</span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                Advance-Fee check overpayment pattern + Unsanctioned Telegram handle @google_careers_emea.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

