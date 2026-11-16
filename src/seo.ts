// Shared SEO metadata, used both by the Express server (injected into the HTML
// so crawlers and social networks see the right tags without running JS) and by
// the React app (updated on client-side navigation).

import type { SiteSettings } from "./types.ts";
import { telHref } from "./data/defaultSettings.ts";

export const SITE_NAME = "Croisières des Îles";

/** Fiche Google Business Profile liée au site (identifiant CID de la fiche) */
export const GOOGLE_PROFILE_URL = "https://www.google.com/maps?cid=12881030414233217563";

export const DEFAULT_OG_IMAGE =
  "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/WhatsApp%20Image%202026-04-30%20at%2013.05.08.jpeg";

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  /** Include in sitemap.xml */
  sitemap?: { priority: string; changefreq: string };
  noindex?: boolean;
}

export const PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Bateau privé avec skipper à Bonifacio | Croisières des Îles",
    description:
      "Excursions et croisières en bateau privé avec skipper au départ de Bonifacio : îles Lavezzi, falaises, Roccapina, archipel de la Maddalena. Carburant et skipper inclus.",
    sitemap: { priority: "1.0", changefreq: "weekly" },
  },
  "/qui-sommes-nous": {
    title: "Christian, votre capitaine à Bonifacio | Croisières des Îles",
    description:
      "Rencontrez Christian, capitaine diplômé de la Marine Marchande et natif de la région, qui vous fait découvrir la Corse du Sud en bateau privé depuis Bonifacio.",
    image:
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/0c435c87-50ff-437d-b612-19832209e1d6%20(1).jpg",
    sitemap: { priority: "0.7", changefreq: "monthly" },
  },
  "/nos-bateaux": {
    title: "Prestige 42 Flybridge avec skipper | Croisières des Îles",
    description:
      "Découvrez le Prestige 42 Flybridge : yacht de 12 m pour 10 personnes, paddle, seabob, plateforme gonflable. Location avec skipper au départ de Bonifacio.",
    image:
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/PHOTO-2026-04-26-21-58-57.jpg",
    sitemap: { priority: "0.9", changefreq: "monthly" },
  },
  "/nos-prestations": {
    title: "Tarifs excursion bateau Bonifacio | Croisières des Îles",
    description:
      "Tarifs et prestations : journée privatisée aux Lavezzi ou à Roccapina dès 1800 €, Sardaigne & Maddalena, coucher de soleil, croisières sur mesure en Corse.",
    image:
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%208.jpg",
    sitemap: { priority: "0.9", changefreq: "weekly" },
  },
  "/contact": {
    title: "Réservation au port de Bonifacio | Croisières des Îles",
    description:
      "Réservez votre excursion ou croisière privée au départ du port de Bonifacio. Téléphone : 06 11 81 84 86. Réponse rapide, devis personnalisé.",
    sitemap: { priority: "0.8", changefreq: "monthly" },
  },
  "/mentions-legales": {
    title: "Mentions légales | Croisières des Îles",
    description: "Mentions légales du site Croisières des Îles, excursions en mer à Bonifacio.",
  },
  "/confidentialite": {
    title: "Politique de confidentialité | Croisières des Îles",
    description: "Politique de confidentialité et gestion des données personnelles du site Croisières des Îles.",
  },
};

export const NOT_FOUND_META: PageMeta = {
  title: "Page introuvable | Croisières des Îles",
  description: "Cette page n'existe pas ou a été déplacée.",
  noindex: true,
};

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

/** Page metadata, with the titles/descriptions customised in the admin panel taking precedence. */
export function getPageMeta(pathname: string, overrides?: SiteSettings["seo"]): PageMeta | null {
  const path = normalizePath(pathname);
  const base = PAGES[path];
  if (!base) return null;
  const custom = overrides?.[path];
  return {
    ...base,
    title: custom?.title?.trim() || base.title,
    description: custom?.description?.trim() || base.description,
  };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildBusinessJsonLd(origin: string, settings?: SiteSettings) {
  const c = settings?.contact;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${origin}/#business`,
    name: SITE_NAME,
    alternateName: ["Croisières des Îles Bonifacio", "Croisieres des Iles"],
    description:
      "Excursions en mer et croisières privées avec skipper au départ de Bonifacio vers les îles Lavezzi, la Sardaigne, l'archipel de La Maddalena et les côtes corses.",
    url: `${origin}/`,
    image: DEFAULT_OG_IMAGE,
    logo: `${origin}/favicon.svg`,
    telephone: c ? telHref(c.phone) : "+33611818486",
    email: c?.email || "croisieresdesiles20169@gmail.com",
    priceRange: "€€€",
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: c?.address || "Quai d'honneur, Port de Bonifacio",
      addressLocality: c?.city || "Bonifacio",
      postalCode: c?.postalCode || "20169",
      addressRegion: "Corse",
      addressCountry: "FR",
    },
    // Point d'embarquement : Quai d'honneur, port de Bonifacio
    geo: { "@type": "GeoCoordinates", latitude: 41.3872, longitude: 9.1558 },
    areaServed: ["Bonifacio", "Corse-du-Sud", "Îles Lavezzi", "Archipel de La Maddalena", "Sardaigne"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "20:00",
    },
    hasMap: c?.googleProfile || GOOGLE_PROFILE_URL,
    sameAs: [c?.instagram, c?.googleProfile || GOOGLE_PROFILE_URL].filter(Boolean),
  };
}

/** HTML for the <head> SEO block, injected server-side. */
export function buildHeadHtml(meta: PageMeta, origin: string, pathname: string, settings?: SiteSettings): string {
  const url = `${origin}${normalizePath(pathname) === "/" ? "/" : normalizePath(pathname)}`;
  const image = meta.image || DEFAULT_OG_IMAGE;
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);
  const jsonLd = JSON.stringify(buildBusinessJsonLd(origin, settings)).replace(/</g, "\\u003c");
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    meta.noindex ? "" : `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");
}
