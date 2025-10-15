import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export default function useLenis({ duration = 1.1 } = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      duration: reduce ? 0 : duration,
      smoothWheel: !reduce,
      smoothTouch: !reduce,
      gestureOrientation: 'vertical',
    });
    lenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [duration]);

  return lenisRef;
}
