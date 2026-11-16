import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageMeta, NOT_FOUND_META, DEFAULT_OG_IMAGE, normalizePath } from '../seo';
import { useSettings } from '../context/SettingsContext';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Keeps <title>, description, canonical and Open Graph tags in sync on client-side navigation. */
export default function usePageMeta() {
  const { pathname } = useLocation();
  const { seo } = useSettings().settings;

  useEffect(() => {
    const meta = getPageMeta(pathname, seo) ?? NOT_FOUND_META;
    const path = normalizePath(pathname);
    // Keep the origin chosen by the server (SITE_URL) when present.
    const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const origin = existing ? new URL(existing.href).origin : window.location.origin;
    const url = `${origin}${path}`;

    document.title = meta.title;
    setMeta('name', 'description', meta.description);
    setMeta('name', 'robots', meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', meta.image || DEFAULT_OG_IMAGE);
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (meta.noindex) {
      canonical?.remove();
    } else {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    }
  }, [pathname, seo]);
}
