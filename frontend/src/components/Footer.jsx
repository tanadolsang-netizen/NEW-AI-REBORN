'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const { t } = useLang();
  const ref = useRef(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 92%' } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={ref} className="border-t border-white/10 bg-[#0b0b0d]">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[12px] text-white/45">{t('common.rights').replace('{year}', year)}</div>
        <div className="text-[12px] text-white/45">{t('common.built')}</div>
      </div>
    </footer>
  );
}
