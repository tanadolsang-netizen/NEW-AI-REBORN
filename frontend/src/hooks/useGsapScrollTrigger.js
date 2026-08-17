import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapScrollTrigger(ref, config = {}) {
  const ctx = useRef(null);

  useEffect(() => {
    const el = typeof ref === 'function' ? ref() : ref?.current;
    if (!el) return;

    ctx.current = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: config.y || 40, opacity: 0, scale: config.scale || 1 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: config.duration || 1.2,
          ease: config.ease || 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, ref);

    return () => ctx.current?.revert();
  }, [ref, config]);
}
