"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/natal", label: "Natal" },
  { href: "/transit", label: "Transit" },
  { href: "/synastry", label: "Synastry" },
  { href: "/branches", label: "Branches" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="shrink-0 text-[15px] font-semibold tracking-tight text-foreground"
        >
          Astral
        </Link>

        <ul className="flex flex-1 items-center justify-center gap-1 overflow-x-auto">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-foreground text-background"
                      : "text-foreground/70 hover:bg-surface-hover hover:text-foreground"
                  }`}
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
