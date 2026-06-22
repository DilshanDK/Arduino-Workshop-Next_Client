'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function BuildSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [pwmVal, setPwmVal] = useState(180);

  const duty = pwmVal / 255;
  const pct = Math.round(duty * 100);
  const rpm = Math.round(duty * 3000);
  const avgV = (duty * 5).toFixed(1);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from('.build-reveal', {
          opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        });

        // Wire draw animations
        document.querySelectorAll('.wire').forEach(w => {
          const el = w as SVGPathElement;
          const len = el.getTotalLength ? el.getTotalLength() : 200;
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
          ScrollTrigger.create({
            trigger: el.closest('svg'),
            start: 'top 75%',
            onEnter: () => gsap.to(el, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }),
            once: true,
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGSAP();
  }, []);

  // PWM waveform generation
  const generateWaveform = () => {
    const x0 = 20, x1 = 380, hi = 50, lo = 140;
    const cycles = 6;
    const cw = (x1 - x0) / cycles;
    let pts = `${x0},${lo}`;
    for (let i = 0; i < cycles; i++) {
      const sx = x0 + i * cw;
      const onW = cw * duty;
      pts += ` ${sx},${lo} ${sx},${hi} ${sx + onW},${hi} ${sx + onW},${lo} ${sx + cw},${lo}`;
    }
    return pts;
  };

  const avgY = 140 - (140 - 50) * duty;

  return (
    <section id="build" ref={sectionRef}>
      <div className="wrap">
        <div className="eyebrow build-reveal">04 · Build</div>
        <h2 className="section-title build-reveal">Today's build: the IR remote car</h2>
        <p className="lede build-reveal">
          Four parts, wired together: an IR receiver to listen for commands, a motor driver to do the 
          heavy lifting, the Arduino Uno to think, and two DC motors to move. Let's meet each one.
        </p>

        <div className="note-box build-reveal">
          <strong>⚡ Speed Control with PWM</strong> — The L298N has ENA and ENB enable pins. By connecting 
          them to Arduino PWM pins (D9 and D10) and using <code>analogWrite(ENA, speed)</code> where speed 
          is 0–255, you can control how fast each motor spins. Low value = slow, 255 = full speed. 
          The car's "forward" and "backward" commands now accept a speed argument!
        </div>

        {/* 1. IR Receiver */}
        <div className="build-sub build-reveal">
          <div className="text">
            <h3>1 · The IR receiver</h3>
            <p>
              An infrared remote doesn't send sound or radio — it blinks an invisible infrared LED in 
              a fast pattern, like Morse code made of light. Every button sends its own unique pattern.
            </p>
            <p>
              The IR receiver module on the car has three pins. It catches that blinking light and turns 
              it into a single digital signal the Arduino can read — then a small code library 
              (<span className="mono">IRremote</span>) decodes which button was pressed.
            </p>
            <ul className="pin-list">
              <li><b>VCC</b> → Arduino 5V</li>
              <li><b>GND</b> → Arduino GND</li>
              <li><b>OUT</b> → Arduino D10 (signal)</li>
            </ul>
          </div>
          <div className="art">
            <div className="art-box">
              <svg viewBox="0 0 320 220">
                <rect x="120" y="30" width="80" height="60" rx="6" className="board-fill"/>
                <circle cx="160" cy="50" r="14" fill="#0F2B21" stroke="#5EEAD4" strokeWidth="2"/>
                <text x="138" y="22" className="schem-label strong">IR RECEIVER</text>
                <path className="wire wire-power" d="M140 90 V150 H 80 V190" />
                <path className="wire wire-gnd" d="M160 90 V170 H 80 V190" />
                <path className="wire wire-sig" d="M180 90 V130 H 260 V190" />
                <text x="50" y="205" className="schem-label">5V</text>
                <text x="55" y="160" className="schem-label" style={{ fill: '#5b6b64' }}>GND</text>
                <text x="235" y="205" className="schem-label" style={{ fill: '#5EEAD4' }}>D10</text>
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Motor Driver */}
        <div className="build-sub reverse build-reveal">
          <div className="text">
            <h3>2 · The motor driver — L298N</h3>
            <p>
              Arduino pins are gentle — they can push out only a tiny trickle of current, nowhere near 
              enough to spin a motor. The <b>L298N</b> module is the muscle: it takes Arduino's small 
              control signals and uses them to switch a much bigger battery current through the motors.
            </p>
            <p>Each motor gets two direction pins (to spin forward or backward) and one enable pin (to control speed via PWM).</p>
            <ul className="pin-list">
              <li><b>IN1 / IN2</b> → D4 / D5 — Left motor direction</li>
              <li><b>IN3 / IN4</b> → D6 / D7 — Right motor direction</li>
              <li><b>ENA</b> → D9 — Left speed (PWM)</li>
              <li><b>ENB</b> → D3 — Right speed (PWM)</li>
              <li><b>12V / GND</b> → Battery pack</li>
            </ul>
          </div>
          <div className="art">
            <div className="art-box">
              <svg viewBox="0 0 320 220">
                <rect x="90" y="20" width="140" height="90" rx="6" className="board-fill"/>
                <text x="108" y="14" className="schem-label strong">L298N MOTOR DRIVER</text>
                <text x="100" y="50" className="schem-label">IN1 IN2 IN3 IN4</text>
                <text x="100" y="70" className="schem-label">ENA(D9)    ENB(D3)</text>
                <circle cx="60" cy="160" r="22" fill="none" stroke="#5EEAD4" strokeWidth="2"/>
                <text x="34" y="195" className="schem-label">Left motor</text>
                <circle cx="260" cy="160" r="22" fill="none" stroke="#5EEAD4" strokeWidth="2"/>
                <text x="225" y="195" className="schem-label">Right motor</text>
                <path className="wire wire-sig" d="M105 110 V140 H60 V138" />
                <path className="wire wire-sig" d="M215 110 V140 H260 V138" />
                <path className="wire wire-power" d="M160 20 V0" />
                <text x="148" y="6" className="schem-label" style={{ fill: '#E0654F' }}>12V battery</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Full circuit */}
        <div style={{ marginTop: '40px' }} className="build-reveal">
          <h3 style={{ fontSize: '24px', color: 'var(--cream)', marginBottom: '10px' }}>3 · Full circuit diagram</h3>
          <p style={{ color: 'var(--muted)', fontSize: '15.5px', maxWidth: '680px', marginBottom: '30px' }}>
            Everything connects back to the Arduino Uno and a shared ground. Trace the colours: 
            red is power, grey/dark is ground, cyan is signal. Note ENA/ENB PWM pins for speed control.
          </p>
          <div className="art-box" style={{ overflowX: 'auto' }}>
            <svg viewBox="0 0 900 460" style={{ minWidth: '760px' }}>
              <rect x="60" y="160" width="220" height="160" rx="10" className="board-fill"/>
              <text x="80" y="148" className="schem-label strong">ARDUINO UNO</text>
              <text x="70" y="185" className="schem-label" style={{ fill: '#5EEAD4' }}>D10 IR_IN</text>
              <text x="70" y="205" className="schem-label" style={{ fill: '#5EEAD4' }}>D4 IN1</text>
              <text x="70" y="220" className="schem-label" style={{ fill: '#5EEAD4' }}>D5 IN2</text>
              <text x="70" y="235" className="schem-label" style={{ fill: '#5EEAD4' }}>D6 IN3</text>
              <text x="70" y="250" className="schem-label" style={{ fill: '#5EEAD4' }}>D7 IN4</text>
              <text x="70" y="268" className="schem-label" style={{ fill: '#F2A968' }}>D9 ENA~</text>
              <text x="70" y="283" className="schem-label" style={{ fill: '#F2A968' }}>D3 ENB~</text>
              <rect x="380" y="60" width="220" height="140" rx="10" className="board-fill"/>
              <text x="400" y="48" className="schem-label strong">L298N DRIVER</text>
              <text x="390" y="85" className="schem-label">IN1 IN2 IN3 IN4</text>
              <text x="390" y="105" className="schem-label" style={{ fill: '#F2A968' }}>ENA(PWM)  ENB(PWM)</text>
              <rect x="380" y="290" width="120" height="80" rx="8" className="board-fill"/>
              <text x="390" y="278" className="schem-label strong">IR RECEIVER</text>
              <circle cx="440" cy="320" r="12" fill="#0F2B21" stroke="#5EEAD4" strokeWidth="1.5"/>
              <rect x="660" y="20" width="90" height="50" rx="6" className="board-fill"/>
              <text x="668" y="14" className="schem-label">BATTERY 7.4–9V</text>
              <circle cx="780" cy="130" r="30" fill="none" stroke="#5EEAD4" strokeWidth="2"/>
              <text x="745" y="172" className="schem-label">Left motor</text>
              <circle cx="780" cy="240" r="30" fill="none" stroke="#5EEAD4" strokeWidth="2"/>
              <text x="740" y="282" className="schem-label">Right motor</text>
              <path className="wire wire-power" d="M705 70 V100 H600" />
              <path className="wire wire-power" d="M660 45 H50 V310" />
              <path className="wire wire-gnd" d="M280 300 H340 V200 H380" />
              <path className="wire wire-gnd" d="M280 320 H360 V360 H380 V360" />
              <path className="wire wire-sig" d="M380 310 H320 V285 H280" />
              <path className="wire wire-sig" d="M280 205 H340 V120 H380" />
              <path className="wire wire-sig" d="M280 220 H350 V135 H380" />
              <path className="wire wire-sig" d="M280 235 H360 V150 H380" />
              <path className="wire wire-sig" d="M280 250 H365 V165 H380" />
              <path className="wire wire-yellow" d="M280 268 H340 V112 H380" />
              <path className="wire wire-yellow" d="M280 283 H345 V125 H380" />
              <path className="wire wire-power" d="M600 110 H640 V130 H750" />
              <path className="wire wire-power" d="M600 135 H650 V240 H750" />
              <text x="610" y="68" style={{ fontFamily: 'JetBrains Mono,monospace', fill: '#E0654F', fontSize: '11px' }}>12V</text>
              <text x="500" y="98" style={{ fontFamily: 'JetBrains Mono,monospace', fill: '#9FB8AC', fontSize: '11px' }}>5V (shared)</text>
              <text x="580" y="115" style={{ fontFamily: 'JetBrains Mono,monospace', fill: '#F2A968', fontSize: '11px' }}>PWM speed</text>
            </svg>
          </div>
        </div>

        {/* PWM Speed Slider */}
        <div className="sim-section build-reveal" style={{ marginTop: '48px' }}>
          <h3>🎛️ Try it: live PWM speed slider</h3>
          <p>
            Drag the slider — the duty-cycle waveform widens, the voltage average rises, and both wheels spin faster. 
            This is exactly what <span className="mono" style={{ color: 'var(--cyan)' }}>analogWrite(ENA, speed)</span> does behind the scenes.
          </p>
          <div className="sim-canvas" style={{ minHeight: '240px' }}>
            <svg viewBox="0 0 620 240" style={{ width: '100%' }}>
              <text x="20" y="28" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="#9FB8AC">PWM SIGNAL · D9 (ENA)</text>
              <line x1="20" y1="100" x2="380" y2="100" stroke="#1E4636" strokeWidth="1" strokeDasharray="3,3"/>
              <polyline points={generateWaveform()} fill="none" stroke="#5EEAD4" strokeWidth="2.2"/>
              <line x1="20" y1="40" x2="20" y2="140" stroke="#1E4636" strokeWidth="1"/>
              <line x1="20" y1="140" x2="380" y2="140" stroke="#1E4636" strokeWidth="1"/>
              <text x="6" y="46" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="#6E8A7E">5V</text>
              <text x="6" y="144" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="#6E8A7E">0V</text>
              <line x1="20" y1={avgY} x2="380" y2={avgY} stroke="#F2A968" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.9"/>
              <text x="386" y={avgY + 4} fontFamily="JetBrains Mono,monospace" fontSize="10" fill="#F2A968">avg {avgV}V</text>
              {/* MOTORS */}
              <text x="440" y="28" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="#9FB8AC">MOTORS</text>
              <WheelSVG cx={460} cy={110} duty={duty} color="#C9824A"/>
              <WheelSVG cx={560} cy={110} duty={duty} color="#F2A968"/>
              <text x="446" y="178" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="#9FB8AC">LEFT</text>
              <text x="548" y="178" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="#9FB8AC">RIGHT</text>
              {/* Speed bar */}
              <rect x="20" y="190" width="580" height="14" rx="7" fill="#0F2B21" stroke="#1E4636"/>
              <defs>
                <linearGradient id="sgrad" x1="0" x2="1">
                  <stop offset="0" stopColor="#5EEAD4"/>
                  <stop offset="1" stopColor="#F2A968"/>
                </linearGradient>
              </defs>
              <rect x="20" y="190" width={580 * duty} height="14" rx="7" fill="url(#sgrad)"/>
              <text x="20" y="224" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="#6E8A7E">0</text>
              <text x="580" y="224" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="#6E8A7E">255</text>
            </svg>
          </div>
          <div className="sim-ctrl" style={{ alignItems: 'center' }}>
            <input
              type="range" min="0" max="255" value={pwmVal}
              onChange={e => setPwmVal(Number(e.target.value))}
              style={{ flex: 1, minWidth: '200px', accentColor: 'var(--cyan)' }}
            />
            <div className="data-display">{pwmVal}<span className="data-label">PWM value (0–255)</span></div>
            <div className="data-display">{pct}%<span className="data-label">Duty cycle</span></div>
            <div className="data-display">{rpm}<span className="data-label">Approx RPM</span></div>
          </div>
          <div className="note-box" style={{ marginTop: '18px' }}>
            <strong>Why this matters</strong> — the Arduino can't actually output "half voltage". Instead it 
            flicks the pin ON and OFF ~490 times per second. The motor's inertia smooths these pulses into an 
            effective voltage. More ON-time per cycle = more average voltage = faster motor.
          </div>
        </div>

        {/* Hardware photos */}
        <div className="sim-section build-reveal" style={{ marginTop: '48px' }}>
          <h3>📸 Meet the hardware</h3>
          <p>The real boards and the full wiring you'll be putting together on the bench.</p>
          <div className="ref-grid">
            <div>
              <div className="ref-img-box">
                <Image src="/image.jpg" alt="Arduino UNO board" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: 'auto' }}/>
              </div>
              <div className="ref-caption">ARDUINO UNO · LABELLED PINOUT</div>
            </div>
            <div>
              <div className="ref-img-box">
                <Image src="/image-2.jpg" alt="L298N motor driver" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: 'auto' }}/>
              </div>
              <div className="ref-caption">L298N MOTOR DRIVER · 43×43mm</div>
            </div>
            <div>
              <div className="ref-img-box">
                <Image src="/image-3.jpg" alt="Full wiring diagram" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: 'auto' }}/>
              </div>
              <div className="ref-caption">FULL WIRING · ARDUINO + L298N + MOTORS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WheelSVG({ cx, cy, duty, color }: { cx: number, cy: number, duty: number, color: string }) {
  const angle = useRef(0);
  const [rot, setRot] = useState(0);

  useEffect(() => {
    if (duty < 0.02) return;
    const speed = duty * 6;
    let raf: number;
    const animate = () => {
      angle.current = (angle.current + speed) % 360;
      setRot(angle.current);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [duty]);

  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r="38" fill="#0F2B21" stroke={color} strokeWidth="2"/>
      <circle r="6" fill={color}/>
      <g transform={`rotate(${rot})`}>
        <line x1="-34" y1="0" x2="34" y2="0" stroke="#5EEAD4" strokeWidth="2"/>
        <line x1="0" y1="-34" x2="0" y2="34" stroke="#5EEAD4" strokeWidth="2"/>
      </g>
    </g>
  );
}
