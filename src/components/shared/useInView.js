import { useRef, useState, useEffect } from 'react';

/**
 * useInView — Intersection Observer Hook für Staggered Animations
 * @param {number} threshold - Sichtbarkeits-Schwellwert (default 0.1)
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 */
export function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/**
 * stagger — Tailwind-Klassen für Staggered Reveal
 * @param {boolean} visible
 * @param {number} idx
 * @returns {string} Tailwind-Klassen
 */
export function stagger(visible, idx) {
  return visible
    ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
    : 'translate-y-8 opacity-0 transition-all duration-700 ease-out';
}

/**
 * staggerDelay — Verzögerung pro Element
 * @param {number} idx
 * @returns {object} style mit transitionDelay
 */
export function staggerDelay(idx) {
  return { transitionDelay: `${idx * 100}ms` };
}
