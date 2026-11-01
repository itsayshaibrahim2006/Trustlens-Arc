import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Cpu, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

const AUDIO_SAMPLES = {
  SYNTHETIC: {
    id: 'synthetic-ceo',
    name: 'CEO Urgent Voice Wire (Synthetic Neural Clone)',
    speaker: 'David Sterling (Impersonated CEO)',
    duration: '00:38',
    syntheticProb: 96.8,
    status: 'SYNTHETIC VOICE CLONE DETECTED',
    isThreat: true,
    transcript: '"Arthur, it\'s David. I\'m stepping into a confidential board meeting for the Singapore acquisition. We have a hard close deadline at 2 PM SGT. You need to release $48,500 immediately to Vertex Apex Pte Ltd. Bypass the dual-authorization rule just for this tranche."',
    metrics: {
      pitchJitter: '0.04%',
      pitchJitterStatus: 'Unnaturally Flat (AI Characteristic)',
      formantShimmer: '0.12 dB',
      formantShimmerStatus: 'Lacks Biological Micro-Tremor',
      noiseFloor: '-92 dB (Artificial Zero-Floor)',
      vocalTractPhase: 'High Phase Artifact Mismatch'
    },
    artifacts: [
      'Unnatural fundamental frequency (F0) stability over continuous phonemes',
      'Phase incoherence at 3.4 kHz characteristic of diffusion vocoders',
      'Zero biological micro-glottal aspiration between syllables'
    ]
  },
  AUTHENTIC: {
    id: 'authentic-human',
    name: 'Authentic Executive Conference Call (Human Control)',
    speaker: 'David Sterling (Verified Natural Voice)',
    duration: '00:32',
    syntheticProb: 1.4,
    status: 'AUTHENTIC HUMAN BIOMETRICS VERIFIED',
    isThreat: false,
    transcript: '"Good morning everyone. Let us review the Q3 infrastructure capital expenditure report. Please make sure all compliance forms go through standard dual-key authorization before end of month."',
    metrics: {
      pitchJitter: '1.86%',
      pitchJitterStatus: 'Normal Human Vocal Dynamics',
      formantShimmer: '1.45 dB',
      formantShimmerStatus: 'Natural Biological Glottal Variation',
      noiseFloor: '-58 dB (Natural Room Reverberation)',
      vocalTractPhase: 'Coherent Biological Harmonics'
    },
    artifacts: [
      'Natural micro-vocal tremor present across all vowel formants',
      'Natural glottal aspiration and atmospheric room reverberation',
      'Consistent physical vocal tract resonance across sentence transitions'
    ]
  }
};

export default function AudioDeepfakeScanner() {
  const [selectedSampleKey, setSelectedSampleKey] = useState('SYNTHETIC');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const animFrameRef = useRef(null);

  const sample = AUDIO_SAMPLES[selectedSampleKey];

  // Procedural Web Audio API sound simulation + Canvas Spectrogram
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const renderSpectrogram = () => {
      time += isPlaying ? 0.05 : 0.01;
      const w = canvas.width;
      const h = canvas.height;

      // Dark background
      ctx.fillStyle = '#060A12';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = '#00F0FF15';
      ctx.lineWidth = 1;
      for (let y = 30; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw frequency spectrum bands
      const numBands = 64;
      const bandWidth = w / numBands;

      for (let i = 0; i < numBands; i++) {
        const freqRatio = i / numBands;
        let amplitude;

        if (selectedSampleKey === 'SYNTHETIC') {
          // Synthetic: overly regular, rigid peaks with high-frequency noise bursts
          const base = Math.sin(time * 3 + i * 0.4) * 0.4 + 0.5;
          const harmonic = Math.sin(time * 6 + i * 0.8) * 0.3;
          const artificialSpike = (i % 7 === 0) ? 0.35 : 0;
          amplitude = isPlaying ? (base + harmonic + artificialSpike) : (base * 0.3 + 0.1);
        } else {
          // Authentic: organic variation, smooth decay, natural formant clusters
          const base = Math.sin(time * 2.2 + i * 0.25) * 0.3 + 0.4;
          const organicJitter = Math.cos(time * 4.1 + i * 0.7) * 0.25;
          const falloff = Math.exp(-freqRatio * 2.5);
          amplitude = isPlaying ? ((base + organicJitter) * falloff * 1.4) : (base * falloff * 0.4 + 0.08);
        }

        const barHeight = Math.min(h * 0.85, Math.max(8, amplitude * h * 0.75));
        const x = i * bandWidth;
        const y = h - barHeight;

        // Gradient color: Red/Amber for Synthetic, Cyan/Emerald for Authentic
        const grad = ctx.createLinearGradient(0, h, 0, y);
        if (selectedSampleKey === 'SYNTHETIC') {
          grad.addColorStop(0, '#00F0FF40');
          grad.addColorStop(0.5, '#F59E0B90');
          grad.addColorStop(1, '#EF4444');
        } else {
          grad.addColorStop(0, '#00F0FF30');
          grad.addColorStop(0.6, '#06B6D4');
          grad.addColorStop(1, '#10B981');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x + 1, y, bandWidth - 2, barHeight);
      }

      // Animated scan line across spectrogram
      const scanX = ((time * 40) % w);
      ctx.strokeStyle = selectedSampleKey === 'SYNTHETIC' ? '#EF444480' : '#10B98180';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, h);
      ctx.stroke();

      animId = requestAnimationFrame(renderSpectrogram);
    };

    renderSpectrogram();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, selectedSampleKey]);

  // Handle Play / Pause using Web Audio API procedural sound
  const togglePlay = () => {
    if (!isPlaying) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Modulate frequency to mimic voice tone
        osc.type = selectedSampleKey === 'SYNTHETIC' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(selectedSampleKey === 'SYNTHETIC' ? 140 : 125, ctx.currentTime);

        gain.gain.setValueAtTime(isMuted ? 0 : 0.05, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        gainRef.current = gain;
      } catch (err) {
        console.warn('AudioContext not allowed or supported', err);
      }
      setIsPlaying(true);
    } else {
      stopAudio();
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  // Time ticker while playing
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => (prev >= 32 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const switchSample = (key) => {
    stopAudio();
    setIsPlaying(false);
    setCurrentTime(0);
    setSelectedSampleKey(key);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
      
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all ${
        sample.isThreat ? 'bg-red-500/10' : 'bg-emerald-500/10'
      }`} />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Neural Biometric Voice Forensics</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Audio Deepfake Spectrogram & Voice Scanner
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time acoustic decomposition detecting AI vocal synthesis and pitch manipulation.
          </p>
        </div>

        {/* Sample Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => switchSample('SYNTHETIC')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              selectedSampleKey === 'SYNTHETIC'
                ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-md shadow-red-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Synthetic CEO Clone</span>
          </button>

          <button
            onClick={() => switchSample('AUTHENTIC')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              selectedSampleKey === 'AUTHENTIC'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Human Voice Control</span>
          </button>
        </div>
      </div>

      {/* Visual Spectrogram Canvas Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#060A12] mb-6 shadow-inner">
        
        {/* Top Overlay Badge */}
        <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 backdrop-blur-sm">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>FFT 1024 Spectrum Waterfall (0 Hz – 16 kHz)</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold border backdrop-blur-sm ${
            sample.isThreat 
              ? 'bg-red-950/80 border-red-500/50 text-red-300' 
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
          }`}>
            <span>{sample.status}</span>
          </div>
        </div>

        {/* Canvas Element */}
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={200} 
          className="w-full h-44 sm:h-52 object-cover block"
        />

        {/* Audio Player Controls Bar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shadow-md ${
                sample.isThreat
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => { stopAudio(); setIsPlaying(false); setCurrentTime(0); }}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="font-mono text-xs text-slate-300">
              <span className="text-white font-bold">
                00:{String(currentTime).padStart(2, '0')}
              </span>
              <span className="text-slate-500"> / {sample.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (gainRef.current && audioCtxRef.current) {
                  gainRef.current.gain.setValueAtTime(!isMuted ? 0 : 0.05, audioCtxRef.current.currentTime);
                }
              }}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Synthetic Probability</span>
              <span className={`text-sm font-mono font-extrabold ${sample.isThreat ? 'text-red-400' : 'text-emerald-400'}`}>
                {sample.syntheticProb}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Transcript & Biometric Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Transcript Box */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 uppercase font-bold">Captured Audio Transcript:</span>
              <span>Speaker: {sample.speaker}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed font-sans bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              {sample.transcript}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase font-bold">
              Detected Forensic Artifacts:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {sample.artifacts.map((art, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={`mt-0.5 text-xs ${sample.isThreat ? 'text-red-400' : 'text-emerald-400'}`}>•</span>
                  <span>{art}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Technical Biometrics Radar */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 font-mono text-xs">
          <span className="text-cyan-400 uppercase font-bold block mb-1">
            Biometric Metric Breakdown:
          </span>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Pitch Jitter (F0):</span>
            <div className="text-right">
              <span className={`font-bold ${sample.isThreat ? 'text-red-400' : 'text-emerald-400'}`}>
                {sample.metrics.pitchJitter}
              </span>
              <span className="text-[10px] text-slate-400 block">{sample.metrics.pitchJitterStatus}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Formant Shimmer:</span>
            <div className="text-right">
              <span className="font-bold text-white">{sample.metrics.formantShimmer}</span>
              <span className="text-[10px] text-slate-400 block">{sample.metrics.formantShimmerStatus}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Acoustic Floor:</span>
            <span className="font-bold text-cyan-300">{sample.metrics.noiseFloor}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Vocal Phase:</span>
            <span className={`font-bold ${sample.isThreat ? 'text-red-400' : 'text-emerald-400'}`}>
              {sample.metrics.vocalTractPhase}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

