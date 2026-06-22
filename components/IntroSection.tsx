'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from('.intro-reveal', {
          opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        });

        // Counter animations
        const counters = document.querySelectorAll('.counter-num');
        counters.forEach(el => {
          const target = parseInt(el.getAttribute('data-target') || '0');
          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            onEnter: () => {
              gsap.to({ val: 0 }, {
                val: target, duration: 2, ease: 'power2.out',
                onUpdate: function () {
                  el.textContent = Math.round((this as any).targets()[0].val) + '+';
                }
              });
            },
            once: true
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    };
    loadGSAP();
  }, []);

  return (
    <section id="about-us" ref={sectionRef} style={{ padding: '140px 0 80px', background: 'linear-gradient(180deg, rgba(7,20,15,0) 0%, rgba(15,43,33,0.3) 100%)' }}>
      <div className="wrap">
        <div className="eyebrow intro-reveal">00 · Who We Are</div>

        {/* Main Presentation Card */}
        <div className="intro-pres intro-reveal">
          <div className="intro-pres-grid">
            <div>
              <div className="company-logo-wrap">
                <Image src="/innovior.png" alt="Innovior" width={56} height={56} style={{ objectFit: 'contain' }} />
                <div className="company-name">
                  Innovior
                  <small>Institute of Technology Studies</small>
                </div>
              </div>

              <h2 className="section-title" style={{ margin: '0 0 20px' }}>
                We Build the <em>Digital Future</em><br />with Young Hands.
              </h2>

              <p>
                Innovior is Sri Lanka's premier technology company — engineering scalable software 
                systems for enterprises while empowering the next generation of innovators through 
                hands-on STEM education.
              </p>

              <p>
                Our <strong style={{ color: 'var(--cyan)' }}>Innovior Kids Tech Academy (IITS)</strong> offers 
                robotics, IoT, and coding programs for children aged 5–17 in Kundasale, Kandy. 
                Today's Arduino workshop is a direct extension of that mission — we want every 
                15-year-old to understand that technology is something you <em style={{ color: 'var(--copper-bright)' }}>build</em>, not just consume.
              </p>

              <div className="program-badges">
                <span className="program-badge spark-j">Spark Juniors · Ages 4–8</span>
                <span className="program-badge spark-b">Spark Bots · Ages 9–13</span>
                <span className="program-badge spark-m">Spark Masters · Ages 14–17</span>
                <span className="program-badge iot">IoT Certificate</span>
              </div>

              <div className="contact-chips">
                <div className="contact-chip">
                  <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  info@innovior.lk
                </div>
                <div className="contact-chip">
                  <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +94 778 778 828
                </div>
                <div className="contact-chip">
                  <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  67/7/8 Nattaranpotha, Kundasale, Kandy
                </div>
              </div>
            </div>

            <div>


              <div style={{ marginTop: '28px', background: 'var(--bg)', border: '1px solid var(--solder-edge)', borderRadius: '16px', padding: '28px' }}>
                <div className="eyebrow" style={{ margin: '0 0 16px' }}>Today's Workshop</div>
                <h4 style={{ color: 'var(--cream)', margin: '0 0 12px', fontSize: '17px' }}>Why Are We Here?</h4>
                <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.7', margin: '0 0 16px' }}>
                  We believe every student should have their "aha!" moment — that spark when code 
                  becomes motion, when a sensor reading changes a LED, when <em>you</em> built the 
                  thing that moved.
                </p>
                
                <div className="timeline">
                  {[
                    { time: '0:00–0:25', label: 'Spark — Intro to Arduino & Electronics' },
                    { time: '0:25–0:55', label: 'Senses — How sensors work + Ideas brainstorm' },
                    { time: '1:00–2:30', label: 'Build — Wire & code the IR remote car' },
                    { time: '2:45–3:00', label: 'Race Day — Compete & celebrate' },
                  ].map(item => (
                    <div className="timeline-item" key={item.time}>
                      <div className="timeline-dot" />
                      <h4>{item.time}</h4>
                      <p>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What is Innovior strip */}
        <div
          className="intro-reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: '20px',
          }}
        >
          {[
            {
              icon: '🏢',
              title: 'Innovior (Pvt) Ltd',
              desc: 'Enterprise software company building scalable digital solutions — Analytics, E-Commerce, Cloud, AI Automation.',
              link: 'https://innovior.lk',
            },
            {
              icon: '🎓',
              title: 'IITS Kids Tech Academy',
              desc: 'Sri Lanka\'s premier STEM academy. Robotics, IoT, and coding for kids 5–17 in Kundasale, Kandy.',
              link: 'https://iits.education',
            },
            {
              icon: '⚡',
              title: 'Today\'s Goal',
              desc: 'By 3:00 PM, every team will have wired, coded, and raced a real Arduino-powered remote control car.',
              link: null,
            },
          ].map(item => (
            <div key={item.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="tag" style={{ marginTop: '14px', display: 'inline-block', textDecoration: 'none' }}>
                  Visit Website →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
