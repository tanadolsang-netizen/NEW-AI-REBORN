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

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const submit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      ...form,
    };
    setEntries((prev) => [entry, ...prev].slice(0, 200));
    setForm({ mood: 5, stress: 3, sleep: 7, note: '' });
  };

  const moodLabel = (v) => {
    const labels = lang === 'th'
      ? ['ไม่กระตุก', 'แย่', 'กลาง', 'ดี', 'ดีมาก']
      : ['Very Low', 'Low', 'Okay', 'Good', 'Great'];
    const idx = Math.min(Math.max(Math.floor(v / 2.5), 0), labels.length - 1);
    return labels[idx];
  };

  const stressLabel = (v) => {
    const labels = lang === 'th'
      ? ['ผ่อนคลาย', 'สงบ', 'เล็กน้อย', 'ค่อนข้างเครียด', 'เครียดมาก']
      : ['Chill', 'Calm', 'Mild', 'Tense', 'High'];
    const idx = Math.min(Math.max(Math.floor(v / 2.5), 0), labels.length - 1);
    return labels[idx];
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">
          {t('journal.title')}
        </h2>
        <p className="mt-3 text-[16px] leading-[1.6] text-white/55 max-w-xl">{t('journal.subtitle')}</p>
      </div>

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

            <button
              type="submit"
              className="w-full rounded-full bg-indigo-500 text-white py-3 text-[13px] font-semibold hover:bg-indigo-400 active:scale-[0.97] transition-all shadow-[0_10px_30px_rgba(99,102,241,0.35)]"
            >
              {t('journal.save')}
            </button>
          </form>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">
            {t('journal.recent')}
          </div>
          <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
            {entries.length === 0 ? (
              <div className="text-[12px] text-white/45">{t('journal.empty')}</div>
            ) : (
              entries.slice(0, 50).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2"
                >
                  <div>
                    <div className="text-[12px] font-semibold text-white/80">{entry.date}</div>
                    <div className="text-[11px] text-white/55">
                      {t('journal.mood')}: {moodLabel(entry.mood)} · {t('journal.stress')}: {stressLabel(entry.stress)} · {t('journal.sleep')}: {entry.sleep}h
                    </div>
                    {entry.note && (
                      <div className="mt-1 text-[11px] text-white/55 line-clamp-2">{entry.note}</div>
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
