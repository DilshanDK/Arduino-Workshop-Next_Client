'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredAtTop, setHoveredAtTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [isMouseIdle, setIsMouseIdle] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();

  // Mouse idle timer (3 seconds)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetIdleTimer = () => {
      setIsMouseIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMouseIdle(true);
      }, 3000);
    };

    // Initialize timer
    resetIdleTimer();

    // Reset timer on movement or interaction
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, []);

  // Toggle cursor visibility based on idle state
  useEffect(() => {
    if (isMouseIdle && !mobileOpen) {
      document.documentElement.classList.add('mouse-idle');
    } else {
      document.documentElement.classList.remove('mouse-idle');
    }
    return () => {
      document.documentElement.classList.remove('mouse-idle');
    };
  }, [isMouseIdle, mobileOpen]);

  // Scroll handler: hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      if (currentScrollY < 40) {
        setVisible(true);
      } else {
        if (Math.abs(currentScrollY - lastScrollY) > 6) {
          if (currentScrollY > lastScrollY) {
            setVisible(false); // scroll down
          } else {
            setVisible(true); // scroll up
          }
          setLastScrollY(currentScrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Hover at top trigger: if mouse is within 16px of top edge, show navbar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > 40) {
        if (e.clientY <= 16) {
          setHoveredAtTop(true);
        } else if (e.clientY > 85 && hoveredAtTop) {
          setHoveredAtTop(false);
        }
      } else {
        setHoveredAtTop(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredAtTop]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  const handleToggle = () => {
    setRipple(true);
    toggle();
    setTimeout(() => setRipple(false), 500);
  };

  const isLight = theme === 'light';
  const showNavbar = mobileOpen || ((visible || hoveredAtTop) && !isMouseIdle);

  return (
    <>
      <nav
        className="navbar"
        style={{
          background: scrolled
            ? isLight ? 'rgba(240,244,241,0.97)' : 'rgba(7,20,15,0.97)'
            : isLight ? 'rgba(240,244,241,0.82)' : 'rgba(7,20,15,0.75)',
          boxShadow: scrolled ? '0 4px 30px var(--shadow-color)' : 'none',
          transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Logo */}
        <div 
          className="navbar-logo" 
          onClick={() => {
            if (pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              router.push('/');
            }
            setMobileOpen(false);
          }} 
          style={{ cursor: 'pointer' }}
        >
          <Image
            src="/innovior.png"
            alt="Innovior Logo"
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
          />
          <div className="navbar-brand">
            Innovi<span>or</span>
            <small style={{
              display: 'block', fontSize: '10px', color: 'var(--muted-dim)',
              fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.12em',
              textTransform: 'uppercase', fontWeight: 400,
            }}>
              Arduino Workshop
            </small>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="navbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[
            { label: 'About Us',  id: 'about-us'   },
            { label: 'Sensors',   id: 'sensors'    },
            { label: 'Projects',  id: 'projects'   },
            { label: 'Build',     id: 'build'      },
            { label: 'Race',      id: 'competition'},
          ].map(item => (
            <button 
              key={item.id} 
              className="nav-link" 
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}

          {/* ── Theme Toggle ── */}
          <button
            className="theme-toggle"
            onClick={handleToggle}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
            title={isLight ? 'Switch to Dark mode' : 'Switch to Light mode'}
          >
            {/* sliding thumb */}
            <span className="theme-toggle-thumb" />

            {/* icons track */}
            <span className="theme-toggle-track">
              {/* Moon */}
              <svg className="icon-moon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
              {/* Sun */}
              <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1"  x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1"  y1="12" x2="3"  y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
                <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
              </svg>
            </span>

            {/* ripple flash */}
            {ripple && <span className="theme-ripple" />}
          </button>

          <button className="nav-cta" onClick={() => scrollTo('about-us')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Join Workshop
          </button>
        </div>

        {/* Mobile controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mobile theme toggle */}
          <button
            className="theme-toggle mobile-theme-btn"
            onClick={handleToggle}
            aria-label="Toggle theme"
          >
            <span className="theme-toggle-thumb" />
            <span className="theme-toggle-track">
              <svg className="icon-moon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
              <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
              </svg>
            </span>
            {ripple && <span className="theme-ripple" />}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-ham"
            aria-label="Menu"
            style={{ background: 'transparent', border: 'none', color: 'var(--cream)', cursor: 'pointer', padding: '8px', display: 'none' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
                : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {[
          { label: 'About Us',       id: 'about-us'    },
          { label: 'Workshop Intro', id: 'hero'         },
          { label: 'Sensors',        id: 'sensors'      },
          { label: 'Projects',       id: 'projects'     },
          { label: 'Build',          id: 'build'        },
          { label: 'Race Day',       id: 'competition'  },
        ].map(item => (
          <button key={item.id} className="nav-link" onClick={() => scrollTo(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .navbar-nav   { display: none !important; }
          .mobile-ham   { display: block !important; }
          .mobile-theme-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-theme-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
