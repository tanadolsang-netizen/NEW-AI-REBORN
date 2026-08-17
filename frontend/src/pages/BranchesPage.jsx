'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api.js';

gsap.registerPlugin(ScrollTrigger);

export default function BranchesPage() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api.branches.list();
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setItems([]);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = items.filter((b) => {
    const title = (b.title || '').toLowerCase();
    const tag = (b.tag || '').toLowerCase();
    const qv = q.toLowerCase();
    return title.includes(qv) || tag.includes(qv);
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } });
      gsap.fromTo(itemsRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, [q, filtered.length]);

  return (
    <section id="branches" ref={sectionRef} className="relative overflow-hidden py-28 bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-100/50 to-transparent blur-3xl" />
        <div className="absolute -right-40 bottom-16 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-100/50 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div ref={headerRef} className="max-w-2xl">
          <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-4">{t('branches.subtitle')}</div>
          <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-black">{t('branches.title')}</h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-black/55">{t('branches.subtitle')}</p>
        </div>

        <div className="mt-8">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('branches.search')}
              className="w-full rounded-2xl border border-black/10 bg-[#fbfbfd] px-5 py-3.5 pl-12 text-[14px] text-black placeholder:text-black/35 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35">⌕</span>
          </div>
          <div className="mt-3 text-[12px] font-medium text-black/45">{filtered.length} {t('branches.count')}</div>
        </div>

        {loading && <div className="mt-10 text-[13px] text-black/50">{t('common.loading')}</div>}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <div
              key={(item.title || item.id || item.slug) + i}
              ref={(el) => (itemsRef.current[i] = el)}
              className="group relative overflow-hidden rounded-[28px] border border-black/8 bg-[#fbfbfd] p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)] transition-all duration-500"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-to-br from-emerald-100/70 to-transparent blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="text-[12px] font-semibold tracking-widest text-black/45 uppercase mb-3">{item.tag || 'branch'}</div>
                <div className="text-[15px] font-semibold text-black/90 leading-snug">{item.title || item.id || item.slug}</div>
                <p className="mt-2 text-[14px] leading-[1.55] text-black/55">{item.body || ''}</p>
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="text-[28px] mb-3">{t('branches.emptyIcon')}</div>
            <div className="text-[15px] font-semibold text-black/70">{t('branches.emptyTitle')}</div>
            <p className="mt-1 text-[13px] text-black/45">{t('branches.emptyBody')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
