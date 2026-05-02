"use client";

import { useLang } from "@/i18n";

/** Hospital level badge (1°, 2°, 3°) or pharmacy pill */
export function LevelBadge({ level, type }: { level: string; type: string }) {
  const { t } = useLang();
  if (type === "pharmacy") return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-hp-amber-light text-hp-amber">💊 {t.pharmacy}</span>;
  const config: Record<string, { label: string; cls: string }> = {
    FIRST: { label: "1°", cls: "bg-hp-green-light text-hp-green" },
    SECOND: { label: "2°", cls: "bg-hp-blue-light text-hp-blue" },
    THIRD: { label: "3°", cls: "bg-hp-blue-light text-hp-navy" },
  };
  const c = config[level] || config.FIRST;
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.cls}`}>{c.label}</span>;
}

/** Transparency dots (1-5 scale) */
export function TransparencyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? "bg-hp-green" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

/** Progress bar with N steps */
export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-8 mt-4">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full ${i < current ? "bg-hp-green" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}
