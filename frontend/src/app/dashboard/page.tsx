"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiPath } from "@/lib/api";
import TiltCard from "@/components/TiltCard";

type RecentChart = { name: string; datetime_utc: string; system: string };

type TransitBody = {
  body: string;
  sign: string;
  degree: number;
  is_retrograde?: boolean;
};

type TransitResponse = {
  now_utc: string;
  tz_offset_hours: number;
  lat: number;
  lon: number;
  bodies: TransitBody[];
};

const actions = [
  { href: "/natal", title: "ดวงกำเนิดใหม่", description: "คำนวณดวงกำเนิดจากวัน เวลา และสถานที่เกิด" },
  { href: "/tarot", title: "เปิดไพ่ทาโรต์", description: "เปิดไพ่หนึ่งใบ สามใบ หรือกางเขนเซลติก" },
  { href: "/synastry", title: "เทียบดวงคู่รัก", description: "ดูมุมสัมพันธ์ระหว่างดวงของสองคน" },
  { href: "/horary", title: "ถามดวงตอนนี้", description: "ตั้งคำถามในใจ ให้ท้องฟ้าตอนนี้ตอบ" },
  { href: "/branches", title: "สำรวจสายวิชา", description: "เรียนรู้สายวิชาและเทคนิคโหราศาสตร์" },
  { href: "/transit", title: "ทรานซิตเต็มรูปแบบ", description: "ดูตำแหน่งดาวเคราะห์ทั้งหมด ณ ตอนนี้" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<RecentChart[]>([]);

  const [transit, setTransit] = useState<TransitResponse | null>(null);
  const [transitError, setTransitError] = useState<string | null>(null);
  const [transitLoading, setTransitLoading] = useState(true);

  async function loadRecent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiPath("/dashboard/recent"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 5 }),
      });
      if (!res.ok) throw new Error(`โหลดไม่สำเร็จ (${res.status})`);
      const data = (await res.json()) as { recent: RecentChart[] };
      setRecent(data.recent);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "โหลดไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams({ tz: "7", lat: "13.8591", lon: "100.5217" });
        const res = await fetch(`${apiPath("/transit/now")}?${params.toString()}`, { cache: "no-store" });
        const data = (await res.json()) as TransitResponse;
        if (!cancelled) setTransit(data);
      } catch {
        if (!cancelled) setTransitError("ทรานซิตไม่พร้อมใช้งาน");
      } finally {
        if (!cancelled) setTransitLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const retrogradeCount = transit?.bodies.filter((b) => b.is_retrograde).length ?? 0;

  const stats = [
    { label: "ดวงล่าสุด · Recent", value: recent.length > 0 ? String(recent.length) : "—" },
    { label: "ดาวที่ติดตาม · Bodies", value: transit ? String(transit.bodies.length) : "—" },
    { label: "ดาวถอยหลัง · Retrograde", value: transitLoading ? "—" : String(retrogradeCount) },
    { label: "ระบบ · Systems", value: "2" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="pill">แดชบอร์ด · Dashboard</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
          ภาพรวม<span className="text-neon">จักรวาล</span>ของคุณ
        </h1>
        <p className="mt-2 text-muted">สรุปกิจกรรมโหราศาสตร์ของคุณในที่เดียว</p>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="card p-5"
          >
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">ดวงล่าสุด · Recent charts</h2>
            <form onSubmit={loadRecent}>
              <button type="submit" disabled={loading} className="btn-secondary h-9 px-4 text-[13px]">
                {loading ? "กำลังโหลด…" : "โหลดล่าสุด"}
              </button>
            </form>
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <div className="mt-4 space-y-2">
            {recent.length === 0 ? (
              <div className="card p-5 text-sm text-muted">ยังไม่มีข้อมูล กด &ldquo;โหลดล่าสุด&rdquo; เพื่อดึงประวัติ</div>
            ) : (
              recent.map((r) => (
                <div key={`${r.name}-${r.datetime_utc}`} className="card card-hover p-4">
                  <p className="font-medium">{r.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{r.datetime_utc}</p>
                  <p className="mt-1 text-sm text-muted">{r.system}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium">ทรานซิตวันนี้ · Today&rsquo;s transit</h2>
          <div className="card mt-4 p-5">
            {transitLoading ? (
              <p className="text-sm text-muted">กำลังโหลดตำแหน่งดาวปัจจุบัน…</p>
            ) : transitError ? (
              <p className="text-sm text-red-400">{transitError}</p>
            ) : transit ? (
              <>
                <p className="text-xs text-muted">{transit.now_utc}</p>
                <ul className="mt-3 space-y-1.5">
                  {transit.bodies.slice(0, 6).map((b) => (
                    <li key={b.body} className="flex justify-between text-sm">
                      <span>{b.body}</span>
                      <span className="text-muted">
                        {b.sign} ({b.degree.toFixed(1)}°){b.is_retrograde ? " R" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/transit" className="mt-4 inline-block text-sm font-medium text-accent hover:opacity-80">
                  ดูทรานซิตเต็มรูปแบบ →
                </Link>
              </>
            ) : null}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-medium">ทางลัด · Quick actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {actions.map((a, i) => (
            <motion.div
              key={a.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <TiltCard>
                <Link href={a.href} className="card card-hover card-3d block h-full p-5">
                  <p className="font-medium">{a.title}</p>
                  <p className="mt-1 text-sm text-muted">{a.description}</p>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
