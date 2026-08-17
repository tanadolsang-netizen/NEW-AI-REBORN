'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function NatalPage() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const resultRef = useRef(null);
  const [form, setForm] = useState({ date: '1997-05-19', time: '05:45', lat: '13.36', lon: '100.98', tz: '7' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(formRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 78%' } });
      if (result) {
        gsap.fromTo(resultRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
      const res = await fetch(`${base}/v1/natal/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lat: Number(form.lat), lon: Number(form.lon), tz: Number(form.tz) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || JSON.stringify(data));
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="natal" ref={sectionRef} className="py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div ref={formRef}>
          <h2 className="text-[36px] md:text-[44px] leading-[0.98] tracking-[-0.03em] font-semibold text-black">
            บทสรุปดวงกำเนิด
          </h2>
          <p className="mt-3 text-[16px] leading-[1.55] text-black/60">
            กรอกเวลา/ที่เกิด → ระบบคำนวณตำแหน่งดาวaksa จริง ณ เวลานั้น
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {[
              { key: 'date', label: 'วันเกิด (YYYY-MM-DD)', type: 'date' },
              { key: 'time', label: 'เวลาเกิด (HH:mm)', type: 'time' },
              { key: 'lat', label: 'ละติจูด birthplace', type: 'number', step: '0.0001' },
              { key: 'lon', label: 'ลองจิจูด birthplace', type: 'number', step: '0.0001' },
              { key: 'tz', label: 'Timezone (+/- hours)', type: 'number', step: '1' },
            ].map((field) => (
              <label key={field.key} className="block">
                <span className="text-[12px] font-medium text-black/60 uppercase tracking-wider">{field.label}</span>
                <input
                  type={field.type}
                  step={field.step}
                  value={form[field.key]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-[15px] text-black placeholder:text-black/30 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 transition-all"
                />
              </label>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black px-6 py-3.5 text-[14px] font-semibold text-white hover:bg-black/85 active:scale-[0.98] disabled:opacity-60 transition-all"
            >
              {loading ? 'กำลังคำนวณ...' : 'คำนวณดวง'}
            </button>
            {error && <p className="text-[13px] text-red-600">{error}</p>}
          </form>
        </div>

        <div ref={resultRef} className="md:border-l md:border-black/6 md:pl-10">
          {result ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-[18px] font-semibold text-black">ผลลัพธ์</h3>
                <p className="mt-2 text-[14px] text-black/60 leading-relaxed">{result.summary || result.message || JSON.stringify(result, null, 2)}</p>
              </div>
              {result.planets && (
                <div className="rounded-3xl border border-black/8 bg-[#fbfbfd] p-5">
                  <div className="text-[12px] font-semibold text-black/55 uppercase tracking-wider">ตำแหน่งดาวเคราะห์</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {Object.entries(result.planets).map(([name, pos]) => (
                      <div key={name} className="rounded-xl border border-black/6 bg-white px-3 py-2 text-[13px] text-black/75">
                        <span className="font-medium text-black">{name}</span>
                        <span className="ml-2 text-black/55">{String(pos)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-[13px] text-black/40">
              ใส่ข้อมูล แล้วกดคำนวณ
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
