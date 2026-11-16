import React, { useState, useEffect } from 'react';
import { Anchor, Menu, X, Instagram, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
  { name: 'Nos Bateaux', href: '/nos-bateaux' },
  { name: 'Prestations', href: '/nos-prestations' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const solid = isScrolled || location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock scroll + close with Escape when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMobileMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <header>
      <nav
        aria-label="Navigation principale"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          solid ? 'py-4 bg-white/95 backdrop-blur-md shadow-lg border-b border-marine-blue/10' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Croisière des Îles – Accueil">
            <Anchor aria-hidden="true" className={`${solid ? 'text-marine-blue' : 'text-marine-cyan'} w-8 h-8 group-hover:rotate-12 transition-transform`} />
            <span className={`text-lg sm:text-xl font-display font-bold tracking-wider ${solid ? 'text-marine-navy' : 'text-white'} uppercase`}>
              Croisière des <span className={solid ? 'text-marine-blue' : 'text-marine-cyan'}>Îles</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  end
                  className={({ isActive }) =>
                    `group text-sm font-medium relative py-1 transition-colors hover:text-marine-cyan ${
                      solid ? 'text-marine-navy' : 'text-white'
                    } ${isActive ? 'font-semibold' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      <span
                        aria-hidden="true"
                        className={`absolute -bottom-1 left-0 h-0.5 bg-marine-cyan transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                      ></span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className="inline-block px-6 py-2 bg-marine-blue hover:bg-marine-navy text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-marine-blue/20 hover:scale-105"
              >
                Réserver
              </Link>
            </li>
          </ul>

          {/* Mobile Toggle */}
          <button
            type="button"
            className={`md:hidden relative z-[70] p-2 -mr-2 ${isMobileMenuOpen ? 'text-white' : solid ? 'text-marine-navy' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="menu-mobile"
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMobileMenuOpen ? <X size={30} aria-hidden="true" /> : <Menu size={30} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-marine-ink z-[60] md:hidden flex flex-col"
          >
            <div className="flex items-center p-6 border-b border-white/10 h-[81px]">
              <span className="flex items-center gap-2" aria-hidden="true">
                <Anchor className="text-marine-cyan w-8 h-8" />
                <span className="text-lg font-display font-bold tracking-wider text-white uppercase">
                  Croisière des <span className="text-marine-cyan">Îles</span>
                </span>
              </span>
            </div>

            <nav aria-label="Menu mobile" className="flex-1 flex flex-col justify-center items-center p-6">
              <ul className="flex flex-col items-center gap-7">
                {navLinks.map((link, idx) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <NavLink
                      to={link.href}
                      end
                      className={({ isActive }) =>
                        `text-3xl font-display font-bold transition-colors hover:text-marine-cyan ${isActive ? 'text-marine-cyan' : 'text-white'}`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="w-full max-w-xs text-center py-4 bg-marine-blue text-white rounded-2xl font-bold mt-10 text-xl shadow-lg shadow-marine-blue/20"
              >
                Réserver maintenant
              </Link>
            </nav>

            <div className="p-8 border-t border-white/10 flex justify-center items-center gap-6">
              <a
                href="tel:+33611818486"
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm"
              >
                <Phone size={18} aria-hidden="true" /> 06 11 81 84 86
              </a>
              <a
                href="https://www.instagram.com/croisieresdesiles_2a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm"
                aria-label="Instagram (nouvelle fenêtre)"
              >
                <Instagram size={18} aria-hidden="true" /> Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
