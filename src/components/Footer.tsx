import React from 'react';
import { Anchor, Instagram, Mail, Phone, MapPin, Star, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { telHref } from '../data/defaultSettings';

const links = [
  { name: 'Accueil', href: '/' },
  { name: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
  { name: 'Nos Bateaux', href: '/nos-bateaux' },
  { name: 'Prestations & tarifs', href: '/nos-prestations' },
  { name: 'Contact', href: '/contact' },
];

export default function Footer() {
  const { contact } = useSettings().settings;
  return (
    <footer className="pt-16 md:pt-24 pb-28 md:pb-12 px-5 sm:px-6 relative overflow-hidden bg-marine-pearl border-t border-marine-blue/10">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <p className="flex items-center gap-2 mb-6">
              <Anchor aria-hidden="true" className="text-marine-blue w-8 h-8" />
              <span className="text-xl font-display font-bold tracking-wider text-marine-navy uppercase">
                Croisières des <span className="text-marine-blue">Îles</span>
              </span>
            </p>
            <p className="text-marine-navy/75 text-sm leading-relaxed font-light mb-8">
              Excursions et croisières en bateau privé avec skipper au départ de Bonifacio : îles Lavezzi,
              Roccapina, archipel de La Maddalena et Sardaigne.
            </p>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez-nous sur Instagram (nouvelle fenêtre)"
              className="w-11 h-11 bg-marine-navy/5 hover:bg-marine-blue/10 border border-marine-navy/10 rounded-full inline-flex items-center justify-center transition-all text-marine-navy/75 hover:text-marine-blue group"
            >
              <Instagram size={18} aria-hidden="true" className="group-hover:scale-110 transition-transform" />
            </a>
            <a
              href={contact.googleProfile}
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
            <ul className="space-y-1">
              {links.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="inline-block py-2 text-sm text-marine-navy/80 hover:text-marine-blue hover:underline underline-offset-4 transition-colors">
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
              <ul className="space-y-1">
                <li className="flex items-center gap-3 text-sm text-marine-navy/80">
                  <Phone size={16} aria-hidden="true" className="text-marine-blue shrink-0" />
                  <a href={`tel:${telHref(contact.phone)}`} className="inline-block py-2 hover:text-marine-blue transition-colors">{contact.phone}</a>
                </li>
                <li className="flex items-center gap-3 text-sm text-marine-navy/80">
                  <Mail size={16} aria-hidden="true" className="text-marine-blue shrink-0" />
                  <a href={`mailto:${contact.email}`} className="inline-block py-2 hover:text-marine-blue transition-colors break-all">
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-marine-navy/80">
                  <MapPin size={16} aria-hidden="true" className="text-marine-blue shrink-0" /> {contact.address}, {contact.postalCode} {contact.city}
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="pt-10 border-t border-marine-navy/10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-xs uppercase tracking-[0.12em] text-marine-navy/70 text-center">
          <p>© {new Date().getFullYear()} Croisières des Îles. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 [&_a]:py-2">
            <Link to="/mentions-legales" className="hover:text-marine-blue transition-colors">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-marine-blue transition-colors">Confidentialité</Link>
            <Link to="/admin" className="inline-flex items-center gap-1.5 hover:text-marine-blue transition-colors">
              <Lock size={12} aria-hidden="true" /> Espace admin
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div aria-hidden="true" className="hidden md:block pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-marine-blue/5 blur-[120px] rounded-full"></div>
    </footer>
  );
}
