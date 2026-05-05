"use client";

import { useState } from "react";
import { useLang } from "@/i18n";
import { ProgressBar } from "@/components/ui/Badges";
import { CategorySelect } from "./CategorySelect";
import { SymptomSelect } from "./SymptomSelect";
import { PainScale } from "./PainScale";
import { RedFlagCheck } from "./RedFlagCheck";
import { PatientInfo } from "./PatientInfo";
import { calculateUrgency, type ScoringInput } from "@/data/scoring";

interface SymptomFlowProps {
  onComplete: (result: {
    categoryId: string;
    symptoms: string[];
    painScore: number;
    redFlagIds: string[];
    riskFactorIds: string[];
    age: string;
    sex: string | null;
    hasInsurance: boolean | null;
    urgency: ReturnType<typeof calculateUrgency>;
  }) => void;
  onBack: () => void;
}

export function SymptomFlow({ onComplete, onBack }: SymptomFlowProps) {
  const { lang, t } = useLang();

  const [category, setCategory] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [pain, setPain] = useState(0);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<string | null>(null);
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);

  // Pain question is conditional: only show if a pain-related symptom is selected
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

  const toggleSymptom = (s: string) => setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const toggleRedFlag = (id: string) => {
    if (id === "none") {
      setRedFlags(["none"]);
      return;
    }
    setRedFlags((prev) => {
      const without = prev.filter((x) => x !== "none");
      return without.includes(id) ? without.filter((x) => x !== id) : [...without, id];
    });
  };

  const toggleRisk = (id: string) => setRiskFactors((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const canSubmit = category && symptoms.length > 0;

  const handleSubmit = () => {
    if (!category) return;

    const input: ScoringInput = {
      symptoms,
      painScore: showPain ? pain : 0,
      redFlagIds: redFlags,
      riskFactorIds: riskFactors,
      categoryId: category,
    };

    const urgency = calculateUrgency(input);

    onComplete({
      categoryId: category,
      symptoms,
      painScore: showPain ? pain : 0,
      redFlagIds: redFlags,
      riskFactorIds: riskFactors,
      age,
      sex,
      hasInsurance,
      urgency,
    });
  };

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
        <CategorySelect selected={category} onSelect={(id) => { setCategory(id); setSymptoms([]); setPain(0); }} />

        {/* Step 2: Symptoms (appears after category) */}
        {category && (
          <SymptomSelect categoryId={category} selected={symptoms} onToggle={toggleSymptom} />
        )}

        {/* Step 3: Pain scale (conditional) */}
        {category && symptoms.length > 0 && showPain && (
          <PainScale value={pain} onChange={setPain} />
        )}

        {/* Step 4: Red flags (appears after symptoms) */}
        {category && symptoms.length > 0 && (
          <RedFlagCheck selected={redFlags} onToggle={toggleRedFlag} />
        )}

        {/* Step 5: Patient info */}
        {category && symptoms.length > 0 && (
          <PatientInfo
            age={age} setAge={setAge}
            sex={sex} setSex={setSex}
            hasInsurance={hasInsurance} setHasInsurance={setHasInsurance}
            riskFactors={riskFactors} onToggleRisk={toggleRisk}
          />
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
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