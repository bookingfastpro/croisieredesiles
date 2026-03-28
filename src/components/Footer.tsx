import React from 'react';
import { Anchor, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="pt-24 pb-12 px-6 relative overflow-hidden bg-white border-t border-marine-ocean/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Anchor className="text-marine-ocean w-8 h-8" />
              <span className="text-xl font-bold tracking-wider text-marine-deep uppercase">
                CROISIERE DES <span className="text-marine-ocean">ILES</span>
              </span>
            </div>
            <p className="text-marine-deep/70 text-sm leading-relaxed font-light mb-8">
              Votre partenaire d'évasion maritime. Des circuits pensés pour l'émerveillement et le respect de l'environnement.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-marine-deep/5 hover:bg-marine-ocean/10 border border-marine-deep/10 rounded-full flex items-center justify-center transition-all text-marine-deep/60 hover:text-marine-ocean group">
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-marine-ocean">Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
                { name: 'Nos Bateaux', href: '/nos-bateaux' },
                { name: 'Prestations', href: '/nos-prestations' },
                { name: 'Contact', href: '/#contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-marine-deep/80 hover:text-marine-turquoise transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-marine-ocean">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-marine-deep/80">
                <Phone size={16} className="text-marine-ocean" /> +33 6 00 00 00 00
              </li>
              <li className="flex items-center gap-3 text-sm text-marine-deep/80">
                <Mail size={16} className="text-marine-ocean" /> contact@croisieredesiles-bonifacio.fr
              </li>
              <li className="flex items-center gap-3 text-sm text-marine-deep/80">
                <MapPin size={16} className="text-marine-ocean" /> Port de Bonifacio, 20169 Bonifacio
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-marine-ocean">Newsletter</h4>
            <p className="text-xs text-marine-deep/60 mb-4 font-light">Recevez nos offres exclusives et actualités marines.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="flex-1 bg-marine-deep/5 border border-marine-deep/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-marine-ocean transition-colors text-marine-deep placeholder:text-marine-deep/40"
              />
              <button className="p-2 bg-marine-ocean hover:bg-marine-deep text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-marine-ocean/20">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-marine-deep/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-marine-deep/50">
          <p>© 2026 CROISIERE DES ILES. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-marine-ocean transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-marine-ocean transition-colors">Politique de Confidentialité</a>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-marine-ocean/5 blur-[150px] rounded-full"></div>
    </footer>
  );
}
