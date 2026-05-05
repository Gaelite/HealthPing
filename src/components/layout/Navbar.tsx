"use client";

import { useLang } from "@/i18n";

interface NavbarProps {
  onLogoClick: () => void;
}

export function Navbar({ onLogoClick }: NavbarProps) {
  const { lang, t, toggle } = useLang();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-3">
          <img src="/logo-healthping.jpeg" alt="HealthPing" className="h-12 w-auto" />
          <span className="font-[family-name:var(--font-display)] text-2xl text-hp-navy hidden sm:inline">
            Health<span className="text-hp-green">Ping</span>
          </span>
        </button>
        <div className="flex items-center gap-3 text-sm">
          <a href="/verify" className="hidden sm:inline bg-hp-green text-white px-4 py-2 rounded-lg font-medium hover:bg-hp-green-dark">{t.verifyCita}</a>
          <button onClick={toggle} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-hp-blue">
            <span className="text-base">{lang === "es" ? "🇲🇽" : "🇺🇸"}</span>
            <span className="font-medium">{lang === "es" ? "ES" : "EN"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}