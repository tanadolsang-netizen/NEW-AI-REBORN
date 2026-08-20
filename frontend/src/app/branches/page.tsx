"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        if (!cancelled) setError("โหลดไม่สำเร็จ");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="pill">สายวิชา · Branches</span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
          สาย<span className="text-neon">วิชา</span>โหราศาสตร์
        </h1>
        <p className="mt-2 text-muted">รายการสายวิชาและเทคนิคจากฐานข้อมูลเซิร์ฟเวอร์</p>
      </motion.div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 space-y-2">
        {branches.length === 0 ? (
          <div className="card p-5 text-sm text-muted">ยังไม่มีสายวิชา — เพิ่มข้อมูลตั้งต้นในฝั่งเซิร์ฟเวอร์</div>
        ) : (
          branches.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card card-hover p-4"
            >
              <p className="font-medium">{String(b.name ?? i)}</p>
              <pre className="mt-1 overflow-auto font-mono text-xs text-muted">{JSON.stringify(b, null, 2)}</pre>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
