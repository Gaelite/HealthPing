"use client";

import { useLang } from "@/i18n";
import { CATEGORIES, type SymptomCategory } from "@/data/categories";

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function CategorySelect({ selected, onSelect }: Props) {
  const { lang } = useLang();

  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-hp-dark mb-2">
        {lang === "es" ? "¿Dónde o qué te molesta hoy?" : "Where or what bothers you today?"}
      </p>
      <p className="text-xs text-hp-gray mb-4">
        {lang === "es"
          ? "Elige una opción para mostrarte lugares adecuados y costos aproximados. No damos diagnósticos."
          : "Choose an option to show you suitable places and approximate costs. We don't diagnose."}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {CATEGORIES.map((cat: SymptomCategory) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`text-left p-3 rounded-xl border-2 transition-all ${
              selected === cat.id
                ? "border-hp-green bg-hp-green-light"
                : "border-gray-200 bg-white hover:border-hp-blue-mid"
            }`}
          >
            <span className="text-sm font-medium text-hp-dark">{cat.label[lang]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}