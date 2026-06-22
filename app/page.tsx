'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import IntroSection from '@/components/IntroSection';
import HeroSection from '@/components/HeroSection';
import SparkSection from '@/components/SparkSection';
import SensorsSection from '@/components/SensorsSection';
import ProjectsSection from '@/components/ProjectsSection';
import BuildSection from '@/components/BuildSection';
import CompetitionSection from '@/components/CompetitionSection';
import Rail from '@/components/Rail';
import Footer from '@/components/Footer';
import SensorOverlay from '@/components/SensorOverlay';

export default function Home() {
  const [activeSensor, setActiveSensor] = useState<string | null>(null);

  const handleSensorClick = (key: string) => {
    setActiveSensor(key);
  };

  return (
    <>
      <div className="pcb-bg" />
      <div className="mobile-progress" id="mobileProgress" />
      <Navbar />
      <Rail />
      <main>
        <IntroSection />
        <HeroSection />
        <SparkSection />
        <SensorsSection onSensorClick={handleSensorClick} />
        <ProjectsSection />
        <BuildSection />
        <CompetitionSection />
      </main>
      <Footer />
      {activeSensor && (
        <SensorOverlay
          sensorKey={activeSensor}
          onClose={() => setActiveSensor(null)}
        />
      )}
    </>
  );
}
