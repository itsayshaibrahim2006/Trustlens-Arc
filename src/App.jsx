import React from 'react';
import HeroSection from './components/HeroSection.jsx';
import BiometricDeepfakes from './components/video_showcase/BiometricDeepfakes.jsx';
import ScanBayVehicle from './components/video_showcase/ScanBayVehicle.jsx';
import ReactiveTelemetry from './components/video_showcase/ReactiveTelemetry.jsx';
import VideoFooter from './components/video_showcase/VideoFooter.jsx';

function App() {
  const handleScrollToFeatures = () => {
    const el = document.getElementById('scanbay-section') || document.getElementById('deepfakes-section');
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

      {/* 3. Autonomous Scan Bay Vehicle with Wireframe Blueprint Mode & Dual Laser Verification */}
      <ScanBayVehicle />

      {/* 4. Neural Acoustic Forensics & CEO Deepfake Voice Spectrogram Suite */}
      <ReactiveTelemetry />

      {/* 5. Cyber Command Center Footer (From Video Reference Scene 5) */}
      <VideoFooter />

    </div>
  );
}

export default App;