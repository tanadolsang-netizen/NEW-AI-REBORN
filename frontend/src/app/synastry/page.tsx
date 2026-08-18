"use client";

import { useState } from "react";
import { apiPath } from "@/lib/api";

type ChartResponse = {
  name: string;
  datetime_utc: string;
  system: string;
  bodies: { body: string; sign: string; degree: number }[];
  ascendant: { sign: string; degree: number };
};

type Person = {
  name: string;
  date: string;
  time: string;
  lat: number;
  lon: number;
  tz_offset_hours: number;
};

type CrossAspect = {
  body_a: string;
  body_b: string;
  aspect: string;
  orb: number;
  applying: boolean;
};

type SynastryResponse = {
  a: ChartResponse;
  b: ChartResponse;
  cross_aspects: CrossAspect[];
};

export default function SynastryPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SynastryResponse | null>(null);

  async function compute(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const person = (prefix: string): Person => ({
      name: String(fd.get(`${prefix}_name`) || ""),
      date: String(fd.get(`${prefix}_date`) || ""),
      time: String(fd.get(`${prefix}_time`) || ""),
      lat: Number(fd.get(`${prefix}_lat`) || 13.8591),
      lon: Number(fd.get(`${prefix}_lon`) || 100.5217),
      tz_offset_hours: Number(fd.get(`${prefix}_tz`) || 7),
    });
    const body = {
      a: person("a"),
      b: person("b"),
    };
    try {
      const res = await fetch(apiPath("/synastry/cross-aspects"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as SynastryResponse;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "synastry failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Synastry</h1>
      <p className="mt-2 text-muted">Compare two natal charts.</p>

      <form onSubmit={compute} className="mt-6 space-y-4">
        {["a", "b"].map((prefix) => (
          <div key={prefix} className="card p-4">
            <p className="text-sm font-medium text-foreground">Person {prefix.toUpperCase()}</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                [`${prefix}_name`, "Name", "text"],
                [`${prefix}_date`, "Date", "date"],
                [`${prefix}_time`, "Time", "time"],
                [`${prefix}_tz`, "TZ Offset (hrs)", "number"],
                [`${prefix}_lat`, "Latitude", "number"],
                [`${prefix}_lon`, "Longitude", "number"],
              ].map(([name, label, type]) => (
                <label key={name} className="flex flex-col gap-1 text-sm">
                  <span className="text-muted">{label}</span>
                  <input
                    name={name}
                    type={type}
                    defaultValue={name.endsWith("_tz") ? "7" : name.endsWith("_lat") ? "13.8591" : name.endsWith("_lon") ? "100.5217" : ""}
                    required
                    step="any"
                    className="input-field"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Computing..." : "Compute Synastry"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {result && (
        <div className="mt-6 space-y-4">
          {[result.a, result.b].map((chart, idx) => (
            <div key={idx} className="card p-4">
              <p className="font-medium text-foreground">{chart.name} — {chart.system}</p>
              <p className="text-xs text-muted">{chart.datetime_utc}</p>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Ascendant</p>
                  <p className="text-muted">{chart.ascendant.sign} ({chart.ascendant.degree.toFixed(2)})</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Bodies</p>
                  <ul className="mt-1 space-y-1">
                    {chart.bodies.map((b) => (
                      <li key={b.body} className="flex justify-between text-foreground">
                        <span>{b.body}</span>
                        <span className="text-muted">{b.sign} ({b.degree.toFixed(2)})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          <div className="card p-4">
            <h3 className="font-medium text-foreground">Cross Aspects</h3>
            <div className="mt-2 max-h-80 overflow-auto text-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-muted">
                    <th className="py-1">A</th>
                    <th className="py-1">B</th>
                    <th className="py-1">Aspect</th>
                    <th className="py-1">Orb</th>
                    <th className="py-1">Applying</th>
                  </tr>
                </thead>
                <tbody>
                  {result.cross_aspects.map((x, i) => (
                    <tr key={i} className="text-foreground">
                      <td className="py-1">{x.body_a}</td>
                      <td className="py-1">{x.body_b}</td>
                      <td className="py-1">{x.aspect}</td>
                      <td className="py-1">{x.orb.toFixed(2)}</td>
                      <td className="py-1">{x.applying ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
