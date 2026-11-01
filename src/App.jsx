import React from 'react';
import HeroSection from './components/HeroSection.jsx';
import BiometricDeepfakes from './components/video_showcase/BiometricDeepfakes.jsx';
import ScanBayVehicle from './components/video_showcase/ScanBayVehicle.jsx';
import ReactiveTelemetry from './components/video_showcase/ReactiveTelemetry.jsx';
import CoreFeaturesShowcase from './components/CoreFeaturesShowcase.jsx';
import VideoFooter from './components/video_showcase/VideoFooter.jsx';

function App() {
  const handleScrollToFeatures = () => {
    const el = document.getElementById('core-features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Cinematic Scroll-Linked Hero Section (Original 240-Frame Corridor & Command Center Canvas) */}
      <HeroSection onEnterDashboard={handleScrollToFeatures} />

      {/* 2. Biometric Deepfakes Mobile Scanner & 6 Stat Cards (From Video Reference Scene 2) */}
      <BiometricDeepfakes />

      {/* 3. Autonomous Scan Bay Vehicle with Wireframe Blueprint Mode (From Video Reference Scene 3) */}
      <ScanBayVehicle />

      {/* 4. Reactive Telemetry Stream with 78% Threat Gauge & Audio Canvas (From Video Reference Scene 4) */}
      <ReactiveTelemetry />

      {/* 5. Clean 4 Big Cards Showcase: Google Job Scam, Stripe Safe Control, CEO Deepfake, QR Detonator */}
      <CoreFeaturesShowcase />

      {/* 6. Cyber Command Center Footer (From Video Reference Scene 5) */}
      <VideoFooter />

    </div>
  );
}

export default App;