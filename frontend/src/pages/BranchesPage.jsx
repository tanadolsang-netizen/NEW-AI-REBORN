'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BranchesPage() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
    fetch(`${base}/v1/branches/list`)
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } });
      if (items.length) {
        gsap.fromTo(listRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.1 });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [items.length]);

  return (
    <section id="branches" ref={sectionRef} className="py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div ref={headerRef}>
          <h2 className="text-[36px] md:text-[44px] leading-[0.98] tracking-[-0.03em] font-semibold text-black">
            สาขาโหราศาสตร์
          </h2>
          <p className="mt-3 text-[16px] leading-[1.55] text-black/60">ภาพรวมสาขาหลัก + แหล่งอ้างอิงใน vault</p>
        </div>

        <div ref={listRef} className="mt-8 rounded-[28px] border border-black/8 bg-[#fbfbfd] p-6">
          {loading && <div className="text-[13px] text-black/50">กำลังโหลด...</div>}
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((b) => (
                <div key={b.id || b.name} className="rounded-2xl border border-black/7 bg-white px-4 py-3">
                  <div className="text-[13px] font-semibold text-black/90">{b.name || b.title || b.id}</div>
                  {b.desc && <div className="mt-1 text-[13px] text-black/55 leading-relaxed">{b.desc}</div>}
                </div>
              ))}
              {items.length === 0 && <div className="text-[13px] text-black/50">ยังไม่มีข้อมูลสาขา</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
