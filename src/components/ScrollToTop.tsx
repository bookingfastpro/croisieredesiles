import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to top on page change and moves focus to the main content (for screen-reader users). */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById('contenu')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
