# TrustLens Arc — Enterprise Multi-Modal Verification Platform
> **Hackathon-Winning Product Architecture & Forensic Engine**

TrustLens Arc is a production-grade multi-modal threat verification platform designed for SecOps analysts, talent operations, and enterprise fraud prevention desks. It ingests multi-format evidence (PDF offers, screenshots, lookalike URLs, audio/text transcripts), performs deep optical and infrastructure forensics, and synthesizes structured threat assessments powered by Google Gemini 1.5 Pro.

---

## 🛡️ Core Verification Capabilities

1. **Multi-Modal Intake Gateway**
   - Supports Drag-and-Drop PDFs, screenshots (PNG/JPEG/WebP), domain URLs, and raw email/message transcripts.
   - Computes SHA-256 cryptographic digests, token volume, and metadata header integrity.
   - Includes 3 pre-configured demonstration presets for instant hackathon evaluations:
     - **Preset 1**: Google Executive Job Scam (PDF Letterhead + Telegram Recruiter + Fake Cashier Check) — *Risk: 88 (Critical)*
     - **Preset 2**: Executive Deepfake Audio & Urgent BEC Wire Transfer ($48,500 swift demand) — *Risk: 94 (Severe)*
     - **Preset 3**: Legitimate Stripe Platform Agreement (EV SSL + DocuSign Keychain) — *Risk: 11 (Authentic)*

2. **Forensic Findings Breakdown**
   - **OCR & Document Forensics**: Text layer reconstruction with interactive red-flag pills highlighting unmonitored communication channels, advance-fee overpayment patterns, and Canva/Skia raster compression artifacts.
   - **Gemini 1.5 Pro Multi-Modal Reasoning Engine**: Multi-modal zero-shot CoT verification detailing urgency tactics, stylistic anomalies, and persona hallucinations. Includes full JSON telemetry inspection.
   - **Infrastructure & Network Forensics**: ICANN WHOIS lookup (domain age flags), DNS MX routing, SPF/DMARC anti-spoofing policies, and X.509 SSL Certificate authority audits.

3. **Explainable Risk Map & 1-Click Operations**
   - Side-by-side tabular comparison of asserted claims vs. discovered forensic reality.
   - **1-Click Verification Draft**: Instantly generates an official verification inquiry pre-filled with SHA-256 hashes, IOCs, and legal disclaimers ready to dispatch to corporate fraud teams (`security@domain.com`).
   - **Report to Community Scam Radar**: Broadcasts threat signatures to global peer nodes with immediate real-time feed synchronization.

4. **Community Scam Pattern Radar**
   - Real-time updating intelligence feed tracking active phishing URLs, deepfake voice attempts, and employment scam templates.
   - Filterable categories (`Job Scam`, `Deepfake Audio`, `Phishing`, `Typosquat`).
   - Peer corroboration and upvote voting engine.

---

## 🎨 Enterprise Design System (Anti-Generic AI Principles)

- **Navy/Slate Palette**: Deep `#0B0F19` base, `#0F172A` cards, `#1E293B` precision borders, `#334155` hover dividers.
- **Semantic Accents**: Muted steel blue `#3B82F6` for operations, emerald green `#10B981` for verified authenticity, rose red `#F43F5E` for threats.
- **Typography & Layout**: Inter system sans-serif paired with JetBrains Mono for cryptographic hashes and raw network telemetry. High-density tabular data cards rather than generic glowing hero cards.

---

## 📁 Repository Structure

```
trustlens-arc/
├── index.html                   # HTML5 Entrypoint with font preconnects
├── package.json                 # React 18, Tailwind CSS, Lucide React, Vite
├── vite.config.js               # Fast HMR Vite configuration
├── tailwind.config.js           # Precision enterprise security palette
├── src/
│   ├── TrustLensArc.jsx         # Production React verification dashboard
│   ├── App.jsx                  # Main application container
│   ├── index.css                # Tailwind directives & crisp scrollbars
│   └── main.jsx                 # React root renderer
└── README.md                    # System architecture documentation
```

---

## 🚀 Running the Application

### 1. Standalone Instant Preview (Zero Dependencies)
You can immediately view and interact with the complete platform by opening the generated artifact in your browser:
- Path: `C:\Users\Office\.gemini\antigravity\brain\77cf3c0c-8477-4a26-8ee7-e45f3beecb45\trustlens_arc_dashboard.html`

### 2. Vite Development Server
```bash
# In the trustlens-arc folder:
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
