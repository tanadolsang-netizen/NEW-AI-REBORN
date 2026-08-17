'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardPage() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const [stats, setStats] = useState({ charts: 0, branches: 0, daily: '--' });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const base = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
    async function load() {
      try {
        const [natalData, branchesData] = await Promise.allSettled([
          api.natal({ date: '1995-06-15', time: '14:30', lat: 13.7563, lon: 100.5018, tz: 7 }).catch(() => null),
          api.branches.list(),
        ]);
        if (!cancelled) {
          setStats((s) => ({
            ...s,
            charts: natalData.status === 'fulfilled' && natalData.value ? 1 : 0,
            branches: branchesData.status === 'fulfilled' && Array.isArray(branchesData.value) ? branchesData.value.length : 9,
          }));
        }
      } catch (e) {
        if (!cancelled) setStats((s) => ({ ...s, charts: 0, branches: 9 }));
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section id="dashboard" ref={sectionRef} className="relative overflow-hidden py-28 bg-[#fbfbfd]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-100/60 to-transparent blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-violet-100/60 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-4">
          {today}
        </div>
        <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-black">
          Dashboard
        </h2>
        <p className="mt-4 text-[16px] leading-[1.6] text-black/55 max-w-xl">
          Quick overview of your astrological workspace: recent charts, active branches, and daily transit summary.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'My Charts', value: stats.charts },
            { label: 'Branches', value: stats.branches },
            { label: 'Daily Transit', value: stats.daily },
            { label: 'Sync', value: 'OK' },
          ].map((s, i) => (
            <div key={i} className="rounded-[22px] border border-black/8 bg-white/85 backdrop-blur-xl p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-2">{s.label}</div>
              <div className="text-[26px] font-semibold text-black">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-black/8 bg-white/85 backdrop-blur-xl p-7">
          <div className="text-[11px] font-semibold tracking-widest text-black/45 uppercase mb-4">Recent Activity</div>
          {loading && <div className="text-[13px] text-black/50">Loading...</div>}
          <div className="grid gap-3">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-black/6 bg-[#fbfbfd] px-5 py-3">
                <div>
                  <div className="text-[14px] font-semibold text-black">{r.title || 'Untitled chart'}</div>
                  <div className="text-[12px] text-black/50">{r.date}</div>
                </div>
                <span className="text-[12px] font-medium text-black/60 rounded-full border border-black/10 px-3 py-1">{r.type || 'natal'}</span>
              </div>
            ))}
            {!loading && recent.length === 0 && (
              <div className="text-[13px] text-black/50">No recent charts yet. Start by calculating your natal chart.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
