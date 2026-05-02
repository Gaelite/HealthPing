"use client";

import { useLang } from "@/i18n";

interface HeroProps {
  onFeelSick: () => void;
  onCompare: () => void;
  onSurgery: () => void;
}

export function HeroSection({ onFeelSick, onCompare, onSurgery }: HeroProps) {
  const { t } = useLang();
  return (
    <section className="pt-24 pb-12 px-5 bg-gradient-to-b from-hp-blue-pale to-white">
      <div className="max-w-6xl mx-auto text-center flex flex-col items-center">
        <div className="max-w-2xl">
          <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl leading-[1.05] text-hp-navy mb-6">
            {t.h1a}<br /><span className="italic text-hp-blue">{t.h1b}</span>
          </h1>
          <p className="text-lg sm:text-xl text-hp-gray max-w-lg mb-12 leading-relaxed mx-auto">{t.sub}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onFeelSick} className="flex items-center justify-center gap-3 bg-hp-navy text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-hp-navy/90 hover:shadow-xl transition-all">
              <span className="w-3 h-3 rounded-full bg-hp-coral animate-pulse-ring" />{t.cta1}
            </button>
            <button onClick={onCompare} className="bg-white border-2 border-gray-200 text-hp-dark px-8 py-4 rounded-2xl font-semibold text-base hover:border-hp-blue hover:text-hp-blue transition-all">{t.cta2}</button>
            <button onClick={onSurgery} className="bg-white border-2 border-gray-200 text-hp-dark px-8 py-4 rounded-2xl font-semibold text-base hover:border-hp-green hover:text-hp-green transition-all">🔬 {t.cta3}</button>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          {[{ v: t.stat1, l: t.stat1l }, { v: t.stat2, l: t.stat2l }, { v: t.stat3, l: t.stat3l }].map((s) => (
            <div key={s.l}><p className="font-[family-name:var(--font-display)] text-3xl text-hp-navy">{s.v}</p><p className="text-sm text-hp-gray mt-1">{s.l}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}
