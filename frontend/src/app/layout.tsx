import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Astral — Astrology, precisely.",
    template: "%s · Astral",
  },
  description:
    "Natal charts, live transits, and synastry readings — calculated with astronomical precision.",
  icons: { icon: "/favicon.ico" },
};

const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var t=s||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");if(t==="dark")document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <NavBar />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
