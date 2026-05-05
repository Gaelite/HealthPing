"use client";

import { useLang } from "@/i18n";
import { FILTER_TAGS, type FilterContext } from "./filterTags";

interface FilterBarProps {
  activeIds: Set<string>;
  onToggle: (id: string) => void;
  onClear: () => void;
  context: FilterContext;
}

export function FilterBar({ activeIds, onToggle, onClear, context }: FilterBarProps) {
  const { lang } = useLang();

  const visible = FILTER_TAGS.filter((tag) => !tag.showIf || tag.showIf(context));

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {visible.map((tag) => {
        const active = activeIds.has(tag.id);
        return (
          <button
            key={tag.id}
            onClick={() => onToggle(tag.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              active
                ? "bg-hp-navy border-hp-navy text-white"
                : "border-gray-200 bg-white text-hp-gray hover:border-hp-blue hover:text-hp-blue"
            }`}
          >
            {tag.emoji && `${tag.emoji} `}{tag.label[lang]}{active && " ✕"}
          </button>
        );
      })}
      {activeIds.size > 0 && (
        <button onClick={onClear} className="text-xs px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-hp-gray hover:text-hp-coral">
          {lang === "es" ? "Limpiar" : "Clear"}
        </button>
      )}
    </div>
  );
}