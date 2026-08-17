'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLang } from '../i18n.jsx';

gsap.registerPlugin(ScrollTrigger);

const items = [
  { title: 'คำนวณดวงจริง', desc: 'คำนวณตำแหน่งดาวเคราะห์ออฟไลน์อย่างแม่นยำ', icon: '✦' },
  { title: 'สองระบบในที่เดียว', desc: 'โหราศาสตร์ไทยและตะวันตก สมดุลกันอย่างเป็นธรรมชาติ', icon: '◈' },
  { title: 'ดูแลบัญชีและข้อมูลส่วนตัว', desc: 'บันทึกการอ่านดวง รายการโน้ต และความเป็นส่วนตัว', icon: '⬡' },
  { title: 'ติดตามชีวิตและพลังงาน', desc: 'บันทึกประจำวัน + ดูพลังงานที่เหมาะกับแต่ละช่วงเวลา', icon: '◇' },
  { title: 'ชำระเงินอย่างปลอดภัย', desc: 'อัปเกรดแผน Pro อย่างมั่นใจ', icon: '⊹' },
  { title: 'ใช้งานง่ายในมือถือ', desc: 'ออกแบบให้อ่านง่าย เร็ว และใช้งานได้ทุกสถานที่', icon: '⬢' },
];

export default function Features() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } });
      gsap.fromTo(cardRefs.current, { opacity: 0, y: 26 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative overflow-hidden py-28 bg-[#0b0b0d]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-24 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-900/40 to-transparent blur-3xl" />
        <div className="absolute -right-40 bottom-16 h-80 w-80 rounded-full bg-gradient-to-br from-violet-900/40 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div ref={headerRef} className="max-w-2xl">
          <div className="text-[11px] font-semibold tracking-widest text-white/45 uppercase mb-4">Capabilities</div>
          <h2 className="text-[44px] md:text-[54px] leading-[0.95] tracking-[-0.035em] font-semibold text-white">{t('features.title')}</h2>
          <p className="mt-5 text-[16px] leading-[1.6] text-white/55">{t('features.subtitle')}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_1px_0_rgba(255,255,255,0.04)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-500"
            >
              <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-600/40 to-transparent blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="text-[22px] text-white/80 tracking-tight mb-4">{item.icon}</div>
                <div className="text-[15px] font-semibold text-white/90">{item.title}</div>
                <p className="mt-2 text-[14px] leading-[1.55] text-white/55">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
