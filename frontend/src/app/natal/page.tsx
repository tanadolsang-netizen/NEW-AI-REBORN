"use client";

import { useState } from "react";
import { apiPath } from "@/lib/api";

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
      const res = await fetch(apiPath("/natal/compute"), {
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
    <div className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Natal Chart</h1>
      <p className="mt-2 text-muted">Compute a natal chart via backend.</p>

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
            <span className="text-muted">{label}</span>
            <input
              name={name}
              type={type}
              defaultValue={name === "tz" ? "7" : name === "lat" ? "13.8591" : name === "lon" ? "100.5217" : name === "system" ? "tropical" : ""}
              required
              step="any"
              className="input-field"
            />
          </label>
        ))}
        <button type="submit" disabled={loading} className="btn-primary col-span-2 mt-2">
          {loading ? "Computing..." : "Compute"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {result && (
        <div className="card mt-6 p-5">
          <h2 className="text-lg font-medium text-foreground">
            {result.name} — {result.system}
          </h2>
          <p className="text-xs text-muted">{result.datetime_utc}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-medium text-foreground">Ascendant</p>
              <p className="text-muted">{result.ascendant.sign} ({result.ascendant.degree.toFixed(2)})</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Bodies</p>
              <ul className="mt-1 space-y-1">
                {result.bodies.map((b) => (
                  <li key={b.body} className="flex justify-between text-foreground">
                    <span>{b.body}</span>
                    <span className="text-muted">{b.sign} ({b.degree.toFixed(2)})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
