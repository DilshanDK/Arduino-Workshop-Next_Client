'use client';
import { useEffect, useRef } from 'react';

export default function CompetitionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from('.comp-reveal', {
          opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGSAP();
  }, []);

  const rules = [
    { pct: '30%', label: 'Speed — fastest to finish', color: 'var(--cyan)' },
    { pct: '30%', label: 'Accuracy — fewest crashes', color: 'var(--copper-bright)' },
    { pct: '20%', label: 'Code quality — clean & commented', color: 'var(--green)' },
    { pct: '20%', label: 'Team spirit — helped each other', color: 'var(--purple)' },
  ];

  const tips = [
    { icon: '⚡', title: 'Tune your speed', body: 'Use the slider — not all 255. Medium PWM values (~160) are often faster around corners.' },
    { icon: '🔁', title: 'Test turns first', body: 'Drive in a figure-8 before the race. Asymmetric motor strength is the #1 cause of straight-line drift.' },
    { icon: '📡', title: 'IR angle matters', body: 'Point your remote at the receiver dome, not the side. Aim within 30° for reliable signals.' },
    { icon: '🧰', title: 'Tape the wires', body: 'A loose dupont wire during the race costs seconds. Tape down the ribbon before you start.' },
    { icon: '🧮', title: 'Add a brake command', body: 'Map one remote button to IN1=LOW, IN2=LOW, ENA=0. Clean stops win close races.' },
    { icon: '🏎️', title: 'Stagger your start', body: 'Press a button to start, not power-on — avoids false starts when everyone plugs in at once.' },
  ];

  return (
    <section id="competition" ref={sectionRef} style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(201,130,74,0.04) 100%)' }}>
      <div className="wrap">
        <div className="eyebrow comp-reveal">05 · Race Day</div>
        <h2 className="section-title comp-reveal">Build it → Race it → Win it</h2>
        <p className="lede comp-reveal">
          The last 15 minutes of the workshop is a timed obstacle course. Every team competes — 
          fastest car with the fewest crashes takes the trophy. Here's how judges score it.
        </p>

        {/* Scoring */}
        <div className="criteria-row comp-reveal">
          {rules.map(r => (
            <div key={r.label} className="criteria">
              <div className="pct" style={{ color: r.color }}>{r.pct}</div>
              <div className="lbl">{r.label}</div>
            </div>
          ))}
        </div>

        {/* Track preview */}
        <div className="comp-reveal" style={{ margin: '60px 0 50px' }}>
          <h3 style={{ fontSize: '22px', color: 'var(--cream)', marginBottom: '12px' }}>
            🏁 Race track layout
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '28px' }}>
            A figure-8 slalom with two checkpoints and a 30 cm-wide gate at the finish line.
          </p>
          <div className="art-box" style={{ padding: '32px' }}>
            <svg viewBox="0 0 700 320" style={{ width: '100%', maxWidth: '700px', margin: '0 auto', display: 'block' }}>
              {/* Track surface */}
              <rect x="0" y="0" width="700" height="320" rx="16" fill="var(--bg2)" stroke="var(--solder-edge)" strokeWidth="1.5"/>

              {/* Loop left */}
              <ellipse cx="200" cy="160" rx="140" ry="110" fill="none" stroke="var(--solder-edge)" strokeWidth="28" strokeOpacity="0.4"/>
              <ellipse cx="200" cy="160" rx="140" ry="110" fill="none" stroke="var(--copper)" strokeWidth="3" strokeDasharray="8 6"/>

              {/* Loop right */}
              <ellipse cx="500" cy="160" rx="140" ry="110" fill="none" stroke="var(--solder-edge)" strokeWidth="28" strokeOpacity="0.4"/>
              <ellipse cx="500" cy="160" rx="140" ry="110" fill="none" stroke="var(--copper)" strokeWidth="3" strokeDasharray="8 6"/>

              {/* Centre crossing */}
              <line x1="340" y1="60" x2="360" y2="260" stroke="var(--copper)" strokeWidth="3" strokeDasharray="8 6"/>

              {/* Start/Finish gate */}
              <rect x="40" y="130" width="6" height="60" rx="3" fill="var(--cyan)"/>
              <rect x="40" y="125" width="60" height="8" fill="var(--cyan)" opacity="0.7"/>
              <text x="50" y="120" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="var(--cyan)">START / FINISH</text>

              {/* Checkpoints */}
              <circle cx="200" cy="50" r="10" fill="var(--copper-bright)" opacity="0.8"/>
              <text x="212" y="54" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="var(--copper-bright)">CP 1</text>
              <circle cx="500" cy="270" r="10" fill="var(--copper-bright)" opacity="0.8"/>
              <text x="515" y="274" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="var(--copper-bright)">CP 2</text>

              {/* Arrow showing direction */}
              <path d="M100 60 Q200 30 290 130 Q350 200 430 130 Q520 50 600 160 Q540 260 440 250"
                fill="none" stroke="var(--cyan)" strokeWidth="2" strokeDasharray="5,4" opacity="0.5"
                markerEnd="url(#arrow)"/>
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 Z" fill="var(--cyan)" opacity="0.7"/>
                </marker>
              </defs>

              {/* Car icon */}
              <rect x="55" y="145" width="22" height="14" rx="4" fill="var(--copper-bright)"/>
              <circle cx="60" cy="160" r="3" fill="var(--bg)"/>
              <circle cx="72" cy="160" r="3" fill="var(--bg)"/>
              <text x="56" y="143" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--cream)">🚗</text>
            </svg>
          </div>
        </div>

        {/* Pro tips */}
        <div className="comp-reveal">
          <h3 style={{ fontSize: '22px', color: 'var(--cream)', marginBottom: '24px' }}>
            🧠 Pro tips before the race
          </h3>
          <div className="grid cols-3">
            {tips.map(tip => (
              <div key={tip.title} className="card" style={{ borderColor: 'var(--solder-edge)' }}>
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{tip.icon}</div>
                <h3 style={{ fontSize: '15px' }}>{tip.title}</h3>
                <p style={{ fontSize: '14px' }}>{tip.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Take-home */}
        <div className="comp-reveal grid cols-2" style={{
          marginTop: '60px', padding: '40px 48px',
          background: 'linear-gradient(135deg, rgba(94,234,212,0.06), rgba(201,130,74,0.06))',
          border: '1px solid var(--solder-edge)', borderRadius: '20px',
          gap: '40px',
        }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '14px' }}>What you take home</div>
            <h3 style={{ color: 'var(--cream)', fontSize: '20px', marginBottom: '14px' }}>
              More than just a car
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.7' }}>
              You now know how to read sensors, drive motors with PWM, decode infrared signals, 
              and write structured Arduino code. Every project idea on the board is buildable 
              by you — today was just the beginning.
            </p>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: '14px' }}>Next steps</div>
            <ul className="pin-list">
              {[
                ['Join IITS', 'Spark Masters programme (ages 14–17)'],
                ['Online', 'arduino.cc/en/Tutorial/HomePage'],
                ['Buy parts', 'Any local electronics store or robu.in'],
                ['Community', 'r/arduino — 1M+ makers ready to help'],
              ].map(([b, t]) => (
                <li key={b}><b>{b}</b>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
