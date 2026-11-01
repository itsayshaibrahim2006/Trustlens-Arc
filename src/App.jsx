import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import BiometricDeepfakes from './components/video_showcase/BiometricDeepfakes.jsx';
import ScanBayVehicle from './components/video_showcase/ScanBayVehicle.jsx';
import ReactiveTelemetry from './components/video_showcase/ReactiveTelemetry.jsx';
import VideoFooter from './components/video_showcase/VideoFooter.jsx';

function App() {
  useEffect(() => {
    // Initialize Lenis for luxurious 120 FPS buttery smooth momentum scrolling
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential easeOut
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  const handleScrollToFeatures = () => {
    const el = document.getElementById('deepfakes-section') || document.getElementById('scanbay-section');
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -20, duration: 1.4 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Floating Glass Navigation Bar (Updated for Recent Forensic Showcases) */}
      <Navbar />

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
