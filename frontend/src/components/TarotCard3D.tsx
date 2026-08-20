"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type DrawnCard = {
  position: string;
  card: string;
  arcana: "major" | "minor";
  orientation: "upright" | "reversed";
  meaning: string;
};

export default function TarotCard3D({ card, delay = 0 }: { card: DrawnCard; delay?: number }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const reversed = card.orientation === "reversed";

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-widest text-muted">{card.position}</p>

      <div className="[perspective:1400px]" style={{ width: 168, height: 264 }}>
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          {/* back face — shown before reveal */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-accent/30 bg-hero-gradient [backface-visibility:hidden]">
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-void-2/60">
              <span className="animate-pulse-glow text-4xl text-accent">✦</span>
              <span className="font-display text-[11px] tracking-[0.35em] text-muted">ASTRAL</span>
            </div>
          </div>

          {/* front face — revealed card */}
          <div className="glow-ring absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-accent/40 bg-void-2 p-4 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span
              className="text-3xl text-accent-gold"
              style={{ transform: reversed ? "rotate(180deg)" : undefined }}
            >
              {card.arcana === "major" ? "★" : "◆"}
            </span>
            <p
              className="text-sm leading-snug font-semibold text-foreground"
              style={{ transform: reversed ? "rotate(180deg)" : undefined }}
            >
              {card.card}
            </p>
            {reversed && (
              <span className="pill border-accent-gold/40 !py-0.5 text-[10px] text-accent-gold">
                กลับหัว · Reversed
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {flipped && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="max-w-[190px] text-center text-xs text-muted"
        >
          {card.meaning}
        </motion.p>
      )}
    </div>
  );
}
