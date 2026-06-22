'use client';
import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');

      const ctx = gsap.context(() => {
        // Stagger hero entrance
        gsap.from('.hero-chip', { opacity: 0, y: 14, duration: 0.6, delay: 0.3 });
        gsap.from('.hero-h1', { opacity: 0, y: 30, duration: 0.9, delay: 0.5, ease: 'power3.out' });
        gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.7, delay: 0.7 });
        gsap.from('.agenda-pill', { opacity: 0, y: 14, duration: 0.5, delay: 0.9, stagger: 0.08 });
        gsap.from('#heroSvg', { opacity: 0, scale: 0.9, duration: 1, delay: 0.4, ease: 'power3.out' });

        // LED blinking
        gsap.utils.toArray('.led').forEach((led: any, i: number) => {
          gsap.to(led, {
            opacity: 0.2, duration: 0.6 + i * 0.3, repeat: -1, yoyo: true,
            ease: 'sine.inOut', delay: i * 0.4
          });
        });

        // Floating particles
        const container = document.getElementById('heroParticles');
        if (container) {
          for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 4 + 2;
            const colors = ['#5EEAD4', '#C9824A', '#F2A968', '#E0654F'];
            p.style.cssText = `
              width: ${size}px; height: ${size}px;
              background: ${colors[Math.floor(Math.random() * colors.length)]};
              left: ${Math.random() * 100}%;
              animation-duration: ${Math.random() * 15 + 10}s;
              animation-delay: ${Math.random() * 10}s;
              opacity: 0;
            `;
            container.appendChild(p);
          }
        }

        // Animate hero SVG wires
        const wires = document.querySelectorAll('#heroSvg .wire');
        wires.forEach(w => {
          const el = w as SVGPathElement;
          const len = el.getTotalLength ? el.getTotalLength() : 200;
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
          gsap.to(el, { strokeDashoffset: 0, duration: 1.5, delay: 0.8, ease: 'power2.inOut' });
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGSAP();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      <div id="heroParticles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      
      <div className="wrap hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <div className="chip hero-chip">
            <span className="dot" />
            Grade 8–9 Maker Lab · Half-day, 3 hours
          </div>
          <h1 className="hero-h1">
            Build it.<br />Code it.<br /><span>Race it.</span>
          </h1>
          <p className="sub hero-sub">
            One afternoon, four sensors, one motor driver, and a remote control — 
            by the end, every team drives a car they wired and programmed themselves.
          </p>
          <div className="agenda-strip">
            {[
              { time: '0:00–0:25', label: 'Spark' },
              { time: '0:25–0:55', label: 'Senses + Ideas' },
              { time: '1:00–2:30', label: 'Build the car' },
              { time: '2:45–3:00', label: 'Race day' },
            ].map(item => (
              <div key={item.time} className="agenda-pill">
                <b>{item.time}</b> · {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-art">
          <svg id="heroSvg" viewBox="0 0 420 380">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Board */}
            <rect x="40" y="40" width="340" height="300" rx="18" className="board-fill"/>
            <g className="mono schem-label">
              <text x="60" y="68" className="strong">ARDUINO UNO</text>
            </g>
            {/* CPU chip */}
            <rect x="160" y="140" width="100" height="60" rx="4" fill="#0F2B21" stroke="#C9824A" strokeWidth="1.2"/>
            <text x="178" y="174" className="schem-label">ATmega328P</text>
            {/* LEDs */}
            <circle className="led" cx="70" cy="100" r="6" fill="#5EEAD4" opacity="0.9" filter="url(#glow)"/>
            <circle className="led" cx="92" cy="100" r="6" fill="#C9824A" opacity="0.5" filter="url(#glow)"/>
            <circle className="led" cx="114" cy="100" r="6" fill="#E0654F" opacity="0.6" filter="url(#glow)"/>
            {/* Wires */}
            <path d="M40 230 H 0" className="wire wire-sig"/>
            <path d="M380 230 H 420" className="wire wire-power"/>
            <path d="M150 340 V 380" className="wire wire-gnd"/>
            <path d="M260 340 V 380" className="wire wire-sig"/>
            {/* PCB traces */}
            <g stroke="#1E4636" strokeWidth="1">
              <line x1="60" y1="40" x2="60" y2="0"/>
              <line x1="100" y1="40" x2="100" y2="0"/>
              <line x1="140" y1="40" x2="140" y2="0"/>
              <line x1="320" y1="340" x2="320" y2="380"/>
            </g>
            {/* Pin headers */}
            {[0,1,2,3,4,5].map(i => (
              <rect key={i} x={260 + i * 12} y="40" width="8" height="12" rx="2" fill="#C9824A" opacity="0.6"/>
            ))}
            {/* USB port */}
            <rect x="40" y="280" width="30" height="20" rx="3" fill="#1E4636" stroke="#5EEAD4" strokeWidth="1"/>
            <text x="42" y="295" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '6px', fill: '#5EEAD4' }}>USB</text>
          </svg>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
        Scroll to explore
      </div>
    </section>
  );
}
