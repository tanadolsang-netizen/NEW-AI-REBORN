import type { Metadata } from "next";
import { Inter, Geist_Mono, Cinzel } from "next/font/google";
import NavBar from "@/components/NavBar";
import Starfield from "@/components/three/Starfield";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Astral — จักรวาลของคุณ ในมือคุณ",
    template: "%s · Astral",
  },
  description:
    "ดวงชะตา ทรานซิต และการเข้ากันของคู่รัก คำนวณด้วยความแม่นยำระดับดาราศาสตร์ — Natal charts, live transits, and synastry readings, calculated with astronomical precision.",
  icons: { icon: "/favicon.ico" },
};

const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var t=s==="light"?"light":"dark";if(t==="dark")document.documentElement.classList.add("dark");}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="relative flex min-h-full flex-col bg-background text-foreground">
        <Starfield />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <NavBar />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}
