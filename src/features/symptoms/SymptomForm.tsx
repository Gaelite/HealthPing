"use client";

import { useLang } from "@/i18n";
import { BODY_ZONES, EXTRA_SYMPTOMS, SINCE_OPTIONS } from "@/data/constants";
import { ProgressBar } from "@/components/ui/Badges";

interface SymptomFormProps {
  zone: string | null; setZone: (z: string) => void;
  pain: number; setPain: (p: number) => void;
  extra: string[]; setExtra: (fn: (prev: string[]) => string[]) => void;
  since: string | null; setSince: (s: string) => void;
  age: string; setAge: (a: string) => void;
  sex: string | null; setSex: (s: string) => void;
  hasInsurance: boolean | null; setHasInsurance: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SymptomForm({ zone, setZone, pain, setPain, extra, setExtra, since, setSince, age, setAge, sex, setSex, hasInsurance, setHasInsurance, onNext, onBack }: SymptomFormProps) {
  const { lang, t } = useLang();

  return (
    <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
      <div className="max-w-lg mx-auto">
        <ProgressBar current={1} total={3} />
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-1">{t.sympTitle}</h2>
        <p className="text-base text-hp-gray mb-8">{t.sympSub}</p>

        {/* Body zone */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-hp-dark mb-3">{t.whereHurt}</p>
          <div className="grid grid-cols-4 gap-2">
            {BODY_ZONES.map((z) => (
              <button key={z.id} onClick={() => setZone(z.id)} className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 ${zone === z.id ? "border-hp-green bg-hp-green-light" : "border-gray-200 bg-white"}`}>
                <span className="text-xl">{z.emoji}</span>
                <span className="text-[11px] font-medium">{z[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pain level */}
        <div className="mb-6">
          <div className="flex justify-between mb-3">
            <p className="text-sm font-semibold text-hp-dark">{t.howBad}</p>
            <span className={`text-sm font-bold ${pain >= 7 ? "text-hp-coral" : pain >= 4 ? "text-hp-amber" : "text-hp-green"}`}>{pain}/10</span>
          </div>
          <input type="range" min={1} max={10} value={pain} onChange={(e) => setPain(+e.target.value)} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-hp-green" style={{ background: "linear-gradient(to right,#16A085,#F39C12 50%,#E74C3C)" }} />
          <div className="flex justify-between text-[10px] text-hp-gray mt-1"><span>{t.mild}</span><span>{t.moderate}</span><span>{t.intense}</span></div>
        </div>

        {/* Extra symptoms */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-hp-dark mb-3">{t.whatElse}</p>
          <div className="flex flex-wrap gap-2">
            {EXTRA_SYMPTOMS[lang].map((s) => (
              <button key={s} onClick={() => setExtra((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])} className={`text-xs px-3 py-2 rounded-full border font-medium ${extra.includes(s) ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Since when */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-hp-dark mb-3">{t.sinceWhen}</p>
          <div className="grid grid-cols-4 gap-2">
            {SINCE_OPTIONS[lang].map((o) => (
              <button key={o.id} onClick={() => setSince(o.id)} className={`text-xs px-2 py-3 rounded-xl border-2 font-medium ${since === o.id ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{o.l}</button>
            ))}
          </div>
        </div>

        {/* Age + Sex */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-hp-dark mb-3">{t.age}</p>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green" />
          </div>
          <div>
            <p className="text-sm font-semibold text-hp-dark mb-3">{t.sex}</p>
            <div className="flex gap-1.5">
              {([["male", t.male], ["female", t.female], ["na", t.noSay]] as [string, string][]).map(([v, l]) => (
                <button key={v} onClick={() => setSex(v)} className={`flex-1 text-[11px] px-1 py-3 rounded-xl border-2 font-medium ${sex === v ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Insurance toggle */}
        <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-hp-dark mb-4">{t.hasIns}</p>
          <div className="flex gap-3">
            <button onClick={() => setHasInsurance(true)} className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm ${hasInsurance === true ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-hp-light text-hp-gray"}`}>{t.yes}</button>
            <button onClick={() => setHasInsurance(false)} className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm ${hasInsurance === false ? "border-hp-navy bg-hp-blue-light text-hp-navy" : "border-gray-200 bg-hp-light text-hp-gray"}`}>{t.no}</button>
          </div>
        </div>

        <button onClick={onNext} disabled={!zone} className="w-full bg-hp-navy text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-40">{t.next}</button>
        <button onClick={onBack} className="w-full mt-3 text-sm text-hp-gray py-2">{t.back}</button>
      </div>
    </section>
  );
}
