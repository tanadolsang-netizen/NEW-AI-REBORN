"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "หน้าแรก", en: "Home" },
  { href: "/dashboard", label: "แดชบอร์ด", en: "Dashboard" },
  { href: "/natal", label: "ดวงกำเนิด", en: "Natal" },
  { href: "/transit", label: "ทรานซิต", en: "Transit" },
  { href: "/synastry", label: "คู่รัก", en: "Synastry" },
  { href: "/tarot", label: "ไพ่ทาโรต์", en: "Tarot" },
  { href: "/horary", label: "ถามดวง", en: "Horary" },
  { href: "/branches", label: "สายวิชา", en: "Branches" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="shrink-0 text-[16px] font-semibold tracking-tight">
          <span className="font-display text-neon">Astral</span>
        </Link>

        <ul className="flex flex-1 items-center justify-center gap-1 overflow-x-auto">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={link.en}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "text-white"
                      : "text-foreground/70 hover:bg-surface-hover hover:text-foreground"
                  }`}
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                          boxShadow: "0 4px 16px -4px var(--glow)",
                        }
                      : undefined
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <ThemeToggle />
      </nav>
    </header>
  );
}
