"use client";

import { useLang } from "@/i18n";
import { ProgressBar } from "@/components/ui/Badges";
import { CategorySelect } from "./CategorySelect";
import { SymptomSelect } from "./SymptomSelect";
import { PainScale } from "./PainScale";
import { RedFlagCheck } from "./RedFlagCheck";
import { PatientInfo } from "./PatientInfo";

interface SymptomFlowProps {
  category: string | null; setCategory: (v: string | null) => void;
  symptoms: string[]; setSymptoms: (v: string[]) => void;
  painScore: number; setPainScore: (v: number) => void;
  redFlagIds: string[]; setRedFlagIds: (v: string[]) => void;
  riskFactorIds: string[]; setRiskFactorIds: (v: string[]) => void;
  age: string; setAge: (v: string) => void;
  sex: string | null; setSex: (v: string) => void;
  hasInsurance: boolean | null; setHasInsurance: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SymptomFlow({
  category, setCategory,
  symptoms, setSymptoms,
  painScore, setPainScore,
  redFlagIds, setRedFlagIds,
  riskFactorIds, setRiskFactorIds,
  age, setAge,
  sex, setSex,
  hasInsurance, setHasInsurance,
  onNext, onBack,
}: SymptomFlowProps) {
  const { lang, t } = useLang();

  const painTerms = [
    "Dolor abdominal", "Abdominal pain",
    "Dolor/presión en pecho", "Chest pain/pressure",
    "Dolor de cabeza", "Headache",
    "Dolor espalda baja", "Lower back pain",
    "Dolor pélvico", "Pelvic pain",
    "Dolor articular", "Joint pain",
    "Dolor tipo cólico", "Colic-type pain",
    "Ardor al orinar", "Burning urination",
  ];
  const showPain = symptoms.some((s) => painTerms.includes(s));

  const toggleSymptom = (s: string) => setSymptoms(
    symptoms.includes(s) ? symptoms.filter((x) => x !== s) : [...symptoms, s]
  );

  const toggleRedFlag = (id: string) => {
    if (id === "none") { setRedFlagIds(["none"]); return; }
    const without = redFlagIds.filter((x) => x !== "none");
    setRedFlagIds(without.includes(id) ? without.filter((x) => x !== id) : [...without, id]);
  };

  const toggleRisk = (id: string) => setRiskFactorIds(
    riskFactorIds.includes(id) ? riskFactorIds.filter((x) => x !== id) : [...riskFactorIds, id]
  );

  const canSubmit = category && symptoms.length > 0;

  return (
    <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
      <div className="max-w-lg mx-auto">
        <ProgressBar current={1} total={3} />

        <h2 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-1">
          {lang === "es" ? "Me siento mal" : "I feel sick"}
        </h2>
        <p className="text-xs text-hp-gray mb-8">
          {lang === "es"
            ? "No damos diagnósticos. Orientamos atención, costos aproximados y lugares capaces."
            : "We don't diagnose. We guide care, approximate costs and capable locations."}
        </p>

        {/* Step 1: Category */}
        <CategorySelect selected={category} onSelect={(id) => { 
          setCategory(id); 
          setSymptoms([]); 
          setPainScore(0);
          if (id === "gyne") setSex("female");
        }} />

        {/* Step 2: Symptoms (appears after category) */}
        {category && (
          <SymptomSelect categoryId={category} selected={symptoms} onToggle={toggleSymptom} />
        )}

        {/* Step 3: Pain scale (conditional) */}
        {category && symptoms.length > 0 && showPain && (
          <PainScale value={painScore} onChange={setPainScore} />
        )}

        {/* Step 4: Red flags (appears after symptoms) */}
        {category && symptoms.length > 0 && (
          <RedFlagCheck selected={redFlagIds} onToggle={toggleRedFlag} />
        )}

        {/* Step 5: Patient info */}
        {category && symptoms.length > 0 && (
          <PatientInfo
            age={age} setAge={setAge}
            sex={sex} setSex={setSex}
            hasInsurance={hasInsurance} setHasInsurance={setHasInsurance}
            riskFactors={riskFactorIds} onToggleRisk={toggleRisk}
            categoryId={category}
          />
        )}

        {/* Submit */}
        <button
          onClick={onNext}
          disabled={!canSubmit}
          className="w-full mt-8 bg-hp-navy text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-40"
        >
          {t.next}
        </button>
        <button onClick={onBack} className="w-full mt-3 text-sm text-hp-gray py-2">
          {t.back}
        </button>
      </div>
    </section>
  );
}