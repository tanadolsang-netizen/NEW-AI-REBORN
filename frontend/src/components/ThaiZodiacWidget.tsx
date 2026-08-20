"use client";

import { useMemo, useState } from "react";
import { buddhistYear, thaiZodiacForYear } from "@/lib/thaiZodiac";

type Lang = "en" | "th";

const COPY = {
  en: {
    eyebrow: "Thai zodiac (ปีนักษัตร)",
    title: "Find your Thai year animal",
    subtitle:
      "A 12-year cycle rooted in Thai and Buddhist tradition, alongside your Western sun sign — not a replacement for it.",
    label: "Birth year",
    buddhist: "Buddhist year",
    langToggle: "ไทย",
  },
  th: {
    eyebrow: "ปีนักษัตรไทย",
    title: "ค้นหาปีนักษัตรของคุณ",
    subtitle:
      "วงจร 12 ปีตามความเชื่อไทยและพุทธศาสนา ใช้คู่กับราศีตะวันตกของคุณได้ ไม่ใช่สิ่งทดแทนกัน",
    label: "ปีเกิด (ค.ศ.)",
    buddhist: "ปี พ.ศ.",
    langToggle: "EN",
  },
} as const;

export default function ThaiZodiacWidget() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear - 25);
  const [lang, setLang] = useState<Lang>("th");

  const animal = useMemo(() => thaiZodiacForYear(year), [year]);
  const t = COPY[lang];

  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="pill">{t.eyebrow}</span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              {t.title}
            </h2>
            <p className="mt-2 max-w-lg text-muted">{t.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setLang((l) => (l === "en" ? "th" : "en"))}
            className="btn-secondary shrink-0"
          >
            {t.langToggle}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,260px)_1fr]">
          <div className="card p-6">
            <label htmlFor="thai-zodiac-year" className="text-sm font-medium text-muted">
              {t.label}
            </label>
            <input
              id="thai-zodiac-year"
              type="number"
              inputMode="numeric"
              className="input-field mt-2"
              value={year}
              min={1900}
              max={currentYear}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (!Number.isNaN(next)) setYear(next);
              }}
            />
            <p className="mt-3 text-sm text-muted">
              {t.buddhist}: <span className="text-foreground">{buddhistYear(year)}</span>
            </p>
          </div>

          <div className="card flex items-center gap-5 p-6">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/10 text-3xl">
              {animal.emoji}
            </span>
            <div>
              <p className="text-xl font-semibold text-foreground">
                {lang === "th" ? animal.th : animal.en}
                <span className="ml-2 text-sm font-normal text-muted">
                  {lang === "th" ? animal.en : animal.th}
                </span>
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {lang === "th" ? animal.traitsTh : animal.traitsEn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
