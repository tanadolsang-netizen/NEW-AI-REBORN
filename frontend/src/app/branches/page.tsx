"use client";

import { useState, useEffect } from "react";
import { apiPath } from "@/lib/api";

type Branch = { name: string; [key: string]: unknown };
type BranchesResponse = { branches: Branch[] };

export default function BranchesPage() {
  const [error, setError] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiPath("/branches/list"), { cache: "no-store" });
        const data = (await res.json()) as BranchesResponse;
        if (!cancelled) setBranches(data.branches);
      } catch {
        if (!cancelled) setError("load failed");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Branches</h1>
      <p className="mt-2 text-muted">List astrological branches from backend.</p>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <div className="mt-6 space-y-2">
        {branches.length === 0 ? (
          <div className="card p-5 text-sm text-muted">No branches yet. Add seed data in backend.</div>
        ) : (
          branches.map((b, i) => (
            <div key={i} className="card p-4">
              <p className="font-medium text-foreground">{String(b.name ?? i)}</p>
              <pre className="mt-1 overflow-auto font-mono text-xs text-muted">{JSON.stringify(b, null, 2)}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
