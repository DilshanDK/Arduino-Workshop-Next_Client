'use client';
import Image from 'next/image';

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="wrap">
        {/* Logo + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <Image src="/innovior.png" alt="Innovior" width={52} height={52} style={{ objectFit: 'contain', opacity: 0.8 }} />
          <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '20px', color: 'var(--cream)' }}>
            Innovi<span style={{ color: 'var(--cyan)' }}>or</span>
          </div>
          <div className="mono" style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-dim)' }}>
            Institute of Technology Studies · Kundasale, Kandy
          </div>
        </div>

        {/* Quick nav */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '36px' }}>
          {[
            { label: 'About',    id: 'about-us'    },
            { label: 'Workshop', id: 'hero'         },
            { label: 'Sensors',  id: 'sensors'      },
            { label: 'Projects', id: 'projects'     },
            { label: 'Build',    id: 'build'        },
            { label: 'Race',     id: 'competition'  },
          ].map(item => (
            <button key={item.id} className="nav-link" onClick={() => scrollTo(item.id)}
              style={{ fontSize: '12px', padding: '6px 14px' }}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Contact chips */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
          {[
            { icon: '📧', text: 'info@innovior.lk', href: 'mailto:info@innovior.lk' },
            { icon: '📞', text: '+94 778 778 828', href: 'tel:+94778778828' },
            { icon: '🌐', text: 'innovior.lk', href: 'https://innovior.lk' },
            { icon: '🎓', text: 'iits.education', href: 'https://iits.education' },
            { icon: '📍', text: '67/7/8 Nattaranpotha, Kundasale', href: null },
          ].map(c => (
            <div key={c.text} className="contact-chip">
              <span>{c.icon}</span>
              {c.href
                ? <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>{c.text}</a>
                : <span style={{ color: 'var(--muted)' }}>{c.text}</span>
              }
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: '60px', height: '1px', background: 'var(--solder-edge)', margin: '0 auto 28px' }} />

        <p className="mono" style={{ margin: '0', color: 'var(--muted-dim)', fontSize: '12px', letterSpacing: '0.06em' }}>
          © {new Date().getFullYear()} Innovior (Pvt) Ltd · All rights reserved
        </p>
        <p className="mono" style={{ margin: '10px 0 0', color: 'var(--muted-dim)', fontSize: '11px' }}>
          Built with ❤️ for the next generation of Sri Lankan makers
        </p>
      </div>
    </footer>
  );
}
