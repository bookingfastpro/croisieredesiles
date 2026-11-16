import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';

export default function NotFoundPage() {
  return (
    <PageShell title="Page introuvable">
      <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <div className="mt-8 flex flex-wrap gap-4 [&_a]:no-underline">
        <Link to="/" className="px-6 py-3 bg-marine-blue !text-white rounded-full font-bold hover:bg-marine-navy">
          Retour à l'accueil
        </Link>
        <Link to="/nos-prestations" className="px-6 py-3 border border-marine-blue rounded-full font-bold">
          Voir nos excursions
        </Link>
      </div>
    </PageShell>
  );
}
