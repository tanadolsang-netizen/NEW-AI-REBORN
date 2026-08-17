'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 92%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={ref} className="border-t border-black/8 bg-[#fbfbfd]">
      <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-[15px] font-semibold tracking-tight text-black/80">ASTRAL</div>
          <p className="mt-2 text-[13px] text-black/50 leading-relaxed">
            เครื่องมือโหราศาสตร์อัจฉริยะ คำนวณ ephemeris เอง offline
          </p>
        </div>
        <div className="text-[13px] text-black/45">
          © {new Date().getFullYear()} ASTRAL — built for accuracy.
        </div>
      </div>
    </footer>
  );
}
