"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { readyPath } from "@/lib/api";
import ThaiZodiacWidget from "@/components/ThaiZodiacWidget";
import TiltCard from "@/components/TiltCard";
import ZodiacWheel3D from "@/components/three/ZodiacWheel3D";

type Health = { ok: boolean; text: string };

const features = [
  {
    href: "/natal",
    title: "ดวงกำเนิด",
    en: "Natal Chart",
    description: "แผนที่ท้องฟ้าในวินาทีที่คุณลืมตาดูโลก",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" />
      </svg>
    ),
  },
  {
    href: "/transit",
    title: "ทรานซิต",
    en: "Transit Now",
    description: "ตำแหน่งดาวเคราะห์ ณ วินาทีนี้ บนท้องฟ้าจริง",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <circle cx="12" cy="12" r="4" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-20 12 12)" />
      </svg>
    ),
  },
  {
    href: "/synastry",
    title: "ดวงคู่รัก",
    en: "Synastry",
    description: "เทียบดวงสองคน เข้าใจพลังงานของความสัมพันธ์",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <circle cx="9" cy="12" r="5.5" />
        <circle cx="15" cy="12" r="5.5" />
      </svg>
    ),
  },
  {
    href: "/tarot",
    title: "ไพ่ทาโรต์",
    en: "Tarot Reading",
    description: "เปิดไพ่สามใบ หรือกางแผนกางเขนเซลติก พร้อมคำทำนาย",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <rect x="5" y="3" width="9" height="14" rx="1.5" />
        <rect x="10" y="7" width="9" height="14" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/horary",
    title: "ถามดวง",
    en: "Horary",
    description: "ตั้งคำถามในใจ แล้วให้ท้องฟ้าตอนนี้ตอบคุณ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <circle cx="12" cy="11" r="7.5" />
        <path d="M12 20v2M9.2 9.5a2.8 2.8 0 1 1 3.9 2.6c-.9.5-1.1 1-1.1 1.9" />
        <circle cx="12" cy="15.7" r="0.15" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/branches",
    title: "สายวิชา",
    en: "Branches",
    description: "สำรวจสายวิชาโหราศาสตร์และเทคนิคของแต่ละสำนัก",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <path d="M12 21V9M12 9c0-3 2-5 6-5-1 3.5-3 5-6 5ZM12 13c0-3-2-5-6-5 1 3.5 3 5 6 5Z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [health, setHealth] = useState<Health>({ ok: false, text: "กำลังเชื่อมต่อเซิร์ฟเวอร์…" });
  const { scrollY } = useScroll();
  const wheelY = useTransform(scrollY, [0, 500], [0, -80]);
  const wheelOpacity = useTransform(scrollY, [0, 400], [1, 0.15]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(readyPath(), { cache: "no-store" });
        if (cancelled) return;
        setHealth(res.ok ? { ok: true, text: "เซิร์ฟเวอร์พร้อมใช้งาน" } : { ok: false, text: `เซิร์ฟเวอร์ขัดข้อง (${res.status})` });
      } catch {
        if (!cancelled) setHealth({ ok: false, text: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden">
      <section className="bg-hero-gradient relative border-b border-border">
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 pt-20 pb-6 text-center sm:pt-28">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pill"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                health.ok ? "animate-pulse-glow bg-emerald-400" : "bg-red-400"
              }`}
            />
            {health.text}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight sm:text-6xl"
          >
            <span className="text-neon">จักรวาล</span>ของคุณ
            <br className="hidden sm:block" /> อยู่ในมือคุณ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-lg leading-8 text-muted"
          >
            ดวงกำเนิด ทรานซิตสด ไพ่ทาโรต์ และความเข้ากันของคู่รัก — คำนวณด้วยข้อมูล
            ดาราศาสตร์จริง ไม่ใช่การเดา
            <span className="mt-1 block text-sm text-muted/70">
              Astrology, calculated precisely — not guessed.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/dashboard" className="btn-primary">
              เริ่มต้นใช้งาน
            </Link>
            <Link href="/natal" className="btn-secondary">
              คำนวณดวงกำเนิด
            </Link>
          </motion.div>
        </div>

        <motion.div
          style={{ y: wheelY, opacity: wheelOpacity }}
          className="relative z-0 mx-auto flex w-full max-w-5xl justify-center px-6 pb-8"
        >
          <ZodiacWheel3D />
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold tracking-tight"
        >
          สำรวจท้องฟ้า
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mt-2 text-muted"
        >
          หกวิธีในการอ่านดวง ตั้งแต่ดวงเดี่ยว ไปจนถึงการเทียบดวงคู่และไพ่ยิปซี
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.href}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="h-full">
                <Link href={f.href} className="card card-hover card-3d flex h-full flex-col gap-3 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    {f.icon}
                  </span>
                  <span className="flex items-center gap-1.5 text-[17px] font-medium">
                    {f.title}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  <span className="text-xs tracking-wide text-muted/70 uppercase">{f.en}</span>
                  <span className="text-sm leading-6 text-muted">{f.description}</span>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      <ThaiZodiacWidget />

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold tracking-tight"
          >
            พร้อมดูดวงของคุณหรือยัง?
          </motion.h2>
          <p className="max-w-md text-muted">
            ไปที่แดชบอร์ดเพื่อดูภาพรวมอย่างรวดเร็ว หรือเริ่มคำนวณได้ทันที
          </p>
          <Link href="/dashboard" className="btn-primary mt-2">
            เปิดแดชบอร์ด
          </Link>
        </div>
      </section>
    </div>
  );
}
