"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readyPath } from "@/lib/api";
import ThaiZodiacWidget from "@/components/ThaiZodiacWidget";

type Health = { ok: boolean; text: string };

const features = [
  {
    href: "/natal",
    title: "Natal Chart",
    description: "Map the sky at the exact moment you were born.",
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
    title: "Transit Now",
    description: "See where the planets stand at this very moment.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <circle cx="12" cy="12" r="4" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-20 12 12)" />
      </svg>
    ),
  },
  {
    href: "/synastry",
    title: "Synastry",
    description: "Compare two charts to understand a relationship.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <circle cx="9" cy="12" r="5.5" />
        <circle cx="15" cy="12" r="5.5" />
      </svg>
    ),
  },
  {
    href: "/branches",
    title: "Branches",
    description: "Browse astrological traditions and their techniques.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
        <path d="M12 21V9M12 9c0-3 2-5 6-5-1 3.5-3 5-6 5ZM12 13c0-3-2-5-6-5 1 3.5 3 5 6 5Z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [health, setHealth] = useState<Health>({ ok: false, text: "Checking backend…" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(readyPath(), { cache: "no-store" });
        if (cancelled) return;
        setHealth(res.ok ? { ok: true, text: "Backend ready" } : { ok: false, text: `Backend down (${res.status})` });
      } catch {
        if (!cancelled) setHealth({ ok: false, text: "Backend unreachable" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-hero-gradient border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
          <span className="pill">
            <span className={`h-1.5 w-1.5 rounded-full ${health.ok ? "bg-green-500" : "bg-red-500"}`} />
            {health.text}
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Astrology, calculated precisely.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted">
            Natal charts, live transits, and synastry readings — built on
            astronomical data, not guesswork.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn-primary">
              Get started
            </Link>
            <Link href="/natal" className="btn-secondary">
              Compute a natal chart
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Explore the sky
        </h2>
        <p className="mt-2 text-muted">
          Four ways to read the chart, from a single birth to a full comparison.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="card card-hover group flex flex-col gap-3 p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                {f.icon}
              </span>
              <span className="flex items-center gap-1.5 text-[17px] font-medium text-foreground">
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
              <span className="text-sm leading-6 text-muted">{f.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <ThaiZodiacWidget />

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Ready to see your chart?
          </h2>
          <p className="max-w-md text-muted">
            Head to your dashboard for a quick overview, or jump straight into
            a calculation.
          </p>
          <Link href="/dashboard" className="btn-primary mt-2">
            Open dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
