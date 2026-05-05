"use client";

import { useLang } from "@/i18n";
import { RED_FLAGS } from "@/data/redFlags";

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

export function RedFlagCheck({ selected, onToggle }: Props) {
  const { lang } = useLang();

  const handleToggle = (id: string) => {
    if (id === "none") {
      // "None" clears all others
      onToggle("none");
      return;
    }
    // Selecting any flag removes "none"
    if (selected.includes("none")) {
      onToggle("none");
    }
    onToggle(id);
  };

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-hp-dark mb-2">
        {lang === "es" ? "¿Tienes alguna señal de alarma?" : "Do you have any warning signs?"}
      </p>
      <div className="flex flex-wrap gap-2">
        {RED_FLAGS.map((flag) => {
          const isNone = flag.id === "none";
          const isActive = selected.includes(flag.id);
          return (
            <button
              key={flag.id}
              onClick={() => handleToggle(flag.id)}
              className={`text-xs px-3 py-2 rounded-full border font-medium transition-all ${
                isActive
                  ? isNone
                    ? "border-hp-green bg-hp-green-light text-hp-green-dark"
                    : "border-hp-coral bg-hp-coral-light text-hp-coral"
                  : "border-gray-200 bg-white text-hp-gray hover:border-gray-300"
              }`}
            >
              {flag.label[lang]}
            </button>
          );
        })}
      </div>
    </div>
  );
}