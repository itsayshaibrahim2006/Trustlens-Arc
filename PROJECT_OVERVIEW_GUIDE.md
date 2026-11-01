# 🛡️ TrustLens Arc — Complete Project Guide & Architecture
> **A Simple, Plain-English Guide to What We Built, How It Works, and the Tech Behind It**

---

## 🌟 1. What is TrustLens Arc? (In Simple Words)

Imagine an intelligent security scanner that acts like an **anti-virus for modern AI scams**. 

Today, hackers aren’t just sending basic scam emails anymore. They are using artificial intelligence to:
1. **Clone the voice of a CEO or family member** to authorize fake emergency wire transfers.
2. **Forge realistic Google and Big Tech job offer letters** that steal thousands of dollars in fake equipment checks.
3. **Hide malicious phishing links inside QR codes (called "Quishing")** that bypass normal email security filters.

**TrustLens Arc** is a real-time web application that detects and neutralizes all three of these threats in seconds — directly in your browser.

---

## 🚀 2. Live Links You Can Try Right Now

- 🌐 **Live Web Application**: [https://trustlensarc.web.app](https://trustlensarc.web.app)
- 📊 **Interactive Hackathon Slide Deck**: [https://trustlensarc.web.app/presentation.html](https://trustlensarc.web.app/presentation.html)
- 🐙 **GitHub Source Code**: [https://github.com/itsayshaibrahim2006/Trustlens-Arc](https://github.com/itsayshaibrahim2006/Trustlens-Arc)

---

## 💻 3. What Languages & Tools Are We Using?

Here is the exact technology stack broken down in plain English:

### 🎨 Frontend (What the User Sees and Interacts With)
- **JavaScript (ES6+)**: The primary programming language used to build all the interactivity, detection algorithms, and calculations.
- **React 18**: The industry-standard UI framework used to break down the website into modular components (Hero section, 3D bay, audio scanner, etc.).
- **Vite**: A next-generation, blazingly fast development build tool and bundler that turns the React code into optimized production files in seconds.
- **Tailwind CSS**: A modern utility-first styling system used for the dark cyber-forensics theme, glowing neon borders, responsive grids, and glassy cards.
- **Lucide React**: Clean, modern vector icons for all buttons, alerts, and security badges.

### 🎮 3D Graphics & Animations (The Wow Factor)
- **Three.js (WebGL)**: Powers the interactive **3D Astro-Van Rover** in the Autonomous Scan Bay. It renders a complete sci-fi vehicle with an astronaut pilot, metallic chassis, rotating radar dish, and glowing thrusters at 60 frames per second using your graphics card.
- **HTML5 Canvas 2D**: Powers the **Radar Laser Plasma Barrage** that fires glowing crimson/emerald plasma bolts from the 3D vehicle’s radar directly into the forensic inspection cards.

### 🧠 Real Client-Side Forensic Engines (The Brains)
- **PDF.js (by Mozilla)**: A JavaScript library that reads and extracts raw text and metadata from uploaded PDF offer letters right inside your browser without needing to send your file to a server.
- **jsQR**: A computer-vision QR code reader library. When you upload a picture of a QR code, it scans the image pixels on an off-screen canvas and extracts the hidden link.
- **Web Audio API**: The browser’s native audio processing engine. It analyzes live microphone streams and audio files, measuring pitch tremor and frequency harmonics in real time.

---

## ☁️ 4. Which Backend & Server Are We Using?

One of the most impressive technical features of TrustLens Arc is its **Zero-Server / Client-Side Architecture**:

### ❓ Wait, where is the backend server?
Traditional websites send your sensitive files (resumes, audio recordings, personal links) to an external backend server (like Python, Node.js, or AWS) to process. That creates two big problems:
1. **Privacy Risk**: Your personal resume or voice recording is sent over the internet to someone else's database.
2. **Speed Lag**: You have to wait for files to upload, process on a server, and download back.

### 🛡️ How TrustLens Arc Does It Instead:
TrustLens Arc runs its **entire detection engine directly on your own device (client-side in the browser)**!
- Your uploaded PDF never leaves your computer.
- Your microphone recording stays in your browser memory.
- All 12 resume scam heuristics and 11 link detonation algorithms run in **under 300 milliseconds** locally.

### 🌐 Where Is the Website Hosted?
- **Server Platform**: **Firebase Hosting (by Google Cloud)**
- **How it works**: The compiled production files (`dist/`) are hosted on Google’s **Global Content Delivery Network (CDN) edge cache**. When anyone visits `trustlensarc.web.app`, Google's servers instantly deliver the cached files from the nearest server location to their city with SSL encryption and DDoS protection.

---

## ⚙️ 5. The 4 Main Features Explained

### 1️⃣ CEO Voice Deepfake Spectrogram (VoiceCheck 3D)
- **What it does**: Analyzes an audio recording or your live microphone to check if a voice is an AI clone.
- **How it detects**: Human vocal cords have natural micro-tremors (called pitch jitter, typically 0.8% to 2.5% variation) and natural breathing pauses. AI voice generators (like ElevenLabs) sound unnaturally flat (&lt; 0.15% jitter) and forget to take breaths between sentences.

### 2️⃣ Google Job Scam & CV / Resume Authenticator
- **What it does**: Inspects job offer letters and resumes to catch advance-fee scams and forged documents.
- **How it detects**: 
  - Extracts text and PDF metadata using `pdfjs-dist`.
  - Flags advance-fee schemes (*"deposit $2,450 for home office equipment"*).
  - Catches fake recruiter handles (e.g. asking you to interview on Telegram via `@google_careers_emea` instead of official corporate portals).
  - Detects if an "official" Google letter was forged using consumer templates like Canva.
  - Verifies authentic candidates by checking their real GitHub profiles and corporate email domains.

### 3️⃣ Quishing Matrix & Sandbox Link Detonator
- **What it does**: Scans QR codes and detonates suspicious links inside a virtual sandbox.
- **How it detects**:
  - Uses `jsQR` to decode QR images uploaded from your phone.
  - Uses the **Levenshtein Distance Algorithm** to catch typosquatting (fake links that look like real brands, like `apple-support.tk` or `paypa1.com`).
  - Detects **IDN Homograph attacks** (scammers replacing English letters with identical-looking Russian/Cyrillic characters).
  - Checks for high-risk top-level domains (`.tk`, `.ml`, `.ru`, `.xyz`) and bare IP addresses.

### 4️⃣ Biometric Deepfakes & Multi-Stream Image Forensics
- **What it does**: Detects modern generative diffusion images (Midjourney v6, Flux, Stable Diffusion 3) and face-swaps that defeat standard simple AI checkers.
- **The Core Scientific Problem**: Standard detectors resize high-res images to $224 \times 224$, which accidentally wipes out pixel-level noise artifacts (the "Resize & Compress Trap").
- **How TrustLens Solves It (Multi-Stream Hybrid Architecture)**:
  - **Fast-Path C2PA & EXIF Gate**: Directly inspects image headers for cryptographic provenance and camera hardware signatures (Canon, Sony) vs generative AI tools (Midjourney, ComfyUI).
  - **Unresized Texture Patches**: Slices native-resolution $64 \times 64$ patches to keep forensic noise intact.
  - **Stream A (Noise Forensics)**: 5x5 Spatial Rich Model (SRM) high-pass convolution filters + Neighboring Pixel Relationships (NPR) gradient differencing.
  - **Stream B (Semantic Vision Priors)**: Vision-Language representation priors (CLIP) verifying lighting consistency and facial symmetry.
  - **Stream C (Facial Manipulation)**: Self-Blended Image (SBI) boundary blending detection and Face X-Ray seam segmentation.
  - **Dynamic Gated Fusion & Forgery Heatmap**: Dynamically balances the streams according to image compression levels and renders an interactive pixel-level forgery heatmap showing the exact manipulated area.

### 5️⃣ Autonomous Scan Bay & 3D Astro-Van
- **What it does**: A high-tech mission control center where you can visually see the vehicle's radar dish lock onto threats.
- **Visual Feedback**: The plasma laser fire changes dynamically:
  - 🔴 **Fires Red Plasma Bolts** when a scam or malicious phishing link is detected.
  - 🟢 **Fires Green Plasma Bolts** when verified safe credentials are confirmed.

---

## 🛠️ 6. How Your Friend Can Run This Project on Their Computer

If your friend wants to test, modify, or run this project on their own machine, here are the exact steps:

### Prerequisites Needed:
- [Node.js](https://nodejs.org/) (Version 18 or higher)
- [Git](https://git-scm.com/)

### Step 1: Clone the Code from GitHub
Open your terminal (PowerShell, Command Prompt, or Mac Terminal) and run:
```bash
git clone https://github.com/itsayshaibrahim2006/Trustlens-Arc.git
```

### Step 2: Open the Folder
```bash
cd Trustlens-Arc
```

### Step 3: Install All Project Dependencies
```bash
npm install
```
*(This automatically downloads React, Three.js, Lucide icons, pdfjs-dist, and jsQR).*

### Step 4: Start the Local Development Server
```bash
npm run dev
```

### Step 5: View It in the Browser
Open your browser and navigate to:
```
http://localhost:5173
```
You can now edit any file in the `src/` folder and see your changes update instantly on screen!

---

## 🏆 7. Summary for Hackathon Judges & Friends

| Question | Answer |
| :--- | :--- |
| **Project Name** | **TrustLens Arc** |
| **Category** | Cyber-Security, AI Safety, Anti-Fraud Forensics |
| **Core Problem** | 2026 AI Threat Wave: Voice Clones, Job Offer Forgery, QR Quishing |
| **Primary Languages** | JavaScript (ES6+), HTML5, CSS3 |
| **Frameworks** | React 18, Vite, Tailwind CSS |
| **3D & Graphics** | Three.js WebGL, HTML5 Canvas 2D |
| **Forensic Engines** | PDF.js (document parsing), jsQR (matrix decoding), Web Audio API (harmonics), Multi-Stream SRM+NPR+CLIP Image Forensics |
| **Backend & Architecture** | 100% Client-Side Engine + PyTorch Reference Model (`models/hybrid_detector.py`) |
| **Cloud Hosting** | Firebase Hosting (Google Cloud Edge CDN) |
| **Live Web App** | [https://trustlensarc.web.app](https://trustlensarc.web.app) |
| **Live Pitch Deck** | [https://trustlensarc.web.app/presentation.html](https://trustlensarc.web.app/presentation.html) |

