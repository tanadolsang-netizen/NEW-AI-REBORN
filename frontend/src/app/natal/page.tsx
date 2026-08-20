"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { apiPath } from "@/lib/api";
import NatalWheel3D from "@/components/three/NatalWheel3D";

type Body = { body: string; sign: string; degree: number };
type ChartResponse = {
  name: string;
  datetime_utc: string;
  system: string;
  bodies: Body[];
  ascendant: Body;
};

const FIELDS: Array<[string, string, string, string]> = [
  ["name", "ชื่อ", "Name", "text"],
  ["date", "วันเกิด", "Date", "date"],
  ["time", "เวลาเกิด", "Time", "time"],
  ["tz", "เขตเวลา (ชม.)", "TZ Offset", "number"],
  ["lat", "ละติจูด", "Latitude", "number"],
  ["lon", "ลองจิจูด", "Longitude", "number"],
];

export default function NatalPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ChartResponse | null>(null);

  async function compute(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      date: String(fd.get("date") || ""),
      time: String(fd.get("time") || ""),
      tz_offset_hours: Number(fd.get("tz") || 7),
      lat: Number(fd.get("lat") || 13.8591),
      lon: Number(fd.get("lon") || 100.5217),
      system: String(fd.get("system") || "tropical"),
    };
    try {
      const res = await fetch(apiPath("/natal/compute"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`คำนวณไม่สำเร็จ (${res.status})`);
      const data = (await res.json()) as ChartResponse;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "คำนวณไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="pill">ดวงกำเนิด · Natal Chart</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
          <span className="text-neon">แผนที่ท้องฟ้า</span>ในวันที่คุณเกิด
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          กรอกวัน เวลา และสถานที่เกิด เพื่อคำนวณตำแหน่งดาวเคราะห์ทั้งหมดจากข้อมูลดาราศาสตร์จริง
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={compute}
          className="card h-fit space-y-3 p-6"
        >
          {FIELDS.map(([name, labelTh, labelEn, type]) => (
            <label key={name} className="flex flex-col gap-1 text-sm">
              <span className="text-muted">
                {labelTh} <span className="text-muted/60">· {labelEn}</span>
              </span>
              <input
                name={name}
                type={type}
                defaultValue={
                  name === "tz" ? "7" : name === "lat" ? "13.8591" : name === "lon" ? "100.5217" : ""
                }
                required
                step="any"
                className="input-field"
              />
            </label>
          ))}
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">
              ระบบ <span className="text-muted/60">· System</span>
            </span>
            <select name="system" defaultValue="tropical" className="input-field">
              <option value="tropical">Tropical</option>
              <option value="sidereal">Sidereal</option>
            </select>
          </label>
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
            {loading ? "กำลังคำนวณ…" : "คำนวณดวง"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </motion.form>

        <div className="min-h-[420px]">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="card p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-medium">
                  {result.name} <span className="text-muted">· {result.system}</span>
                </h2>
                <p className="text-xs text-muted">{result.datetime_utc}</p>
              </div>

              <NatalWheel3D bodies={result.bodies} ascendant={result.ascendant} />

              <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-medium text-accent-gold">
                    ลัคนา <span className="text-muted">· Ascendant</span>
                  </p>
                  <p className="mt-1 text-muted">
                    {result.ascendant.sign} ({result.ascendant.degree.toFixed(2)}°)
                  </p>
                </div>
                <div>
                  <p className="font-medium">
                    ดาวเคราะห์ <span className="text-muted">· Bodies</span>
                  </p>
                  <ul className="mt-1 space-y-1">
                    {result.bodies.map((b) => (
                      <li key={b.body} className="flex justify-between">
                        <span>{b.body}</span>
                        <span className="text-muted">
                          {b.sign} ({b.degree.toFixed(2)}°)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="card flex h-full min-h-[420px] flex-col items-center justify-center gap-3 p-6 text-center text-muted">
              <span className="animate-pulse-glow text-4xl text-accent">✦</span>
              <p>กรอกข้อมูลด้านซ้ายแล้วกดคำนวณดวง เพื่อดูวงล้อ 3 มิติของคุณที่นี่</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
