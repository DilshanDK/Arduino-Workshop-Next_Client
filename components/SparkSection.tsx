'use client';
import { useEffect, useRef } from 'react';

export default function SparkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from('.spark-reveal', {
          opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGSAP();
  }, []);

  return (
    <section id="spark" ref={sectionRef} style={{ padding: '100px 0', background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="eyebrow spark-reveal" style={{ textTransform: 'uppercase' }}>— 01 · Spark</div>
        <h2 className="section-title spark-reveal" style={{ marginBottom: '40px' }}>What is Arduino, really?</h2>
        
        <div className="spark-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '60px', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--muted)', fontSize: '18px', lineHeight: '1.8', margin: 0 }}>
              An Arduino is a tiny, programmable computer brain — small enough to fit inside a toy car, cheap enough to break without panic, and simple enough to learn in an afternoon. You write instructions on your laptop, upload them over USB, and the board carries them out forever, even after you unplug your computer.
            </p>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
            <img src="/image.jpg" alt="Arduino Uno Diagram" style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }} />
          </div>
        </div>

        <div className="spark-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div style={{ border: '1px dashed var(--solder-edge)', padding: '40px', borderRadius: '16px' }}>
            <h3 style={{ color: 'var(--cream)', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Microprocessor (your laptop)</h3>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
              The brain in your laptop is powerful but needs a whole support team around it — separate memory chips, storage drives, a cooling fan, an operating system. It's built to juggle many apps at once.
            </p>
          </div>
          <div style={{ border: '1px dashed var(--solder-edge)', padding: '40px', borderRadius: '16px' }}>
            <h3 style={{ color: 'var(--cream)', marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Microcontroller (Arduino)</h3>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
              An Arduino's brain, memory, and input/output pins all live on one tiny chip. No operating system, no juggling — it runs one job, perfectly, over and over. That's exactly what a robot or sensor needs.
            </p>
          </div>
        </div>

        <div className="spark-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="card">
            <h4 style={{ color: 'var(--copper-bright)', marginBottom: '10px', fontSize: '18px' }}>Arduino Uno</h4>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
              The classic beginner board. USB-programmable, 14 digital pins, 6 analog pins, huge community. What we're using today.
            </p>
          </div>
          <div className="card">
            <h4 style={{ color: 'var(--copper-bright)', marginBottom: '10px', fontSize: '18px' }}>ESP32</h4>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Same idea, plus built-in Wi‑Fi and Bluetooth. Great once you want your project to talk to a phone app.
            </p>
          </div>
          <div className="card">
            <h4 style={{ color: 'var(--copper-bright)', marginBottom: '10px', fontSize: '18px' }}>Raspberry Pi Pico</h4>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Very cheap, dual-core, programmable in Python or C++. A solid second board to try after Arduino.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
