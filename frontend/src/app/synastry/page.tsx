"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { apiPath } from "@/lib/api";

type ChartResponse = {
  name: string;
  datetime_utc: string;
  system: string;
  bodies: { body: string; sign: string; degree: number }[];
  ascendant: { sign: string; degree: number };
};

type Person = {
  name: string;
  date: string;
  time: string;
  lat: number;
  lon: number;
  tz_offset_hours: number;
};

type CrossAspect = {
  body_a: string;
  body_b: string;
  aspect: string;
  orb: number;
  applying: boolean;
};

type SynastryResponse = {
  a: ChartResponse;
  b: ChartResponse;
  cross_aspects: CrossAspect[];
};

export default function SynastryPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SynastryResponse | null>(null);

  async function compute(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const person = (prefix: string): Person => ({
      name: String(fd.get(`${prefix}_name`) || ""),
      date: String(fd.get(`${prefix}_date`) || ""),
      time: String(fd.get(`${prefix}_time`) || ""),
      lat: Number(fd.get(`${prefix}_lat`) || 13.8591),
      lon: Number(fd.get(`${prefix}_lon`) || 100.5217),
      tz_offset_hours: Number(fd.get(`${prefix}_tz`) || 7),
    });
    const body = { a: person("a"), b: person("b") };
    try {
      const res = await fetch(apiPath("/synastry/cross-aspects"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`เทียบดวงไม่สำเร็จ (${res.status})`);
      const data = (await res.json()) as SynastryResponse;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เทียบดวงไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="pill">ดวงคู่รัก · Synastry</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
          เทียบดวง<span className="text-neon">สองใจ</span>
        </h1>
        <p className="mt-2 text-muted">เปรียบเทียบดวงกำเนิดของสองคน เพื่อเข้าใจพลังงานของความสัมพันธ์</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={compute}
        className="mt-6 space-y-4"
      >
        {[
          { prefix: "a", label: "คนที่หนึ่ง · Person A" },
          { prefix: "b", label: "คนที่สอง · Person B" },
        ].map(({ prefix, label }) => (
          <div key={prefix} className="card p-4">
            <p className="text-sm font-medium">{label}</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                [`${prefix}_name`, "ชื่อ", "text"],
                [`${prefix}_date`, "วันเกิด", "date"],
                [`${prefix}_time`, "เวลาเกิด", "time"],
                [`${prefix}_tz`, "เขตเวลา", "number"],
                [`${prefix}_lat`, "ละติจูด", "number"],
                [`${prefix}_lon`, "ลองจิจูด", "number"],
              ].map(([name, label, type]) => (
                <label key={name} className="flex flex-col gap-1 text-sm">
                  <span className="text-muted">{label}</span>
                  <input
                    name={name}
                    type={type}
                    defaultValue={
                      name.endsWith("_tz") ? "7" : name.endsWith("_lat") ? "13.8591" : name.endsWith("_lon") ? "100.5217" : ""
                    }
                    required
                    step="any"
                    className="input-field"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "กำลังคำนวณ…" : "เทียบดวง"}
        </button>
      </motion.form>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 space-y-4"
        >
          {[result.a, result.b].map((chart, idx) => (
            <div key={idx} className="card p-4">
              <p className="font-medium">
                {chart.name} <span className="text-muted">— {chart.system}</span>
              </p>
              <p className="text-xs text-muted">{chart.datetime_utc}</p>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-accent-gold">ลัคนา · Ascendant</p>
                  <p className="text-muted">
                    {chart.ascendant.sign} ({chart.ascendant.degree.toFixed(2)}°)
                  </p>
                </div>
                <div>
                  <p className="font-medium">ดาวเคราะห์ · Bodies</p>
                  <ul className="mt-1 space-y-1">
                    {chart.bodies.map((b) => (
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
            </div>
          ))}

          <div className="card p-4">
            <h3 className="font-medium">มุมสัมพันธ์ · Cross Aspects</h3>
            <div className="mt-2 max-h-80 overflow-auto text-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-muted">
                    <th className="py-1">A</th>
                    <th className="py-1">B</th>
                    <th className="py-1">มุม</th>
                    <th className="py-1">ออร์บ</th>
                    <th className="py-1">กำลังก่อตัว</th>
                  </tr>
                </thead>
                <tbody>
                  {result.cross_aspects.map((x, i) => (
                    <tr key={i}>
                      <td className="py-1">{x.body_a}</td>
                      <td className="py-1">{x.body_b}</td>
                      <td className="py-1">{x.aspect}</td>
                      <td className="py-1">{x.orb.toFixed(2)}</td>
                      <td className="py-1">{x.applying ? "ใช่" : "ไม่"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
