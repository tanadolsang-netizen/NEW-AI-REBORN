'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLang } from '../i18n.jsx';

const STORAGE_KEY = 'astral-energy';

const PLANETARY_ENERGIES = [
  {
    id: 'sun',
    labelKey: 'energy.sun',
    icon: '☀️',
    themes: ['Focus', 'Vitality', 'Leadership'],
    goodFor: ['Business decisions', 'Presentations', 'Starting projects'],
    avoid: ['Negotiation', 'Long meetings'],
    tip: { th: 'เปิดวาระสำคัญตรงนี้ โอกาสเข้มสูงกว่าช่วงอื่น', en: 'Schedule high-stakes work here; odds are better than other slots' },
  },
  {
    id: 'moon',
    labelKey: 'energy.moon',
    icon: '🌙',
    themes: ['Emotion', 'Intuition', 'Rest'],
    goodFor: ['Journaling', 'Creative work', 'Family time'],
    avoid: ['High-risk decisions', 'Confrontation'],
    tip: { th: 'ให้เวลากับความรู้สึก จดบันทึก หรือเลือกงานที่ใช้ความคิดสร้างสรรค์', en: 'Honor your mood. Journal, create, or choose soft, reflective work' },
  },
  {
    id: 'mercury',
    labelKey: 'energy.mercury',
    icon: '☿',
    themes: ['Communication', 'Learning', 'Writing'],
    goodFor: ['Emails', 'Negotiation', 'Study'],
    avoid: ['Signing major contracts', 'Long trips'],
    tip: { th: 'ส่งอีเมล、เจรจา、อ่าน、เขียนในช่วงนี้ ช่วยให้ได้รับผลดี', en: 'Write, reply, negotiate, or learn now while clarity is higher' },
  },
  {
    id: 'venus',
    labelKey: 'energy.venus',
    icon: '♀',
    themes: ['Harmony', 'Pleasure', 'Relationships'],
    goodFor: ['Social events', 'Design', 'Sales'],
    avoid: ['Discipline', 'Tough conversations'],
    tip: { th: 'พบปะผู้คน、รังวัดความสัมพันธ์ หรือแก้ไขปัญหาเชิงบรรยากาศ', en: 'Meet people, smooth relationships, or choose aesthetics over force' },
  },
  {
    id: 'mars',
    labelKey: 'energy.mars',
    icon: '♂',
    themes: ['Action', 'Drive', 'Courage'],
    goodFor: ['Exercise', 'Difficult tasks', 'Competition'],
    avoid: ['Impulsive decisions', 'Arguments'],
    tip: { th: 'ใช้พลังนี้สำหรับงานยาก、ออกกำลังกาย、หรือตัดสินใจที่ต้องกล้า', en: 'Use this for hard tasks, movement, or decisive moves — but pause before conflict' },
  },
  {
    id: 'jupiter',
    labelKey: 'energy.jupiter',
    icon: '♃',
    themes: ['Growth', 'Luck', 'Optimism'],
    goodFor: ['Expansion', 'Learning', 'Travel'],
    avoid: ['Overpromising', 'Risky bets'],
    tip: { th: 'เรียนรู้、เปิดประสบการณ์ใหม่、เริ่ม Projekc ขนาดใหญ่', en: 'Learn, expand, or start a meaningful project while momentum favors growth' },
  },
  {
    id: 'saturn',
    labelKey: 'energy.saturn',
    icon: '♄',
    themes: ['Discipline', 'Structure', 'Responsibility'],
    goodFor: ['Planning', 'Admin', 'Long-term projects'],
    avoid: ['Risk', 'Unnecessary spending'],
    tip: { th: 'จัดระเบียบ、วางแผนระยะยาว、จัดการธุรกรรมที่ค้างไว้', en: 'Organize, plan long-term, and settle obligations now' },
  },
];

function loadLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export default function EnergyForecast() {
  const { t, lang } = useLang();

  const [logs, setLogs] = useState(() => loadLogs());
  const [selected, setSelected] = useState([]);
  const [followUp, setFollowUp] = useState('');

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

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

  const hours = useMemo(() => {
    return Array.from({ length: 6 }).map((_, idx) => {
      const hour = (now.getHours() - 2 + idx + 24) % 24;
      const planet = PLANETARY_ENERGIES[hour % PLANETARY_ENERGIES.length];
      const isNow = idx === 2;
      return { hour, planet, isNow };
    });
  }, [now]);

  const weeklyEnergy = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = logs.filter((l) => new Date(l.date) >= weekAgo);
    if (!recent.length) return null;
    const counts = {};
    recent.forEach((l) => {
      if (l.planet) counts[l.planet] = (counts[l.planet] || 0) + 1;
    });
    return counts;
  }, [logs]);

  const topEnergy = useMemo(() => {
    if (!weeklyEnergy) return null;
    const sorted = Object.entries(weeklyEnergy).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? sorted[0][0] : null;
  }, [weeklyEnergy]);

  const togglePlanet = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const logEnergy = () => {
    if (!primary) return;
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      hour: now.getHours(),
      planet: primary.id,
      followUp,
    };
    setLogs((prev) => [entry, ...prev]);
    setFollowUp('');
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">
          {t('energy.title')}
        </h2>
        <p className="mt-3 text-[16px] leading-[1.6] text-white/55 max-w-xl">{t('energy.subtitle')}</p>
      </div>

      {weeklyEnergy && (
        <div className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">
            {lang === 'th' ? 'แนวโน้มพลังงาน 7 วัน' : 'Weekly energy pattern'}
          </div>
          <div className="flex flex-wrap gap-2">
            {PLANETARY_ENERGIES.map((p) => (
              <span
                key={p.id}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                  topEnergy === p.id ? 'border-white/25 bg-white/15 text-white' : 'border-white/10 bg-white/[0.04] text-white/60'
                }`}
              >
                {p.icon} {t(p.labelKey)} {weeklyEnergy[p.id] ? `x${weeklyEnergy[p.id]}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'พลังงานหลักวันนี้' : 'Primary Energy'}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{primary.icon}</div>
            <div>
              <div className="text-[15px] font-semibold text-black/85">{t(primary.labelKey)}</div>
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
              <div className="font-semibold text-black/75">{lang === 'th' ? 'เหมาะกับ' : 'Good for'}</div>
              <ul className="mt-1 list-disc pl-4">
                {primary.goodFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-black/75">{lang === 'th' ? 'หลีกเลี่ยง' : 'Avoid'}</div>
              <ul className="mt-1 list-disc pl-4">
                {primary.avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-black/5 p-2 text-[12px] text-black/70">
              <span className="font-semibold">{lang === 'th' ? 'ข้อเสนอปฏิบัติ' : 'Actionable tip'}：</span>
              {primary.tip[lang]}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'พลังงานรอง' : 'Secondary Energy'}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{secondary.icon}</div>
            <div>
              <div className="text-[15px] font-semibold text-black/85">{t(secondary.labelKey)}</div>
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
            <div className="rounded-xl bg-black/5 p-2 text-[12px] text-black/70">
              <span className="font-semibold">{lang === 'th' ? 'ข้อเสนอปฏิบัติ' : 'Actionable tip'}：</span>
              {secondary.tip[lang]}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'จังหวะชั่วโมง' : 'Hourly Rhythm'}
          </div>
          <div className="space-y-2">
            {hours.map(({ hour, planet, isNow }) => (
              <div
                key={hour}
                className={`flex items-center justify-between rounded-xl px-3 py-2 ${isNow ? 'bg-black/[0.04]' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-sm">{planet.icon}</div>
                  <div className="text-[12px] font-medium text-black/75">{String(hour).padStart(2, '0')}:00</div>
                </div>
                <div className="text-[11px] text-black/55">{t(planet.labelKey)}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="text-[12px] font-semibold text-black/75 mb-2">
              {lang === 'th' ? 'บันทึกพลังงานที่รู้สึก' : 'Log actual energy'}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {PLANETARY_ENERGIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePlanet(p.id)}
                  className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${
                    selected.includes(p.id) ? 'border-black/25 bg-black text-white' : 'border-black/10 bg-white/60 text-black/70'
                  }`}
                >
                  {p.icon} {t(p.labelKey)}
                </button>
              ))}
            </div>
            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              rows={2}
              placeholder={lang === 'th' ? 'ผลลัพธ์จริงเป็นอย่างไร?' : 'What actually happened?'}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-[12px] text-black/80 outline-none focus:border-black/25"
            />
            <button
              onClick={logEnergy}
              className="mt-2 w-full rounded-full bg-black text-white py-2 text-[12px] font-semibold hover:bg-black/80 active:scale-[0.97] transition-all"
            >
              {lang === 'th' ? 'บันทึก' : 'Log energy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
