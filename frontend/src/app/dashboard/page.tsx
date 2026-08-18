"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiPath } from "@/lib/api";

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
  {
    href: "/natal",
    title: "New natal chart",
    description: "Compute a birth chart from date, time, and place.",
  },
  {
    href: "/synastry",
    title: "Compare synastry",
    description: "See cross-aspects between two charts.",
  },
  {
    href: "/branches",
    title: "Browse branches",
    description: "Explore astrological traditions and techniques.",
  },
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
      const data = (await res.json()) as { recent: RecentChart[] };
      setRecent(data.recent);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "load failed");
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
        if (!cancelled) setTransitError("Transit unavailable");
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
    { label: "Recent charts", value: recent.length > 0 ? String(recent.length) : "—" },
    { label: "Bodies tracked", value: transit ? String(transit.bodies.length) : "—" },
    { label: "Retrograde now", value: transitLoading ? "—" : String(retrogradeCount) },
    { label: "Systems", value: "2" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted">Overview of your astrological activity.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Recent charts</h2>
            <form onSubmit={loadRecent}>
              <button type="submit" disabled={loading} className="btn-secondary h-9 px-4 text-[13px]">
                {loading ? "Loading…" : "Load recent"}
              </button>
            </form>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-4 space-y-2">
            {recent.length === 0 ? (
              <div className="card p-5 text-sm text-muted">
                No charts loaded yet. Click &ldquo;Load recent&rdquo; to fetch history.
              </div>
            ) : (
              recent.map((r) => (
                <div key={`${r.name}-${r.datetime_utc}`} className="card card-hover p-4">
                  <p className="font-medium text-foreground">{r.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{r.datetime_utc}</p>
                  <p className="mt-1 text-sm text-muted">{r.system}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground">Today&rsquo;s transit</h2>
          <div className="mt-4 card p-5">
            {transitLoading ? (
              <p className="text-sm text-muted">Loading current sky positions…</p>
            ) : transitError ? (
              <p className="text-sm text-red-500">{transitError}</p>
            ) : transit ? (
              <>
                <p className="text-xs text-muted">{transit.now_utc}</p>
                <ul className="mt-3 space-y-1.5">
                  {transit.bodies.slice(0, 6).map((b) => (
                    <li key={b.body} className="flex justify-between text-sm text-foreground">
                      <span>{b.body}</span>
                      <span className="text-muted">
                        {b.sign} ({b.degree.toFixed(1)}°){b.is_retrograde ? " R" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/transit" className="mt-4 inline-block text-sm font-medium text-accent hover:opacity-80">
                  View full transit →
                </Link>
              </>
            ) : null}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-foreground">Quick actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {actions.map((a) => (
            <Link key={a.href} href={a.href} className="card card-hover p-5">
              <p className="font-medium text-foreground">{a.title}</p>
              <p className="mt-1 text-sm text-muted">{a.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
