import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/work' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Photography', to: '/photography' },
  { label: 'Production', to: '/production' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isHome = location.pathname === '/';
  const solid = scrolled || !isHome || open;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          solid ? 'bg-ecs-white/90 backdrop-blur-md border-b border-ecs-black/8' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group" aria-label="Eternal Creative Studio home">
              <span className={`font-display text-2xl leading-none transition-colors duration-300 ${solid ? 'text-ecs-black' : 'text-ecs-white'}`}>
                E
              </span>
              <span className={`hidden sm:block text-[11px] uppercase tracking-[0.28em] font-medium leading-tight transition-colors duration-300 ${solid ? 'text-ecs-black/70' : 'text-ecs-white/80'}`}>
                Eternal
                <br />
                Creative Studio
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-9">
              {navLinks.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-[12px] uppercase tracking-[0.22em] font-medium link-underline transition-colors duration-300 ${
                      solid ? 'text-ecs-black/80 hover:text-ecs-black' : 'text-ecs-white/85 hover:text-ecs-white'
                    } ${active ? 'text-ecs-gold' : ''}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <Link
                to="/contact"
                className={`hidden lg:inline-flex text-[12px] uppercase tracking-[0.22em] font-medium px-5 py-2.5 border transition-all duration-300 ${
                  solid
                    ? 'border-ecs-black text-ecs-black hover:bg-ecs-black hover:text-ecs-white'
                    : 'border-ecs-white/70 text-ecs-white hover:bg-ecs-white hover:text-ecs-black'
                }`}
              >
                Start a Project
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className={`lg:hidden p-1 transition-colors ${solid ? 'text-ecs-black' : 'text-ecs-white'}`}
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-ecs-black text-ecs-white transition-all duration-500 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full pt-28 px-6 pb-10">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-display text-4xl font-light py-3 border-b border-ecs-white/10 transition-all duration-500"
                style={{ transitionDelay: open ? `${i * 60 + 100}ms` : '0ms', opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(12px)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/contact"
            className="mt-auto inline-flex items-center justify-center text-sm uppercase tracking-[0.22em] font-medium px-6 py-4 border border-ecs-gold text-ecs-gold"
          >
            Start a Project
          </Link>
          <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-ecs-white/40">
            Film • Media • Design • Digital
          </p>
        </div>
      </div>
    </>
  );
}