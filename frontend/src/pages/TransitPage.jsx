'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDailyTransitNotification } from '../hooks/useDailyTransitNotification';

gsap.registerPlugin(ScrollTrigger);

export default function TransitPage() {
  const sectionRef = useRef(null);
  const bodyRef = useRef(null);
  const { supported, subscribed, subscribe, unsubscribe } = useDailyTransitNotification();
  const [transits, setTransits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(bodyRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
    const controller = new AbortController();
    setLoading(true);
    fetch(`${base}/v1/transit/now?lat=13.8591&lon=100.5217&tz=7`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => { setTransits(Array.isArray(d) ? d : [d]); setLoading(false); })
      .catch((e) => { if (e.name !== 'AbortError') { setError(e.message); setLoading(false); } });
    return () => controller.abort();
  }, []);

  return (
    <section id="transit" ref={sectionRef} className="py-28 bg-[#fbfbfd]">
      <div className="mx-auto max-w-6xl px-6" ref={bodyRef}>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-[36px] md:text-[44px] leading-[0.98] tracking-[-0.03em] font-semibold text-black">
              Transit ปัจจุบัน
            </h2>
            <p className="mt-3 text-[16px] leading-[1.55] text-black/60">ตำแหน่งดาวเคราะห์現在/ไกล + overlay กับตำแหน่งกำเนิด</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={subscribe}
              disabled={!supported || subscribed}
              className="rounded-full bg-black px-5 py-2.5 text-[13px] font-medium text-white hover:bg-black/85 active:scale-[0.97] disabled:opacity-50 transition-all"
            >
              {subscribed ? 'แจ้งเตือนเปิดแล้ว' : 'เปิดแจ้งเตือน'}
            </button>
            <button
              onClick={unsubscribe}
              disabled={!subscribed}
              className="rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-black border border-black/10 hover:bg-black/[0.03] active:scale-[0.97] disabled:opacity-50 transition-all"
            >
              ปิด
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-black/8 bg-white p-6">
          {loading && <div className="text-[13px] text-black/50">กำลังโหลด...</div>}
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {transits.map((t) => (
                <div key={t.name || t.id} className="rounded-2xl border border-black/7 bg-[#fbfbfd] px-4 py-3">
                  <div className="text-[12px] text-black/55 font-medium">{t.name || t.id}</div>
                  <div className="mt-1 text-[14px] font-semibold text-black">{t.sign || ''}</div>
                  <div className="text-[12px] text-black/50">{t.degree ?? ''}</div>
                </div>
              ))}
              {transits.length === 0 && <div className="text-[13px] text-black/50">ไม่มีข้อมูล transit</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
