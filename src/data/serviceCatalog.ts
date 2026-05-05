import type { Lang } from "@/i18n/types";

/** Dummy pricing from doc section 9. To be parameterized per city/hospital later. */
export interface ServicePrice {
  id: string;
  name: Record<Lang, string>;
  low: number;   // MXN
  high: number;  // MXN
  usedFor: string; // description of when this service applies
}

export const SERVICE_CATALOG: ServicePrice[] = [
  { id: "pharmacy_consult",     name: { es: "Consulta en farmacia", en: "Pharmacy consultation" },           low: 50,   high: 120,   usedFor: "basic_no_alarm" },
  { id: "general_consult",      name: { es: "Consulta general", en: "General consultation" },                low: 350,  high: 900,   usedFor: "first_contact" },
  { id: "er_basic",             name: { es: "Consulta urgencias básica", en: "Basic ER consultation" },      low: 800,  high: 1800,  usedFor: "minor_er" },
  { id: "er_hospital",          name: { es: "Consulta urgencias hospitalaria", en: "Hospital ER consultation" }, low: 1200, high: 2800, usedFor: "hospital_er" },
  { id: "cbc",                  name: { es: "Biometría hemática", en: "Complete blood count" },              low: 180,  high: 450,   usedFor: "infection_inflammation" },
  { id: "blood_chemistry",      name: { es: "Química sanguínea", en: "Blood chemistry" },                   low: 250,  high: 700,   usedFor: "metabolic_renal_hepatic" },
  { id: "urinalysis",           name: { es: "Examen general de orina", en: "Urinalysis" },                  low: 100,  high: 300,   usedFor: "urinary_abdominal_gyne" },
  { id: "pregnancy_test",       name: { es: "Prueba embarazo", en: "Pregnancy test" },                      low: 120,  high: 350,   usedFor: "gyne" },
  { id: "ecg",                  name: { es: "Electrocardiograma", en: "Electrocardiogram" },                low: 250,  high: 700,   usedFor: "chest_palpitations" },
  { id: "troponins",            name: { es: "Troponinas", en: "Troponins" },                                low: 600,  high: 1600,  usedFor: "chest_alarm" },
  { id: "xray_simple",          name: { es: "Radiografía simple", en: "Simple X-ray" },                     low: 450,  high: 1200,  usedFor: "trauma" },
  { id: "xray_chest",           name: { es: "Radiografía tórax", en: "Chest X-ray" },                      low: 500,  high: 1300,  usedFor: "chest_fever" },
  { id: "ultrasound",           name: { es: "USG abdominal/pélvico/renal", en: "Ultrasound (abdominal/pelvic/renal)" }, low: 900, high: 2200, usedFor: "abdomen_gyne_urinary" },
  { id: "ct_scan",              name: { es: "Tomografía", en: "CT scan" },                                  low: 3500, high: 9000,  usedFor: "evc_tce_complex" },
  { id: "iv_fluids",            name: { es: "Solución IV", en: "IV fluids" },                               low: 300,  high: 900,   usedFor: "dehydration_er" },
  { id: "pain_med",             name: { es: "Medicamento dolor/fiebre", en: "Pain/fever medication" },      low: 80,   high: 350,   usedFor: "initial_costing" },
  { id: "antiemetic",           name: { es: "Antiemético", en: "Antiemetic" },                              low: 100,  high: 400,   usedFor: "initial_costing" },
  { id: "wound_care",           name: { es: "Curación", en: "Wound care" },                                 low: 300,  high: 1000,  usedFor: "mild_wounds" },
  { id: "suture",               name: { es: "Sutura", en: "Suture" },                                      low: 800,  high: 2500,  usedFor: "deep_wounds" },
  { id: "specialist",           name: { es: "Valoración especialista", en: "Specialist assessment" },       low: 900,  high: 2500,  usedFor: "surgery_trauma_gyne_cardio" },
];

/** Convert MXN to approximate USD */
export function mxnToUsd(mxn: number): number {
  return Math.round(mxn / 17.6); // approximate rate, parameterize later
}