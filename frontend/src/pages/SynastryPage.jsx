'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api.js';

gsap.registerPlugin(ScrollTrigger);

export default function SynastryPage() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const [a, setA] = useState({ date: '1995-06-15', time: '14:30', lat: '13.7563', lon: '100.5018', tz: '7' });
  const [b, setB] = useState({ date: '1997-08-18', time: '09:15', lat: '13.7563', lon: '100.5018', tz: '7' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.synastry(
        { ...a, tz: Number(a.tz), lat: Number(a.lat), lon: Number(a.lon) },
        { ...b, tz: Number(b.tz), lat: Number(b.lat), lon: Number(b.lon) }
      );
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="synastry" ref={sectionRef} className="relative overflow-hidden py-28 bg-[#0b0b0d]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-rose-900/30 to-transparent blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-pink-900/25 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-4">{t('synastry.subtitle')}</div>
        <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">{t('synastry.title')}</h2>
        <p className="mt-4 text-[16px] leading-[1.6] text-white/55 max-w-xl">
          {t('synastry.body')}
        </p>

        <form onSubmit={submit} className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_1px_0_rgba(255,255,255,0.04)]">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: t('synastry.aDate'), key: 'date', group: 'a' },
              { label: t('synastry.aTime'), key: 'time', group: 'a' },
              { label: t('synastry.aLat'), key: 'lat', group: 'a' },
              { label: t('synastry.aLon'), key: 'lon', group: 'a' },
              { label: t('synastry.aTz'), key: 'tz', group: 'a' },
              { label: t('synastry.bDate'), key: 'date', group: 'b' },
              { label: t('synastry.bTime'), key: 'time', group: 'b' },
              { label: t('synastry.bLat'), key: 'lat', group: 'b' },
              { label: t('synastry.bLon'), key: 'lon', group: 'b' },
              { label: t('synastry.bTz'), key: 'tz', group: 'b' },
            ].map((f) => (
              <label key={`${f.group}-${f.key}`} className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold tracking-tight text-white/65">{f.label}</span>
                <input
                  type={f.key === 'date' ? 'date' : f.key === 'time' ? 'time' : 'number'}
                  step={f.key === 'date' || f.key === 'time' ? undefined : '0.0001'}
                  value={f.group === 'a' ? a[f.key] : b[f.key]}
                  onChange={(e) => (f.group === 'a' ? setA((s) => ({ ...s, [f.key]: e.target.value })) : setB((s) => ({ ...s, [f.key]: e.target.value })))}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10 transition-all"
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 text-white px-6 py-3 text-[14px] font-medium hover:bg-indigo-400 active:scale-[0.97] transition-all disabled:opacity-60"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('synastry.submit')}
            </button>
          </div>
          {error && <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">{error}</div>}
          {result && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">{t('synastry.resultTitle')}</div>
              <pre className="text-[13px] leading-[1.6] text-white/75 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
