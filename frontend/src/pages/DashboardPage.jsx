'use client';

import { useMemo } from 'react';
import { useLang } from '../i18n.jsx';
import { Link } from 'react-router-dom';

const BRIEFING_ITEMS = [
  { labelKey: 'briefing.focus', icon: '🎯' },
  { labelKey: 'briefing.energy', icon: '⚡' },
  { labelKey: 'briefing.rest', icon: '🌿' },
];

export default function DashboardPage() {
  const { t, lang } = useLang();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return lang === 'th' ? 'สวัสดีตอนเช้า' : 'Good morning';
    if (h < 17) return lang === 'th' ? 'สวัสดีตอนบ่าย' : 'Good afternoon';
    return lang === 'th' ? 'สวัสดีตอนเย็น' : 'Good evening';
  }, [lang]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">
            {greeting}
          </h2>
          <p className="mt-3 text-[16px] leading-[1.6] text-white/55 max-w-xl">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="hidden md:flex gap-3">
          <Link
            to="/journal"
            className="rounded-full bg-indigo-500 text-white px-5 py-2.5 text-[13px] font-medium hover:bg-indigo-400 active:scale-[0.97] transition-all shadow-[0_10px_30px_rgba(99,102,241,0.35)]"
          >
            {t('journal.title')}
          </Link>
          <Link
            to="/energy"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-[13px] font-medium text-white/80 hover:border-white/25 hover:text-white transition-all"
          >
            {t('energy.title')}
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">{t('dashboard.briefing')}</div>
          <div className="space-y-3">
            {BRIEFING_ITEMS.map((item) => (
              <div key={item.labelKey} className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
                <div className="text-[18px] leading-none mt-0.5">{item.icon}</div>
                <div>
                  <div className="text-[13px] font-semibold text-white/85">{t(item.labelKey)}</div>
                  <div className="mt-1 text-[12px] leading-[1.6] text-white/55">
                    {lang === 'th' ? 'ข้อมูลที่เกี่ยวข้องวันนี้อยู่ที่นี่' : 'Context for today appears here'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">{t('energy.title')}</div>
          <div className="text-[13px] leading-[1.7] text-white/65">
            {t('energy.subtitle')}
          </div>
          <div className="mt-3 flex gap-2">
            <Link to="/energy" className="rounded-full bg-indigo-500 text-white px-4 py-2 text-[13px] font-medium hover:bg-indigo-400 transition-all">
              {lang === 'th' ? 'ดูพลังงานวันนี้' : 'View today'}
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">{t('timing.title')}</div>
          <div className="text-[13px] leading-[1.7] text-white/65">
            {t('timing.subtitle')}
          </div>
          <div className="mt-3 flex gap-2">
            <Link to="/timing" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-white/80 hover:border-white/25 hover:text-white transition-all">
              {lang === 'th' ? 'ดูจังหวะชีวิต' : 'View timing'}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/journal" className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl hover:border-white/20 transition-all">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-2">{t('journal.title')}</div>
          <div className="text-[13px] leading-[1.7] text-white/65">{t('journal.subtitle')}</div>
        </Link>
        <Link to="/natal" className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl hover:border-white/20 transition-all">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-2">{t('nav.natal')}</div>
          <div className="text-[13px] leading-[1.7] text-white/65">{lang === 'th' ? 'เปิดดูชาร์ตประจำวัน' : 'Open today\'s chart'}</div>
        </Link>
      </div>
    </div>
  );
}
