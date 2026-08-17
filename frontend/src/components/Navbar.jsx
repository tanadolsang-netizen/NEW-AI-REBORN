'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(menuRef.current, { opacity: 0, y: 12, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
      gsap.fromTo('.nav-item', { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'power3.out', delay: 0.05 });
    }, menuRef);
    return () => ctx.revert();
  }, [open]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/75 backdrop-blur-2xl border-b border-black/[0.06] shadow-[0_1px_0_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-6xl px-6 h-[64px] flex items-center justify-between">
        <a href="#" className="text-[17px] font-semibold tracking-tight text-black">{t('brand')}</a>

        <nav className="hidden md:flex items-center gap-8">
          {['home', 'dashboard', 'journal', 'energy', 'timing', 'natal', 'synastry', 'branches'].map((k) => {
            const href = k === 'home' ? '#hero' : `/${k}`;
            return (
              <a key={k} href={href} className="text-[13px] text-black/60 hover:text-black transition-colors">
                {t(`nav.${k}`)}
              </a>
            );
          })}
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')} className="rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-medium text-black/70 hover:border-black/25 hover:text-black transition-all">
            {lang === 'th' ? 'TH' : 'EN'}
          </button>
          <button onClick={() => {}} className="rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-medium text-black/70 hover:border-black/25 hover:text-black transition-all">{t('nav.signin')}</button>
        </nav>

        <div className="md:hidden flex items-center gap-3">
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')} className="rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-medium text-black/70">
            {lang === 'th' ? 'TH' : 'EN'}
          </button>
          <button onClick={() => {}} className="rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-medium text-black/70">{t('nav.signin')}</button>
          <button onClick={() => setOpen((v) => !v)} className="h-9 w-9 flex items-center justify-center rounded-full border border-black/10">
            <span className="space-y-[5px]">
              <span className={`block h-[1.5px] w-[14px] bg-black transition-all ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
              <span className={`block h-[1.5px] w-[14px] bg-black transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-[14px] bg-black transition-all ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden">
          <div ref={menuRef} className="mx-6 mt-2 rounded-[28px] border border-black/[0.08] bg-white/90 backdrop-blur-2xl p-6">
            {['home', 'natal', 'branches'].map((k) => (
              <a
                key={k}
                href={`#${k === 'home' ? 'hero' : k}`}
                className="nav-item block py-3 text-[15px] font-medium text-black/80 border-b border-black/5 last:border-none"
                onClick={() => setOpen(false)}
              >
                {t(`nav.${k}`)}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
