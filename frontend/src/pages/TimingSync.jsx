'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLang } from '../i18n.jsx';

const WINDOWS = [
  { id: 'morning', labelKey: 'timing.morning', start: 6, end: 9, theme: 'Launch', icon: '🌅' },
  { id: 'midday', labelKey: 'timing.midday', start: 9, end: 12, theme: 'Deep Work', icon: '☀️' },
  { id: 'afternoon', labelKey: 'timing.afternoon', start: 12, end: 15, theme: 'Collaboration', icon: '🌤' },
  { id: 'evening', labelKey: 'timing.evening', start: 15, end: 18, theme: 'Wrap-up', icon: '🌇' },
  { id: 'night', labelKey: 'timing.night', start: 18, end: 21, theme: 'Rest', icon: '🌙' },
];

const DOING_KEY = 'astral-timing-doing';

function loadDoing() {
  try {
    const raw = localStorage.getItem(DOING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDoing(entry) {
  localStorage.setItem(DOING_KEY, JSON.stringify(entry));
}

export default function TimingSync() {
  const { t, lang } = useLang();
  const [doing, setDoing] = useState(() => loadDoing());
  const [completed, setCompleted] = useState([]);
  const [customTask, setCustomTask] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (doing) saveDoing(doing);
  }, [doing]);

  const now = new Date();
  const currentHour = now.getHours();

  const activeWindows = useMemo(() => {
    return WINDOWS.map((w) => ({
      ...w,
      active: currentHour >= w.start && currentHour < w.end,
      passed: currentHour >= w.end,
      upcoming: currentHour < w.start,
    }));
  }, [currentHour]);

  const active = activeWindows.find((w) => w.active) || activeWindows[0];

  const suggestion = useMemo(() => {
    if (active.id === 'morning') {
      return lang === 'th'
        ? 'ช่วงเช้าดีสำหรับงานที่ต้องการโฟกัสสูง และเริ่มโปรเจกต์ใหม่'
        : 'Morning is best for deep focus and starting new projects';
    }
    if (active.id === 'midday') {
      return lang === 'th'
        ? 'ช่วงกลางวันเหมาะกับงานที่ต้องใช้สมาธิสูง เช่น การวางแผนหรือวิเคราะห์'
        : 'Midday suits analytical work and planning';
    }
    if (active.id === 'afternoon') {
      return lang === 'th'
        ? 'ช่วงบ่ายเหมาะกับการเจรจา ประชุม และทำงานร่วมกับผู้อื่น'
        : 'Afternoon is better for meetings and collaboration';
    }
    if (active.id === 'evening') {
      return lang === 'th'
        ? 'ช่วงเย็นเหมาะกับการ wrap-up งาน และจัดลำดับความสำคัญรายวัน'
        : 'Evening is good for wrapping up tasks and reviewing';
    }
    return lang === 'th'
      ? 'ค่ำคืนเหมาะกับการพักผ่อน เตรียมใจสำหรับวันรุ่งขึ้น'
      : 'Night is for rest and mental reset';
  }, [active, lang]);

  const addCustomTask = () => {
    if (!customTask.trim()) return;
    setDoing((prev) => ({ ...prev, task: customTask.trim(), windowId: active.id, date: new Date().toISOString().slice(0, 10) }));
    setCustomTask('');
    setNote('');
  };

  const complete = () => {
    if (!doing?.task) return;
    setCompleted((prev) => [{ ...doing, completedAt: new Date().toISOString(), note }, ...prev].slice(0, 50));
    setDoing(null);
    setNote('');
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">
          {t('timing.title')}
        </h2>
        <p className="mt-3 text-[16px] leading-[1.6] text-white/55 max-w-xl">{t('timing.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'คำแนะนำจังหวะวันนี้' : "Today's Timing Suggestion"}
          </div>
          <div className="text-[15px] font-medium text-black/80 leading-relaxed">{suggestion}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeWindows.map((w) => (
              <span
                key={w.id}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                  w.active
                    ? 'border-black/25 bg-black text-white'
                    : w.passed
                    ? 'border-black/10 bg-black/5 text-black/55'
                    : 'border-black/10 bg-white/60 text-black/70'
                }`}
              >
                {w.icon} {w.start}:00-{w.end}:00
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'สมดุล Activities' : 'Routine Builder'}
          </div>
          <div className="space-y-2">
            {activeWindows.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div>{w.icon}</div>
                  <div className="text-[13px] font-medium text-black/75">{t(w.labelKey)}</div>
                </div>
                <div className="text-[11px] font-mono text-black/55">{w.start}:00-{w.end}:00</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'ลำดับความสำคัญ' : 'Priority Matrix'}
          </div>
          <div className="space-y-2 text-[12px] text-black/65">
            <div className="rounded-xl bg-black/5 px-3 py-2">
              <div className="font-semibold text-black/75">{t('timing.importantUrgent')}</div>
              <div className="mt-0.5">{lang === 'th' ? 'ส่งงานที่ due วันนี้ + มีผลลัพธ์สูง' : 'Do today with high value and deadline'}</div>
            </div>
            <div className="rounded-xl bg-white/60 px-3 py-2">
              <div className="font-semibold text-black/75">{t('timing.importantNotUrgent')}</div>
              <div className="mt-0.5">{lang === 'th' ? 'วางแผน เรียนรู้ ดูแลสุขภาพ' : 'Plan long-term, learn, recover'}</div>
            </div>
            <div className="rounded-xl bg-white/60 px-3 py-2">
              <div className="font-semibold text-black/75">{t('timing.urgentNotImportant')}</div>
              <div className="mt-0.5">{lang === 'th' ? 'รวบรวม、คัดลอก威、จบงานเล็กๆ' : 'Batch or delegate small tasks'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl lg:col-span-2">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">
            {lang === 'th' ? 'จังหวะทำวันนี้' : 'This hour, actually do this'}
          </div>
          {!doing ? (
            <div className="space-y-3">
              <div className="text-[12px] text-white/55">
                {lang === 'th'
                  ? 'ช่วงนี้เหมาะกับ: ' + active.theme
                  : 'This window is best for: ' + active.theme}
              </div>
              <div className="flex gap-2">
                <input
                  value={customTask}
                  onChange={(e) => setCustomTask(e.target.value)}
                  placeholder={lang === 'th' ? 'ใส่งานที่คุณจะทำในช่วงนี้' : 'Enter what you will do now'}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[13px] text-white/90 outline-none focus:border-white/25"
                />
                <button
                  onClick={addCustomTask}
                  className="rounded-full bg-indigo-500 text-white px-4 py-2 text-[12px] font-semibold hover:bg-indigo-400 active:scale-[0.97] transition-all"
                >
                  {lang === 'th' ? 'เริ่ม' : 'Start'}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[13px] font-semibold text-white/80">
                {lang === 'th' ? 'กำลังทำ' : 'Doing now'}: {doing.task}
              </div>
              <div className="mt-2 text-[11px] text-white/55">
                {t(active.labelKey)} · {active.start}:00-{active.end}:00
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder={lang === 'th' ? 'บันทึกผลสั้น ๆ ก่อนจบ' : 'Quick note before finishing'}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[12px] text-white/90 outline-none focus:border-white/25"
              />
              <button
                onClick={complete}
                className="mt-2 rounded-full bg-white text-black px-4 py-2 text-[12px] font-semibold hover:bg-white/80 active:scale-[0.97] transition-all"
              >
                {lang === 'th' ? 'จบแล้ว' : 'Mark done'}
              </button>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-3">
            {lang === 'th' ? 'สิ่งที่ทำแล้ววันนี้' : 'Completed today'}
          </div>
          <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
            {completed.length === 0 ? (
              <div className="text-[12px] text-white/45">
                {lang === 'th' ? 'ยังไม่มีรายการที่ทำเสร็จ' : 'No completed tasks yet'}
              </div>
            ) : (
              completed.slice(0, 20).map((c, i) => (
                <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                  <div className="text-[12px] font-semibold text-white/80 line-through decoration-white/40">{c.task}</div>
                  {c.note && (
                    <div className="mt-1 text-[11px] text-white/55 line-clamp-2">{c.note}</div>
                  )}
                  <div className="mt-1 text-[10px] text-white/35 font-mono">
                    {new Date(c.completedAt).toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
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
