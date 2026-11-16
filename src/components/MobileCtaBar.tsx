import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, CalendarCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { telHref } from '../data/defaultSettings';

/** Sticky "Appeler / Réserver" bar shown on phones only. */
export default function MobileCtaBar() {
  const { contact } = useSettings().settings;
  const { pathname } = useLocation();
  if (pathname === '/admin') return null;
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 border-t border-marine-blue/10 shadow-[0_-4px_20px_rgba(2,12,27,0.08)] px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex gap-2">
      <a
        href={`tel:${telHref(contact.phone)}`}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-marine-blue/30 text-marine-blue font-bold text-sm"
      >
        <Phone size={18} aria-hidden="true" /> Appeler
      </a>
      <Link
        to="/contact"
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-marine-blue text-white font-bold text-sm"
      >
        <CalendarCheck size={18} aria-hidden="true" /> Réserver
      </Link>
    </div>
  );
}
