import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useSettings } from '../context/SettingsContext';

export default function PrivacyPage() {
  const { contact } = useSettings().settings;
  return (
    <PageShell title="Politique de confidentialité">
      <h2>Données collectées</h2>
      <p>
        Ce site ne comporte ni formulaire, ni compte client, ni outil de mesure d'audience. Aucune donnée
        personnelle n'est collectée lors de votre navigation.
      </p>
      <p>
        Lorsque vous nous contactez par téléphone ou par e-mail, les informations que vous nous transmettez (nom,
        coordonnées, dates souhaitées) sont utilisées uniquement pour répondre à votre demande et organiser votre
        prestation. Elles ne sont jamais revendues ni cédées à des tiers.
      </p>

      <h2>Stockage local</h2>
      <p>
        Pour accélérer l'affichage, le site conserve dans votre navigateur (stockage local) une copie des contenus
        publics (circuits, bateaux). Ces données ne vous identifient pas et peuvent être effacées à tout moment
        depuis les réglages de votre navigateur.
      </p>

      <h2>Services tiers</h2>
      <p>
        La page <Link to="/contact">Contact</Link> intègre une carte Google Maps. Lors de son affichage, Google peut
        déposer des cookies et collecter des données de navigation selon sa propre{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          politique de confidentialité
        </a>
        . Les photos sont hébergées chez Supabase.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
        Pour l'exercer, écrivez-nous à{' '}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>. Vous pouvez également
        adresser une réclamation à la CNIL (cnil.fr).
      </p>
    </PageShell>
  );
}
