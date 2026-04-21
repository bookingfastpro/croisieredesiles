import React, { useState, useEffect } from 'react';
import { Anchor, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
    { name: 'Nos Bateaux', href: '/nos-bateaux' },
    { name: 'Prestations', href: '/nos-prestations' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || location.pathname !== '/' ? 'py-4 bg-white/95 backdrop-blur-md shadow-lg border-b border-marine-blue/10' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <Anchor className={`${isScrolled || location.pathname !== '/' ? 'text-marine-blue' : 'text-marine-cyan'} w-8 h-8 group-hover:rotate-12 transition-transform`} />
            <span className={`text-xl font-display font-bold tracking-wider ${isScrolled || location.pathname !== '/' ? 'text-marine-navy' : 'text-white'} uppercase`}>
              CROISIERE DES <span className={isScrolled || location.pathname !== '/' ? 'text-marine-blue' : 'text-marine-cyan'}>ILES</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative group"
              >
                <Link
                  to={link.href}
                  className={`text-sm font-medium flex items-center gap-1 ${isScrolled || location.pathname !== '/' ? 'text-marine-navy' : 'text-white/90'} hover:text-marine-cyan transition-colors relative`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-marine-cyan transition-all group-hover:w-full`}></span>
                </Link>
              </div>
            ))}
            <Link to="/contact">
              <button className="px-6 py-2 bg-marine-blue hover:bg-marine-navy text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-marine-blue/20 hover:scale-105">
                Réserver
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`md:hidden relative z-[70] ${isMobileMenuOpen ? 'text-white' : (isScrolled || location.pathname !== '/' ? 'text-marine-navy' : 'text-white')}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-marine-ink z-[60] md:hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <Anchor className="text-marine-cyan w-8 h-8" />
                <span className="text-xl font-display font-bold tracking-wider text-white uppercase">
                  CROISIERE DES <span className="text-marine-cyan">ILES</span>
                </span>
              </Link>
              {/* The X is handled by the toggle button in the nav for better positioning consistency */}
              <div className="w-8"></div> 
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center p-6 gap-8">
              {navLinks.map((link, idx) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-display font-bold text-white/90 hover:text-marine-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <Link to="/contact" className="w-full max-w-xs" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="w-full py-4 bg-marine-blue text-white rounded-2xl font-bold mt-8 text-xl shadow-lg shadow-marine-blue/20"
                >
                  Réserver maintenant
                </motion.button>
              </Link>
            </div>

            <div className="p-8 border-t border-white/10 flex justify-center gap-8">
              <div className="text-white/40 text-xs uppercase tracking-widest">Suivez-nous</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
