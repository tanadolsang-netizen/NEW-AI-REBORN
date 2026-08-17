'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api.js';

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
      const data = await api.natal({ ...form, tz: Number(form.tz), lat: Number(form.lat), lon: Number(form.lon) });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="natal" ref={sectionRef} className="relative overflow-hidden py-28 bg-[#0b0b0d]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-900/40 to-transparent blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-violet-900/30 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-4">{t('natal.title')}</div>
          <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">{t('natal.title')}</h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-white/55">{t('natal.body')}</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <form onSubmit={submit} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_1px_0_rgba(255,255,255,0.04)]">
            <div className="grid gap-4">
              {[
                { key: 'date', label: t('natal.dateLabel'), type: 'date' },
                { key: 'time', label: t('natal.timeLabel'), type: 'time' },
                { key: 'lat', label: t('natal.latLabel'), type: 'number', step: '0.0001' },
                { key: 'lon', label: t('natal.lonLabel'), type: 'number', step: '0.0001' },
                { key: 'tz', label: t('natal.tzLabel'), type: 'number', step: '1' },
              ].map((f) => (
                <label key={f.key} className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-semibold tracking-tight text-white/65">{f.label}</span>
                  <input
                    type={f.type}
                    value={form[f.key] || ''}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    step={f.step}
                    required
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10 transition-all"
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-indigo-500 text-white px-6 py-3 text-[14px] font-medium hover:bg-indigo-400 active:scale-[0.97] transition-all disabled:opacity-60 shadow-[0_10px_30px_rgba(99,102,241,0.35)]"
                disabled={loading}
              >
                {loading ? t('natal.loading') : t('natal.submit')}
              </button>
              <button
                type="button"
                onClick={setDemo}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[14px] font-medium text-white/80 hover:border-white/25 hover:text-white transition-all"
              >
                {t('natal.demo')}
              </button>
            </div>
          </form>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_1px_0_rgba(255,255,255,0.04)]">
            {error && (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">{error}</div>
            )}
            {result ? (
              <div>
                <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">{t('natal.resultTitle')}</div>
                <pre className="text-[13px] leading-[1.6] text-white/75 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[13px] text-white/45">
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
