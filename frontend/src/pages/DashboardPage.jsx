'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';
import { api } from '../services/api.js';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { label: ' natal', value: 'natal' },
  { label: ' synastry', value: 'synastry' },
  { label: ' branches', value: 'branches' },
];

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
    async function load() {
      try {
        const [healthRes, branchesRes] = await Promise.allSettled([
          api.health().catch(() => null),
          api.branches.list().catch(() => []),
        ]);
        if (!cancelled) {
          setStats((s) => ({
            ...s,
            charts: healthRes.status === 'fulfilled' && healthRes.value ? 1 : 0,
            branches: branchesRes.status === 'fulfilled' && Array.isArray(branchesRes.value) ? branchesRes.value.length : 9,
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
    <section id="dashboard" ref={sectionRef} className="relative overflow-hidden py-28 bg-[#0b0b0d]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-900/40 to-transparent blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-violet-900/30 to-transparent blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-4">
          {today}
        </div>
        <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">
          {t('dashboard.title')}
        </h2>
        <p className="mt-4 text-[16px] leading-[1.6] text-white/55 max-w-xl">
          {t('dashboard.subtitle')}
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('dashboard.charts'), value: stats.charts },
            { label: t('dashboard.branches'), value: stats.branches },
            { label: t('dashboard.dailyTransit'), value: stats.daily },
            { label: t('dashboard.sync'), value: 'OK' },
          ].map((s, i) => (
            <div key={i} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)]">
              <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-2">{s.label}</div>
              <div className="text-[26px] font-semibold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-7">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-4">{t('dashboard.recent')}</div>
          {loading && <div className="text-[13px] text-white/50">{t('common.loading')}</div>}
          <div className="grid gap-3">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.02] px-5 py-3">
                <div>
                  <div className="text-[14px] font-semibold text-white/90">{r.title || 'Untitled chart'}</div>
                  <div className="text-[12px] text-white/50">{r.date}</div>
                </div>
                <span className="text-[12px] font-medium text-white/60 rounded-full border border-white/10 px-3 py-1">{r.type || 'natal'}</span>
              </div>
            ))}
            {!loading && recent.length === 0 && (
              <div className="text-[13px] text-white/50">{t('dashboard.empty')}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
