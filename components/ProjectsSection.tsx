'use client';
import { useEffect, useRef } from 'react';

const PROJECTS = [
  { num: '01', emoji: '🌙', title: 'Automatic Night Light', desc: 'LDR detects darkness and auto-switches an LED strip on. Add a potentiometer to tune the sensitivity threshold.', tag: 'LDR + LED + Resistor', diff: 'EASY', diffClass: 'diff-easy', variant: 'new-idea' },
  { num: '02', emoji: '👏', title: 'Clap-to-Toggle Lamp', desc: 'Sound sensor catches a double-clap pattern and flips a relay to turn a room lamp on or off — no app, no remote.', tag: 'Sound Sensor + Relay', diff: 'EASY', diffClass: 'diff-easy', variant: 'new-idea' },
  { num: '03 · Today\'s Build', emoji: '🚗', title: 'IR Remote Control Car', desc: 'A remote sends infrared codes, the Arduino reads them, and a motor driver turns the wheels with variable speed — forward, back, left, right.', tag: 'IR + L298N + PWM Speed', diff: 'EASY', diffClass: 'diff-easy', variant: 'featured' },
  { num: '04', emoji: '🌡️', title: 'Mini Weather Station', desc: 'DHT11 reads temperature and humidity every second and prints them to an LCD or serial monitor. Add a buzzer for heat alerts.', tag: 'DHT11 + LCD I2C', diff: 'EASY', diffClass: 'diff-easy', variant: 'new-idea' },
  { num: '05', emoji: '🌿', title: 'Smart Plant Waterer', desc: 'Soil moisture probe reads dryness. When it drops below a set value the Arduino fires a mini pump for 3 seconds. Your plant will never thirst.', tag: 'Soil Moisture + Mini Pump', diff: 'MEDIUM', diffClass: 'diff-med', variant: 'new-idea' },
  { num: '06', emoji: '🔒', title: 'Motion-Triggered Security Alarm', desc: 'PIR sensor detects movement in a room and triggers a buzzer + LED flash. Add a keypad "password" to disarm it.', tag: 'PIR + Buzzer + Keypad', diff: 'MEDIUM', diffClass: 'diff-med', variant: 'new-idea' },
  { num: '07', emoji: '🤖', title: 'Obstacle-Avoiding Robot', desc: 'HC-SR04 ultrasonic sensor scans ahead. When something is closer than 20 cm the robot spins, picks a new direction, and drives on automatically.', tag: 'Ultrasonic + Motors + Servo', diff: 'MEDIUM', diffClass: 'diff-med', variant: 'new-idea' },
  { num: '08', emoji: '🅿️', title: 'Smart Parking Distance Meter', desc: 'Mount an HC-SR04 on a garage wall. An LED bar shows green → yellow → red as your car gets closer to the wall. Never hit the wall again.', tag: 'Ultrasonic + LED Bar', diff: 'MEDIUM', diffClass: 'diff-med', variant: 'new-idea' },
  { num: '09', emoji: '🌈', title: 'RGB Mood Lamp', desc: 'A potentiometer or app controls the colour of an RGB LED strip. Add a sound sensor mode where it reacts to music beats.', tag: 'RGB LED + PWM', diff: 'EASY', diffClass: 'diff-easy', variant: 'new-idea' },
  { num: '10', emoji: '🐾', title: 'Pet Feeder Timer', desc: 'A servo motor rotates a food dispenser on a schedule. Use a push button override for manual feeding — never miss mealtime.', tag: 'Servo + RTC Module', diff: 'MEDIUM', diffClass: 'diff-med', variant: 'new-idea' },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from('.proj-reveal', {
          opacity: 0, y: 40, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGSAP();
  }, []);

  return (
    <section id="projects" ref={sectionRef}>
      <div className="wrap">
        <div className="eyebrow proj-reveal">03 · Ideas</div>
        <h2 className="section-title proj-reveal">Project ideas worth trying next</h2>
        <p className="lede proj-reveal">
          Once you know a handful of sensors, dozens of projects open up. These are hand-picked ideas 
          a 15-year-old can actually build — ordered from beginner to stretch goal. Each one uses 
          sensors you'll learn about today.
        </p>

        <div className="grid cols-2" id="projectGrid">
          {PROJECTS.map(proj => (
            <div key={proj.num} className={`card proj-card ${proj.variant} proj-reveal`}>
              <div className="num">{proj.num}</div>
              <span className={`diff ${proj.diffClass}`}>{proj.diff}</span>
              <h3>{proj.emoji} {proj.title}</h3>
              <p>{proj.desc}</p>
              <span className="tag">{proj.tag}</span>
            </div>
          ))}
        </div>

        <div className="proj-reveal" style={{ marginTop: '80px', background: '#0a1210', border: '1px solid var(--solder-edge)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
          
          <h3 style={{ fontSize: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cream)' }}>
            <span style={{ fontSize: '32px' }}>✨</span> Supercharge with AI
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px', maxWidth: '800px' }}>
            Don't know where to start? Stuck on a weird bug? AI is your ultimate lab partner. You don't need to be an expert coder to build amazing things — just describe what you want, and AI can write the Arduino code, suggest wiring diagrams, troubleshoot errors, and even visualize your finished product.
          </p>

          <h4 style={{ color: 'var(--cream)', marginBottom: '16px', borderBottom: '1px solid var(--solder-edge)', paddingBottom: '8px' }}>The Best Free AI Tools</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
              <strong style={{ color: '#10a37f', fontSize: '16px', display: 'block', marginBottom: '8px' }}>ChatGPT</strong>
              <p style={{ color: 'var(--muted-dim)', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Excellent for breaking down complex concepts, generating structured C++ code, and learning electronics step-by-step.</p>
            </div>
            <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
              <strong style={{ color: '#1a73e8', fontSize: '16px', display: 'block', marginBottom: '8px' }}>Google Gemini</strong>
              <p style={{ color: 'var(--muted-dim)', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Fast and highly contextual. Great at fetching the latest datasheet specs and explaining hardware logic clearly.</p>
            </div>
            <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
              <strong style={{ color: '#d97757', fontSize: '16px', display: 'block', marginBottom: '8px' }}>Claude</strong>
              <p style={{ color: 'var(--muted-dim)', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Outstanding at writing highly accurate, well-commented, and robust Arduino sketches for larger projects.</p>
            </div>
            <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
              <strong style={{ color: '#9333ea', fontSize: '16px', display: 'block', marginBottom: '8px' }}>Microsoft Copilot</strong>
              <p style={{ color: 'var(--muted-dim)', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Includes DALL-E image generation for free. Use it to visualize your robot casing or 3D-printed parts!</p>
            </div>
          </div>

          <h4 style={{ color: 'var(--cream)', marginBottom: '16px', borderBottom: '1px solid var(--solder-edge)', paddingBottom: '8px' }}>Example Prompts (Try copy-pasting these!)</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {/* Column 1: Idea Generation */}
            <div>
              <h5 style={{ color: 'var(--cyan)', fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                💡 Getting Project Ideas
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "I have an Arduino Uno, a servo motor, an LDR, and cardboard. Give me 3 fun, easy project ideas I can build in under an hour."
                  </p>
                </div>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "What are 5 beginner-friendly Arduino projects that solve a real-world problem in my bedroom? I have a standard starter kit."
                  </p>
                </div>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "I want to build something for my pet cat using an ultrasonic sensor and a buzzer. Give me a creative project idea and a build guide."
                  </p>
                </div>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "I built a basic temperature sensor. Give me 3 ideas on how I can upgrade this project to make it more interactive."
                  </p>
                </div>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "Suggest a science fair project involving a PIR motion sensor, LEDs, and a button. Explain the concept like I'm 12 years old."
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Image Generation */}
            <div>
              <h5 style={{ color: '#b366ff', fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
                🎨 Generating Images
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "A futuristic robot casing designed for an Arduino. The ultrasonic sensor looks like glowing blue eyes. Cyberpunk style, photorealistic."
                  </p>
                </div>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "A beautiful wooden enclosure for an Arduino weather station. The DHT11 sensor is subtly integrated into a minimalist design. 3D render."
                  </p>
                </div>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "A remote control car built with Arduino, designed to look like a tiny Mars Rover. Rugged tires, visible wiring, dusty Martian background."
                  </p>
                </div>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "A modern smart plant watering device in a terracotta pot. It features a glowing LED ring and a moisture sensor. Cozy indoor jungle aesthetic."
                  </p>
                </div>
                <div style={{ background: '#050a08', padding: '16px', borderRadius: '12px', border: '1px solid #1a2a24' }}>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                    "An interactive LED mood lamp. The outer shell is frosted glass shaped like a geometric crystal, glowing from within with a magenta gradient."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
