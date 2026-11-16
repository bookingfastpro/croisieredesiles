import React from 'react';
import { Anchor, Instagram, Mail, Phone, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GOOGLE_PROFILE_URL } from '../seo';

const links = [
  { name: 'Accueil', href: '/' },
  { name: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
  { name: 'Nos Bateaux', href: '/nos-bateaux' },
  { name: 'Prestations & tarifs', href: '/nos-prestations' },
  { name: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="pt-20 md:pt-24 pb-12 px-6 relative overflow-hidden bg-marine-pearl border-t border-marine-blue/10">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <p className="flex items-center gap-2 mb-6">
              <Anchor aria-hidden="true" className="text-marine-blue w-8 h-8" />
              <span className="text-xl font-display font-bold tracking-wider text-marine-navy uppercase">
                Croisière des <span className="text-marine-blue">Îles</span>
              </span>
            </p>
            <p className="text-marine-navy/75 text-sm leading-relaxed font-light mb-8">
              Excursions et croisières en bateau privé avec skipper au départ de Bonifacio : îles Lavezzi,
              Roccapina, archipel de La Maddalena et Sardaigne.
            </p>
            <a
              href="https://www.instagram.com/croisieresdesiles_2a/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez-nous sur Instagram (nouvelle fenêtre)"
              className="w-11 h-11 bg-marine-navy/5 hover:bg-marine-blue/10 border border-marine-navy/10 rounded-full inline-flex items-center justify-center transition-all text-marine-navy/75 hover:text-marine-blue group"
            >
              <Instagram size={18} aria-hidden="true" className="group-hover:scale-110 transition-transform" />
            </a>
            <a
              href={GOOGLE_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex items-center gap-2 h-11 px-4 bg-marine-navy/5 hover:bg-marine-blue/10 border border-marine-navy/10 rounded-full text-sm font-semibold text-marine-navy/80 hover:text-marine-blue transition-all align-top"
            >
              <Star size={16} aria-hidden="true" /> Nos avis Google
            </a>
          </div>

          {/* Links */}
          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="font-bold mb-6 uppercase tracking-widest text-xs text-marine-blue">Navigation</h2>
            <ul className="space-y-3">
              {links.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-marine-navy/80 hover:text-marine-blue hover:underline underline-offset-4 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="font-bold mb-6 uppercase tracking-widest text-xs text-marine-blue">Contact</h2>
            <address className="not-italic">
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-marine-navy/80">
                  <Phone size={16} aria-hidden="true" className="text-marine-blue shrink-0" />
                  <a href="tel:+33611818486" className="hover:text-marine-blue transition-colors">06 11 81 84 86</a>
                </li>
                <li className="flex items-center gap-3 text-sm text-marine-navy/80">
                  <Mail size={16} aria-hidden="true" className="text-marine-blue shrink-0" />
                  <a href="mailto:croisieresdesiles20169@gmail.com" className="hover:text-marine-blue transition-colors break-all">
                    croisieresdesiles20169@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-marine-navy/80">
                  <MapPin size={16} aria-hidden="true" className="text-marine-blue shrink-0" /> Quai d'honneur, Port de Bonifacio, 20169 Bonifacio
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="pt-10 border-t border-marine-navy/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-[0.15em] text-marine-navy/70">
          <p>© {new Date().getFullYear()} Croisière des Îles. Tous droits réservés.</p>
          <div className="flex gap-6 sm:gap-8">
            <Link to="/mentions-legales" className="hover:text-marine-blue transition-colors">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-marine-blue transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div aria-hidden="true" className="absolute -top-24 -right-24 w-96 h-96 bg-marine-blue/5 blur-[120px] rounded-full"></div>
    </footer>
  );
}
