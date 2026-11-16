import React from 'react';
import PageShell from '../components/PageShell';

// TODO (propriétaire du site) : compléter les informations légales ci-dessous.
const LEGAL = {
  company: 'Croisière des Îles',
  legalForm: 'à compléter (ex. : EI, SARL…)',
  siret: 'à compléter',
  director: 'à compléter',
  host: 'à compléter (nom, adresse et téléphone de l\'hébergeur)',
};

export default function LegalPage() {
  return (
    <PageShell title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        {LEGAL.company} – {LEGAL.legalForm}
        <br />
        Quai d'honneur, Port de Bonifacio, 20169 Bonifacio, France
        <br />
        Téléphone : <a href="tel:+33611818486">06 11 81 84 86</a>
        <br />
        E-mail : <a href="mailto:croisieresdesiles20169@gmail.com">croisieresdesiles20169@gmail.com</a>
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
