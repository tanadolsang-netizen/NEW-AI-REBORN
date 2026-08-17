'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function NatalPage() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ date: '', time: '12:00', lat: '13.7563', lon: '100.5018', tz: '7' });
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

  const setDemo = () => setForm({ date: '1995-06-15', time: '14:30', lat: '13.7563', lon: '100.5018', tz: '7' });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
      const r = await fetch(`${base}/v1/natal/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tz: Number(form.tz), lat: Number(form.lat), lon: Number(form.lon) }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="natal" ref={sectionRef} className="relative overflow-hidden py-28 bg-[#fbfbfd]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-amber-100/60 to-transparent blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-sky-100/60 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-4">{t('natal.title')}</div>
          <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-black">{t('natal.title')}</h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-black/55">{t('natal.body')}</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <form onSubmit={submit} className="rounded-[28px] border border-black/8 bg-white/85 backdrop-blur-xl p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <div className="grid gap-4">
              {[
                { key: 'date', label: t('natal.dateLabel'), type: 'date' },
                { key: 'time', label: t('natal.timeLabel'), type: 'time' },
                { key: 'lat', label: t('natal.latLabel'), type: 'number', step: '0.0001' },
                { key: 'lon', label: t('natal.lonLabel'), type: 'number', step: '0.0001' },
                { key: 'tz', label: t('natal.tzLabel'), type: 'number', step: '1' },
              ].map((f) => (
                <label key={f.key} className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-semibold tracking-tight text-black/65">{f.label}</span>
                  <input
                    type={f.type}
                    value={form[f.key] || ''}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    step={f.step}
                    required
                    className="rounded-2xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-[14px] text-black placeholder:text-black/35 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-3 text-[14px] font-medium hover:bg-black/85 active:scale-[0.97] transition-all disabled:opacity-60"
                disabled={loading}
              >
                {loading ? t('natal.loading') : t('natal.submit')}
              </button>
              <button
                type="button"
                onClick={setDemo}
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-[14px] font-medium text-black/75 hover:border-black/25 hover:text-black transition-all"
              >
                {t('natal.demo')}
              </button>
            </div>
          </form>

          <div className="rounded-[28px] border border-black/8 bg-white/85 backdrop-blur-xl p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
            )}
            {result ? (
              <div>
                <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-3">{t('natal.resultTitle')}</div>
                <pre className="text-[13px] leading-[1.6] text-black/70 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[13px] text-black/40">
                <div className="mb-3 text-[28px]">{t('natal.emptyTitle')}</div>
                {t('natal.emptyBody')}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
