'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    if (open) {
      gsap.fromTo(linksRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.45, ease: 'power3.out' });
    } else {
      gsap.to(linksRef.current, { y: 8, opacity: 0, duration: 0.22 });
    }
  }, [open]);

  const scrollTo = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/70 backdrop-blur-2xl border-b border-black/5 shadow-[0_1px_0_rgba(0,0,0,0.04)]' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <button onClick={() => scrollTo('#hero')} className="font-semibold tracking-tight text-[15px] text-black/80 hover:text-black transition-colors">
          ASTRAL
        </button>
        <div className="hidden md:flex items-center gap-8 text-[13px] text-black/70">
          {[
            { label: 'บทสรุปดวง', href: '#natal' },
            { label: 'Transit', href: '#transit' },
            { label: 'สาขาโหราศาสตร์', href: '#branches' },
            { label: 'จุดเด่น', href: '#features' },
          ].map((item) => (
            <button key={item.href} onClick={() => scrollTo(item.href)} className="hover:text-black transition-colors">
              {item.label}
            </button>
          ))}
        </div>
        <button className="md:hidden text-black/70" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div ref={menuRef} className="md:hidden bg-white/80 backdrop-blur-2xl border-b border-black/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3">
            {[
              { label: 'บทสรุปดวง', href: '#natal' },
              { label: 'Transit', href: '#transit' },
              { label: 'สาขาโหราศาสตร์', href: '#branches' },
              { label: 'จุดเด่น', href: '#features' },
            ].map((item, idx) => (
              <button
                key={item.href}
                ref={(el) => (linksRef.current[idx] = el)}
                onClick={() => scrollTo(item.href)}
                className="text-left text-[14px] text-black/75 hover:text-black transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
