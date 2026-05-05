"use client";

import { useLang } from "@/i18n";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function PainScale({ value, onChange }: Props) {
  const { lang } = useLang();

  const labels: Record<number, Record<string, string>> = {
    1: { es: "Leve", en: "Mild" },
    4: { es: "Moderado", en: "Moderate" },
    7: { es: "Urgencia recomendada", en: "ER recommended" },
    9: { es: "Atención inmediata", en: "Immediate attention" },
  };

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-hp-dark mb-2">
        {lang === "es" ? "¿Qué tan fuerte es el dolor?" : "How bad is the pain?"}
      </p>
      <div className="grid grid-cols-10 gap-1.5 mb-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
              value === n
                ? n >= 9 ? "border-hp-coral bg-hp-coral text-white"
                : n >= 7 ? "border-hp-coral bg-hp-coral-light text-hp-coral"
                : n >= 4 ? "border-hp-amber bg-hp-amber-light text-hp-amber"
                : "border-hp-green bg-hp-green-light text-hp-green"
                : "border-gray-200 bg-white text-hp-gray hover:border-gray-300"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-hp-gray px-1">
        <span>{labels[1][lang]}</span>
        <span>{labels[4][lang]}</span>
        <span className="text-hp-coral font-medium">{labels[7][lang]}</span>
        <span className="text-hp-coral font-bold">{labels[9][lang]}</span>
      </div>
    </div>
  );
}