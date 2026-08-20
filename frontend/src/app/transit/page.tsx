"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { apiPath } from "@/lib/api";

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

export default function TransitPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TransitResponse | null>(null);

  async function compute(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.set("tz", String(fd.get("tz") || 7));
    params.set("lat", String(fd.get("lat") || 13.8591));
    params.set("lon", String(fd.get("lon") || 100.5217));
    try {
      const res = await fetch(`${apiPath("/transit/now")}?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`โหลดทรานซิตไม่สำเร็จ (${res.status})`);
      const data = (await res.json()) as TransitResponse;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "โหลดทรานซิตไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="pill">ทรานซิต · Transit</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
          ท้องฟ้า<span className="text-neon">ตอนนี้</span>
        </h1>
        <p className="mt-2 text-muted">ดูตำแหน่งดาวเคราะห์ ณ วินาทีนี้ จากสถานที่ที่คุณระบุ</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={compute}
        className="card mt-6 grid grid-cols-2 gap-3 p-6"
      >
        {[
          ["tz", "เขตเวลา (ชม.)", "number"],
          ["lat", "ละติจูด", "number"],
          ["lon", "ลองจิจูด", "number"],
        ].map(([name, label, type]) => (
          <label key={name} className="flex flex-col gap-1 text-sm">
            <span className="text-muted">{label}</span>
            <input
              name={name}
              type={type}
              defaultValue={name === "tz" ? "7" : name === "lat" ? "13.8591" : "100.5217"}
              required
              step="any"
              className="input-field"
            />
          </label>
        ))}
        <button type="submit" disabled={loading} className="btn-primary col-span-2 mt-2">
          {loading ? "กำลังโหลด…" : "ดูทรานซิต"}
        </button>
      </motion.form>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card mt-6 p-6"
        >
          <h2 className="text-lg font-medium">ตอนนี้ · Now</h2>
          <p className="text-xs text-muted">{result.now_utc}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {result.bodies.map((b) => (
              <li key={b.body} className="flex justify-between">
                <span>{b.body}</span>
                <span className="text-muted">
                  {b.sign} ({b.degree.toFixed(2)}°){b.is_retrograde ? " R" : ""}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
