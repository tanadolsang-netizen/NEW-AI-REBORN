"use client";

import { motion } from "framer-motion";

type ElementKey = "fire" | "earth" | "air" | "water";

const ORDER: ElementKey[] = ["fire", "earth", "water", "air"];

const META: Record<ElementKey, { th: string; en: string; color: string }> = {
  fire: { th: "ไฟ", en: "Fire", color: "#e8623a" },
  earth: { th: "ดิน", en: "Earth", color: "#2f9e6e" },
  water: { th: "น้ำ", en: "Water", color: "#3a5fd9" },
  air: { th: "ลม", en: "Air", color: "#189aa8" },
};

export default function ElementBalance({
  percent,
  dominant,
  lacking,
  note,
}: {
  percent: Record<ElementKey, number>;
  dominant?: string | null;
  lacking?: string | null;
  note?: string | null;
}) {
  return (
    <div className="space-y-3">
      {ORDER.map((key, i) => {
        const value = Math.max(0, Math.min(100, percent[key] ?? 0));
        const isDominant = dominant === key;
        const isLacking = lacking === key;
        return (
          <div key={key}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                {META[key].th}
                <span className="text-xs text-muted/70">· {META[key].en}</span>
                {isDominant && <span className="pill !py-0 text-[10px] text-accent-gold">เด่น</span>}
                {isLacking && <span className="pill !py-0 text-[10px] text-muted">ขาด</span>}
              </span>
              <span className="tabular-nums text-muted">{value.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-hover">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{
                  background: META[key].color,
                  boxShadow: isDominant ? `0 0 12px ${META[key].color}` : undefined,
                }}
              />
            </div>
          </div>
        );
      })}
      {note && <p className="pt-1 text-xs leading-5 text-muted">{note}</p>}
    </div>
  );
}
