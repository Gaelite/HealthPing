"use client";

import { useLang } from "@/i18n";
import type { EnrichedHospital } from "@/data/types";
import HospitalMap from "@/components/map/HospitalMap";
import { HospitalCard } from "./HospitalCard";

interface ResultsScreenProps {
  hospitals: EnrichedHospital[];
  insurer: string | null; setInsurer: (v: string | null) => void;
  convenio: boolean; setConvenio: (v: boolean) => void;
  sortBy: string; setSortBy: (v: string) => void;
  expanded: number | null; setExpanded: (v: number | null) => void;
  userLat: number | null; userLng: number | null;
  onSelectHospital: (id: number) => void;
  onRequestAppt: (id: number) => void;
  onBack: () => void;
}

export function ResultsScreen({ hospitals, insurer, setInsurer, convenio, setConvenio, sortBy, setSortBy, expanded, setExpanded, userLat, userLng, onSelectHospital, onRequestAppt, onBack }: ResultsScreenProps) {
  const { lang, t } = useLang();

  return (
    <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
      <div className="max-w-3xl mx-auto mt-4">
        {/* Map */}
        <div className="mb-5">
          <HospitalMap
            hospitals={hospitals.filter((h) => h.type === "hospital").map((h) => ({ id: h.id, name: h.name, lat: h.lat, lng: h.lng, isPremium: h.prem, level: h.level, depositRange: h.ap[lang] }))}
            userLat={userLat} userLng={userLng} onSelectHospital={onSelectHospital}
          />
        </div>

        {/* Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">{t.resultsTitle}</h2>
            <p className="text-sm text-hp-gray mt-1">{hospitals.length} {t.options}{insurer && insurer !== "__other" ? ` · ${insurer}` : ""}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {insurer && insurer !== "__other" && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-hp-blue-light border border-hp-blue/20 text-hp-blue font-medium flex items-center gap-1.5">
              🛡️ {insurer}<button onClick={() => setInsurer(null)} className="ml-1 hover:text-hp-coral">✕</button>
            </span>
          )}
          <button onClick={() => setConvenio(!convenio)} className={`text-xs px-3 py-1.5 rounded-full border ${convenio ? "bg-hp-green-light border-hp-green text-hp-green" : "border-gray-200 bg-white text-hp-gray"}`}>
            {convenio ? `${t.onlyConvenio} ✓` : t.onlyConvenio}
          </button>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white">
            <option value="distance">{t.closest}</option><option value="cost">{t.cheapest}</option>
            <option value="rating">{t.bestRated}</option><option value="transparency">{t.mostTransp}</option>
          </select>
        </div>

        {/* Hospital list */}
        <div className="flex flex-col gap-3">
          {hospitals.map((h) => (
            <HospitalCard key={h.id} hospital={h} insurer={insurer} isExpanded={expanded === h.id}
              onToggleExpand={() => setExpanded(expanded === h.id ? null : h.id)}
              onRequestAppt={() => onRequestAppt(h.id)} />
          ))}
          {hospitals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-hp-gray">{t.noResults}</p>
              <button onClick={() => { setConvenio(false); setInsurer(null); }} className="mt-3 text-xs text-hp-blue hover:underline">{t.clearFilters}</button>
            </div>
          )}
        </div>
        <button onClick={onBack} className="w-full mt-6 text-sm text-hp-gray py-2">{t.back}</button>
      </div>
    </section>
  );
}
