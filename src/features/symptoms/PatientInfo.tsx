"use client";

import { useLang } from "@/i18n";
import { RISK_FACTORS } from "@/data/redFlags";

interface Props {
  age: string;
  setAge: (v: string) => void;
  sex: string | null;
  setSex: (v: string) => void;
  hasInsurance: boolean | null;
  setHasInsurance: (v: boolean) => void;
  riskFactors: string[];
  onToggleRisk: (id: string) => void;
}

export function PatientInfo({ age, setAge, sex, setSex, hasInsurance, setHasInsurance, riskFactors, onToggleRisk }: Props) {
  const { lang, t } = useLang();

  return (
    <div className="space-y-6">
      {/* Age + Sex */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-hp-dark mb-3">{t.age}</p>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-hp-dark mb-3">{t.sex}</p>
          <div className="flex gap-1.5">
            {([["male", t.male], ["female", t.female]] as [string, string][]).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setSex(v)}
                className={`flex-1 text-[11px] px-1 py-3 rounded-xl border-2 font-medium ${
                  sex === v ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Risk factors */}
      <div>
        <p className="text-sm font-semibold text-hp-dark mb-2">
          {lang === "es" ? "¿Algún factor de riesgo?" : "Any risk factors?"}
        </p>
        <p className="text-xs text-hp-gray mb-3">
          {lang === "es" ? "Opcional. Ayuda a priorizar tu orientación." : "Optional. Helps prioritize your guidance."}
        </p>
        <div className="flex flex-wrap gap-2">
          {RISK_FACTORS.map((rf) => (
            <button
              key={rf.id}
              onClick={() => onToggleRisk(rf.id)}
              className={`text-xs px-3 py-2 rounded-full border font-medium ${
                riskFactors.includes(rf.id)
                  ? "border-hp-amber bg-hp-amber-light text-hp-amber"
                  : "border-gray-200 bg-white text-hp-gray"
              }`}
            >
              {rf.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Insurance toggle */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-sm font-semibold text-hp-dark mb-4">{t.hasIns}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setHasInsurance(true)}
            className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm ${
              hasInsurance === true ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-hp-light text-hp-gray"
            }`}
          >
            {t.yes}
          </button>
          <button
            onClick={() => setHasInsurance(false)}
            className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm ${
              hasInsurance === false ? "border-hp-navy bg-hp-blue-light text-hp-navy" : "border-gray-200 bg-hp-light text-hp-gray"
            }`}
          >
            {t.no}
          </button>
        </div>
      </div>
    </div>
  );
}