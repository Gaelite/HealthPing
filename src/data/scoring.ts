import type { Lang } from "@/i18n/types";
import type { ServiceCategory } from "./types";
import { RED_FLAGS, CRITICAL_OVERRIDES, PHARMACY_EXCLUSION_SYMPTOMS } from "./redFlags";

// ── Urgency levels ──

export type UrgencyLevel = "basic" | "same_day" | "urgent" | "emergency";

export interface UrgencyResult {
  level: UrgencyLevel;
  score: number;
  label: Record<Lang, string>;
  description: Record<Lang, string>;
  color: string;           // tailwind color class
  canShowPharmacy: boolean;
}

const LEVEL_META: Record<UrgencyLevel, Omit<UrgencyResult, "score" | "canShowPharmacy">> = {
  basic: {
    level: "basic",
    label: { es: "Orientación básica", en: "Basic guidance" },
    description: {
      es: "Puede iniciar con consulta de primer contacto.",
      en: "Can start with a first-contact consultation.",
    },
    color: "hp-green",
  },
  same_day: {
    level: "same_day",
    label: { es: "Valoración médica pronta", en: "Prompt medical assessment" },
    description: {
      es: "Conviene valoración hoy o dentro de 24 horas.",
      en: "Assessment recommended today or within 24 hours.",
    },
    color: "hp-amber",
  },
  urgent: {
    level: "urgent",
    label: { es: "Urgencias recomendadas", en: "Emergency room recommended" },
    description: {
      es: "Podría requerir laboratorio, imagen o vigilancia.",
      en: "May require lab, imaging or monitoring.",
    },
    color: "hp-coral",
  },
  emergency: {
    level: "emergency",
    label: { es: "Atención inmediata", en: "Immediate attention" },
    description: {
      es: "Acude a urgencias o llama al 911 si los síntomas son intensos.",
      en: "Go to the ER or call 911 if symptoms are severe.",
    },
    color: "hp-coral",
  },
};

// ── Scoring input ──

export interface ScoringInput {
  symptoms: string[];
  painScore: number;         // 0 = no pain question, 1-10
  redFlagIds: string[];
  riskFactorIds: string[];
  categoryId: string;
}

// ── Main scoring function ──

export function calculateUrgency(input: ScoringInput): UrgencyResult {
  const { symptoms, painScore, redFlagIds, riskFactorIds } = input;

  // 1. Check critical overrides first
  const hasCritical = redFlagIds.some((id) => {
    const flag = [...RED_FLAGS, ...CRITICAL_OVERRIDES].find((f) => f.id === id);
    return flag?.isCritical;
  });

  if (hasCritical) {
    return { ...LEVEL_META.emergency, score: 99, canShowPharmacy: false };
  }

  // 2. Calculate score
  let score = 0;

  // +1 per symptom selected
  score += symptoms.length;

  // Pain score contribution
  if (painScore >= 4 && painScore <= 6) score += 2;
  if (painScore >= 7 && painScore <= 8) score += 5;
  if (painScore >= 9) score += 7;

  // Fever
  const feverTerms = ["Fiebre", "Fever"];
  if (symptoms.some((s) => feverTerms.includes(s))) score += 2;

  // Red flag weights
  for (const id of redFlagIds) {
    const flag = RED_FLAGS.find((f) => f.id === id);
    if (flag) score += flag.weight;
  }

  // Risk factor weights
  score += riskFactorIds.length * 2;

  // 3. Determine level from score
  let level: UrgencyLevel;
  if (score >= 10) level = "urgent";
  else if (score >= 6) level = "same_day";
  else level = "basic";

  // Pain 9-10 with any red flag = emergency
  if (painScore >= 9 && redFlagIds.length > 0 && !redFlagIds.includes("none")) {
    level = "emergency";
  }

  // 4. Determine pharmacy eligibility
  const hasExclusionSymptom = symptoms.some((s) => PHARMACY_EXCLUSION_SYMPTOMS.includes(s));
  const canShowPharmacy = level === "basic" && painScore < 4 && !hasExclusionSymptom;

  return { ...LEVEL_META[level], score, canShowPharmacy };
}

// ── Suggested route based on category + urgency ──

export interface SuggestedRoute {
  services: Record<Lang, string[]>;
  requiredCapabilities: ServiceCategory[];
  costRange: Record<Lang, string>;
  costDisclaimer: Record<Lang, string>;
}

/**
 * Maps category + urgency level to a suggested care route.
 * Based on doc sections 6, 8, and 9.
 */
export function getSuggestedRoute(categoryId: string, level: UrgencyLevel): SuggestedRoute {
  // Default route
  const defaultRoute: SuggestedRoute = {
    services: {
      es: ["Consulta médica", "Estudios según valoración"],
      en: ["Medical consultation", "Tests as needed"],
    },
    requiredCapabilities: ["CONSULTATION"],
    costRange: { es: "$350 - $900 MXN", en: "$20 - $51 USD" },
    costDisclaimer: {
      es: "No incluye estudios adicionales ni hospitalización.",
      en: "Does not include additional tests or hospitalization.",
    },
  };

  if (level === "basic") return defaultRoute;

  const routes: Record<string, Record<string, SuggestedRoute>> = {
    abdomen: {
      same_day: {
        services: {
          es: ["Consulta de urgencias", "Biometría hemática", "Química sanguínea", "EGO", "Analgésico", "Antiemético"],
          en: ["ER consultation", "Complete blood count", "Blood chemistry", "Urinalysis", "Painkiller", "Antiemetic"],
        },
        requiredCapabilities: ["EMERGENCY", "LAB"],
        costRange: { es: "$1,800 - $4,500 MXN", en: "$100 - $256 USD" },
        costDisclaimer: { es: "No incluye cirugía ni hospitalización.", en: "Does not include surgery or hospitalization." },
      },
      urgent: {
        services: {
          es: ["Consulta de urgencias", "BH", "QS", "EGO", "USG abdominal", "Analgésico", "Antiemético", "Solución IV"],
          en: ["ER consultation", "CBC", "Blood chemistry", "Urinalysis", "Abdominal ultrasound", "Painkiller", "Antiemetic", "IV fluids"],
        },
        requiredCapabilities: ["EMERGENCY", "LAB", "IMAGING"],
        costRange: { es: "$2,800 - $6,500 MXN", en: "$159 - $370 USD" },
        costDisclaimer: { es: "No incluye cirugía ni hospitalización.", en: "Does not include surgery or hospitalization." },
      },
      emergency: {
        services: {
          es: ["Urgencias", "BH", "QS", "EGO", "USG abdominal", "TAC si necesario", "Cirugía general posible", "Solución IV"],
          en: ["Emergency room", "CBC", "Blood chemistry", "Urinalysis", "Abdominal ultrasound", "CT if needed", "Possible surgery", "IV fluids"],
        },
        requiredCapabilities: ["EMERGENCY", "LAB", "IMAGING", "SURGERY"],
        costRange: { es: "$4,000 - $12,000+ MXN", en: "$227 - $682+ USD" },
        costDisclaimer: { es: "Puede incluir cirugía y hospitalización.", en: "May include surgery and hospitalization." },
      },
    },
    chest: {
      same_day: {
        services: {
          es: ["Consulta de urgencias", "ECG", "BH", "QS", "RX tórax"],
          en: ["ER consultation", "ECG", "CBC", "Blood chemistry", "Chest X-ray"],
        },
        requiredCapabilities: ["EMERGENCY", "LAB", "IMAGING"],
        costRange: { es: "$2,500 - $5,500 MXN", en: "$142 - $313 USD" },
        costDisclaimer: { es: "No incluye hospitalización ni monitoreo.", en: "Does not include hospitalization or monitoring." },
      },
      urgent: {
        services: {
          es: ["Urgencias", "ECG", "Troponinas", "BH", "QS", "RX tórax", "Monitorización"],
          en: ["Emergency room", "ECG", "Troponins", "CBC", "Blood chemistry", "Chest X-ray", "Monitoring"],
        },
        requiredCapabilities: ["EMERGENCY", "LAB", "IMAGING"],
        costRange: { es: "$4,000 - $12,000 MXN", en: "$227 - $682 USD" },
        costDisclaimer: { es: "Puede requerir hospitalización.", en: "May require hospitalization." },
      },
      emergency: {
        services: {
          es: ["Urgencias 24/7", "ECG", "Troponinas", "BH", "QS", "RX tórax", "Monitorización", "Hemodinamia posible"],
          en: ["24/7 Emergency room", "ECG", "Troponins", "CBC", "Blood chemistry", "Chest X-ray", "Monitoring", "Possible catheterization"],
        },
        requiredCapabilities: ["EMERGENCY", "LAB", "IMAGING"],
        costRange: { es: "$4,000 - $12,000+ MXN", en: "$227 - $682+ USD" },
        costDisclaimer: { es: "Rango inicial. Cardiología puede elevar costos.", en: "Initial range. Cardiology may increase costs." },
      },
    },
    neuro: {
      same_day: {
        services: { es: ["Consulta", "TA", "Glucosa", "BH/QS"], en: ["Consultation", "Blood pressure", "Glucose", "CBC/Chemistry"] },
        requiredCapabilities: ["EMERGENCY", "LAB"],
        costRange: { es: "$1,500 - $3,500 MXN", en: "$85 - $199 USD" },
        costDisclaimer: { es: "No incluye tomografía.", en: "Does not include CT scan." },
      },
      urgent: {
        services: { es: ["Urgencias", "TA", "Glucosa", "ECG", "BH/QS", "TAC si alarma"], en: ["ER", "Blood pressure", "Glucose", "ECG", "CBC/Chemistry", "CT if alarming"] },
        requiredCapabilities: ["EMERGENCY", "LAB", "IMAGING"],
        costRange: { es: "$3,000 - $10,000 MXN", en: "$170 - $568 USD" },
        costDisclaimer: { es: "TAC puede elevar costos significativamente.", en: "CT scan may significantly increase costs." },
      },
      emergency: {
        services: { es: ["Urgencias 24/7", "TAC", "BH/QS", "ECG", "Neurología"], en: ["24/7 ER", "CT scan", "CBC/Chemistry", "ECG", "Neurology"] },
        requiredCapabilities: ["EMERGENCY", "LAB", "IMAGING"],
        costRange: { es: "$5,000 - $15,000+ MXN", en: "$284 - $852+ USD" },
        costDisclaimer: { es: "Puede requerir hospitalización y neurocirugía.", en: "May require hospitalization and neurosurgery." },
      },
    },
  };

  // Fallback for categories not yet mapped
  const categoryRoutes = routes[categoryId];
  if (!categoryRoutes) return defaultRoute;
  return categoryRoutes[level] || defaultRoute;
}

/**
 * Returns relevant desglose items for a hospital based on the user's
 * category and urgency level. Filters out services that don't apply
 * to the user's situation.
 *
 * HP-03: Symptom-indexed relevance for hospital breakdown
 */
export function getRelevantDesglose(
  hospitalDesglose: { n: string; p: string; i: boolean }[],
  categoryId: string,
  level: UrgencyLevel
): { n: string; p: string; i: boolean; relevant: boolean }[] {
  // Services that are only relevant for higher urgency
  const highUrgencyTerms = [
    "Cirugía", "Surgery", "Cuarto/noche", "Room/night",
    "Tomografía", "CT scan", "CT Scan",
    "Anestesiólogo", "Anesthesiologist",
    "Hemodinamia", "Catheterization",
    "UCI", "ICU", "Monitorización", "Monitoring",
  ];

  // Services only relevant for specific categories
  const categoryRelevance: Record<string, string[]> = {
    abdomen: ["Consulta", "Consultation", "Biometría", "Complete blood", "Química", "Blood chemistry", "Examen general de orina", "Urinalysis", "Medicamento", "medication", "USG", "Ultrasound", "Solución IV", "IV fluids", "Antiemético", "Antiemetic"],
    chest: ["Consulta", "Consultation", "Biometría", "Complete blood", "Química", "Blood chemistry", "Medicamento", "medication", "Electrocardiograma", "Electrocardiogram", "Troponinas", "Troponins", "Radiografía tórax", "Chest X-ray"],
    neuro: ["Consulta", "Consultation", "Biometría", "Complete blood", "Química", "Blood chemistry", "Medicamento", "medication", "Tomografía", "CT scan", "Electrocardiograma", "Electrocardiogram"],
    urinary: ["Consulta", "Consultation", "Biometría", "Complete blood", "Química", "Blood chemistry", "Examen general de orina", "Urinalysis", "Medicamento", "medication", "USG", "Ultrasound"],
    gyne: ["Consulta", "Consultation", "Biometría", "Complete blood", "Química", "Blood chemistry", "Examen general de orina", "Urinalysis", "Medicamento", "medication", "USG", "Ultrasound", "Prueba embarazo", "Pregnancy"],
    skin: ["Consulta", "Consultation", "Medicamento", "medication", "Curación", "Wound care", "Sutura", "Suture"],
    trauma: ["Consulta", "Consultation", "Radiografía", "X-ray", "X-Ray", "Medicamento", "medication", "Valoración especialista", "Specialist"],
    fever: ["Consulta", "Consultation", "Biometría", "Complete blood", "Química", "Blood chemistry", "Examen general de orina", "Urinalysis", "Medicamento", "medication", "Radiografía", "X-ray"],
    unknown: ["Consulta", "Consultation", "Biometría", "Complete blood", "Química", "Blood chemistry", "Medicamento", "medication"],
  };

  const relevantTerms = categoryRelevance[categoryId] || [];

  return hospitalDesglose.map((item) => {
    // Always-relevant items (admission, basic lab, doctor fees, meds)
    const isBasic = ["Consulta", "Consultation", "Biometría", "Complete blood", "Medicamento", "medication"]
      .some((term) => item.n.toLowerCase().includes(term.toLowerCase()));

    // High urgency items only relevant if urgent/emergency
    const isHighUrgency = highUrgencyTerms.some((term) => item.n.includes(term));
    if (isHighUrgency && (level === "basic" || level === "same_day")) {
      return { ...item, relevant: false };
    }

    // Category-specific relevance
    const matchesCategory = relevantTerms.some((term) => item.n.includes(term));

    return { ...item, relevant: isBasic || matchesCategory };
  });
}