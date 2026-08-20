"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { apiPath } from "@/lib/api";
import TarotCard3D, { type DrawnCard } from "@/components/TarotCard3D";
import ElementBalance from "@/components/ElementBalance";

type ElementBlock = {
  scores: Record<string, number>;
  percent: Record<string, number>;
  dominant: string;
  lacking: string;
  tarot_suits: Record<string, string>;
  note: string;
};

type TarotResponse = {
  name: string;
  spread: string;
  cards: DrawnCard[];
  tilted_toward: string | null;
  elements: ElementBlock | null;
  caveat: string;
};

const SPREADS = [
  { value: "single", th: "ไพ่ใบเดียว", en: "Single" },
  { value: "three_card", th: "สามใบ อดีต–ปัจจุบัน–อนาคต", en: "Three Card" },
  { value: "celtic_cross", th: "กางเขนเซลติก", en: "Celtic Cross" },
];

const CROSS_AREAS: Array<{ area: string; style?: React.CSSProperties }> = [
  { area: "center" },
  { area: "cross" },
  { area: "found" },
  { area: "past" },
  { area: "crown" },
  { area: "future" },
  { area: "self" },
  { area: "env" },
  { area: "hopes" },
  { area: "outcome" },
];

function SpreadLayout({ cards }: { cards: DrawnCard[] }) {
  if (cards.length === 10) {
    return (
      <div
        className="mx-auto grid w-full max-w-4xl gap-x-6 gap-y-10"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gridTemplateAreas: `
            ".    crown  .      outcome"
            "past center future hopes"
            ".    found  .      env"
            ".    .      .      self"
          `,
        }}
      >
        {cards.map((c, i) => {
          const { area } = CROSS_AREAS[i] ?? { area: undefined };
          if (i === 1) {
            return (
              <div key={i} style={{ gridArea: "center" }} className="relative flex items-center justify-center">
                <div className="pointer-events-none absolute rotate-90 scale-90 opacity-90">
                  <TarotCard3D card={c} delay={i * 550} />
                </div>
              </div>
            );
          }
          return (
            <div key={i} style={{ gridArea: area }} className="flex items-center justify-center">
              <TarotCard3D card={c} delay={i * 550} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {cards.map((c, i) => (
        <TarotCard3D key={i} card={c} delay={i * 550} />
      ))}
    </div>
  );
}

export default function TarotPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TarotResponse | null>(null);
  const [includeBirth, setIncludeBirth] = useState(false);

  async function draw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);

    const payload: Record<string, unknown> = {
      name: String(fd.get("name") || ""),
      spread: String(fd.get("spread") || "three_card"),
    };

    if (includeBirth) {
      payload.birth = {
        date: String(fd.get("date") || ""),
        time: String(fd.get("time") || ""),
        tz_offset_hours: Number(fd.get("tz") || 7),
        lat: Number(fd.get("lat") || 13.8591),
        lon: Number(fd.get("lon") || 100.5217),
        system: String(fd.get("system") || "tropical"),
      };
    }

    try {
      const res = await fetch(apiPath("/tarot/draw"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`เปิดไพ่ไม่สำเร็จ (${res.status})`);
      const data = (await res.json()) as TarotResponse;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เปิดไพ่ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="pill">ไพ่ทาโรต์ · Tarot</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
          เปิด<span className="text-neon">ไพ่</span> ฟังเสียงจักรวาล
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          ตั้งจิตนิ่ง ๆ ใส่ชื่อของคุณ เลือกรูปแบบการเปิดไพ่ แล้วปล่อยให้จักรวาลเลือกไพ่ให้
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={draw}
        className="card mt-8 space-y-4 p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">
              ชื่อผู้ถาม <span className="text-muted/60">· Name</span>
            </span>
            <input name="name" type="text" required maxLength={120} className="input-field" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">
              รูปแบบไพ่ <span className="text-muted/60">· Spread</span>
            </span>
            <select name="spread" defaultValue="three_card" className="input-field">
              {SPREADS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.th} · {s.en}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={includeBirth}
            onChange={(e) => setIncludeBirth(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          ใส่ข้อมูลวันเกิด เพื่อวิเคราะห์ธาตุประจำตัวร่วมด้วย
        </label>

        {includeBirth && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3"
          >
            {[
              ["date", "วันเกิด", "date"],
              ["time", "เวลาเกิด", "time"],
              ["tz", "เขตเวลา", "number"],
              ["lat", "ละติจูด", "number"],
              ["lon", "ลองจิจูด", "number"],
            ].map(([name, label, type]) => (
              <label key={name} className="flex flex-col gap-1 text-xs">
                <span className="text-muted">{label}</span>
                <input
                  name={name}
                  type={type}
                  step="any"
                  defaultValue={name === "tz" ? "7" : name === "lat" ? "13.8591" : name === "lon" ? "100.5217" : ""}
                  className="input-field"
                />
              </label>
            ))}
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted">ระบบ</span>
              <select name="system" defaultValue="tropical" className="input-field">
                <option value="tropical">Tropical</option>
                <option value="sidereal">Sidereal</option>
              </select>
            </label>
          </motion.div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
          {loading ? "กำลังเปิดไพ่…" : "เปิดไพ่"}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </motion.form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 space-y-8"
        >
          <div className="text-center">
            <h2 className="text-lg font-medium">
              {result.name} <span className="text-muted">· {SPREADS.find((s) => s.value === result.spread)?.th}</span>
            </h2>
            {result.tilted_toward && (
              <p className="mt-1 text-sm text-accent-gold">ไพ่ชุดนี้เอนเอียงไปทาง {result.tilted_toward}</p>
            )}
          </div>

          <div className="overflow-x-auto py-4">
            <SpreadLayout cards={result.cards} />
          </div>

          {result.elements && (
            <div className="card mx-auto max-w-xl p-6">
              <h3 className="text-sm font-medium tracking-wide text-muted uppercase">
                สมดุลธาตุ · Elemental Balance
              </h3>
              <div className="mt-4">
                <ElementBalance
                  percent={result.elements.percent as never}
                  dominant={result.elements.dominant}
                  lacking={result.elements.lacking}
                  note={result.elements.note}
                />
              </div>
            </div>
          )}

          <p className="mx-auto max-w-xl text-center text-xs text-muted/70">{result.caveat}</p>
        </motion.div>
      )}
    </div>
  );
}
