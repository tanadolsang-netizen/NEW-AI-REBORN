'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    title: 'Ephemeris จริง offline',
    desc: 'คำนวณตำแหน่งดาวเคราะห์ด้วย JPL DE421 + skyfield แบบ standalone ไม่พึ่งเว็บ第三步',
    icon: '🧭',
  },
  {
    title: 'สองระบบ: ไทย + สากล',
    desc: 'แสดง Tropical และ Lahiri Sidereal side-by-side พร้อมอ้างอิง ayanamsa',
    icon: '✨',
  },
  {
    title: 'Transit เปรียบเทียบ',
    desc: 'ตรวจ overlay ดาวเคราะห์ปัจจุบันกับตำแหน่งกำเนิด + จันทร์ขึ้น/อังคารด้วย',
    icon: '🪐',
  },
  {
    title: 'สาขาโหราศาสตร์',
    desc: 'Natal, Synastry, Electional, Horary, Medical, Financial, Vedic, Chinese, Astrocartography, Mundane, Evolutionary',
    icon: '📚',
  },
  {
    title: 'แจ้งเตือนนาทีทอง',
    desc: 'ตั้งเวลาแจ้งเตือนวันเวลา movement สำคัญ พร้อม push notification + preferences',
    icon: '🔔',
  },
  {
    title: 'Backend จาก vault',
    desc: 'ใช้โครงสร้าง wiki/raw 론 vault เป็น content engine คำนวณผลตรงจากข้อมูลตัวเอง',
    icon: '🛡️',
  },
];

export default function Features() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 72%',
        onEnter: () => setInView(true),
      });
      if (inView) {
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out' }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [inView]);

  return (
    <section id="features" ref={sectionRef} className="relative py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-[40px] md:text-[52px] leading-[0.98] tracking-[-0.03em] font-semibold text-black">
            ทำไมเลือก ASTRAL
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-black/60">
            เครื่องมือโหราศาสตร์ที่คำนวณเอง ไม่ใช่แค่รวบรวมคำ。สมาร์ท、精确、ตรงไปตรงมา。
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <div
              key={item.title}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="group rounded-[28px] border border-black/8 bg-[#fbfbfd] p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500"
            >
              <div className="text-[28px] leading-none">{item.icon}</div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-black/90">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-black/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
