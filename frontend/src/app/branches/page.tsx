"use client";

import { useState, useEffect } from "react";

type Branch = { name: string; [key: string]: unknown };
type BranchesResponse = { branches: Branch[] };

export default function BranchesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/branches/list", { cache: "no-store" });
        const data = (await res.json()) as BranchesResponse;
        if (!cancelled) setBranches(data.branches);
      } catch {
        if (!cancelled) setError("load failed");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-xl p-8">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Branches</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">List astrological branches from backend.</p>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <div className="mt-6 space-y-2">
          {branches.length === 0 ? (
            <p className="text-sm text-zinc-500">No branches yet. Add seed data in backend.</p>
          ) : (
            branches.map((b, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-black">
                <p className="font-medium text-black dark:text-zinc-50">{String(b.name ?? i)}</p>
                <pre className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{JSON.stringify(b, null, 2)}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
