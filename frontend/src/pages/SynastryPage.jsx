'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api';

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
      const base = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
      const r = await fetch(`${base}/v1/synastry/cross-aspects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          a: { ...a, tz: Number(a.tz), lat: Number(a.lat), lon: Number(a.lon) },
          b: { ...b, tz: Number(b.tz), lat: Number(b.lat), lon: Number(b.lon) },
        }),
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
    <section id="synastry" ref={sectionRef} className="relative overflow-hidden py-28 bg-[#fbfbfd]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-rose-100/60 to-transparent blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-pink-100/60 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-4">Relationship Analysis</div>
        <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-black">Synastry</h2>
        <p className="mt-4 text-[16px] leading-[1.6] text-black/55 max-w-xl">
          Compare two birth charts and discover cross-aspects, emotional chemistry, and growth areas between partners.
        </p>

        <form onSubmit={submit} className="mt-10 rounded-[28px] border border-black/8 bg-white/85 backdrop-blur-xl p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: 'Person A — Birth date', key: 'date', group: 'a' },
              { label: 'Person A — Birth time', key: 'time', group: 'a' },
              { label: 'Person A — Latitude', key: 'lat', group: 'a' },
              { label: 'Person A — Longitude', key: 'lon', group: 'a' },
              { label: 'Person A — Timezone', key: 'tz', group: 'a' },
              { label: 'Person B — Birth date', key: 'date', group: 'b' },
              { label: 'Person B — Birth time', key: 'time', group: 'b' },
              { label: 'Person B — Latitude', key: 'lat', group: 'b' },
              { label: 'Person B — Longitude', key: 'lon', group: 'b' },
              { label: 'Person B — Timezone', key: 'tz', group: 'b' },
            ].map((f) => (
              <label key={`${f.group}-${f.key}`} className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold tracking-tight text-black/65">{f.label}</span>
                <input
                  type={f.key === 'date' ? 'date' : f.key === 'time' ? 'time' : 'number'}
                  step={f.key === 'date' || f.key === 'time' ? undefined : '0.0001'}
                  value={f.group === 'a' ? a[f.key] : b[f.key]}
                  onChange={(e) => (f.group === 'a' ? setA((s) => ({ ...s, [f.key]: e.target.value })) : setB((s) => ({ ...s, [f.key]: e.target.value })))}
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
              {loading ? 'Calculating...' : 'Compare charts'}
            </button>
          </div>
          {error && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>}
          {result && (
            <div className="mt-6 rounded-2xl border border-black/8 bg-[#fbfbfd] p-6">
              <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-3">Synastry Aspects</div>
              <pre className="text-[13px] leading-[1.6] text-black/70 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
