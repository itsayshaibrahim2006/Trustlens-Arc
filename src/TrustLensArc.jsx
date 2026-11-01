import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Globe,
  UploadCloud,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Search,
  RefreshCw,
  Terminal,
  Radio,
  FileCheck,
  Send,
  Download,
  Share2,
  ChevronRight,
  Info,
  Lock,
  Server,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  UserCheck,
  Check,
  X,
  FileSearch,
  Eye,
  Sliders,
  Bell
} from 'lucide-react';

// ==========================================
// MOCK DATA PRESETS (Real-World Enterprise Security Scenarios)
// ==========================================

const PRESETS = {
  JOB_SCAM: {
    id: 'TL-8942-JS',
    name: 'Google Executive Job Scam (PDF Letterhead + Telegram Recruiter)',
    format: 'pdf',
    riskScore: 88,
    status: 'CRITICAL THREAT',
    statusColor: 'threat',
    category: 'Advance-Fee Employment Fraud',
    fileName: 'Google_Senior_Staff_Offer_Letter_Q4.pdf',
    fileSize: '1.84 MB',
    fileHash: 'e7c8b420f18d7b3a964821a084bc63b194d35e18',
    url: 'https://careers-google-verify.net/onboarding/candidate-tl8924',
    summary: 'High-confidence synthetic impersonation. Fabricated Google letterhead instructing candidate to contact an unsanctioned Telegram handle and accept a counterfeit equipment stipend check.',
    metrics: {
      syntheticProb: 91.4,
      infrastructureRisk: 95.0,
      domainReputation: 14,
      channelLegitimacy: 0,
      confidence: 96.8
    },
    ocrText: `GOOGLE LLC — EMPLOYMENT OFFER & CONFIDENTIAL ENGAGEMENT AGREEMENT
Mountain View, California 94043

Dear Candidate,

Following our executive review of your portfolio, we are pleased to offer you the position of Senior Principal Systems Architect at Google Cloud. 

COMPENSATION & LOGISTICS:
• Base Salary: $195,000 USD / Annual
• Remote Office Setup Stipend: $2,450 USD (Issued via verified bank cashier check)
• Equipment Acquisition: You are required to purchase Apple Silicon hardware exclusively from our certified vendor portal at http://equipment-sentinel-logistics.com within 48 hours of check deposit.

ONBOARDING CONTACT:
For identity validation and instant background onboarding, contact Senior Talent Director Dr. Marcus Vance on Telegram: @google_careers_emea. Do not contact standard HR channels until Telegram clearance is completed.

Authorized Digital Signature:
Sarah Jenkins, VP People Operations, Google LLC
Ref ID: GOOG-ENG-2026-9921`,
    flaggedTokens: [
      {
        token: '@google_careers_emea',
        type: 'CRITICAL',
        title: 'Unsanctioned Recruitment Channel',
        desc: 'Google corporate recruiting never operates over Telegram. Known vector for unmonitored advance-fee scams.'
      },
      {
        token: 'Remote Office Setup Stipend: $2,450 USD (Issued via verified bank cashier check)',
        type: 'CRITICAL',
        title: 'Advance-Fee Check Overpayment Pattern',
        desc: 'Classic scam signature: Candidate deposits fraudulent check, buys gear from scammer-owned vendor portal, then bank reverses deposit.'
      },
      {
        token: 'equipment-sentinel-logistics.com',
        type: 'CRITICAL',
        title: 'Unregistered Vendor Entity',
        desc: 'Domain registered 3 days ago. No SSL EV validation, hosted on bulletproof Russian AS44050 infrastructure.'
      },
      {
        token: 'Sarah Jenkins, VP People Operations',
        type: 'HIGH',
        title: 'Impersonated Executive Identity',
        desc: 'Persona signature extracted from a 2021 Canva template. No record of this VP in Google Mountain View hierarchy.'
      }
    ],
    aiAssessment: {
      geminiVerdict: 'SYNTHETIC IMPERSONATION DETECTED',
      modelUsed: 'Gemini 1.5 Pro Multi-Modal Reasoning Engine (v2.4-Enterprise)',
      languageCoherence: 'High stylistic imitation with structural syntax anomalies',
      reasoning: [
        'Urgency framing ("within 48 hours of check deposit") violates standard corporate hiring windows.',
        'Document kerning and raster compression around Google logo indicate bitmap paste over Canva PDF template (PDF Producer: Canva/Skia 2.1).',
        'Contradiction detected: Mountain View legal entity claims EMEA-specific recruiter Telegram handle (@google_careers_emea).'
      ],
      syntheticConfidence: 94.2
    },
    infrastructure: {
      domain: 'careers-google-verify.net',
      registrar: 'NameCheap Inc. (Privacy Shield Protected)',
      ageDays: 4,
      createdDate: 'Oct 26, 2026',
      ip: '194.26.29.112 (AS44050 - Moscow, RU)',
      dnsMx: 'mail.careers-google-verify.net (Missing Google Workspace MX)',
      spfRecord: 'v=spf1 ~all (SoftFail - Spoofing Permitted)',
      dmarc: 'p=none (No enforcement policy)',
      sslIssuer: "Let's Encrypt Authority X3 (90-day DV Cert)",
      sslStatus: 'Invalid Subject Alt Name (Google LLC EV Cert Missing)'
    },
    riskMap: [
      { claim: 'Authorized Google Mountain View Employment Agreement', verified: false, detail: 'Document metadata created via Canva. Missing corporate DocuSign envelope and cryptographic signature.' },
      { claim: 'Corporate Email Communications', verified: false, detail: 'Originates from third-party SMTP server without SPF/DKIM alignment with google.com.' },
      { claim: 'Standard Remote Hardware Stipend Check', verified: false, detail: 'Instructs victim to deposit non-guaranteed check and wire personal funds to unverified vendor.' },
      { claim: 'Recruiting Talent Partner Identity', verified: false, detail: 'Executive signature block cloned from public web asset; Telegram handle belongs to known scam syndicate.' },
      { claim: 'Standard Google Cloud JD Terminology', verified: true, detail: 'Role specification and requirements were scraped from a legitimate public Google Careers post.' }
    ]
  },
  DEEPFAKE_WIRE: {
    id: 'TL-9104-DF',
    name: 'Executive Deepfake Audio & Urgent Wire Instruction',
    format: 'text',
    riskScore: 94,
    status: 'SEVERE IMPERSONATION',
    statusColor: 'threat',
    category: 'Executive Voice Synthesis & BEC',
    fileName: 'CEO_Urgent_Call_Transcript_Wire.txt',
    fileSize: '42.1 KB',
    fileHash: '8a91b2c4e3f5d6a7890123456789abcdef123456',
    url: 'internal://voip-gateway-recording/stream-9104',
    summary: 'Critical threat. Synthetic voice cloned from CEO public keynote, accompanied by an urgent spoofed email directing a $48,500 emergency wire transfer to an offshore entity.',
    metrics: {
      syntheticProb: 96.8,
      infrastructureRisk: 92.0,
      domainReputation: 8,
      channelLegitimacy: 5,
      confidence: 98.2
    },
    ocrText: `TRANSCRIPT: EXECUTIVE EMERGENCY VOIP INCOMING [CASE #TL-9104]
Caller ID: +1 (650) 555-0199 (Spoofed Palo Alto Caller ID)
Target: Arthur Pendelton, VP Corporate Treasury

[00:04] "Arthur, it's David. I'm stepping into a confidential board meeting for the Singapore acquisition. We have a hard close deadline at 2 PM SGT. The escrow account details changed due to compliance."
[00:18] "I sent the swift wire instructions to your inbox right now. You need to release $48,500 immediately to Vertex Apex Pte Ltd. Bypass the dual-authorization rule just for this tranche; I will countersign as soon as I land."
[00:32] "Do not call my cell, board room has zero cell coverage. Confirm execution by reply email to david.ceo@acme-ventures-holding.co."`,
    flaggedTokens: [
      {
        token: 'david.ceo@acme-ventures-holding.co',
        type: 'CRITICAL',
        title: 'Typosquatted Lookalike Domain',
        desc: 'Actual corporate domain is acme-ventures.com. The .co holding domain was registered 12 hours ago.'
      },
      {
        token: 'Bypass the dual-authorization rule',
        type: 'CRITICAL',
        title: 'Internal Control Circumvention Trigger',
        desc: 'Textbook social engineering tactic designed to induce urgency and panic treasury personnel into protocol violations.'
      },
      {
        token: 'Vertex Apex Pte Ltd',
        type: 'CRITICAL',
        title: 'Shell Entity in High-Risk Escrow Jurisdiction',
        desc: 'Entity unlisted in ACRA Singapore corporate registry. Bank beneficiary routing points to an unverified intermediary.'
      }
    ],
    aiAssessment: {
      geminiVerdict: 'SYNTHETIC VOICE & BEC ATTACK',
      modelUsed: 'Gemini 1.5 Pro Multi-Modal Audio-Linguistic Pipeline',
      languageCoherence: 'Voice cadence exhibits typical ElevenLabs / RVC latent pitch jitter',
      reasoning: [
        'Spectral pitch analysis reveals 16kHz resampled artifacts typical of low-tier generative neural vocoders.',
        'High urgency markers coupled with uncharacteristic protocol bypass requests.',
        'Spoofed Caller ID routed through Twilio free trial trunk (IP: 54.244.51.10).'
      ],
      syntheticConfidence: 97.4
    },
    infrastructure: {
      domain: 'acme-ventures-holding.co',
      registrar: 'Porkbun LLC (Registered 12 hrs ago)',
      ageDays: 0,
      createdDate: 'Oct 30, 2026',
      ip: '45.142.214.19 (CyberGhost VPN Exit Node - Frankfurt)',
      dnsMx: 'mail.acme-ventures-holding.co',
      spfRecord: 'v=spf1 +ip4:45.142.214.19 -all',
      dmarc: 'v=DMARC1; p=reject (Self-asserted on fake domain)',
      sslIssuer: 'ZeroSSL DV RSA 2026',
      sslStatus: 'Valid for fake domain, but flagged as brand impersonation'
    },
    riskMap: [
      { claim: 'CEO Caller Identity Verification', verified: false, detail: 'Audio acoustic profile matches ElevenLabs v2 voice clone synthesized from 2025 TechCrunch interview.' },
      { claim: 'Legitimate Singapore Acquisition Escrow', verified: false, detail: 'No acquisition filing exists. Beneficiary company is an unregistered shell.' },
      { claim: 'Authorized Protocol Bypass', verified: false, detail: 'Internal policy strictly forbids unilateral executive wire authorizations over $10,000.' },
      { claim: 'Executive Domain Communications', verified: false, detail: 'Sender domain differs by 8 characters from official corporate root.' }
    ]
  },
  LEGIT_STRIPE: {
    id: 'TL-7721-OK',
    name: 'Legitimate Stripe Partner Integration Agreement',
    format: 'pdf',
    riskScore: 11,
    status: 'VERIFIED AUTHENTIC',
    statusColor: 'verified',
    category: 'Commercial SaaS Agreement',
    fileName: 'Stripe_Enterprise_Connect_Agreement_2026.pdf',
    fileSize: '3.12 MB',
    fileHash: '3f847291a82b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    url: 'https://dashboard.stripe.com/agreements/connect-ent-7721',
    summary: 'Cryptographically authentic agreement. Verified DocuSign envelope chain, strict DKIM signature from stripe.com, and valid Extended Validation (EV) SSL certificate from DigiCert.',
    metrics: {
      syntheticProb: 4.1,
      infrastructureRisk: 2.0,
      domainReputation: 99,
      channelLegitimacy: 100,
      confidence: 99.4
    },
    ocrText: `STRIPE, INC. — CONNECT PLATFORM SERVICE AGREEMENT
510 Townsend Street, San Francisco, CA 94103

This Platform Service Agreement is entered into between Stripe, Inc. and Authorized Enterprise Merchant.

1. SCOPE OF SERVICES:
Stripe shall furnish managed payment routing, PCI-DSS Level 1 compliant vaulting, and automated settlement infrastructure as defined under Schedule A.

2. AUTHENTICATION & SECURITY:
All API interactions must enforce TLS 1.3 with cryptographic mutual authentication using OAuth 2.0 Client Credentials or restricted API keys (rk_live_...).

Signed via DocuSign Certificate of Completion:
DocuSign Envelope ID: 49D8E12A-93B4-4B21-992F-821A77E2001
Stripe Legal Counsel: Patrick Collison, CEO
Date: October 24, 2026`,
    flaggedTokens: [
      {
        token: 'stripe.com',
        type: 'VERIFIED',
        title: 'Authentic Corporate Domain',
        desc: 'Domain registered in 1995. High trust score, strict HSTS, DNSSEC enabled.'
      },
      {
        token: 'DocuSign Envelope ID: 49D8E12A...',
        type: 'VERIFIED',
        title: 'Cryptographic Timestamp Chain',
        desc: 'Digital signature verified against DocuSign public key infrastructure.'
      }
    ],
    aiAssessment: {
      geminiVerdict: 'AUTHENTIC LEGAL INSTRUMENT',
      modelUsed: 'Gemini 1.5 Pro Multi-Modal Reasoning Engine (v2.4-Enterprise)',
      languageCoherence: 'Standardized institutional legal drafting conventions',
      reasoning: [
        'Zero pressure tactics or anomalous escrow instructions detected.',
        'PDF metadata tags correspond directly to Adobe InDesign and official DocuSign cryptographic pipeline.',
        'DKIM signature passed with 2048-bit RSA key belonging to stripe.com.'
      ],
      syntheticConfidence: 3.2
    },
    infrastructure: {
      domain: 'stripe.com',
      registrar: 'MarkMonitor Inc.',
      ageDays: 11400,
      createdDate: 'Feb 11, 1995',
      ip: '199.60.103.28 (Fastly Anycast Global CDN)',
      dnsMx: 'mxa.mailgun.org, mxb.mailgun.org (Verified DKIM: s=stripe2024)',
      spfRecord: 'v=spf1 include:_spf.stripe.com ~all (Pass)',
      dmarc: 'v=DMARC1; p=reject; sp=reject; pct=100 (Strict Enforcement)',
      sslIssuer: 'DigiCert Global Root CA (Extended Validation EV)',
      sslStatus: 'Strict TLS 1.3 • Organization: Stripe, Inc. [US]'
    },
    riskMap: [
      { claim: 'Official Stripe San Francisco Legal Entity', verified: true, detail: 'Corporate registration validated with Delaware Secretary of State.' },
      { claim: 'DocuSign Cryptographic Envelope Integrity', verified: true, detail: 'Hash chain matches DocuSign public transparency log.' },
      { claim: 'Official Communication Infrastructure', verified: true, detail: 'DKIM and SPF 100% aligned with verified stripe.com records.' },
      { claim: 'Valid API Key Architecture Terms', verified: true, detail: 'References official standard Stripe restricted key security standards.' }
    ]
  }
};

// Initial Community Radar Feed Items
const INITIAL_RADAR_FEED = [
  {
    id: 'SCAM-2026-904',
    title: 'Google Cloud Senior Architect - Advance Check Scam',
    type: 'Job Scam',
    threatLevel: 'Critical',
    hash: 'e7c8b420...63b1',
    reports: 49,
    timestamp: '2 mins ago',
    ioc: 'careers-google-verify.net',
    vector: 'Telegram / Fake Check',
    upvoted: false
  },
  {
    id: 'SCAM-2026-903',
    title: 'OpenAI Research Fellow WhatsApp Interview Invitation',
    type: 'Phishing',
    threatLevel: 'High',
    hash: '4d8a11b2...99f0',
    reports: 118,
    timestamp: '11 mins ago',
    ioc: 'openai-hiring-portal.org',
    vector: 'WhatsApp DM',
    upvoted: true
  },
  {
    id: 'SCAM-2026-902',
    title: 'Executive Voice Spoof: Urgent Swift Wire Singapore',
    type: 'Deepfake Audio',
    threatLevel: 'Critical',
    hash: '8a91b2c4...ef12',
    reports: 24,
    timestamp: '34 mins ago',
    ioc: 'acme-ventures-holding.co',
    vector: 'VOIP Deepfake',
    upvoted: false
  },
  {
    id: 'SCAM-2026-901',
    title: 'Stripe Connect Merchant KYC Re-authentication Trap',
    type: 'Typosquat',
    threatLevel: 'High',
    hash: '1a72cc94...b512',
    reports: 83,
    timestamp: '1 hour ago',
    ioc: 'stripe-merchant-verify.co',
    vector: 'SMS Smishing',
    upvoted: false
  },
  {
    id: 'SCAM-2026-900',
    title: 'Anthropic Compute Allocation Grant Crypto Escrow',
    type: 'Crypto Scam',
    threatLevel: 'High',
    hash: '9f02cba3...71e4',
    reports: 62,
    timestamp: '2 hours ago',
    ioc: 'anthropic-compute-token.io',
    vector: 'Twitter Direct Message',
    upvoted: false
  }
];

export default function TrustLensArc({ externalPresetKey }) {
  // Global States
  const [activePresetKey, setActivePresetKey] = useState(externalPresetKey || 'JOB_SCAM');
  const [activeFormat, setActiveFormat] = useState('pdf'); // 'image' | 'pdf' | 'url' | 'text'
  const [customText, setCustomText] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Analysis State Machine
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(true); // Default to showing rich results for instant hackathon review

  // Active Forensic Tab
  const [forensicTab, setForensicTab] = useState('ocr'); // 'ocr' | 'ai' | 'infra'

  // Radar Feed & Community State
  const [radarFeed, setRadarFeed] = useState(INITIAL_RADAR_FEED);
  const [radarFilter, setRadarFilter] = useState('All');
  const [reportedCase, setReportedCase] = useState(false);

  // Modals & Drawers
  const [showEmailDraftModal, setShowEmailDraftModal] = useState(false);
  const [showJsonTelemetryModal, setShowJsonTelemetryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Current active data model based on preset
  const currentData = useMemo(() => {
    return PRESETS[activePresetKey] || PRESETS.JOB_SCAM;
  }, [activePresetKey]);

  // Synchronize external preset from Sentinel Hub or Bento Grid
  useEffect(() => {
    if (externalPresetKey && PRESETS[externalPresetKey]) {
      handleSelectPreset(externalPresetKey);
    }
  }, [externalPresetKey]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Synchronize format with preset change
  const handleSelectPreset = (key) => {
    setActivePresetKey(key);
    const p = PRESETS[key];
    setActiveFormat(p.format);
    setUploadedFile({
      name: p.fileName,
      size: p.fileSize,
      hash: p.fileHash
    });
    setCustomUrl(p.url);
    setCustomText(p.ocrText);
    setHasAnalyzed(true);
    setToastMessage(`Loaded preset: ${p.name}`);
  };

  // Run Real-time Simulation Engine
  const runAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStep(0);

    const steps = [
      { progress: 25, step: 1 },
      { progress: 55, step: 2 },
      { progress: 85, step: 3 },
      { progress: 100, step: 4 }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < steps.length) {
        setAnalysisProgress(steps[currentIdx].progress);
        setAnalysisStep(steps[currentIdx].step);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        setHasAnalyzed(true);
        setToastMessage('Multi-modal forensic analysis complete!');
      }
    }, 450);
  };

  const skipAnalysis = () => {
    setIsAnalyzing(false);
    setAnalysisProgress(100);
    setAnalysisStep(4);
    setHasAnalyzed(true);
  };

  // Handle reporting to Community Scam Radar
  const handleReportToRadar = () => {
    if (reportedCase) {
      setToastMessage('Case hash is already indexed in the Community Radar.');
      return;
    }

    const newRadarItem = {
      id: `SCAM-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${currentData.name.split('(')[0].trim()}`,
      type: currentData.category.split(' ')[0] || 'Phishing',
      threatLevel: currentData.riskScore > 75 ? 'Critical' : 'Moderate',
      hash: `${currentData.fileHash.slice(0, 8)}...${currentData.fileHash.slice(-4)}`,
      reports: 1,
      timestamp: 'Just now',
      ioc: currentData.infrastructure.domain,
      vector: currentData.category,
      upvoted: true
    };

    setRadarFeed([newRadarItem, ...radarFeed]);
    setReportedCase(true);
    setToastMessage(`Broadcast case #${currentData.id} to 4,120 Scam Radar nodes!`);
  };

  // Upvote radar item
  const handleToggleUpvote = (id) => {
    setRadarFeed(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.upvoted;
          return {
            ...item,
            upvoted: nextState,
            reports: nextState ? item.reports + 1 : item.reports - 1
          };
        }
        return item;
      })
    );
  };

  // Copy email draft to clipboard
  const handleCopyEmail = () => {
    const emailBody = `TO: security-incident@${currentData.infrastructure.domain.split('.').slice(-2).join('.') || 'target-entity.com'}
SUBJECT: [SECURITY INTAKE] Forensic Inquiry: Impersonation & Phishing Case #${currentData.id}

Security Operations Team,

Our automated verification engine (TrustLens Arc v2.4 Core) has intercepted an unauthorized engagement artifact purporting to originate from your organization:

• Case Reference ID: ${currentData.id}
• Intercept Timestamp: ${new Date().toUTCString()}
• SHA-256 Digest: ${currentData.fileHash}
• Flagged Domain / IOC: ${currentData.infrastructure.domain} (Registered ${currentData.infrastructure.ageDays} days ago)
• Identified Risk Score: ${currentData.riskScore} / 100 [${currentData.status}]
• Synthetic Anomaly Probability: ${currentData.metrics.syntheticProb}%

EVIDENCE HIGHLIGHTS:
${currentData.flaggedTokens.map(f => `- [${f.title}]: "${f.token}" (${f.desc})`).join('\n')}

Please confirm whether this communication, domain routing, or associated recruitment handles are authorized by your legal/talent division.

Submitted by TrustLens Arc Multi-Modal Verification Gateway.`;

    navigator.clipboard.writeText(emailBody);
    setToastMessage('Official verification email copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* =========================================================================
          TOP ENTERPRISE NAVIGATION HEADER
          ========================================================================= */}
      <header className="border-b border-[#1E293B] bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-slate-900/80 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/15 overflow-hidden p-0.5">
              <img 
                src="/trustlens_mark_transparent.png" 
                alt="TrustLens Arc Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5 font-sans">
                  TrustLens <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent font-extrabold">Arc</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300">
                  v2.4 Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Multi-Modal Threat Verification Platform
              </p>
            </div>
          </div>

          {/* Engine Status Micro-Badge */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-emerald-400 font-medium">Engine Live</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-mono text-[11px]">Gemini 1.5 Pro</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-mono text-[11px]">284ms Latency</span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md relative hidden lg:block">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Lookup Case ID, IOC Hash, or Domain (e.g. TL-8942)..."
              className="w-full bg-[#0B0F19] border border-[#1E293B] rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition-colors"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              ⌘K
            </kbd>
          </div>

          {/* User Org & Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJsonTelemetryModal(true)}
              className="px-2.5 py-1.5 rounded-md bg-[#1E293B]/60 hover:bg-[#1E293B] border border-slate-700/60 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all"
              title="Inspect Raw Gemini Model Telemetry"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Telemetry</span>
            </button>

            <div className="h-6 w-px bg-slate-800"></div>

            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-semibold text-blue-400">
                SC
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-xs font-semibold text-slate-200">SecOps Sentinel</div>
                <div className="text-[10px] text-slate-400 font-mono">Tier-1 Enterprise</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-blue-500/50 text-white shadow-2xl text-xs font-mono animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 flex-1">
        
        {/* =========================================================================
            HACKATHON QUICK DEMO SELECTOR BAR
            ========================================================================= */}
        <section className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-950/60 border border-blue-800/60 text-blue-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Live Demonstration Scenarios & Presets
                </h2>
                <p className="text-[12px] text-slate-400">
                  Select a pre-configured evidence bundle to test multi-modal verification workflows.
                </p>
              </div>
            </div>

            {/* Scenario Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSelectPreset('JOB_SCAM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                  activePresetKey === 'JOB_SCAM'
                    ? 'bg-rose-950/40 text-rose-300 border-rose-700/80 ring-1 ring-rose-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Google Job Scam (PDF + Telegram)</span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-rose-900/60 text-rose-300">
                  Risk 88
                </span>
              </button>

              <button
                onClick={() => handleSelectPreset('DEEPFAKE_WIRE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                  activePresetKey === 'DEEPFAKE_WIRE'
                    ? 'bg-rose-950/40 text-rose-300 border-rose-700/80 ring-1 ring-rose-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                <span>Deepfake Audio + Wire (BEC)</span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-rose-900/60 text-rose-300">
                  Risk 94
                </span>
              </button>

              <button
                onClick={() => handleSelectPreset('LEGIT_STRIPE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                  activePresetKey === 'LEGIT_STRIPE'
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/80 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Legit Stripe Agreement</span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-900/60 text-emerald-300">
                  Safe 11
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            MODULE 1: MULTI-MODAL VERIFICATION INPUT HUB
            ========================================================================= */}
        <section className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm">
          {/* Section Header */}
          <div className="border-b border-[#1E293B] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Multi-Modal Evidence Intake Gateway
              </h2>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Ingestion Engine v2
              </span>
            </div>

            {/* Multi-Format Selector Tabs */}
            <div className="flex items-center p-1 rounded-lg bg-[#0B0F19] border border-slate-800 text-xs">
              <button
                onClick={() => setActiveFormat('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  activeFormat === 'pdf'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Document</span>
              </button>

              <button
                onClick={() => setActiveFormat('image')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  activeFormat === 'image'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Screenshot / PNG</span>
              </button>

              <button
                onClick={() => setActiveFormat('url')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  activeFormat === 'url'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Domain URL</span>
              </button>

              <button
                onClick={() => setActiveFormat('text')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  activeFormat === 'text'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Raw Text / Mail</span>
              </button>
            </div>
          </div>

          {/* Input Body */}
          <div className="p-5 space-y-4">
            
            {/* Conditional Format Renderers */}
            {activeFormat === 'pdf' && (
              <div className="border-2 border-dashed border-slate-700/80 hover:border-blue-500/60 rounded-xl p-6 bg-[#0B0F19]/60 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-200 mb-1">
                  {currentData.fileName}
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
                  <span>Size: {currentData.fileSize}</span>
                  <span>•</span>
                  <span>SHA-256: {currentData.fileHash.slice(0, 16)}...</span>
                </div>
                <div className="mt-3 text-[11px] text-blue-400 font-mono bg-blue-950/30 px-3 py-1 rounded border border-blue-900/60">
                  Ready for OCR Text Extraction & Layout Inspection
                </div>
              </div>
            )}

            {activeFormat === 'image' && (
              <div className="border-2 border-dashed border-slate-700/80 hover:border-blue-500/60 rounded-xl p-6 bg-[#0B0F19]/60 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-200 mb-1">
                  Drop screenshot evidence (WhatsApp, Telegram, Offer Letter, or Slip)
                </div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Supports PNG, JPG, WebP up to 32MB. Automatically performs typography kerning analysis & metadata EXIF audits.
                </p>
                <div className="mt-3 text-[11px] text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  Active file: {currentData.fileName.replace('.pdf', '.png')} (1.42 MB)
                </div>
              </div>
            )}

            {activeFormat === 'url' && (
              <div className="space-y-3 bg-[#0B0F19]/60 border border-slate-800 rounded-xl p-4">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Target Domain or Verification Portal URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customUrl || currentData.url}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#0F172A] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => setToastMessage('DNS cache refreshed.')}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ping</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-4">
                  <span>Associated Host: {currentData.infrastructure.ip}</span>
                  <span>•</span>
                  <span>Registrar: {currentData.infrastructure.registrar}</span>
                </div>
              </div>
            )}

            {activeFormat === 'text' && (
              <div className="space-y-2 bg-[#0B0F19]/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Raw Message Content / Email Headers / Call Transcript
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    Tokens: ~342 | Characters: {currentData.ocrText.length}
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={customText || currentData.ocrText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700/80 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                />
              </div>
            )}

            {/* Analysis Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Verification Pipeline: Gemini 1.5 Pro + ICANN WHOIS + VirusTotal Mesh</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setHasAnalyzed(false);
                    setToastMessage('Cleared forensic evidence buffer.');
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
                >
                  Clear Buffer
                </button>

                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Evidence ({analysisProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white text-white" />
                      <span>Analyze & Verify Evidence</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step-by-Step Progress Simulator Overlay */}
            {isAnalyzing && (
              <div className="mt-4 p-4 rounded-xl bg-[#0B0F19] border border-blue-900/60 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-300">
                    <Activity className="w-4 h-4 animate-pulse text-blue-400" />
                    <span>Real-time Multi-Modal Verification Telemetry</span>
                  </div>
                  <button
                    onClick={skipAnalysis}
                    className="text-[11px] font-mono text-slate-400 hover:text-white underline"
                  >
                    Skip to Results ➔
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-300 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>

                {/* Checklist Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div className={`p-2 rounded border flex items-center gap-2 ${analysisStep >= 1 ? 'border-emerald-800 bg-emerald-950/20 text-emerald-300' : 'border-slate-800 text-slate-500'}`}>
                    {analysisStep >= 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>}
                    <span>1. OCR & Token Parsing</span>
                  </div>

                  <div className={`p-2 rounded border flex items-center gap-2 ${analysisStep >= 2 ? 'border-emerald-800 bg-emerald-950/20 text-emerald-300' : 'border-slate-800 text-slate-500'}`}>
                    {analysisStep >= 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>}
                    <span>2. DNS / WHOIS / SSL Lookup</span>
                  </div>

                  <div className={`p-2 rounded border flex items-center gap-2 ${analysisStep >= 3 ? 'border-emerald-800 bg-emerald-950/20 text-emerald-300' : 'border-slate-800 text-slate-500'}`}>
                    {analysisStep >= 3 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>}
                    <span>3. Gemini Multi-Modal Model</span>
                  </div>

                  <div className={`p-2 rounded border flex items-center gap-2 ${analysisStep >= 4 ? 'border-emerald-800 bg-emerald-950/20 text-emerald-300' : 'border-slate-800 text-slate-500'}`}>
                    {analysisStep >= 4 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>}
                    <span>4. Scam Radar Cross-Match</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            MODULE 2: MULTI-MODAL EVIDENCE BREAKDOWN DASHBOARD (When Analyzed)
            ========================================================================= */}
        {hasAnalyzed && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* HERO RISK SCORE & THREAT VECTOR GAUGE */}
            <section className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Visual Risk Gauge Meter (Cols 1-4) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-[#0B0F19] rounded-xl border border-slate-800 relative overflow-hidden">
                  
                  {/* Semicircular SVG Gauge */}
                  <div className="relative w-44 h-24 flex items-end justify-center">
                    <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 85">
                      {/* Background Track */}
                      <path
                        d="M 15 80 A 65 65 0 0 1 145 80"
                        fill="none"
                        stroke="#1E293B"
                        strokeWidth="14"
                        strokeLinecap="round"
                      />
                      {/* Colored Value Track */}
                      <path
                        d="M 15 80 A 65 65 0 0 1 145 80"
                        fill="none"
                        stroke={currentData.riskScore > 70 ? '#F43F5E' : currentData.riskScore > 40 ? '#F59E0B' : '#10B981'}
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray="204"
                        strokeDashoffset={204 - (204 * currentData.riskScore) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    {/* Numeric Score in Center */}
                    <div className="absolute inset-x-0 bottom-0 text-center flex flex-col items-center">
                      <span className={`text-4xl font-extrabold font-mono tracking-tight ${
                        currentData.riskScore > 70 ? 'text-rose-400' : currentData.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {currentData.riskScore}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest -mt-1">
                        / 100 Threat Index
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Status Tag */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wide uppercase ${
                      currentData.riskScore > 70
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : currentData.riskScore > 40
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    }`}>
                      {currentData.status}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-500 mt-2">
                    Confidence: {currentData.metrics.confidence}% • Calibrated 2026
                  </p>
                </div>

                {/* Threat Synopsis & Metrics Matrix (Cols 5-12) */}
                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                        Case ID: #{currentData.id}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-mono text-slate-400">
                        Category: {currentData.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {currentData.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {currentData.summary}
                    </p>
                  </div>

                  {/* Micro-Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-[#0B0F19] p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-mono text-slate-400">Synthetic AI Prob</div>
                      <div className="text-sm font-mono font-bold text-rose-400 mt-1">
                        {currentData.metrics.syntheticProb}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Gemini Vision/LLM</div>
                    </div>

                    <div className="bg-[#0B0F19] p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-mono text-slate-400">Infra Risk Score</div>
                      <div className="text-sm font-mono font-bold text-rose-400 mt-1">
                        {currentData.metrics.infrastructureRisk}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">DNS/WHOIS/ASN</div>
                    </div>

                    <div className="bg-[#0B0F19] p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-mono text-slate-400">Domain Trust</div>
                      <div className={`text-sm font-mono font-bold mt-1 ${
                        currentData.metrics.domainReputation < 30 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {currentData.metrics.domainReputation}/100
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">ICANN Age & SSL</div>
                    </div>

                    <div className="bg-[#0B0F19] p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-mono text-slate-400">Channel Legality</div>
                      <div className={`text-sm font-mono font-bold mt-1 ${
                        currentData.metrics.channelLegitimacy < 20 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {currentData.metrics.channelLegitimacy}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Off-Platform Audit</div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* FORENSIC FINDINGS TABBED CONTAINER */}
            <section className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm">
              {/* Tab Navigation */}
              <div className="border-b border-[#1E293B] px-5 py-2.5 flex items-center justify-between gap-3 bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
                    Deep Forensic Findings
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-[#0B0F19] p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setForensicTab('ocr')}
                    className={`px-3 py-1 rounded-md transition-all font-mono ${
                      forensicTab === 'ocr'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    1. OCR & Suspicious Claims
                  </button>

                  <button
                    onClick={() => setForensicTab('ai')}
                    className={`px-3 py-1 rounded-md transition-all font-mono ${
                      forensicTab === 'ai'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    2. Gemini Multi-Modal Model
                  </button>

                  <button
                    onClick={() => setForensicTab('infra')}
                    className={`px-3 py-1 rounded-md transition-all font-mono ${
                      forensicTab === 'infra'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    3. Infrastructure & SSL / DNS
                  </button>
                </div>
              </div>

              {/* Forensic Tab Content */}
              <div className="p-5">
                
                {/* TAB 1: OCR & DOCUMENT TEXT FORENSICS */}
                {forensicTab === 'ocr' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        Optical character recognition text layer preview with interactive anomaly triggers highlighted in red:
                      </p>
                      <span className="text-[11px] font-mono text-rose-400 bg-rose-950/40 px-2.5 py-0.5 rounded border border-rose-900">
                        {currentData.flaggedTokens.length} Flagged Anomalies Detected
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      
                      {/* Raw Extracted Document View (Cols 1-7) */}
                      <div className="lg:col-span-7 bg-[#0B0F19] border border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {currentData.ocrText}
                      </div>

                      {/* Flagged Tokens Detailed Breakdown (Cols 8-12) */}
                      <div className="lg:col-span-5 space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        {currentData.flaggedTokens.map((flag, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border text-xs space-y-1.5 transition-colors ${
                              flag.type === 'CRITICAL'
                                ? 'bg-rose-950/20 border-rose-900/60 text-slate-200'
                                : flag.type === 'HIGH'
                                ? 'bg-amber-950/20 border-amber-900/60 text-slate-200'
                                : 'bg-emerald-950/20 border-emerald-900/60 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                                flag.type === 'CRITICAL'
                                  ? 'bg-rose-900/80 text-rose-200'
                                  : flag.type === 'HIGH'
                                  ? 'bg-amber-900/80 text-amber-200'
                                  : 'bg-emerald-900/80 text-emerald-200'
                              }`}>
                                {flag.type} SIGNAL
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">Signal #{idx + 1}</span>
                            </div>
                            <div className="font-mono font-semibold text-rose-300">
                              "{flag.token}"
                            </div>
                            <div className="text-[11px] font-medium text-slate-200">
                              {flag.title}
                            </div>
                            <div className="text-[11px] text-slate-400 leading-snug">
                              {flag.desc}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 2: AI DEEPFAKE & GEMINI MULTI-MODAL ASSESSMENT */}
                {forensicTab === 'ai' && (
                  <div className="space-y-4">
                    <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-5 space-y-4">
                      
                      {/* Model Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="text-xs font-bold text-white font-mono">
                              {currentData.aiAssessment.modelUsed}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Multi-Modal Zero-Shot CoT Verification (Cross-Attention on Text + Pixel Artifacts)
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">Synthetic Confidence:</span>
                          <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900">
                            {currentData.aiAssessment.syntheticConfidence}%
                          </span>
                        </div>
                      </div>

                      {/* Verdict Banner */}
                      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-mono text-slate-300">
                            Assessment Verdict: <strong className="text-white">{currentData.aiAssessment.geminiVerdict}</strong>
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {currentData.aiAssessment.languageCoherence}
                        </span>
                      </div>

                      {/* Chain of Thought Reasoning Cards */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                          Key Chain-of-Thought Reasoning Logs
                        </h4>
                        <div className="space-y-2">
                          {currentData.aiAssessment.reasoning.map((item, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-[#0F172A] border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
                              <span className="font-mono text-blue-400 font-bold">[{idx + 1}]</span>
                              <span className="leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Inspect Raw Telemetry CTA */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => setShowJsonTelemetryModal(true)}
                          className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>View Raw Gemini JSON Structured Output ➔</span>
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 3: INFRASTRUCTURE, WHOIS, DNS & SSL CHECKS */}
                {forensicTab === 'infra' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400">
                      Real-time WHOIS registration records, DNS mail exchange routes, and X.509 SSL certificate validity audit:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Card 1: WHOIS */}
                      <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Globe className="w-3.5 h-3.5 text-blue-400" />
                            <span>ICANN WHOIS Records</span>
                          </div>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            currentData.infrastructure.ageDays < 30 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300'
                          }`}>
                            {currentData.infrastructure.ageDays < 30 ? 'FRESH DOMAIN' : 'ESTABLISHED'}
                          </span>
                        </div>

                        <div className="space-y-2 font-mono text-[11px]">
                          <div>
                            <span className="text-slate-500 block">Domain Name:</span>
                            <span className="text-slate-200 font-bold">{currentData.infrastructure.domain}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Registrar:</span>
                            <span className="text-slate-300">{currentData.infrastructure.registrar}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Domain Age:</span>
                            <span className="text-rose-400 font-bold">{currentData.infrastructure.ageDays} days ({currentData.infrastructure.createdDate})</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">IP & ASN:</span>
                            <span className="text-slate-300">{currentData.infrastructure.ip}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: DNS & Mail Routing */}
                      <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Server className="w-3.5 h-3.5 text-blue-400" />
                            <span>DNS & MX Enforcement</span>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            RFC-7208
                          </span>
                        </div>

                        <div className="space-y-2 font-mono text-[11px]">
                          <div>
                            <span className="text-slate-500 block">MX Routing:</span>
                            <span className="text-slate-300 truncate block">{currentData.infrastructure.dnsMx}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">SPF Policy:</span>
                            <span className="text-amber-400 truncate block">{currentData.infrastructure.spfRecord}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">DMARC Alignment:</span>
                            <span className="text-rose-400 truncate block">{currentData.infrastructure.dmarc}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">DKIM Verification:</span>
                            <span className="text-slate-400">Failed / Unaligned Key</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: SSL Certificate Validation */}
                      <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Lock className="w-3.5 h-3.5 text-blue-400" />
                            <span>X.509 SSL Certificate</span>
                          </div>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            currentData.riskScore > 50 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300'
                          }`}>
                            {currentData.riskScore > 50 ? 'UNALIGNED EV' : 'VERIFIED EV'}
                          </span>
                        </div>

                        <div className="space-y-2 font-mono text-[11px]">
                          <div>
                            <span className="text-slate-500 block">Issuer Authority:</span>
                            <span className="text-slate-300 truncate block">{currentData.infrastructure.sslIssuer}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Validation Type:</span>
                            <span className="text-slate-300">Domain Validated (DV - 90 Days)</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Subject Alt Check:</span>
                            <span className="text-rose-400 truncate block">{currentData.infrastructure.sslStatus}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Certificate Transparency:</span>
                            <span className="text-slate-400">Logged to Google Argon 2026</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            </section>

            {/* =========================================================================
                MODULE 3: EXPLAINABLE EVIDENCE & ACTION PANEL (Risk Map + Actions)
                ========================================================================= */}
            <section className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Explainable Risk Map: Verified Claims vs. Red Flags</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Structured balance sheet contrasting authentic traits against discovered malicious anomalies.
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEmailDraftModal(true)}
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>1-Click Verification Draft</span>
                  </button>

                  <button
                    onClick={handleReportToRadar}
                    className="px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800 text-rose-300 font-medium text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Radio className="w-3.5 h-3.5 text-rose-400" />
                    <span>Report to Scam Radar</span>
                  </button>
                </div>
              </div>

              {/* Tabular Risk Map Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                      <th className="pb-2.5 font-medium">Claim / Assertion in Evidence</th>
                      <th className="pb-2.5 font-medium w-36">Forensic Verdict</th>
                      <th className="pb-2.5 font-medium">Explainable Discovery & Telemetry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {currentData.riskMap.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 pr-4 text-slate-200 font-sans font-medium">
                          {item.claim}
                        </td>
                        <td className="py-3 pr-4">
                          {item.verified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              <Check className="w-3 h-3" /> VERIFIED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                              <X className="w-3 h-3" /> RED FLAG
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-[11px] text-slate-400 font-sans leading-relaxed">
                          {item.detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}

        {/* =========================================================================
            MODULE 4: COMMUNITY SCAM PATTERN RADAR (Live Real-Time Feed)
            ========================================================================= */}
        <section className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="border-b border-[#1E293B] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                  <span>Community Scam Pattern Radar</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                    Live Broadcast Stream
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">
                  Syncing with 4,120 nodes across global security operations centers
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-[#0B0F19] p-1 rounded-lg border border-slate-800 text-xs">
              {['All', 'Job Scam', 'Deepfake Audio', 'Phishing', 'Typosquat'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRadarFilter(filter)}
                  className={`px-2.5 py-1 rounded-md transition-all font-mono text-[11px] ${
                    radarFilter === filter
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Feed List Table */}
          <div className="divide-y divide-slate-800/80">
            {radarFeed
              .filter(item => radarFilter === 'All' || item.type.toLowerCase().includes(radarFilter.toLowerCase()))
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-900/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                        item.threatLevel === 'Critical'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {item.threatLevel}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {item.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        ({item.timestamp})
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Type: <strong className="text-slate-300">{item.type}</strong></span>
                      <span>•</span>
                      <span>IOC Domain: <span className="text-rose-300">{item.ioc}</span></span>
                      <span>•</span>
                      <span>Digest: <span className="text-slate-500">{item.hash}</span></span>
                    </div>
                  </div>

                  {/* Corroborate Upvote Button */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleUpvote(item.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                        item.upvoted
                          ? 'bg-blue-950/60 text-blue-300 border-blue-700'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      title="Corroborate that your organization observed this pattern"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{item.reports} Corroborated</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Footer of Feed */}
          <div className="p-3 bg-[#0B0F19] border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Radar Node: US-EAST-VIRGINIA-04</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Websocket Stream Connected
            </span>
          </div>
        </section>

      </main>

      {/* =========================================================================
          MODAL 1: 1-CLICK VERIFICATION DRAFT MODAL
          ========================================================================= */}
      {showEmailDraftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  1-Click Formal Verification Inquiry Draft
                </h3>
              </div>
              <button
                onClick={() => setShowEmailDraftModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              This formal inquiry is pre-filled with discovered IOCs, cryptographic hashes, and legal disclaimers ready to dispatch to official corporate fraud desks:
            </p>

            <div className="bg-[#0B0F19] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-2 max-h-72 overflow-y-auto leading-relaxed">
              <div className="text-blue-400 font-semibold">
                TO: security-incident@{currentData.infrastructure.domain.split('.').slice(-2).join('.') || 'target-entity.com'}
              </div>
              <div className="text-slate-400">
                SUBJECT: [SECURITY INTAKE] Forensic Verification: Impersonation & Phishing Case #{currentData.id}
              </div>
              <div className="border-t border-slate-800 pt-2 text-slate-300 whitespace-pre-wrap">
{`Security Operations Team,

Our automated verification platform (TrustLens Arc Core) has intercepted an unauthorized engagement artifact purporting to originate from your organization:

• Case Reference: ${currentData.id}
• Evidence Digest: ${currentData.fileHash}
• Associated Host / Domain: ${currentData.infrastructure.domain} (Age: ${currentData.infrastructure.ageDays} days)
• Identified Threat Severity: ${currentData.riskScore} / 100 [${currentData.status}]
• Synthetic Anomaly Probability: ${currentData.metrics.syntheticProb}%

DETECTED ANOMALY SIGNATURES:
${currentData.flaggedTokens.map(f => `• [${f.title}]: "${f.token}"`).join('\n')}

Please review attached evidence and confirm if this recruitment route is legitimate.

Generated automatically by TrustLens Arc Verification Gateway.`}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEmailDraftModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono"
              >
                Close
              </button>
              <button
                onClick={handleCopyEmail}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-mono font-medium text-white flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Draft to Clipboard</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: RAW GEMINI STRUCTURED TELEMETRY MODAL
          ========================================================================= */}
      {showJsonTelemetryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  Gemini Multi-Modal Structured Telemetry Payload
                </h3>
              </div>
              <button
                onClick={() => setShowJsonTelemetryModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#0B0F19] border border-slate-800 rounded-lg p-4 font-mono text-[11px] text-cyan-300 max-h-80 overflow-y-auto leading-relaxed">
              <pre>
{JSON.stringify(
  {
    schema: "trustlens.verification.v2",
    case_id: currentData.id,
    model: "gemini-1.5-pro-preview-0514",
    timestamp: new Date().toISOString(),
    evaluation: {
      threat_score: currentData.riskScore,
      verdict: currentData.status,
      synthetic_confidence: currentData.metrics.syntheticProb,
      reasoning_tokens: currentData.aiAssessment.reasoning,
      indicators_of_compromise: currentData.flaggedTokens.map(t => ({
        token: t.token,
        classification: t.type,
        explanation: t.desc
      })),
      infrastructure_telemetry: currentData.infrastructure
    }
  },
  null,
  2
)}
              </pre>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowJsonTelemetryModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#1E293B] bg-[#0B0F19] py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TrustLens Arc Enterprise Verification Engine • Hackathon Edition</span>
          <span>Powered by Google Gemini 1.5 Multi-Modal Architecture & ICANN ThreatMesh</span>
        </div>
      </footer>

    </div>
  );
}
