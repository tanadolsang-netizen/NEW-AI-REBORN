import Image from "next/image";
import Link from "next/link";

async function checkHealth() {
  try {
    const res = await fetch("http://127.0.0.1:8000/ready", {
      next: { revalidate: 0 },
    });
    const ok = res.ok;
    const text = ok ? "Backend ready" : `Backend down (${res.status})`;
    return { ok, text };
  } catch {
    return { ok: false, text: "Backend unreachable" };
  }
}

export default async function Home() {
  const health = await checkHealth();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Astral Frontend
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Next.js app at <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">D:\AI\astral-backend\frontend</code>
          </p>
          <div className="flex items-center gap-2 text-base">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${health.ok ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-zinc-700 dark:text-zinc-300">{health.text}</span>
          </div>
          <div className="grid grid-cols-1 gap-3 text-base font-medium sm:grid-cols-2">
            <Link
              href="/natal"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Natal Chart
            </Link>
            <Link
              href="/transit"
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              Transit Now
            </Link>
            <Link
              href="/synastry"
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              Synastry
            </Link>
            <Link
              href="/branches"
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              Branches
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
