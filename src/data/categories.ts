import type { Lang } from "@/i18n/types";
import type { ServiceCategory } from "./types";

export interface SymptomCategory {
  id: string;
  label: Record<Lang, string>;
  icon: string;
  symptoms: Record<Lang, string[]>;
  needs: ServiceCategory[];
}

export const CATEGORIES: SymptomCategory[] = [
  {
    id: "abdomen",
    label: { es: "Abdomen / digestivo", en: "Abdomen / digestive" },
    icon: "",
    needs: ["EMERGENCY", "SURGERY", "IMAGING", "LAB"],
    symptoms: {
      es: ["Dolor abdominal", "Fiebre", "Náusea", "Vómito", "Diarrea", "Acidez", "Inflamación", "Estreñimiento", "Sangre", "Piel/ojos amarillos"],
      en: ["Abdominal pain", "Fever", "Nausea", "Vomit", "Diarrhea", "Heartburn", "Swelling", "Constipation", "Blood", "Yellow skin/eyes"],
    },
  },
  {
    id: "chest",
    label: { es: "Pecho / respiración", en: "Chest / breathing" },
    icon: "",
    needs: ["EMERGENCY", "IMAGING", "LAB"],
    symptoms: {
      es: ["Dolor/presión en pecho", "Falta de aire", "Palpitaciones", "Tos", "Fiebre", "Silbido al respirar"],
      en: ["Chest pain/pressure", "Shortness of breath", "Palpitations", "Cough", "Fever", "Wheezing"],
    },
  },
  {
    id: "neuro",
    label: { es: "Cabeza / mareo", en: "Head / dizziness" },
    icon: "",
    needs: ["EMERGENCY", "IMAGING", "LAB"],
    symptoms: {
      es: ["Dolor de cabeza", "Mareo", "Desmayo", "Visión borrosa", "Debilidad", "Confusión"],
      en: ["Headache", "Dizziness", "Fainting", "Blurred vision", "Weakness", "Confusion"],
    },
  },
  {
    id: "urinary",
    label: { es: "Urinario / renal", en: "Urinary / kidney" },
    icon: "",
    needs: ["CONSULTATION", "LAB", "IMAGING"],
    symptoms: {
      es: ["Ardor al orinar", "Orino muy seguido", "Dolor espalda baja", "Sangre en orina", "Fiebre", "Dolor tipo cólico"],
      en: ["Burning urination", "Frequent urination", "Lower back pain", "Blood in urine", "Fever", "Colic-type pain"],
    },
  },
  {
    id: "gyne",
    label: { es: "Ginecológico / embarazo", en: "Gynecological / pregnancy" },
    icon: "",
    needs: ["EMERGENCY", "IMAGING", "LAB"],
    symptoms: {
      es: ["Dolor pélvico", "Sangrado vaginal", "Embarazo posible", "Flujo vaginal", "Fiebre"],
      en: ["Pelvic pain", "Vaginal bleeding", "Possible pregnancy", "Vaginal discharge", "Fever"],
    },
  },
  {
    id: "skin",
    label: { es: "Piel / alergia / heridas", en: "Skin / allergy / wounds" },
    icon: "",
    needs: ["CONSULTATION"],
    symptoms: {
      es: ["Ronchas", "Comezón", "Hinchazón", "Herida/cortada", "Quemadura", "Infección en piel"],
      en: ["Hives", "Itching", "Swelling", "Wound/cut", "Burn", "Skin infection"],
    },
  },
  {
    id: "trauma",
    label: { es: "Golpes / lesiones", en: "Injuries / trauma" },
    icon: "",
    needs: ["EMERGENCY", "IMAGING"],
    symptoms: {
      es: ["Caída", "Golpe", "Torcedura", "Dolor articular", "Deformidad", "Herida"],
      en: ["Fall", "Hit/blow", "Sprain", "Joint pain", "Deformity", "Wound"],
    },
  },
  {
    id: "fever",
    label: { es: "Fiebre / malestar general", en: "Fever / general malaise" },
    icon: "",
    needs: ["CONSULTATION", "LAB"],
    symptoms: {
      es: ["Fiebre", "Escalofríos", "Cuerpo cortado", "Cansancio", "Dolor de garganta", "Tos", "Diarrea"],
      en: ["Fever", "Chills", "Body aches", "Fatigue", "Sore throat", "Cough", "Diarrhea"],
    },
  },
  {
    id: "unknown",
    label: { es: "No sé / varios síntomas", en: "Not sure / multiple symptoms" },
    icon: "",
    needs: ["CONSULTATION", "LAB"],
    symptoms: {
      es: ["Dolor abdominal", "Fiebre", "Dolor de cabeza", "Mareo", "Náusea", "Cansancio", "Falta de aire", "Dolor de pecho"],
      en: ["Abdominal pain", "Fever", "Headache", "Dizziness", "Nausea", "Fatigue", "Shortness of breath", "Chest pain"],
    },
  },
];