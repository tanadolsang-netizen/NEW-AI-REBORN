"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { apiPath } from "@/lib/api";
import NatalWheel3D from "@/components/three/NatalWheel3D";
import ElementBalance from "@/components/ElementBalance";

type Body = { body: string; sign: string; degree: number };
type ElementBlock = {
  percent: Record<string, number>;
  dominant: string;
  lacking: string;
  tarot_suits: Record<string, string>;
  note: string;
};
type HoraryResponse = {
  question: string;
  asked_at_local: string;
  chart: { name: string; datetime_utc: string; system: string; bodies: Body[]; ascendant: Body };
  ascendant: Body;
  moon: Body;
  elements: ElementBlock;
  caveat: string;
};

export default function HoraryPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HoraryResponse | null>(null);

  async function ask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      question: String(fd.get("question") || ""),
      tz_offset_hours: Number(fd.get("tz") || 7),
      lat: Number(fd.get("lat") || 13.8591),
      lon: Number(fd.get("lon") || 100.5217),
      system: String(fd.get("system") || "tropical"),
    };
    try {
      const res = await fetch(apiPath("/horary/ask"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`ถามดวงไม่สำเร็จ (${res.status})`);
      const data = (await res.json()) as HoraryResponse;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "ถามดวงไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="pill">ถามดวง · Horary</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
          ตั้งคำถาม ให้<span className="text-neon">ท้องฟ้าตอนนี้</span>ตอบ
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          โหราศาสตร์คำถาม (Horary) ตั้งดวงจากวินาทีที่คุณถาม ไม่ใช่วันเกิด — เหมาะกับคำถามเฉพาะเจาะจงในใจตอนนี้
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={ask}
        className="card mt-8 space-y-4 p-6"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">
            คำถามของคุณ <span className="text-muted/60">· Your question</span>
          </span>
          <textarea
            name="question"
            required
            maxLength={500}
            rows={3}
            placeholder="เช่น ฉันควรตัดสินใจเรื่องนี้ตอนนี้ไหม?"
            className="input-field resize-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted">เขตเวลา</span>
            <input name="tz" type="number" step="any" defaultValue="7" className="input-field" />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted">ละติจูด</span>
            <input name="lat" type="number" step="any" defaultValue="13.8591" className="input-field" />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted">ลองจิจูด</span>
            <input name="lon" type="number" step="any" defaultValue="100.5217" className="input-field" />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted">ระบบ</span>
            <select name="system" defaultValue="tropical" className="input-field">
              <option value="tropical">Tropical</option>
              <option value="sidereal">Sidereal</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
          {loading ? "กำลังตั้งดวง…" : "ถามดวง"}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </motion.form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]"
        >
          <div className="card p-6">
            <p className="text-sm text-muted">&ldquo;{result.question}&rdquo;</p>
            <p className="mt-1 text-xs text-muted/60">ตั้งดวงเมื่อ {result.asked_at_local}</p>
            <NatalWheel3D bodies={result.chart.bodies} ascendant={result.chart.ascendant} />
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium tracking-wide text-muted uppercase">จุดสำคัญ · Key Points</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-accent-gold">ลัคนา · ASC</span>
                  <span className="text-muted">
                    {result.ascendant.sign} ({result.ascendant.degree.toFixed(1)}°)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-2">ดวงจันทร์ · Moon</span>
                  <span className="text-muted">
                    {result.moon.sign} ({result.moon.degree.toFixed(1)}°)
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-medium tracking-wide text-muted uppercase">สมดุลธาตุ · Elements</h3>
              <div className="mt-3">
                <ElementBalance
                  percent={result.elements.percent as never}
                  dominant={result.elements.dominant}
                  lacking={result.elements.lacking}
                  note={result.elements.note}
                />
              </div>
            </div>

            <p className="text-xs text-muted/70">{result.caveat}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
