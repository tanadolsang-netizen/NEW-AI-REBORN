'use client';

import { useMemo } from 'react';
import { useLang } from '../i18n.jsx';

const WINDOWS = [
  { id: 'morning', labelKey: 'timing.morning', start: 6, end: 9, theme: 'Launch', icon: '🌅' },
  { id: 'midday', labelKey: 'timing.midday', start: 9, end: 12, theme: 'Deep Work', icon: '☀️' },
  { id: 'afternoon', labelKey: 'timing.afternoon', start: 12, end: 15, theme: 'Collaboration', icon: '🌤' },
  { id: 'evening', labelKey: 'timing.evening', start: 15, end: 18, theme: 'Wrap-up', icon: '🌇' },
  { id: 'night', labelKey: 'timing.night', start: 18, end: 21, theme: 'Rest', icon: '🌙' },
];

export default function TimingSync() {
  const { t, lang } = useLang();
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

  const suggestion = useMemo(() => {
    const w = activeWindows.find((w) => w.active) || activeWindows[0];
    if (w.id === 'morning') {
      return lang === 'th'
        ? 'ช่วงเช้าดีสำหรับงานที่ต้องการโฟกัสสูง และเริ่มโปรเจกต์ใหม่'
        : 'Morning is best for deep focus and starting new projects';
    }
    if (w.id === 'midday') {
      return lang === 'th'
        ? 'ช่วงกลางวันเหมาะกับงานที่ต้องใช้สมาธิสูง เช่น การวางแผนหรือวิเคราะห์'
        : 'Midday suits analytical work and planning';
    }
    if (w.id === 'afternoon') {
      return lang === 'th'
        ? 'ช่วงบ่ายเหมาะกับการเจรจา ประชุม และทำงานร่วมกับผู้อื่น'
        : 'Afternoon is better for meetings and collaboration';
    }
    if (w.id === 'evening') {
      return lang === 'th'
        ? 'ช่วงเย็นเหมาะกับการ wrap-up งาน และจัดลำดับความสำคัญรายวัน'
        : 'Evening is good for wrapping up tasks and reviewing';
    }
    return lang === 'th'
      ? 'ค่ำคืนเหมาะกับการพักผ่อน เตรียมใจสำหรับวันรุ่งขึ้น'
      : 'Night is for rest and mental reset';
  }, [activeWindows, lang]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's best timing */}
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

        {/* Routine builder */}
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

        {/* Priority suggestion */}
        <div className="rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="text-[11px] font-semibold tracking-widest text-black/50 uppercase mb-3">
            {lang === 'th' ? 'ลำดับความสำคัญ' : 'Priority Matrix'}
          </div>
          <div className="space-y-2 text-[12px] text-black/65">
            <div className="rounded-xl bg-black/5 px-3 py-2">
              <div className="font-semibold text-black/75">
                {lang === 'th' ? 'สำคัญ + ด่วน' : 'Important + Urgent'}
              </div>
              <div className="mt-0.5">
                {lang === 'th' ? 'ทำงานที่ต้องส่งวันนี้ และมีค่าเวลาสูง' : 'Do today with high value and deadline'}
              </div>
            </div>
            <div className="rounded-xl bg-white/60 px-3 py-2">
              <div className="font-semibold text-black/75">
                {lang === 'th' ? 'สำคัญ + ไม่ด่วน' : 'Important + Not Urgent'}
              </div>
              <div className="mt-0.5">
                {lang === 'th' ? 'วางแผนระยะยาว เรียน ฟื้นฟูศักยภาพ' : 'Plan long-term, learn, recover'}
              </div>
            </div>
            <div className="rounded-xl bg-white/60 px-3 py-2">
              <div className="font-semibold text-black/75">
                {lang === 'th' ? 'ด่วน + ไม่สำคัญ' : 'Urgent + Not Important'}
              </div>
              <div className="mt-0.5">
                {lang === 'th' ? 'กระจายเวลา หรือคัดลอก威งาน' : 'Batch or delegate small tasks'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
