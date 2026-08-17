'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api.js';

gsap.registerPlugin(ScrollTrigger);

export default function TransitPage() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const bodyRef = useRef(null);
  const [transits, setTransits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(bodyRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api.transitNow({ lat: 13.8591, lon: 100.5217, tz: 7 });
        if (!cancelled) {
          setTransits(Array.isArray(data) ? data : [data]);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="transit" ref={sectionRef} className="relative overflow-hidden py-28 bg-[#fbfbfd]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-sky-100/60 to-transparent blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-100/60 to-transparent blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6" ref={bodyRef}>
        <div>
          <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-4">{t('transit.subtitle')}</div>
          <h2 className="text-[36px] md:text-[44px] leading-[0.98] tracking-[-0.03em] font-semibold text-black">{t('transit.title')}</h2>
          <p className="mt-3 text-[16px] leading-[1.55] text-black/60">{t('transit.body')}</p>
        </div>
        <div className="mt-8 rounded-[28px] border border-black/8 bg-white p-6">
          {loading && <div className="text-[13px] text-black/50">{t('common.loading')}</div>}
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {transits.map((item) => (
                <div key={item.name || item.id} className="rounded-2xl border border-black/7 bg-[#fbfbfd] px-4 py-3">
                  <div className="text-[12px] text-black/55 font-medium">{item.name || item.id}</div>
                  <div className="mt-1 text-[14px] font-semibold text-black">{item.sign || ''}</div>
                  <div className="text-[12px] text-black/50">{item.degree ?? ''}</div>
                </div>
              ))}
              {transits.length === 0 && <div className="text-[13px] text-black/50">ไม่มีข้อมูล transit</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
