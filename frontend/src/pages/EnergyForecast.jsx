'use client';

import { useMemo } from 'react';
import { useLang } from '../i18n.jsx';

const PLANETARY_ENERGIES = [
  {
    id: 'sun',
    labelKey: 'energy.sun',
    icon: '☀️',
    themes: ['Focus', 'Vitality', 'Leadership'],
    goodFor: ['Business decisions', 'Presentations', 'Starting projects'],
    avoid: ['Negotiation', 'Long meetings'],
  },
  {
    id: 'moon',
    labelKey: 'energy.moon',
    icon: '🌙',
    themes: ['Emotion', 'Intuition', 'Rest'],
    goodFor: ['Journaling', 'Creative work', 'Family time'],
    avoid: ['High-risk decisions', 'Confrontation'],
  },
  {
    id: 'mercury',
    labelKey: 'energy.mercury',
    icon: '☿',
    themes: ['Communication', 'Learning', 'Writing'],
    goodFor: ['Emails', 'Negotiation', 'Study'],
    avoid: ['Signing major contracts', 'Long trips'],
  },
  {
    id: 'venus',
    labelKey: 'energy.venus',
    icon: '♀',
    themes: ['Harmony', 'Pleasure', 'Relationships'],
    goodFor: ['Social events', 'Design', 'Sales'],
    avoid: ['Discipline', 'Tough conversations'],
  },
  {
    id: 'mars',
    labelKey: 'energy.mars',
    icon: '♂',
    themes: ['Action', 'Drive', 'Courage'],
    goodFor: ['Exercise', 'Difficult tasks', 'Competition'],
    avoid: ['Impulsive decisions', 'Arguments'],
  },
  {
    id: 'jupiter',
    labelKey: 'energy.jupiter',
    icon: '♃',
    themes: ['Growth', 'Luck', 'Optimism'],
    goodFor: ['Expansion', 'Learning', 'Travel'],
    avoid: ['Overpromising', 'Risky bets'],
  },
  {
    id: 'saturn',
    labelKey: 'energy.saturn',
    icon: '♄',
    themes: ['Discipline', 'Structure', 'Responsibility'],
    goodFor: ['Planning', 'Admin', 'Long-term projects'],
    avoid: ['Risk', 'Unnecessary spending'],
  },
];

export default function EnergyForecast() {
  const { t, lang } = useLang();

  const now = useMemo(() => new Date(), []);

  const hourSeed = now.getHours();
  const active = useMemo(() => {
    const indices = [
      (hourSeed + 0) % PLANETARY_ENERGIES.length,
      (hourSeed + 1) % PLANETARY_ENERGIES.length,
      (hourSeed + 2) % PLANETARY_ENERGIES.length,
    ];
    return indices.map((i) => PLANETARY_ENERGIES[i]);
  }, [hourSeed]);

  const primary = active[0];
  const secondary = active[1];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary energy */}
        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'พลังงานหลักวันนี้' : 'Primary Energy'}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{primary.icon}</div>
            <div>
              <div className="text-[15px] font-semibold text-black/85">
                {t(primary.labelKey)}
              </div>
              <div className="text-[11px] font-mono text-black/55">
                {now.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {primary.themes.map((theme) => (
              <span key={theme} className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[11px] font-medium text-black/70">
                {theme}
              </span>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-[12px] text-black/65">
            <div>
              <div className="font-semibold text-black/75">
                {lang === 'th' ? 'เหมาะกับ' : 'Good for'}
              </div>
              <ul className="mt-1 list-disc pl-4">
                {primary.goodFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-black/75">
                {lang === 'th' ? 'หลีกเลี่ยง' : 'Avoid'}
              </div>
              <ul className="mt-1 list-disc pl-4">
                {primary.avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Secondary energy */}
        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'พลังงานรอง' : 'Secondary Energy'}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{secondary.icon}</div>
            <div>
              <div className="text-[15px] font-semibold text-black/85">
                {t(secondary.labelKey)}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {secondary.themes.map((theme) => (
              <span key={theme} className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[11px] font-medium text-black/70">
                {theme}
              </span>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-[12px] text-black/65">
            <ul className="list-disc pl-4">
              {secondary.goodFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hourly rhythm */}
        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'จังหวะชั่วโมง' : 'Hourly Rhythm'}
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, idx) => {
              const hour = (now.getHours() - 2 + idx) % 24;
              const planet = PLANETARY_ENERGIES[hour % PLANETARY_ENERGIES.length];
              const isNow = idx === 2;
              return (
                <div
                  key={hour}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 ${isNow ? 'bg-black/[0.04]' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-sm">{planet.icon}</div>
                    <div className="text-[12px] font-medium text-black/75">
                      {String(hour).padStart(2, '0')}:00
                    </div>
                  </div>
                  <div className="text-[11px] text-black/55">{t(planet.labelKey)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
