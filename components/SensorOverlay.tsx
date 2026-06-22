'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ─── Sensor data ────────────────────────────────────────────── */
type SensorData = {
  title: string;
  emoji: string;
  tagColor: string;
  tagText: string;
  what: string;
  how: string;
  useCases: Array<{ icon: string; text: string }>;
  SimComponent: React.FC;
  wiring: Array<{ pin: string; to: string; color: string }>;
  imagePath?: string;
};

/* ─── Individual simulation components ───────────────────────── */

function IRSim() {
  const [btn, setBtn] = useState<string | null>(null);
  const [dir, setDir] = useState<string>('Waiting...');
  const [hex, setHex] = useState('0x----');
  const [isTransmitting, setIsTransmitting] = useState(false);

  const press = (label: string, code: string, direction: string) => {
    setBtn(label);
    setHex(code);
    setDir(direction);
    setIsTransmitting(true);
    setTimeout(() => setIsTransmitting(false), 250);
  };

  const buttons = [
    { label: '▲ Forward', code: '0xFF629D', dir: 'Forward' },
    { label: '▼ Backward', code: '0xFFA857', dir: 'Backward' },
    { label: '◀ Left', code: '0xFF22DD', dir: 'Left' },
    { label: '▶ Right', code: '0xFFC23D', dir: 'Right' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: 'var(--cream)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ color: 'var(--copper-bright)' }}>⚡</span> Live Wiring Simulation
        </h4>
        <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
          Watch how data flows from the sensor to the Arduino. Press the buttons to simulate different states.
        </p>
      </div>

      <div style={{ 
        background: '#051310', border: '1px solid var(--solder-edge)', borderRadius: '16px', 
        padding: '20px', position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '20px'
      }}>
        <svg viewBox="0 0 500 240" style={{ width: '100%', maxWidth: '540px', height: 'auto', display: 'block', margin: '0 auto' }}>
          {/* Lines ARDUINO to IR RECEIVER */}
          <path d="M 160 110 L 260 110" stroke="var(--copper-bright)" strokeWidth="2.5" fill="none" />
          <path d="M 160 125 L 260 125" stroke="#4b6359" strokeWidth="2.5" fill="none" />
          <path d="M 160 140 L 260 140" stroke="var(--copper-bright)" strokeWidth="2.5" fill="none" />
          
          {/* Signal from REMOTE to IR RECEIVER */}
          <path d="M 320 125 L 400 125" stroke="var(--copper-bright)" strokeWidth="3" fill="none" strokeDasharray="10 8" 
                style={{
                  strokeDashoffset: isTransmitting ? -60 : 0,
                  transition: isTransmitting ? 'stroke-dashoffset 0.25s linear' : 'none'
                }} />

          {/* ARDUINO Box */}
          <rect x="40" y="80" width="120" height="110" rx="8" fill="#061814" stroke="#1d3b31" strokeWidth="2" />
          <text x="52" y="102" fill="var(--muted-dim)" fontSize="11" fontFamily="JetBrains Mono,monospace" letterSpacing="0.05em">ARDUINO</text>
          
          {/* Decoded Command Box */}
          <rect x="80" y="170" width="100" height="36" rx="6" fill="#061814" stroke="var(--cyan)" strokeWidth="2" />
          <text x="130" y="193" fill="var(--cyan)" fontSize="13" fontFamily="JetBrains Mono,monospace" textAnchor="middle">{hex}</text>

          {/* IR RECEIVER */}
          <rect x="260" y="95" width="60" height="70" rx="8" fill="#061814" stroke="var(--copper-bright)" strokeWidth="2" />
          <circle cx="290" cy="130" r="14" fill="#0c111c" stroke="var(--copper-bright)" strokeWidth="2" />
          <text x="290" y="185" fill="var(--copper-bright)" fontSize="10" fontFamily="JetBrains Mono,monospace" textAnchor="middle" style={{ textTransform: 'uppercase' }}>IR Receiver</text>

          {/* REMOTE */}
          <rect x="400" y="65" width="56" height="110" rx="12" fill="#061814" stroke="var(--copper-bright)" strokeWidth="2" />
          <text x="428" y="90" fill="var(--copper-bright)" fontSize="9" fontFamily="JetBrains Mono,monospace" textAnchor="middle">REMOTE</text>
          
          <rect x="412" y="102" width="12" height="10" rx="2" fill={btn === '▲ Forward' ? 'var(--cyan)' : '#ab6657'} />
          <rect x="432" y="102" width="12" height="10" rx="2" fill={btn === '▼ Backward' ? 'var(--cyan)' : '#ab6657'} />
          <rect x="412" y="120" width="12" height="10" rx="2" fill={btn === '◀ Left' ? 'var(--cyan)' : '#ab6657'} />
          <rect x="432" y="120" width="12" height="10" rx="2" fill={btn === '▶ Right' ? 'var(--cyan)' : '#ab6657'} />
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          background: '#051310', border: '1px solid var(--solder-edge)', borderRadius: '12px',
          padding: '12px 20px', minWidth: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ color: dir === 'Waiting...' ? 'var(--cyan)' : 'var(--cream)', fontSize: '18px', fontWeight: 600, fontFamily: 'JetBrains Mono,monospace', marginBottom: '4px' }}>
            {dir}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '10px', fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase' }}>
            {dir === 'Waiting...' ? 'Status' : 'Decoded Command'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {buttons.map(b => (
            <button
              key={b.label}
              onClick={() => press(b.label, b.code, b.dir)}
              className="sim-btn"
              style={{
                background: btn === b.label ? 'var(--cyan)' : 'transparent',
                color: btn === b.label ? '#000' : 'var(--cyan)',
                border: '1px solid var(--cyan)',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'JetBrains Mono,monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UltrasonicSim() {
  const [dist, setDist] = useState(80);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleRun = () => {
    if (running) {
      if (timerRef.current) clearInterval(timerRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      timerRef.current = setInterval(() => {
        setDist(d => {
          const next = d + (Math.random() * 10 - 5);
          return Math.max(2, Math.min(200, next));
        });
      }, 300);
    }
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const pct = Math.min(dist / 200, 1);
  const zoneColor = dist < 20 ? '#E0654F' : dist < 60 ? '#F2A968' : '#5EEAD4';
  const zoneLabel = dist < 20 ? '🔴 DANGER' : dist < 60 ? '🟡 CLOSE' : '🟢 CLEAR';

  return (
    <div>
      {/* Radar visual */}
      <div className="sim-canvas" style={{ minHeight: '220px', position: 'relative', overflow: 'hidden' }}>
        <svg viewBox="0 0 500 200" style={{ width: '100%' }}>
          {/* Sensor */}
          <rect x="20" y="80" width="50" height="40" rx="6" fill="var(--solder)" stroke="var(--solder-edge)" strokeWidth="1.5"/>
          <circle cx="32" cy="100" r="8" fill="var(--muted-dim)" stroke="var(--solder-edge)"/>
          <circle cx="57" cy="100" r="8" fill="var(--muted-dim)" stroke="var(--solder-edge)"/>
          <text x="25" y="140" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--muted-dim)">HC-SR04</text>

          {/* Beam cone */}
          <path d={`M70 100 L${70 + pct * 370} 50 L${70 + pct * 370} 150 Z`}
            fill={zoneColor} opacity="0.08"/>
          <path d={`M70 100 L${70 + pct * 370} 50`} stroke={zoneColor} strokeWidth="1.5" strokeDasharray="5,4" opacity="0.5"/>
          <path d={`M70 100 L${70 + pct * 370} 150`} stroke={zoneColor} strokeWidth="1.5" strokeDasharray="5,4" opacity="0.5"/>

          {/* Object */}
          <rect x={65 + pct * 370} y="60" width="18" height="80" rx="4" fill="var(--solder)" stroke={zoneColor} strokeWidth="2"/>

          {/* Echo line */}
          <line x1={65 + pct * 370} y1="100" x2="70" y2="100" stroke={zoneColor} strokeWidth="2" strokeDasharray="4,3" opacity="0.7"/>
          <text x={72 + pct * 170} y="96" fontFamily="JetBrains Mono,monospace" fontSize="10" fill={zoneColor} textAnchor="middle">
            {Math.round(dist)} cm
          </text>

          {/* Zone labels */}
          <text x="130" y="190" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--red)" opacity="0.7">DANGER &lt;20cm</text>
          <text x="220" y="190" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--copper-bright)" opacity="0.7">CLOSE &lt;60cm</text>
          <text x="350" y="190" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--cyan)" opacity="0.7">CLEAR &gt;60cm</text>
        </svg>
      </div>

      <div className="sim-ctrl">
        <button className={`sim-btn ${running ? 'active' : ''}`} onClick={toggleRun}>
          {running ? '⏹ Stop simulation' : '▶ Start live sensor'}
        </button>
        {!running && (
          <input type="range" min="2" max="200" value={dist}
            onChange={e => setDist(Number(e.target.value))}
            style={{ flex: 1, minWidth: '160px', accentColor: 'var(--cyan)' }}
          />
        )}
        <div className="data-display">{Math.round(dist)} cm<span className="data-label">Distance</span></div>
        <div className="data-display" style={{ fontSize: '14px', color: zoneColor }}>{zoneLabel}<span className="data-label">Zone</span></div>
      </div>
    </div>
  );
}

function LDRSim() {
  const [lux, setLux] = useState(500);
  const pct = lux / 1023;
  const ledOn = pct < 0.3;
  const resistance = Math.round((1 - pct) * 100 + 2);

  return (
    <div>
      <div className="sim-canvas" style={{ minHeight: '200px' }}>
        <svg viewBox="0 0 520 180" style={{ width: '100%' }}>
          {/* Sun */}
          <circle cx="80" cy="90" r="28" fill="#F2A968" opacity={0.3 + pct * 0.7} filter="url(#sunGlow)"/>
          <defs><filter id="sunGlow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          {[0,45,90,135,180,225,270,315].map(a => (
            <line key={a}
              x1={80 + Math.cos(a*Math.PI/180)*34} y1={90 + Math.sin(a*Math.PI/180)*34}
              x2={80 + Math.cos(a*Math.PI/180)*46} y2={90 + Math.sin(a*Math.PI/180)*46}
              stroke="#F2A968" strokeWidth="3" opacity={0.3 + pct * 0.7}/>
          ))}
          <text x="58" y="140" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="var(--copper-bright)">
            Light: {Math.round(pct * 100)}%
          </text>

          {/* LDR component */}
          <rect x="190" y="68" width="48" height="44" rx="6" fill="var(--solder)" stroke="var(--solder-edge)" strokeWidth="1.5"/>
          <path d="M202 80 Q210 68 230 80 Q220 96 202 80Z" fill="var(--copper-bright)" opacity="0.4"/>
          <text x="193" y="128" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="var(--muted)">LDR</text>
          <text x="173" y="144" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--muted-dim)">{resistance}kΩ</text>

          {/* Wire to Arduino */}
          <line x1="238" y1="90" x2="310" y2="90" stroke="var(--cyan)" strokeWidth="2"/>
          <text x="316" y="78" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="var(--cyan)">A0</text>

          {/* Arduino box */}
          <rect x="310" y="60" width="80" height="60" rx="8" fill="var(--solder)" stroke="var(--solder-edge)" strokeWidth="1.5"/>
          <text x="320" y="88" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--muted)">Arduino</text>
          <text x="316" y="104" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--cyan)">val: {lux}</text>

          {/* Wire to LED */}
          <line x1="390" y1="90" x2="440" y2="90" stroke={ledOn ? '#4ade80' : 'var(--muted-dim)'} strokeWidth="2"/>

          {/* LED */}
          <circle cx="455" cy="90" r="16" fill={ledOn ? '#4ade80' : 'var(--solder)'} opacity={ledOn ? 0.9 : 0.4}
            stroke={ledOn ? '#4ade80' : 'var(--solder-edge)'} strokeWidth="2"
            style={{ filter: ledOn ? 'drop-shadow(0 0 10px #4ade80)' : 'none' }}/>
          <text x="440" y="125" fontFamily="JetBrains Mono,monospace" fontSize="10" fill={ledOn ? '#4ade80' : 'var(--muted-dim)'}>
            {ledOn ? 'LED ON 🟢' : 'LED OFF'}
          </text>
        </svg>
      </div>

      <div className="sim-ctrl">
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '12px', color: 'var(--muted)' }}>☀️ Light level</span>
        <input type="range" min="0" max="1023" value={lux}
          onChange={e => setLux(Number(e.target.value))}
          style={{ flex: 1, minWidth: '160px', accentColor: 'var(--cyan)' }}
        />
        <div className="data-display">{lux}<span className="data-label">analogRead(A0)</span></div>
        <div className="data-display" style={{ color: ledOn ? '#4ade80' : 'var(--red)' }}>
          {ledOn ? 'DARK' : 'BRIGHT'}<span className="data-label">Mode</span>
        </div>
      </div>
      <div className="note-box" style={{ marginTop: '16px' }}>
        <strong>How it works:</strong> When the LDR is in the dark, its resistance rises → the voltage divider puts more voltage to A0 → analogRead gives a low value → the Arduino switches the LED on.
      </div>
    </div>
  );
}

function DHTSim() {
  const [temp, setTemp] = useState(28);
  const [hum, setHum] = useState(65);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleRun = () => {
    if (running) { if (timerRef.current) clearInterval(timerRef.current); setRunning(false); }
    else {
      setRunning(true);
      timerRef.current = setInterval(() => {
        setTemp(t => +Math.max(15, Math.min(50, t + (Math.random() * 2 - 1))).toFixed(1));
        setHum(h => +Math.max(10, Math.min(100, h + (Math.random() * 4 - 2))).toFixed(0));
      }, 1500);
    }
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const hi = temp > 35;
  const comfort = temp >= 20 && temp <= 30 && hum >= 40 && hum <= 60;

  return (
    <div>
      <div className="sim-canvas" style={{ minHeight: '160px' }}>
        <svg viewBox="0 0 520 160" style={{ width: '100%' }}>
          {/* DHT chip */}
          <rect x="40" y="40" width="60" height="80" rx="8" fill="var(--solder)" stroke="var(--solder-edge)" strokeWidth="1.5"/>
          <text x="46" y="76" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="var(--cyan)" fontWeight="bold">DHT</text>
          <text x="46" y="94" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="var(--cyan)">11</text>
          <line x1="50" y1="120" x2="50" y2="140" stroke="var(--red)" strokeWidth="2"/>
          <line x1="65" y1="120" x2="65" y2="140" stroke="var(--cyan)" strokeWidth="2"/>
          <line x1="80" y1="120" x2="80" y2="140" stroke="#5b6b64" strokeWidth="2"/>
          <text x="44" y="154" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--red)">VCC</text>
          <text x="58" y="154" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--cyan)">DAT</text>
          <text x="73" y="154" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--muted-dim)">GND</text>

          {/* Thermometer */}
          <rect x="200" y="30" width="26" height="80" rx="13" fill="var(--solder)" stroke="var(--solder-edge)" strokeWidth="1.5"/>
          <rect x="208" y={30 + (1 - (temp - 15) / 35) * 60} width="10" height={(temp - 15) / 35 * 60 + 16} rx="5"
            fill={temp > 35 ? 'var(--red)' : temp < 20 ? 'var(--cyan)' : 'var(--copper-bright)'}/>
          <text x="194" y="126" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="var(--muted)">TEMP</text>
          <text x="188" y="16" fontFamily="JetBrains Mono,monospace" fontSize="20" fill={temp > 35 ? 'var(--red)' : 'var(--copper-bright)'} fontWeight="bold">
            {temp.toFixed(1)}°C
          </text>

          {/* Droplet / humidity */}
          <path d="M330 50 Q330 20 350 30 Q370 20 370 50 Q370 75 350 80 Q330 75 330 50Z"
            fill="var(--blue)" opacity={0.2 + (hum / 100) * 0.6}/>
          <text x="326" y="100" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="var(--muted)">HUMIDITY</text>
          <text x="322" y="16" fontFamily="JetBrains Mono,monospace" fontSize="20" fill="var(--blue)" fontWeight="bold">
            {hum}%
          </text>

          {/* Status */}
          <rect x="430" y="40" width="70" height="80" rx="10" fill="var(--solder)" stroke={comfort ? '#4ade80' : 'var(--copper)'} strokeWidth="1.5"/>
          <text x="452" y="72" fontFamily="JetBrains Mono,monospace" fontSize="14">{comfort ? '😊' : hi ? '🥵' : '🥶'}</text>
          <text x="438" y="94" fontFamily="JetBrains Mono,monospace" fontSize="9" fill={comfort ? '#4ade80' : 'var(--copper-bright)'}>
            {comfort ? 'COMFY' : hi ? 'TOO HOT' : 'COOL'}
          </text>
        </svg>
      </div>

      <div className="sim-ctrl" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <button className={`sim-btn ${running ? 'active' : ''}`} onClick={toggleRun}>
          {running ? '⏹ Stop' : '▶ Simulate live'}
        </button>
        {!running && <>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'var(--muted)' }}>🌡️ Temp</span>
            <input type="range" min="15" max="50" step="0.5" value={temp}
              onChange={e => setTemp(+e.target.value)} style={{ width: '120px', accentColor: 'var(--copper-bright)' }}/>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'var(--muted)' }}>💧 Hum</span>
            <input type="range" min="10" max="100" value={hum}
              onChange={e => setHum(+e.target.value)} style={{ width: '120px', accentColor: 'var(--blue)' }}/>
          </div>
        </>}
      </div>
    </div>
  );
}

function PIRSim() {
  const [motion, setMotion] = useState(false);
  const [lastSeen, setLastSeen] = useState<string>('—');
  const [events, setEvents] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = () => {
    setMotion(true);
    const ts = new Date().toLocaleTimeString();
    setLastSeen(ts);
    setEvents(e => [`Motion at ${ts}`, ...e].slice(0, 5));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMotion(false), 3000);
  };

  return (
    <div>
      <div className="sim-canvas" style={{ minHeight: '180px', cursor: 'pointer' }} onClick={trigger}>
        <svg viewBox="0 0 520 180" style={{ width: '100%' }}>
          {/* PIR dome */}
          <ellipse cx="110" cy="90" rx="55" ry="55" fill={motion ? 'rgba(94,234,212,0.15)' : 'var(--solder)'} stroke={motion ? 'var(--cyan)' : 'var(--solder-edge)'} strokeWidth="2"
            style={{ transition: 'all 0.3s ease', filter: motion ? 'drop-shadow(0 0 16px rgba(94,234,212,0.4))' : 'none' }}/>
          <text x="84" y="95" fontFamily="JetBrains Mono,monospace" fontSize="13" fill={motion ? 'var(--cyan)' : 'var(--muted)'} fontWeight="bold">PIR</text>

          {/* Detection zones */}
          {motion && [1, 2, 3].map(i => (
            <ellipse key={i} cx="110" cy="90" rx={55 + i * 50} ry={55 + i * 40}
              fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeDasharray="5,5"
              opacity={0.6 - i * 0.15}/>
          ))}

          {/* Person icon */}
          <g style={{ transition: 'opacity 0.3s', opacity: 1 }}>
            <circle cx="400" cy="55" r="15" fill={motion ? 'var(--copper-bright)' : 'var(--muted-dim)'} opacity="0.8"/>
            <rect x="388" y="72" width="24" height="35" rx="6" fill={motion ? 'var(--copper-bright)' : 'var(--muted-dim)'} opacity="0.8"/>
            <line x1="388" y1="90" x2="375" y2="110" stroke={motion ? 'var(--copper-bright)' : 'var(--muted-dim)'} strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
            <line x1="412" y1="90" x2="425" y2="110" stroke={motion ? 'var(--copper-bright)' : 'var(--muted-dim)'} strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
          </g>

          {/* Buzzer */}
          <circle cx="470" cy="90" r="22" fill={motion ? 'var(--red)' : 'var(--solder)'} stroke="var(--solder-edge)" strokeWidth="2"
            style={{ transition: 'all 0.3s', filter: motion ? 'drop-shadow(0 0 12px rgba(224,101,79,0.6))' : 'none' }}/>
          <text x="454" y="95" fontFamily="JetBrains Mono,monospace" fontSize="11" fill={motion ? '#fff' : 'var(--muted-dim)'}>
            {motion ? '🔔' : '🔕'}
          </text>
          <text x="458" y="128" fontFamily="JetBrains Mono,monospace" fontSize="9" fill={motion ? 'var(--red)' : 'var(--muted-dim)'}>
            ALARM
          </text>

          {/* Click hint */}
          {!motion && <text x="180" y="166" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="var(--muted-dim)" textAnchor="middle">
            👆 Click / tap to simulate motion
          </text>}
          {motion && <text x="180" y="166" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="var(--cyan)" textAnchor="middle">
            ⚠️ MOTION DETECTED — 3s hold
          </text>}
        </svg>
      </div>

      <div className="sim-ctrl">
        <button className="sim-btn active" onClick={trigger}>Trigger motion</button>
        <div className="data-display" style={{ color: motion ? 'var(--red)' : 'var(--muted)' }}>
          {motion ? 'DETECTED' : 'CLEAR'}<span className="data-label">digitalRead(D2)</span>
        </div>
        <div className="data-display" style={{ fontSize: '13px' }}>{lastSeen}<span className="data-label">Last seen</span></div>
      </div>

      {events.length > 0 && (
        <pre style={{ background: '#051310', border: '1px solid var(--solder-edge)', borderRadius: '10px', padding: '14px', fontFamily: 'JetBrains Mono,monospace', fontSize: '12px', marginTop: '14px' }}>
          {events.map((e, i) => <div key={i} style={{ opacity: 1 - i * 0.18, color: i === 0 ? 'var(--cyan)' : 'var(--muted-dim)' }}>{e}</div>)}
        </pre>
      )}
    </div>
  );
}

function SoilSim() {
  const [moisture, setMoisture] = useState(400);
  const [pumping, setPumping] = useState(false);
  const [pumpLog, setPumpLog] = useState<string[]>([]);
  const threshold = 300;

  const wet = moisture >= threshold;
  const pct = Math.round((moisture / 1023) * 100);
  const barColor = moisture < 200 ? 'var(--red)' : moisture < threshold ? 'var(--copper-bright)' : 'var(--cyan)';

  useEffect(() => {
    if (!wet && !pumping) {
      setPumping(true);
      setPumpLog(l => [`[${new Date().toLocaleTimeString()}] Pump ON — soil dry!`, ...l].slice(0, 5));
      const t = setTimeout(() => {
        setPumping(false);
        setMoisture(m => Math.min(m + 200, 900));
        setPumpLog(l => [`[${new Date().toLocaleTimeString()}] Pump OFF — watered 3s`, ...l].slice(0, 5));
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [wet, moisture]);

  return (
    <div>
      <div className="sim-canvas" style={{ minHeight: '160px' }}>
        <svg viewBox="0 0 520 160" style={{ width: '100%' }}>
          {/* Soil probes */}
          <rect x="60" y="30" width="12" height="100" rx="4" fill="var(--copper-bright)" stroke="var(--copper)" strokeWidth="1.5"/>
          <rect x="90" y="30" width="12" height="100" rx="4" fill="var(--copper-bright)" stroke="var(--copper)" strokeWidth="1.5"/>
          <text x="50" y="22" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="var(--muted)">Probes</text>

          {/* Soil */}
          <rect x="40" y="80" width="100" height="60" rx="0" fill="#3d2a1a" opacity="0.6"/>
          {/* Water level */}
          <rect x="40" y={80 + (1 - moisture / 1023) * 60} width="100"
            height={moisture / 1023 * 60} fill="var(--blue)" opacity="0.4"/>

          {/* Line */}
          <line x1="162" y1="50" x2="220" y2="50" stroke="var(--cyan)" strokeWidth="2"/>
          <text x="162" y="38" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--cyan)">A0</text>

          {/* Microcontroller */}
          <rect x="220" y="30" width="80" height="80" rx="8" fill="var(--solder)" stroke="var(--solder-edge)" strokeWidth="1.5"/>
          <text x="232" y="66" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--muted)">Arduino</text>
          <text x="228" y="82" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--cyan)">val={moisture}</text>
          <text x="228" y="98" fontFamily="JetBrains Mono,monospace" fontSize="9" fill={wet ? '#4ade80' : 'var(--red)'}>
            {wet ? 'WET ✔' : 'DRY ✖'}
          </text>

          {/* Pump */}
          <line x1="300" y1="70" x2="370" y2="70" stroke={pumping ? '#4ade80' : 'var(--muted-dim)'} strokeWidth="2"/>
          <ellipse cx="400" cy="70" rx="30" ry="22" fill={pumping ? 'rgba(74,222,128,0.15)' : 'var(--solder)'}
            stroke={pumping ? '#4ade80' : 'var(--solder-edge)'} strokeWidth="2"
            style={{ filter: pumping ? 'drop-shadow(0 0 10px rgba(74,222,128,0.4))' : 'none' }}/>
          <text x="376" y="68" fontFamily="JetBrains Mono,monospace" fontSize="9" fill={pumping ? '#4ade80' : 'var(--muted-dim)'}>
            {pumping ? '💧💧' : 'PUMP'}
          </text>
          <text x="374" y="80" fontFamily="JetBrains Mono,monospace" fontSize="8" fill={pumping ? '#4ade80' : 'var(--muted-dim)'}>
            {pumping ? 'ON' : 'OFF'}
          </text>

          {/* Moisture bar */}
          <rect x="460" y="20" width="20" height="120" rx="5" fill="var(--solder)" stroke="var(--solder-edge)"/>
          <rect x="460" y={20 + (1 - moisture / 1023) * 120} width="20" height={moisture / 1023 * 120} rx="5" fill={barColor}/>
          <text x="457" y="155" fontFamily="JetBrains Mono,monospace" fontSize="9" fill={barColor}>{pct}%</text>
          <line x1="455" y1={20 + (1 - threshold / 1023) * 120} x2="484" y2={20 + (1 - threshold / 1023) * 120}
            stroke="var(--red)" strokeWidth="1.5" strokeDasharray="3,2"/>
          <text x="448" y={18 + (1 - threshold / 1023) * 120} fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--red)">▶</text>
        </svg>
      </div>

      <div className="sim-ctrl">
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '12px', color: 'var(--muted)' }}>💧 Moisture</span>
        <input type="range" min="0" max="1023" value={moisture}
          onChange={e => setMoisture(Number(e.target.value))}
          style={{ flex: 1, minWidth: '120px', accentColor: 'var(--cyan)' }}
        />
        <div className="data-display">{moisture}<span className="data-label">analogRead(A0)</span></div>
        <div className="data-display" style={{ color: pumping ? '#4ade80' : 'var(--muted)' }}>
          {pumping ? 'PUMPING' : 'IDLE'}<span className="data-label">Pump state</span>
        </div>
      </div>

      {pumpLog.length > 0 && (
        <pre style={{ background: '#051310', border: '1px solid var(--solder-edge)', borderRadius: '10px', padding: '14px', fontFamily: 'JetBrains Mono,monospace', fontSize: '12px', marginTop: '14px' }}>
          {pumpLog.map((l, i) => <div key={i} style={{ opacity: 1 - i * 0.2, color: i === 0 ? '#4ade80' : 'var(--muted-dim)' }}>{l}</div>)}
        </pre>
      )}
    </div>
  );
}

function ButtonSim() {
  const [pressed, setPressed] = useState(false);
  const [toggleMode, setToggleMode] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const handlePress = useCallback(() => {
    if (pressed) return;
    setPressed(true);
    setPressCount(c => c + 1);
    const ts = new Date().toLocaleTimeString() + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
    setLog(prev => [`[${ts}] Pin D4 -> LOW (PRESSED)`, ...prev].slice(0, 5));
  }, [pressed]);

  const handleRelease = useCallback(() => {
    if (!pressed) return;
    setPressed(false);
    const ts = new Date().toLocaleTimeString() + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
    setLog(prev => [`[${ts}] Pin D4 -> HIGH (RELEASED)`, ...prev].slice(0, 5));
  }, [pressed]);

  const handleClick = () => {
    if (toggleMode) {
      if (pressed) {
        handleRelease();
      } else {
        handlePress();
      }
    }
  };

  return (
    <div>
      <div className="sim-canvas" style={{ minHeight: '200px', userSelect: 'none' }}>
        <svg viewBox="0 0 520 180" style={{ width: '100%' }}>
          {/* Breadboard background */}
          <rect x="20" y="20" width="480" height="140" rx="8" fill="var(--solder)" stroke="var(--solder-edge)" strokeWidth="1.5" />
          
          {/* Arduino pin headers */}
          <text x="35" y="45" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--muted-dim)">Arduino Input D4 & GND</text>
          
          {/* Push Button Representation */}
          <rect x="120" y="60" width="60" height="60" rx="8" fill="#1e1e1e" stroke="#333" strokeWidth="2" />
          {/* Metal pins */}
          <rect x="110" y="70" width="10" height="8" rx="2" fill="#aaa" />
          <rect x="110" y="102" width="10" height="8" rx="2" fill="#aaa" />
          <rect x="180" y="70" width="10" height="8" rx="2" fill="#aaa" />
          <rect x="180" y="102" width="10" height="8" rx="2" fill="#aaa" />
          
          {/* Interactive Button Cap (plunger) */}
          <circle 
            cx="150" 
            cy="90" 
            r={pressed ? 18 : 22} 
            fill={pressed ? 'var(--cyan)' : 'var(--red)'} 
            stroke="#111" 
            strokeWidth="3"
            style={{ 
              transition: 'all 0.1s ease', 
              cursor: 'pointer',
              filter: pressed ? 'drop-shadow(0 0 10px var(--cyan))' : 'none' 
            }}
            onMouseDown={() => { if (!toggleMode) handlePress(); }}
            onMouseUp={() => { if (!toggleMode) handleRelease(); }}
            onMouseLeave={() => { if (!toggleMode && pressed) handleRelease(); }}
            onTouchStart={(e) => { e.preventDefault(); if (!toggleMode) handlePress(); }}
            onTouchEnd={(e) => { e.preventDefault(); if (!toggleMode) handleRelease(); }}
            onClick={handleClick}
          />
          <text x="150" y="94" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="bold" fill={pressed ? 'var(--bg)' : '#fff'} style={{ pointerEvents: 'none' }}>
            {pressed ? 'DOWN' : 'PUSH'}
          </text>

          {/* D13 Indicator LED (Built-in LED) */}
          <circle cx="340" cy="90" r="15" fill={pressed ? '#4ade80' : '#1a4a2a'} stroke={pressed ? '#4ade80' : '#2a6a3a'} strokeWidth="2" style={{ filter: pressed ? 'drop-shadow(0 0 12px #4ade80)' : 'none' }} />
          <text x="340" y="125" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="9" fill={pressed ? '#4ade80' : 'var(--muted-dim)'}>
            {pressed ? 'LED D13: ON' : 'LED D13: OFF'}
          </text>
          
          {/* Wires */}
          <path d="M110 74 L80 74 L80 140" fill="none" stroke="#5b6b64" strokeWidth="2" />
          <text x="85" y="135" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="#5b6b64">GND</text>
          
          <path d="M110 106 L60 106 L60 140" fill="none" stroke="var(--cyan)" strokeWidth="2" />
          <text x="45" y="135" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--cyan)">D4</text>

          {/* Internal Pull-up resistor text/indicator */}
          <text x="210" y="70" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--muted)">INPUT_PULLUP enabled</text>
          <text x="210" y="85" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--muted-dim)">Internal resistor (~30kΩ) pulls D4 to 5V</text>
          <text x="210" y="105" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--muted-dim)">Pressing connects D4 directly to GND</text>
        </svg>
      </div>

      <div className="sim-ctrl">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'JetBrains Mono,monospace', fontSize: '12px', color: 'var(--cream)' }}>
          <input type="checkbox" checked={toggleMode} onChange={e => { setToggleMode(e.target.checked); if (pressed) handleRelease(); }} />
          Toggle mode (Click to lock)
        </label>
        <div className="data-display" style={{ color: pressed ? 'var(--cyan)' : 'var(--copper-bright)' }}>
          {pressed ? 'LOW (0)' : 'HIGH (1)'}<span className="data-label">digitalRead(D4)</span>
        </div>
        <div className="data-display">{pressCount}<span className="data-label">Press Count</span></div>
      </div>

      {log.length > 0 && (
        <pre style={{ background: '#051310', border: '1px solid var(--solder-edge)', borderRadius: '10px', padding: '14px', fontFamily: 'JetBrains Mono,monospace', fontSize: '12px', marginTop: '14px' }}>
          {log.map((l, i) => <div key={i} style={{ opacity: 1 - i * 0.18, color: i === 0 ? 'var(--cyan)' : 'var(--muted-dim)' }}>{l}</div>)}
        </pre>
      )}
    </div>
  );
}

function SoundSim() {
  const [ambient, setAmbient] = useState(25);
  const [threshold, setThreshold] = useState(50);
  const [currentSound, setCurrentSound] = useState(25);
  const [lampOn, setLampOn] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const isClapActive = useRef(false);

  // Sync currentSound to ambient unless a clap is active
  useEffect(() => {
    if (!isClapActive.current) {
      setCurrentSound(ambient);
    }
  }, [ambient]);

  const triggerClap = () => {
    if (isClapActive.current) return;
    isClapActive.current = true;
    setCurrentSound(100);
    
    const ts = new Date().toLocaleTimeString() + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
    
    // Check if 100 exceeds threshold
    if (100 > threshold) {
      setLampOn(l => !l);
      setLog(prev => [
        `[${ts}] 👏 CLAP DETECTED! Sound (100) > Threshold (${threshold})`,
        `[${ts}] Toggle Lamp -> ${!lampOn ? 'ON 💡' : 'OFF 🌑'}`,
        ...prev
      ].slice(0, 6));
    } else {
      setLog(prev => [
        `[${ts}] 👏 CLAP! Sound (100) <= Threshold (${threshold}) [Too insensitive!]`,
        ...prev
      ].slice(0, 6));
    }

    setTimeout(() => {
      isClapActive.current = false;
      setCurrentSound(ambient);
    }, 200);
  };

  const doPin = currentSound > threshold ? 'HIGH (1)' : 'LOW (0)';
  const analogVal = Math.round((currentSound / 100) * 1023);
  const thresholdAnalog = Math.round((threshold / 100) * 1023);

  return (
    <div>
      <div className="sim-canvas" style={{ minHeight: '220px' }}>
        <svg viewBox="0 0 520 200" style={{ width: '100%' }}>
          {/* Sound Sensor Module */}
          <rect x="30" y="40" width="120" height="120" rx="8" fill="var(--solder)" stroke="var(--solder-edge)" strokeWidth="1.5" />
          
          {/* Microphone component */}
          <circle cx="90" cy="70" r="18" fill="#111" stroke="#333" strokeWidth="2" />
          <circle cx="90" cy="70" r="14" fill="#222" stroke="var(--copper)" strokeWidth="1" />
          <path d="M78 70 L102 70 M90 58 L90 82" stroke="#555" strokeWidth="1.5" />
          <text x="90" y="100" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--muted)">MIC</text>

          {/* Blue Trim pot */}
          <rect x="50" y="115" width="22" height="22" fill="#0055ff" rx="2" stroke="#0033cc" strokeWidth="1" />
          <circle cx="61" cy="126" r="6" fill="#fff" />
          {/* Rotate trim pot screw based on threshold */}
          <line 
            x1="61" 
            y1="126" 
            x2={61 + Math.cos(threshold * Math.PI / 50) * 6} 
            y2={126 + Math.sin(threshold * Math.PI / 50) * 6} 
            stroke="#444" 
            strokeWidth="2" 
          />
          <text x="61" y="148" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="7" fill="var(--muted)">SENS</text>

          {/* Sound waves visualizer */}
          {[1, 2, 3].map(i => {
            const size = currentSound / 100;
            return (
              <path 
                key={i} 
                d={`M${90 - 24 - i*10} ${70 - i*8} Q${90 - 32 - i*12} 70 ${90 - 24 - i*10} ${70 + i*8}`} 
                fill="none" 
                stroke={currentSound > threshold ? 'var(--cyan)' : 'var(--copper-bright)'} 
                strokeWidth="2" 
                opacity={Math.max(0.1, size * (1.2 - i*0.3))} 
                strokeLinecap="round"
              />
            );
          })}

          {/* Connective lines */}
          <path d="M150 70 L240 70" fill="none" stroke="var(--copper-bright)" strokeWidth="2" />
          <text x="160" y="62" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--copper-bright)">A1 (Analogue)</text>
          
          <path d="M150 110 L240 110" fill="none" stroke="var(--cyan)" strokeWidth="2" />
          <text x="160" y="102" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--cyan)">D5 (Digital)</text>

          {/* Arduino Box */}
          <rect x="240" y="40" width="90" height="90" rx="8" fill="var(--solder)" stroke="var(--solder-edge)" strokeWidth="1.5" />
          <text x="285" y="65" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="var(--cream)">Arduino</text>
          <text x="248" y="88" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--copper-bright)">A1: {analogVal}</text>
          <text x="248" y="105" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="var(--cyan)">D5: {currentSound > threshold ? 'HIGH' : 'LOW'}</text>

          {/* Lamp wire */}
          <path d="M330 85 L390 85" fill="none" stroke={lampOn ? '#ffcc00' : 'var(--muted-dim)'} strokeWidth="2" />

          {/* Lamp Visual */}
          <g transform="translate(430, 85)">
            <path d="M-15 15 L15 15 L10 25 L-10 25 Z" fill="#666" />
            <rect x="-4" y="25" width="8" height="15" fill="#444" />
            <circle cx="0" cy="-5" r="20" fill={lampOn ? '#ffe680' : '#444444'} stroke={lampOn ? '#ffcc00' : '#555'} strokeWidth="2" style={{ transition: 'all 0.2s' }} />
            {lampOn && [0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <line 
                key={a}
                x1={Math.cos(a * Math.PI / 180) * 24} 
                y1={-5 + Math.sin(a * Math.PI / 180) * 24} 
                x2={Math.cos(a * Math.PI / 180) * 34} 
                y2={-5 + Math.sin(a * Math.PI / 180) * 34} 
                stroke="#ffcc00" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            ))}
            <text x="0" y="5" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="18" style={{ pointerEvents: 'none' }}>
              {lampOn ? '💡' : '🌑'}
            </text>
            <text x="0" y="48" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="9" fill={lampOn ? '#ffcc00' : 'var(--muted-dim)'} fontWeight="bold">
              {lampOn ? 'LAMP ON' : 'LAMP OFF'}
            </text>
          </g>
        </svg>
      </div>

      <div className="sim-ctrl" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <button className="sim-btn active" onClick={triggerClap} style={{ background: 'var(--cyan)', color: 'var(--bg)' }}>
          👏 Trigger Clap!
        </button>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'var(--muted)' }}>🔊 Sound Level</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={ambient} 
            onChange={e => setAmbient(Number(e.target.value))} 
            style={{ width: '100px', accentColor: 'var(--copper-bright)' }} 
            disabled={isClapActive.current}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', color: 'var(--muted)' }}>⚙️ Threshold</span>
          <input 
            type="range" 
            min="10" 
            max="90" 
            value={threshold} 
            onChange={e => setThreshold(Number(e.target.value))} 
            style={{ width: '100px', accentColor: 'var(--cyan)' }} 
          />
        </div>
      </div>

      <div className="sim-ctrl" style={{ marginTop: '10px', justifyContent: 'flex-start', gap: '14px' }}>
        <div className="data-display">{analogVal} <span className="data-label">analogRead(A1)</span></div>
        <div className="data-display" style={{ color: currentSound > threshold ? 'var(--cyan)' : 'var(--muted-dim)' }}>
          {doPin} <span className="data-label">digitalRead(D5)</span>
        </div>
        <div className="data-display" style={{ color: thresholdAnalog > 800 ? 'var(--red)' : 'var(--cyan)' }}>
          {thresholdAnalog} <span className="data-label">Threshold setting</span>
        </div>
      </div>

      {log.length > 0 && (
        <pre style={{ background: '#051310', border: '1px solid var(--solder-edge)', borderRadius: '10px', padding: '14px', fontFamily: 'JetBrains Mono,monospace', fontSize: '12px', marginTop: '14px' }}>
          {log.map((l, i) => <div key={i} style={{ opacity: 1 - i * 0.16, color: i === 0 ? 'var(--cyan)' : 'var(--muted-dim)' }}>{l}</div>)}
        </pre>
      )}
    </div>
  );
}

/* Generic sim for sensors without a dedicated one */
function GenericSim({ title }: { title: string }) {
  return (
    <div className="sim-canvas" style={{ minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted-dim)', fontFamily: 'JetBrains Mono,monospace', fontSize: '13px', textAlign: 'center' }}>
        Interactive simulation for {title}<br/>coming soon — try the other sensors!
      </p>
    </div>
  );
}

/* ─── Sensor database ─────────────────────────────────────────── */
const SENSORS: Record<string, SensorData> = {
  ir: {
    title: 'IR Receiver',
    emoji: '📡',
    tagColor: 'var(--copper-bright)',
    tagText: "Today's core sensor",
    what: `An infrared (IR) receiver listens for modulated infrared light bursts coming from your TV remote — or a dedicated car remote. Each button on the remote sends a unique 38 kHz blink-pattern.`,
    how: `The receiver module's dome filters out visible light and only reacts to 38 kHz IR. It demodulates the signal into a digital HIGH/LOW pulse train. A library like IRremote decodes this pattern into a hex number your sketch can act on — for example 0xFF629D = "Up" button.`,
    useCases: [
      { icon: '🚗', text: 'Remote-control vehicles (today!)' },
      { icon: '📺', text: 'Control TVs, fans, ACs' },
      { icon: '🔐', text: 'IR "password" door unlocker' },
      { icon: '🎮', text: 'IR-controlled robot arm' },
    ],
    SimComponent: IRSim,
    wiring: [
      { pin: 'VCC', to: 'Arduino 5V', color: 'var(--red)' },
      { pin: 'GND', to: 'Arduino GND', color: '#5b6b64' },
      { pin: 'OUT', to: 'Arduino D10', color: 'var(--cyan)' },
    ],
    imagePath: '/ir.jpg',
  },
  ultrasonic: {
    title: 'Ultrasonic (HC-SR04)',
    emoji: '🦇',
    tagColor: 'var(--cyan)',
    tagText: 'Distance sensor',
    what: `The HC-SR04 measures distance using sound waves, just like a bat uses echolocation. It fires a 40 kHz ultrasonic burst, then listens for the echo. The time between send and receive, divided by the speed of sound, gives you centimetres.`,
    how: `Send a 10µs HIGH pulse to the TRIG pin. The sensor fires 8 ultrasonic pulses and the ECHO pin goes HIGH until the echo returns. Measure that HIGH pulse width with pulseIn() and divide by 58 to get cm (or 148 for inches).`,
    useCases: [
      { icon: '🤖', text: 'Obstacle-avoiding robot' },
      { icon: '🅿️', text: 'Parking distance indicator' },
      { icon: '📦', text: 'Level sensor in tanks/bins' },
      { icon: '🚪', text: 'Auto door opener' },
    ],
    SimComponent: UltrasonicSim,
    wiring: [
      { pin: 'VCC',  to: 'Arduino 5V', color: 'var(--red)'  },
      { pin: 'GND',  to: 'Arduino GND', color: '#5b6b64' },
      { pin: 'TRIG', to: 'Arduino D9 (output)', color: 'var(--copper-bright)' },
      { pin: 'ECHO', to: 'Arduino D8 (input)',  color: 'var(--cyan)' },
    ],
    imagePath: '/image-4.jpg',
  },
  ldr: {
    title: 'LDR (Light Sensor)',
    emoji: '☀️',
    tagColor: 'var(--copper-bright)',
    tagText: 'Analogue light level',
    what: `An LDR (Light Dependent Resistor) changes its resistance based on how much light hits it. In bright light it's a few hundred ohms; in the dark it shoots up to megaohms. Pair it with a fixed resistor to make a voltage divider and you get an analogue 0–1023 reading on any Arduino analogue pin.`,
    how: `Wire the LDR in series with a 10 kΩ resistor between 5V and GND. Read the midpoint with analogRead(A0). When dark, the LDR resistance is very high so most voltage appears at A0 → high reading. When light, resistance falls → low reading.`,
    useCases: [
      { icon: '🌙', text: 'Auto night-light' },
      { icon: '🌱', text: 'Grow-light controller' },
      { icon: '🏙️', text: 'Street-lamp automation' },
      { icon: '📸', text: 'Flash trigger for photography' },
    ],
    SimComponent: LDRSim,
    wiring: [
      { pin: 'LDR leg A', to: 'Arduino 5V', color: 'var(--red)' },
      { pin: 'LDR leg B', to: 'A0 and 10kΩ→GND', color: 'var(--cyan)' },
    ],
    imagePath: '/image-5.jpg',
  },
  dht: {
    title: 'Temperature & Humidity (DHT11)',
    emoji: '🌡️',
    tagColor: 'var(--blue)',
    tagText: 'Climate sensing',
    what: `The DHT11 (or DHT22 for better accuracy) is a combined temperature and humidity sensor in one plastic package. It speaks a simple single-wire protocol that the DHT library handles for you — one line of code gives you both readings.`,
    how: `After powering on, wait 2 seconds for the sensor to stabilise. Call dht.readTemperature() and dht.readHumidity(). The sensor sends a 40-bit serial stream encoding both values. The library decodes it and returns floats.`,
    useCases: [
      { icon: '🌤️', text: 'Personal weather station' },
      { icon: '🏠', text: 'Smart HVAC controller' },
      { icon: '🌿', text: 'Greenhouse climate monitor' },
      { icon: '⚠️', text: 'Heat-stroke alert wearable' },
    ],
    SimComponent: DHTSim,
    wiring: [
      { pin: 'VCC', to: 'Arduino 5V', color: 'var(--red)' },
      { pin: 'GND', to: 'Arduino GND', color: '#5b6b64' },
      { pin: 'DATA', to: 'Arduino D4 (+ 10kΩ pull-up to 5V)', color: 'var(--cyan)' },
    ],
    imagePath: '/image-6.jpg',
  },
  pir: {
    title: 'PIR Motion Sensor',
    emoji: '👁️',
    tagColor: 'var(--red)',
    tagText: 'Motion detection',
    what: `A PIR (Passive Infrared) sensor detects changes in infrared radiation — specifically the heat emitted by moving bodies. The Fresnel lens on the front divides the field of view into zones; when a warm object moves between zones, the sensor fires.`,
    how: `Connect OUT to a digital pin and call digitalRead() in your loop. The pin goes HIGH for a settable hold-time (default ~3 s) whenever motion is detected. A potentiometer on the sensor module adjusts sensitivity and hold-time.`,
    useCases: [
      { icon: '💡', text: 'Security-light trigger' },
      { icon: '🔔', text: 'Intruder alarm' },
      { icon: '🚿', text: 'Auto-flush toilet' },
      { icon: '🖥️', text: 'Screen saver wake-up' },
    ],
    SimComponent: PIRSim,
    wiring: [
      { pin: 'VCC', to: 'Arduino 5V', color: 'var(--red)' },
      { pin: 'GND', to: 'Arduino GND', color: '#5b6b64' },
      { pin: 'OUT', to: 'Arduino D2', color: 'var(--cyan)' },
    ],
    imagePath: '/image-7.jpg',
  },
  soil: {
    title: 'Soil Moisture Sensor',
    emoji: '🌱',
    tagColor: 'var(--green)',
    tagText: 'Gardening IoT',
    what: `Two conductive probes measure the resistance of the soil between them. Wet soil conducts more electricity than dry soil, so the resistance falls as moisture rises. The module converts this to a 0–1023 analogue voltage you can read on any Arduino analogue pin.`,
    how: `Connect VCC and GND, then read AO (analogue out) with analogRead(). Calibrate: push the probe into dry soil and note the reading (~800+), then water it and note the new reading (~300). Set your pump threshold somewhere between them.`,
    useCases: [
      { icon: '🌿', text: 'Auto plant watering system' },
      { icon: '🌾', text: 'Smart irrigation controller' },
      { icon: '🏡', text: 'Indoor plant care bot' },
      { icon: '📊', text: 'Soil health logger' },
    ],
    SimComponent: SoilSim,
    wiring: [
      { pin: 'VCC', to: 'Arduino 5V', color: 'var(--red)' },
      { pin: 'GND', to: 'Arduino GND', color: '#5b6b64' },
      { pin: 'AO',  to: 'Arduino A0 (analogue)', color: 'var(--cyan)' },
      { pin: 'DO',  to: 'Arduino D7 (optional threshold)', color: 'var(--copper-bright)' },
    ],
    imagePath: '/image-8.jpg',
  },
  button: {
    title: 'Push Button',
    emoji: '🔘',
    tagColor: 'var(--muted)',
    tagText: 'Digital input',
    what: `A push button is the simplest input device — it connects or breaks a circuit when pressed. On an Arduino, wire it between a digital pin and GND, enable the internal pull-up resistor with INPUT_PULLUP and the pin reads HIGH normally, LOW when pressed.`,
    how: `pinMode(pin, INPUT_PULLUP) then digitalRead(pin) == LOW means pressed. Debounce with a small delay() or the Bounce2 library to ignore electrical noise on the contact edges.`,
    useCases: [
      { icon: '🚀', text: 'Race start trigger' },
      { icon: '🔐', text: 'Keypad combinations' },
      { icon: '🎮', text: 'Game controller input' },
      { icon: '🔔', text: 'Manual buzzer trigger' },
    ],
    SimComponent: ButtonSim,
    wiring: [
      { pin: 'Leg A', to: 'Arduino D4', color: 'var(--cyan)' },
      { pin: 'Leg B', to: 'Arduino GND', color: '#5b6b64' },
    ],
    imagePath: '/touch.jpg',
  },
  sound: {
    title: 'Sound Sensor',
    emoji: '🎤',
    tagColor: 'var(--purple)',
    tagText: 'Audio detection',
    what: `A sound sensor module has a small electret microphone and a comparator. The DO (digital out) pin fires HIGH when sound exceeds an adjustable threshold — perfect for clap-detection. The AO (analogue out) gives the raw audio waveform level.`,
    how: `Use DO with digitalRead() for clap detection (set threshold with the blue trimmer). Use AO with analogRead() if you want to visualise audio amplitude or react to volume levels.`,
    useCases: [
      { icon: '👏', text: 'Clap-controlled lamp' },
      { icon: '🎵', text: 'Music-reactive LED strip' },
      { icon: '🚨', text: 'Loud-noise alarm' },
      { icon: '🤫', text: 'Silence detector for libraries' },
    ],
    SimComponent: SoundSim,
    wiring: [
      { pin: 'VCC', to: 'Arduino 5V', color: 'var(--red)' },
      { pin: 'GND', to: 'Arduino GND', color: '#5b6b64' },
      { pin: 'DO',  to: 'Arduino D5 (digital)', color: 'var(--cyan)' },
      { pin: 'AO',  to: 'Arduino A1 (analogue)', color: 'var(--copper-bright)' },
    ],
    imagePath: '/sound.jpg',
  },
};

/* ─── Overlay component ──────────────────────────────────────── */
export default function SensorOverlay({
  sensorKey,
  onClose,
}: {
  sensorKey: string;
  onClose: () => void;
}) {
  const data = SENSORS[sensorKey];
  const panelRef = useRef<HTMLDivElement>(null);

  // Animate in
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.1,0.64,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [sensorKey]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!data) return null;
  const Sim = data.SimComponent;

  return (
    <div className="sensor-overlay open" style={{ overflowY: 'auto' }}>
      <div className="overlay-header">
        <button className="back-btn" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          All Sensors
        </button>
        <div className="overlay-title">{data.emoji} {data.title}</div>
        <span style={{
          fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', letterSpacing: '0.08em',
          border: '1px solid', borderColor: data.tagColor, color: data.tagColor,
          borderRadius: '6px', padding: '3px 10px',
        }}>
          {data.tagText}
        </span>
      </div>

      <div className="overlay-body" ref={panelRef}>
        {data.imagePath && (
          <div style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '600px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
              <img src={data.imagePath} alt={data.title} style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', display: 'block' }} />
            </div>
            <div style={{ marginTop: '16px', fontFamily: 'JetBrains Mono,monospace', fontSize: '11px', letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>
              {data.title} · Reference Photo
            </div>
          </div>
        )}

        {/* What + How section */}
        <div className="sensor-explain">
          <div>
            <h3>What is it?</h3>
            <p>{data.what}</p>
          </div>
          <div>
            <h3>How does it work?</h3>
            <p>{data.how}</p>

            <h4 style={{ color: 'var(--cream)', fontSize: '14px', margin: '20px 0 12px' }}>Wiring</h4>
            <ul className="pin-list">
              {data.wiring.map(w => (
                <li key={w.pin}><b style={{ color: w.color }}>{w.pin}</b>{w.to}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Use cases */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--cream)', marginBottom: '14px' }}>Real-world uses</h3>
          <div className="use-cases">
            {data.useCases.map(u => (
              <div key={u.text} className="use-case-pill">
                <span>{u.icon}</span>{u.text}
              </div>
            ))}
          </div>
        </div>

        {/* Simulation */}
        <div>
          <h3 style={{ fontSize: '20px', color: 'var(--cream)', marginBottom: '6px' }}>
            🧪 Live simulation
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
            Interact below to see how the sensor data changes — the Arduino code would read exactly these values.
          </p>
          <Sim />
        </div>
      </div>
    </div>
  );
}
