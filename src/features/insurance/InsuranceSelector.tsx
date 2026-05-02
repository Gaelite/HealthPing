"use client";

import { useLang } from "@/i18n";
import { INSURERS } from "@/data/constants";
import { ProgressBar } from "@/components/ui/Badges";

interface InsuranceSelectorProps {
  insurer: string | null; setInsurer: (v: string | null) => void;
  otherInsurer: string; setOtherInsurer: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InsuranceSelector({ insurer, setInsurer, otherInsurer, setOtherInsurer, onNext, onBack }: InsuranceSelectorProps) {
  const { lang, t } = useLang();

  return (
    <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
      <div className="max-w-lg mx-auto">
        <ProgressBar current={2} total={3} />
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-1">{t.insTitle}</h2>
        <p className="text-base text-hp-gray mb-8">{t.insSub}</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {INSURERS.map((ins) => (
            <button key={ins} onClick={() => { setInsurer(ins); setOtherInsurer(""); }} className={`text-sm px-4 py-3 rounded-xl border-2 font-medium text-left ${insurer === ins ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{ins}</button>
          ))}
        </div>
        <div className="mb-6">
          <button onClick={() => setInsurer("__other")} className={`w-full text-sm px-4 py-3 rounded-xl border-2 font-medium text-left ${insurer === "__other" ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{t.otherIns}</button>
          {insurer === "__other" && <input value={otherInsurer} onChange={(e) => setOtherInsurer(e.target.value)} placeholder={lang === "es" ? "Escribe tu aseguradora" : "Type your insurer"} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green mt-2" />}
        </div>
        <button onClick={onNext} disabled={!insurer} className="w-full bg-hp-navy text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-40">{t.seeHosp}</button>
        <button onClick={onBack} className="w-full mt-3 text-sm text-hp-gray py-2">{t.back}</button>
      </div>
    </section>
  );
}
