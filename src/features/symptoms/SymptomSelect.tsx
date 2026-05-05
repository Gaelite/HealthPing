"use client";

import { useLang } from "@/i18n";
import { CATEGORIES } from "@/data/categories";

interface Props {
  categoryId: string;
  selected: string[];
  onToggle: (symptom: string) => void;
}

export function SymptomSelect({ categoryId, selected, onToggle }: Props) {
  const { lang } = useLang();
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;

  const symptoms = category.symptoms[lang];

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-hp-dark mb-2">
        {lang === "es" ? "¿Qué estás sintiendo?" : "What are you feeling?"}
      </p>
      <p className="text-xs text-hp-gray mb-4">
        {lang === "es" ? "Puedes elegir varias opciones." : "You can select multiple options."}
      </p>
      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => onToggle(symptom)}
            className={`text-xs px-3 py-2 rounded-full border font-medium transition-all ${
              selected.includes(symptom)
                ? "border-hp-green bg-hp-green-light text-hp-green-dark"
                : "border-gray-200 bg-white text-hp-gray hover:border-hp-blue"
            }`}
          >
            {selected.includes(symptom) && "✓ "}{symptom}
          </button>
        ))}
      </div>
    </div>
  );
}