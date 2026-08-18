"use client";

import { useState } from "react";

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
      const res = await fetch(`/api/transit/now?${params.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as TransitResponse;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "transit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Transit Now</h1>
      <p className="mt-2 text-muted">Get current transit positions.</p>

      <form onSubmit={compute} className="mt-6 grid grid-cols-2 gap-3">
        {[
          ["tz", "TZ Offset (hrs)", "number"],
          ["lat", "Latitude", "number"],
          ["lon", "Longitude", "number"],
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
          {loading ? "Loading..." : "Get Transit"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {result && (
        <div className="card mt-6 p-5">
          <h2 className="text-lg font-medium text-foreground">Now</h2>
          <p className="text-xs text-muted">{result.now_utc}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-medium text-foreground">Bodies</p>
              <ul className="mt-1 space-y-1">
                {result.bodies.map((b) => (
                  <li key={b.body} className="flex justify-between text-foreground">
                    <span>{b.body}</span>
                    <span className="text-muted">
                      {b.sign} ({b.degree.toFixed(2)}){b.is_retrograde ? " R" : ""}
                    </span>
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
