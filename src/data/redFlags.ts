import type { Lang } from "@/i18n/types";

export interface RedFlag {
  id: string;
  label: Record<Lang, string>;
  /** Points added to urgency score */
  weight: number;
  /** If true, overrides score and sends directly to emergency */
  isCritical: boolean;
}

/** Red flags the user can select after symptoms */
export const RED_FLAGS: RedFlag[] = [
  { id: "unbearable_pain",  label: { es: "Dolor insoportable", en: "Unbearable pain" },              weight: 5, isCritical: false },
  { id: "no_liquids",       label: { es: "No tolero líquidos", en: "Can't keep liquids down" },      weight: 4, isCritical: false },
  { id: "heavy_bleeding",   label: { es: "Sangre abundante", en: "Heavy bleeding" },                 weight: 5, isCritical: true },
  { id: "fainting",         label: { es: "Desmayo/confusión", en: "Fainting/confusion" },            weight: 5, isCritical: true },
  { id: "none",             label: { es: "Ninguna de estas", en: "None of these" },                  weight: 0, isCritical: false },
];

/** Critical emergency flags — if ANY is present, override to emergency */
export const CRITICAL_OVERRIDES: RedFlag[] = [
  { id: "chest_sweat",      label: { es: "Dolor pecho con sudor/mareo", en: "Chest pain with sweating/dizziness" }, weight: 0, isCritical: true },
  { id: "severe_dyspnea",   label: { es: "Falta de aire intensa", en: "Severe shortness of breath" },               weight: 0, isCritical: true },
  { id: "neuro_deficit",    label: { es: "Déficit neurológico", en: "Neurological deficit" },                        weight: 0, isCritical: true },
  { id: "uncontrolled_bleed", label: { es: "Sangrado que no cede", en: "Uncontrolled bleeding" },                   weight: 0, isCritical: true },
];

export interface RiskFactor {
  id: string;
  label: Record<Lang, string>;
  weight: number;
}

/** Risk factors that elevate priority even with moderate symptoms */
export const RISK_FACTORS: RiskFactor[] = [
  // { id: "elderly",       label: { es: "Adulto mayor (65+)", en: "Elderly (65+)" },           weight: 2 },
  // { id: "infant",        label: { es: "Bebé o niño pequeño", en: "Baby or small child" },    weight: 2 },
  { id: "pregnant",      label: { es: "Embarazo", en: "Pregnancy" },                         weight: 2 },
  { id: "immunosup",     label: { es: "Inmunosupresión", en: "Immunosuppressed" },           weight: 2 },
  { id: "heart_disease", label: { es: "Cardiopatía", en: "Heart disease" },                  weight: 2 },
];

/**
 * Categories where pharmacy should NOT be shown as first option.
 * Based on doc section 7: exclusion rules.
 */
export const PHARMACY_EXCLUSION_SYMPTOMS = [
  "Dolor/presión en pecho", "Chest pain/pressure",
  "Falta de aire", "Shortness of breath",
  "Desmayo", "Fainting",
  "Confusión", "Confusion",
  "Debilidad", "Weakness",
  "Visión borrosa", "Blurred vision",
  "Sangrado vaginal", "Vaginal bleeding",
  "Embarazo posible", "Possible pregnancy",
  "Deformidad", "Deformity",
];