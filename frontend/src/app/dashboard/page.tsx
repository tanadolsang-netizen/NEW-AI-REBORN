"use client";

import { useState } from "react";

type ChartRow = { body: string; sign: string; degree: number };

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<
    { name: string; datetime_utc: string; system: string }[]
  >([]);

  async function load(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/recent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 5 }),
      });
      const data = (await res.json()) as { recent: typeof recent };
      setRecent(data.recent);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "load failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-2xl p-8">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Overview of your astrological activity.
        </p>

        <form onSubmit={load} className="mt-6">
          <button
            type="submit"
            className="h-11 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Load recent
          </button>
        </form>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {recent.length > 0 && (
          <div className="mt-6 space-y-2">
            {recent.map((r) => (
              <div
                key={`${r.name}-${r.datetime_utc}`}
                className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black"
              >
                <p className="font-medium text-black dark:text-zinc-50">
                  {r.name}
                </p>
                <p className="text-xs text-zinc-500">{r.datetime_utc}</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {r.system}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
