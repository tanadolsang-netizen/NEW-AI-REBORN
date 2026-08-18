"use client";

import { useState } from "react";

type Body = { body: string; sign: string; degree: number };
type ChartResponse = {
  name: string;
  datetime_utc: string;
  system: string;
  bodies: Body[];
  ascendant: Body;
};

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
      const res = await fetch("/api/natal/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ChartResponse;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "compute failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-xl p-8">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Natal Chart</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Compute a natal chart via backend.</p>

        <form onSubmit={compute} className="mt-6 grid grid-cols-2 gap-3">
          {[
            ["name", "Name", "text"],
            ["date", "Date", "date"],
            ["time", "Time", "time"],
            ["tz", "TZ Offset (hrs)", "number"],
            ["lat", "Latitude", "number"],
            ["lon", "Longitude", "number"],
            ["system", "System", "text"],
          ].map(([name, label, type]) => (
            <label key={name} className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
              <input
                name={name}
                type={type}
                defaultValue={name === "tz" ? "7" : name === "lat" ? "13.8591" : name === "lon" ? "100.5217" : name === "system" ? "tropical" : ""}
                required
                step="any"
                className="rounded border border-black/10 bg-white px-3 py-2 text-black dark:border-white/10 dark:bg-black dark:text-zinc-50"
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="col-span-2 mt-2 h-12 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50"
          >
            {loading ? "Computing..." : "Compute"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {result && (
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
            <h2 className="text-lg font-medium text-black dark:text-zinc-50">
              {result.name} — {result.system}
            </h2>
            <p className="text-xs text-zinc-500">{result.datetime_utc}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300">Ascendant</p>
                <p className="text-zinc-900 dark:text-zinc-100">{result.ascendant.sign} ({result.ascendant.degree.toFixed(2)})</p>
              </div>
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300">Bodies</p>
                <ul className="mt-1 space-y-1">
                  {result.bodies.map((b) => (
                    <li key={b.body} className="flex justify-between text-zinc-800 dark:text-zinc-200">
                      <span>{b.body}</span>
                      <span>{b.sign} ({b.degree.toFixed(2)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
