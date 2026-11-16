import React from 'react';
import PageShell from '../components/PageShell';

import { useSettings } from '../context/SettingsContext';
import { telHref } from '../data/defaultSettings';

// Les informations légales se modifient dans l'admin (rubrique « Mentions légales »).
export default function LegalPage() {
  const { legal, contact } = useSettings().settings;
  const LEGAL = { company: 'Croisières des Îles', ...legal };
  return (
    <PageShell title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        {LEGAL.company} – {LEGAL.legalForm}
        <br />
        {contact.address}, {contact.postalCode} {contact.city}, France
        <br />
        Téléphone : <a href={`tel:${telHref(contact.phone)}`}>{contact.phone}</a>
        <br />
        E-mail : <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <br />
        SIRET : {LEGAL.siret}
      </p>

      <h2>Directeur de la publication</h2>
      <p>{LEGAL.director}</p>

      <h2>Hébergement</h2>
      <p>{LEGAL.host}</p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus de ce site (textes, photographies, logos) est la propriété de {LEGAL.company}, sauf
        mention contraire. Toute reproduction sans autorisation préalable est interdite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Les informations (itinéraires, tarifs, horaires) sont données à titre indicatif et peuvent évoluer selon la
        saison et les conditions météorologiques. Seul le devis ou la confirmation de réservation fait foi.
      </p>
    </PageShell>
  );
}
