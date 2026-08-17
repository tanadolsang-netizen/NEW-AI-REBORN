'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLang } from '../i18n.jsx';

const STORAGE_KEY = 'astral-journal';

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function DailyJournal() {
  const { t, lang } = useLang();
  const [entries, setEntries] = useState(() => loadEntries());
  const [form, setForm] = useState({ mood: 5, stress: 3, sleep: 7, note: '' });
  const [energy, setEnergy] = useState('');
  const [reflection, setReflection] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayEntry = entries.find((e) => e.date === today);

  const moodLabel = (v) => {
    const labels = lang === 'th'
      ? ['ไม่กระตุก', 'แย่', 'กลาง', 'ดี', 'ดีมาก']
      : ['Very Low', 'Low', 'Okay', 'Good', 'Great'];
    const idx = Math.min(Math.max(Math.floor((v - 1) / 2.5), 0), labels.length - 1);
    return labels[idx];
  };

  const stressLabel = (v) => {
    const labels = lang === 'th'
      ? ['ผ่อนคลาย', 'สงบ', 'เล็กน้อย', 'ค่อนข้างเครียด', 'เครียดมาก']
      : ['Chill', 'Calm', 'Mild', 'Tense', 'High'];
    const idx = Math.min(Math.max(Math.floor((v - 1) / 2.5), 0), labels.length - 1);
    return labels[idx];
  };

  const reflectionPrompt = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const prompts = lang === 'th'
      ? [
          'วันนี้อะไรทำให้คุณรู้สึกมีความสุข?',
          'วันนี้อะไรยาก ลีดราคา?',
          'ถ้าวันนี้ผ่านไปอย่างดี มีสาเหตุอะไร?',
          'วันนี้คุณทำสิ่งที่ใช่ต่อชีวิตหรือเปล่า?',
          'สิ่งที่คุณขอบคุณที่สุดวันนี้คืออะไร?',
        ]
      : [
          'What brought you joy today?',
          'What felt difficult today?',
          'If today went well, why?',
          'Did you act in line with what matters to you?',
          'What are you most grateful for today?',
        ];
    return prompts[dayOfYear % prompts.length];
  }, [lang]);

  const submit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      date: today,
      mood: form.mood,
      stress: form.stress,
      sleep: form.sleep,
      note: form.note,
      energy,
      reflection,
    };
    setEntries((prev) => {
      const next = prev.filter((x) => x.date !== today || x.id === entry.id);
      return [entry, ...next];
    });
    setForm({ mood: 5, stress: 3, sleep: 7, note: '' });
    setEnergy('');
    setReflection('');
  };

  const exportCSV = () => {
    setExporting(true);
    const header = 'date,mood,stress,sleep,note,energy,reflection\n';
    const rows = entries.map((e) =>
      [
        e.date,
        e.mood,
        e.stress,
        e.sleep,
        `"${(e.note || '').replace(/"/g, '""')}"`,
        `"${(e.energy || '').replace(/"/g, '""')}"`,
        `"${(e.reflection || '').replace(/"/g, '""')}"`,
      ].join(',')
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astral-journal-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const weeklyAvg = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = entries.filter((e) => new Date(e.date) >= weekAgo);
    if (!recent.length) return null;
    const avgMood = +(recent.reduce((s, e) => s + e.mood, 0) / recent.length).toFixed(1);
    const avgStress = +(recent.reduce((s, e) => s + e.stress, 0) / recent.length).toFixed(1);
    const avgSleep = +(recent.reduce((s, e) => s + e.sleep, 0) / recent.length).toFixed(1);
    return { avgMood, avgStress, avgSleep, count: recent.length };
  }, [entries]);

  const insights = useMemo(() => {
    if (!weeklyAvg) return [];
    const tips = [];
    if (lang === 'th') {
      if (weeklyAvg.avgSleep < 6) tips.push('นอนน้อยเกินไป ลองตั้งเวลาเตือนให้minusก่อนนอน 30 นาที');
      if (weeklyAvg.avgStress > 7) tips.push('ความเครียดสูง ลองหายใจลึก 5 นาที หรือเดินสั้นๆ');
      if (weeklyAvg.avgMood >= 7) tips.push('อารมณ์ดี เป็นสัญญาณว่าคุณกำลังทำสิ่งที่ใช่ ลองทำซ้ำ activity นั้น');
      if (weeklyAvg.avgMood <= 4) tips.push('อารมณ์ต่ำ ลองให้戟WITH ตัวเองวันนี้ และลดสิ่งที่ซ้ำรัง');
      if (weeklyAvg.avgSleep >= 7 && weeklyAvg.avgStress <= 4) tips.push('คุณกำลังใช้เวลาดีมาก ลองรักษา pattern นี้');
    } else {
      if (weeklyAvg.avgSleep < 6) tips.push('Sleep is low. Try a 30-minute earlier wind-down tonight.');
      if (weeklyAvg.avgStress > 7) tips.push('Stress is high. Try a 5-minute breathing break or short walk.');
      if (weeklyAvg.avgMood >= 7) tips.push('Mood is strong. Note what you are doing and repeat it tomorrow.');
      if (weeklyAvg.avgMood <= 4) tips.push('Mood is low. Be gentle with yourself today and cut extra commitments.');
      if (weeklyAvg.avgSleep >= 7 && weeklyAvg.avgStress <= 4) tips.push('You are in a good rhythm. Protect this pattern.');
    }
    return tips;
  }, [weeklyAvg, lang]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">
          {t('journal.title')}
        </h2>
        <p className="mt-3 text-[16px] leading-[1.6] text-white/55 max-w-xl">{t('journal.subtitle')}</p>
      </div>

      {weeklyAvg && (
        <div className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">
            {lang === 'th' ? 'สรุป 7 วันล่าสุด' : '7-day summary'}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-[24px] font-semibold text-white">{weeklyAvg.avgMood}</div>
              <div className="text-[11px] text-white/55">{t('journal.mood')}</div>
            </div>
            <div>
              <div className="text-[24px] font-semibold text-white">{weeklyAvg.avgStress}</div>
              <div className="text-[11px] text-white/55">{t('journal.stress')}</div>
            </div>
            <div>
              <div className="text-[24px] font-semibold text-white">{weeklyAvg.avgSleep}h</div>
              <div className="text-[11px] text-white/55">{t('journal.sleep')}</div>
            </div>
            <div>
              <div className="text-[24px] font-semibold text-white">{weeklyAvg.count}</div>
              <div className="text-[11px] text-white/55">{lang === 'th' ? 'บันทึก' : 'entries'}</div>
            </div>
          </div>
          {insights.length > 0 && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[12px] font-semibold text-white/70 mb-1">
                {lang === 'th' ? 'ข้อเสนอปฏิบัติ' : 'Actionable insight'}
              </div>
              <ul className="space-y-1 text-[12px] text-white/65">
                {insights.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-medium text-white/80">{t('journal.mood')}</div>
                <div className="text-[12px] font-mono text-white/55">{moodLabel(form.mood)}</div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={form.mood}
                onChange={(e) => setForm((f) => ({ ...f, mood: Number(e.target.value) }))}
                className="mt-2 w-full"
              />
              <div className="mt-1 flex justify-between text-[10px] text-white/45 font-mono">
                <span>1</span>
                <span>10</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-medium text-white/80">{t('journal.stress')}</div>
                <div className="text-[12px] font-mono text-white/55">{stressLabel(form.stress)}</div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={form.stress}
                onChange={(e) => setForm((f) => ({ ...f, stress: Number(e.target.value) }))}
                className="mt-2 w-full"
              />
            </div>

            <div>
              <div className="text-[13px] font-medium text-white/80">{t('journal.sleep')}</div>
              <input
                type="number"
                min="0"
                max="14"
                step="0.5"
                value={form.sleep}
                onChange={(e) => setForm((f) => ({ ...f, sleep: Number(e.target.value) }))}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[13px] text-white/90 outline-none focus:border-white/25"
              />
            </div>

            <div>
              <div className="text-[13px] font-medium text-white/80">{t('journal.note')}</div>
              <textarea
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[13px] text-white/90 outline-none focus:border-white/25"
              />
            </div>

            <div>
              <div className="text-[13px] font-medium text-white/80">
                {lang === 'th' ? 'พลังงานที่รู้สึกวันนี้' : "Today's energy"}
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() =>
                      setEnergy((v) => (v === p ? '' : p))
                    }
                    className={`rounded-xl border px-2 py-1 text-[12px] transition-colors ${
                      energy === p
                        ? 'border-white/25 bg-white/15 text-white'
                        : 'border-white/10 bg-white/[0.04] text-white/70 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[13px] font-medium text-white/80">
                {lang === 'th' ? 'ลอง reflect ดู' : 'Reflection'}
              </div>
              <div className="text-[11px] text-white/45 mb-1">{reflectionPrompt}</div>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[13px] text-white/90 outline-none focus:border-white/25"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-indigo-500 text-white py-3 text-[13px] font-semibold hover:bg-indigo-400 active:scale-[0.97] transition-all shadow-[0_10px_30px_rgba(99,102,241,0.35)]"
            >
              {t('journal.save')}
            </button>
          </form>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase">
              {t('journal.recent')}
            </div>
            <button
              onClick={exportCSV}
              disabled={!entries.length}
              className="text-[11px] rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-white/70 hover:text-white disabled:opacity-40"
            >
              {exporting ? (lang === 'th' ? 'กำลังส่งออก...' : 'Exporting...') : (lang === 'th' ? 'ส่งออก CSV' : 'Export CSV')}
            </button>
          </div>
          <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
            {entries.length === 0 ? (
              <div className="text-[12px] text-white/45">{t('journal.empty')}</div>
            ) : (
              entries.slice(0, 50).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-white/80">{entry.date}</div>
                    <div className="text-[11px] text-white/55">
                      {t('journal.mood')}: {moodLabel(entry.mood)} · {t('journal.stress')}: {stressLabel(entry.stress)} · {t('journal.sleep')}: {entry.sleep}h
                    </div>
                    {entry.energy && (
                      <div className="text-[11px] text-white/55">
                        {lang === 'th' ? 'พลังงาน' : 'Energy'}: {entry.energy}
                      </div>
                    )}
                    {entry.note && (
                      <div className="mt-1 text-[11px] text-white/55 line-clamp-2">{entry.note}</div>
                    )}
                    {entry.reflection && (
                      <div className="mt-1 text-[11px] text-white/45 line-clamp-2 italic">“{entry.reflection}”</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
