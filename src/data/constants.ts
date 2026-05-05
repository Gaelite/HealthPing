import type { BodyZone, CarouselSlide, SinceOption } from "./types";
import type { Lang } from "@/i18n/types";

/** Body zones for symptom selection with required service categories */
export const BODY_ZONES: BodyZone[] = [
  { id: "head", es: "Cabeza", en: "Head", emoji: "", needs: ["CONSULTATION", "IMAGING"] },
  { id: "chest", es: "Pecho", en: "Chest", emoji: "", needs: ["EMERGENCY", "IMAGING", "LAB"] },
  { id: "abdomen", es: "Abdomen", en: "Abdomen", emoji: "", needs: ["EMERGENCY", "SURGERY", "IMAGING", "LAB"] },
  { id: "back", es: "Espalda", en: "Back", emoji: "", needs: ["CONSULTATION", "IMAGING"] },
  { id: "limbs", es: "Extremidades", en: "Limbs", emoji: "", needs: ["EMERGENCY", "IMAGING"] },
  { id: "throat", es: "Garganta", en: "Throat", emoji: "", needs: ["CONSULTATION", "LAB"] },
  { id: "skin", es: "Piel", en: "Skin", emoji: "", needs: ["CONSULTATION"] },
  { id: "general", es: "General", en: "General", emoji: "", needs: ["CONSULTATION", "LAB"] },
];

/** Extra symptoms the user can select */
export const EXTRA_SYMPTOMS: Record<Lang, string[]> = {
  es: ["Fiebre", "Náusea", "Vómito", "Dificultad para respirar", "Mareo", "Sangrado", "Dolor intenso", "Diarrea"],
  en: ["Fever", "Nausea", "Vomit", "Breathing difficulty", "Dizziness", "Bleeding", "Intense pain", "Diarrhea"],
};

/** Duration options */
export const SINCE_OPTIONS: Record<Lang, SinceOption[]> = {
  es: [{ id: "1h", l: "< 1 hora" }, { id: "1-6h", l: "1-6 horas" }, { id: "6h+", l: "+6 horas" }, { id: "days", l: "Varios días" }],
  en: [{ id: "1h", l: "< 1 hr" }, { id: "1-6h", l: "1-6 hrs" }, { id: "6h+", l: "+6 hrs" }, { id: "days", l: "Days" }],
};

/** Available insurance providers */
export const INSURERS = ["GNP", "AXA", "Metlife", "Seguros Monterrey", "Zurich", "BUPA", "Allianz", "Mapfre", "Inbursa"];

/** Hero carousel slides — image + tip rotate together */
export const CAROUSEL_SLIDES: CarouselSlide[] = [
  { tip: { es: "Hidrátate bien, habrá mucho sol", en: "Stay hydrated, it'll be sunny" }, emoji: "", img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80" },
  { tip: { es: "Cuidado con el dengue: usa repelente", en: "Watch out for dengue: use repellent" }, emoji: "", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80" },
  { tip: { es: "Protégete del sol: usa bloqueador", en: "Protect yourself from the sun" }, emoji: "", img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80" },
  { tip: { es: "Lávate las manos frecuentemente", en: "Wash your hands frequently" }, emoji: "", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80" },
  { tip: { es: "Si bebes alcohol, hazlo con moderación", en: "Drink alcohol in moderation" }, emoji: "", img: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&q=80" },
];
