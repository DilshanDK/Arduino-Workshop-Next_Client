'use client';
import { useEffect, useRef } from 'react';

export default function Rail() {
  const fillRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<NodeListOf<Element> | null>(null);

  useEffect(() => {
    const sections = ['about-us', 'hero', 'sensors', 'projects', 'build', 'competition'];
    
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / total) * 100;
      if (fillRef.current) fillRef.current.style.height = `${pct}%`;

      // update mobile progress
      const prog = document.getElementById('mobileProgress');
      if (prog) prog.style.width = `${pct}%`;

      // update nodes
      const nodes = document.querySelectorAll('.rail-node');
      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el || !nodes[i]) return;
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
        if (inView) nodes[i].classList.add('active');
        else nodes[i].classList.remove('active');
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const labels = ['ABOUT', 'SPARK', 'SENSES', 'IDEAS', 'BUILD', 'RACE'];
  const sections = ['about-us', 'hero', 'sensors', 'projects', 'build', 'competition'];

  return (
    <div className="rail">
      <div className="rail-track">
        <div className="rail-fill" ref={fillRef} />
        {labels.map((label, i) => (
          <div
            key={label}
            className="rail-node"
            data-label={label}
            style={{ top: `${(i / (labels.length - 1)) * 100}%` }}
            onClick={() => scrollTo(sections[i])}
          />
        ))}
      </div>
    </div>
  );
}
