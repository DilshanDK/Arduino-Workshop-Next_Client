'use client';
import { useEffect, useRef } from 'react';

const SENSOR_CARDS = [
  {
    key: 'ir',
    icon: <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="10" fill="none" stroke="#5EEAD4" strokeWidth="2"/><path d="M20 4v6M20 30v6M4 20h6M30 20h6" stroke="#C9824A" strokeWidth="2"/></svg>,
    title: 'IR Sensor',
    desc: 'Sees infrared light. Detects obstacles, or reads the coded pulses sent by a remote control.',
    tag: "Today's build",
  },
  {
    key: 'ultrasonic',
    icon: <svg viewBox="0 0 40 40"><rect x="4" y="14" width="10" height="12" rx="2" fill="#5EEAD4"/><path d="M18 17 Q24 12 30 20 Q24 28 18 23" stroke="#C9824A" strokeWidth="2" fill="none"/><path d="M22 14 Q32 8 36 20 Q32 32 22 26" stroke="#C9824A" strokeWidth="1.5" fill="none" opacity=".5"/></svg>,
    title: 'Ultrasonic (HC‑SR04)',
    desc: 'Sends out sound pulses and times the echo to measure distance — the same trick as a bat.',
    tag: 'Distance',
  },
  {
    key: 'ldr',
    icon: <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="7" fill="#C9824A"/><path d="M20 4v6M20 30v6M4 20h6M30 20h6M9 9l4 4M27 27l4 4M31 9l-4 4M13 27l-4 4" stroke="#5EEAD4" strokeWidth="2"/></svg>,
    title: 'LDR (Light Sensor)',
    desc: 'Resistance drops as light increases. Perfect for night lights that switch on automatically.',
    tag: 'Light',
  },
  {
    key: 'dht',
    icon: <svg viewBox="0 0 40 40"><rect x="14" y="6" width="12" height="22" rx="6" fill="none" stroke="#5EEAD4" strokeWidth="2"/><circle cx="20" cy="32" r="4" fill="#C9824A"/><path d="M20 10v12" stroke="#C9824A" strokeWidth="2"/></svg>,
    title: 'Temperature / Humidity',
    desc: 'DHT11 or DHT22 modules report heat and moisture — the heart of a weather station.',
    tag: 'Climate',
  },
  {
    key: 'button',
    icon: <svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" rx="4" fill="none" stroke="#C9824A" strokeWidth="2"/><circle cx="20" cy="20" r="4" fill="#5EEAD4"/></svg>,
    title: 'Push Button / Touch',
    desc: 'The simplest sensor of all: it\'s either pressed or it isn\'t. Great for first interactive projects.',
    tag: 'Input',
  },
  {
    key: 'sound',
    icon: <svg viewBox="0 0 40 40"><path d="M8 20 Q14 8 20 20 T32 20" stroke="#5EEAD4" strokeWidth="2" fill="none"/><circle cx="20" cy="20" r="2.5" fill="#C9824A"/></svg>,
    title: 'Sound Sensor',
    desc: 'A small microphone module that detects claps or loud noise — wire it to a clap-controlled lamp.',
    tag: 'Audio',
  },
  {
    key: 'pir',
    icon: <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="9" fill="none" stroke="#C9824A" strokeWidth="2"/><circle cx="20" cy="20" r="3" fill="#5EEAD4"/><path d="M20 4v3M20 33v3M4 20h3M33 20h3" stroke="#C9824A" strokeWidth="2"/></svg>,
    title: 'PIR Motion Sensor',
    desc: 'Detects body heat moving across its lens — the sensor behind most security lights and alarms.',
    tag: 'Motion',
  },
  {
    key: 'soil',
    icon: <svg viewBox="0 0 40 40"><path d="M20 6 C12 16 12 24 20 34 C28 24 28 16 20 6 Z" fill="none" stroke="#5EEAD4" strokeWidth="2"/><path d="M14 24h12" stroke="#C9824A" strokeWidth="2"/></svg>,
    title: 'Soil Moisture',
    desc: 'Measures water in soil between two probes — the brains behind a self-watering plant.',
    tag: 'Garden',
  },
];

export default function SensorsSection({ onSensorClick }: { onSensorClick: (key: string) => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from('.sensors-reveal', {
          opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        });

        // Sensor card hover magnetics
        document.querySelectorAll('.sensor-card').forEach((card: Element) => {
          card.addEventListener('mousemove', (e: Event) => {
            const event = e as MouseEvent;
            const rect = (card as HTMLElement).getBoundingClientRect();
            const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
            gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, duration: 0.3, transformPerspective: 800 });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5 });
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGSAP();
  }, []);

  return (
    <section id="sensors" ref={sectionRef}>
      <div className="wrap">
        <div className="eyebrow sensors-reveal">02 · Senses</div>
        <h2 className="section-title sensors-reveal">Sensors give Arduino its senses</h2>
        <p className="lede sensors-reveal">
          A microcontroller alone can't feel the world — sensors are how it sees light, hears sound, 
          measures distance, and detects touch. <strong style={{ color: 'var(--cyan)' }}>Click any sensor card</strong> to 
          explore how it works, see wiring diagrams, and run live simulations.
        </p>

        <div className="grid cols-4" id="sensorGrid">
          {SENSOR_CARDS.map(card => (
            <div
              key={card.key}
              className="card sensor-card sensors-reveal"
              data-sensor={card.key}
              onClick={() => onSensorClick(card.key)}
              style={{ willChange: 'transform' }}
            >
              <div className="icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <span className="tag">{card.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
