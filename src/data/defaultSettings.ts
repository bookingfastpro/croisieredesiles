import type { SiteSettings } from '../types';

// Valeurs par défaut : utilisées si settings.json est absent ou incomplet.
export const DEFAULT_SETTINGS: SiteSettings = {
  contact: {
    phone: '06 11 81 84 86',
    email: 'croisieresdesiles20169@gmail.com',
    address: "Quai d'honneur, Port de Bonifacio",
    postalCode: '20169',
    city: 'Bonifacio',
    hours: 'Tous les jours : 09:00 – 20:00',
    seasonNote: "Saison d'été (Avril – Octobre)",
    instagram: 'https://www.instagram.com/croisieresdesiles_2a/',
    googleProfile: 'https://www.google.com/maps?cid=12881030414233217563',
  },
  about: {
    photo:
      'https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/0c435c87-50ff-437d-b612-19832209e1d6%20(1).jpg',
    title: 'À la rencontre de',
    highlight: 'Christian',
    personalTitle: 'Vie Personnelle & Passions',
    personalText:
      "Natif de la région et passionné par l'univers maritime depuis son plus jeune âge, Christian a fait de la mer son terrain de jeu et son bureau. Amateur de photographie sous-marine et fervent défenseur de l'écosystème corse, il partage son temps entre la navigation et ses centres d'intérêt pour la nature sauvage et les traditions locales.",
    careerTitle: 'Cursus Professionnel & Diplômes',
    careerText:
      "Fort d'un cursus solide au sein de la Marine Marchande, Christian est titulaire de tous les diplômes de commandement requis pour la navigation professionnelle. Son parcours l'a mené à naviguer sur divers types de navires avant de se consacrer entièrement à la plaisance de luxe et au partage de sa passion avec une clientèle exigeante.",
    quote:
      "Naviguer n'est pas seulement un métier, c'est un art de vivre que je m'efforce de transmettre à chaque sortie.",
    signature: 'Christian',
    signatureRole: 'Capitaine & Fondateur',
    stats: [
      { value: '100%', label: 'Sécurité', desc: 'Équipements certifiés' },
      { value: 'Capitaine', label: 'Expertise', desc: 'Diplômé Marine Marchande' },
      { value: '20+ ans', label: 'Expérience', desc: 'Navigation locale' },
      { value: 'Excellence', label: 'Qualité', desc: 'Service sur mesure' },
    ],
  },
  rates: [
    { label: 'Avril / Juin', price: '1800€' },
    { label: 'Juillet', price: '2200€' },
    { label: 'Août', price: '2500€' },
    { label: 'Septembre', price: '2000€' },
  ],
  ratesNote: '* Carburant et skipper inclus.',
  services: [
    {
      title: 'Location à la journée',
      icon: 'calendar',
      description:
        "Privatisation complète du bateau pour une journée d'exception. Le tarif inclut le carburant et les services d'un skipper professionnel.",
      details: ['Départ 10h - Retour 18h', 'Carburant inclus', 'Skipper inclus', 'Itinéraire sur mesure'],
    },
    {
      title: 'Croisières (Dès 1 nuit)',
      icon: 'ship',
      description:
        "Vivez l'expérience unique d'une nuit en mer ou d'un séjour prolongé. Nos croisières sont entièrement personnalisables selon vos envies.",
      details: ["À partir d'une nuit", 'Skipper inclus', 'Itinéraire flexible', 'Confort haut de gamme'],
    },
    {
      title: 'Séjours sur Mesure',
      icon: 'sparkles',
      description:
        'Vous avez un projet spécifique ? Nous créons pour vous un itinéraire et un service totalement adaptés à vos besoins.',
      details: ['Durée à la carte', 'Destinations au choix', 'Service VIP', '100% Personnalisable'],
    },
    {
      title: 'Coucher de Soleil',
      icon: 'sun',
      description:
        "Découvrez les falaises de Bonifacio sous les couleurs de l'or. Une navigation exclusive pour une fin de journée magique.",
      details: ['Départ 18h30', 'Apéritif à bord', 'Skipper inclus', 'Ambiance intimiste'],
    },
  ],
  faq: [
    {
      q: "Quel est le prix d'une journée en bateau privé à Bonifacio ?",
      a: 'La location à la journée avec skipper commence à 1800 € en avril, mai, juin, puis 2200 € en juillet, 2500 € en août et 2000 € en septembre. Le carburant et le skipper sont inclus et le bateau est entièrement privatisé.',
    },
    {
      q: 'Combien de personnes peuvent embarquer ?',
      a: "Le Prestige 42 Flybridge accueille jusqu'à 10 personnes pour une sortie à la journée. Pour les croisières avec nuits à bord, la capacité est de 4 personnes plus le skipper.",
    },
    {
      q: "Quels sont les horaires d'une sortie à la journée ?",
      a: 'Le départ se fait en général à 10h depuis le port de Bonifacio, pour un retour vers 18h. La sortie coucher de soleil part à 18h30.',
    },
    {
      q: "Faut-il des papiers d'identité pour aller en Sardaigne ?",
      a: "Oui : pour l'excursion vers l'archipel de La Maddalena et la Sardaigne, chaque passager doit avoir une carte d'identité ou un passeport en cours de validité.",
    },
    {
      q: "L'itinéraire peut-il être personnalisé ?",
      a: 'Oui. Les circuits proposés sont des suggestions : le capitaine adapte les escales, les mouillages et la durée selon vos envies et la météo du jour.',
    },
  ],
  legal: {
    legalForm: 'à compléter (ex. : EI, SARL…)',
    siret: 'à compléter',
    director: 'à compléter',
    host: "à compléter (nom, adresse et téléphone de l'hébergeur)",
  },
  seo: {},
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** Fusionne des réglages partiels avec les valeurs par défaut (les clés manquantes sont complétées). */
export function mergeSettings(partial: unknown): SiteSettings {
  const merge = (base: any, over: any): any => {
    if (!isObject(base) || !isObject(over)) return over === undefined ? base : over;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(over)) out[key] = merge(base[key], over[key]);
    return out;
  };
  return merge(DEFAULT_SETTINGS, isObject(partial) ? partial : {});
}

/** "06 11 81 84 86" → "+33611818486" */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('0')) return `+33${digits.slice(1)}`;
  return digits;
}
