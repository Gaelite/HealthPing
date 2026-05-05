import type { EnrichedHospital, ServiceCategory } from "@/data/types";
import type { Lang } from "@/i18n/types";

export interface FilterTag {
  id: string;
  label: Record<Lang, string>;
  emoji?: string;
  /** Return true if hospital PASSES the filter */
  match: (h: EnrichedHospital) => boolean;
  /** Only show this tag if condition is true (e.g. MY_INS only if user has insurer) */
  showIf?: (ctx: FilterContext) => boolean;
}

export interface FilterContext {
  hasInsurer: boolean;
}

const svc = (sc: ServiceCategory): FilterTag["match"] => (h) => h.sc.includes(sc);

export const FILTER_TAGS: FilterTag[] = [
  { id: "MY_INS",       label: { es: "Mi seguro", en: "My insurance" },     
   match: (h) => !!h.myIns, showIf: (ctx) => ctx.hasInsurer },
  { id: "CONVENIO",     label: { es: "Convenio", en: "Partner" }, match: (h) => h.prem },
  { id: "PRECIO_CLARO", label: { es: "Precio claro", en: "Clear pricing" }, match: (h) => h.tr >= 4 },
  { id: "URGENCIAS",    label: { es: "Urgencias", en: "Emergency" }, match: (h) => h.urg },
  { id: "SURGERY",      label: { es: "Cirugía", en: "Surgery" }, match: svc("SURGERY") },
  { id: "LAB",          label: { es: "Laboratorio", en: "Lab" },  match: svc("LAB") },
  { id: "IMAGING",      label: { es: "Imagen", en: "Imaging" }, match: svc("IMAGING") },
  { id: "CONSULTATION", label: { es: "Consulta", en: "Consultation" }, match: svc("CONSULTATION") },
  { id: "HOSPITAL",     label: { es: "Hospitales", en: "Hospitals" }, match: (h) => h.type === "hospital" },
  { id: "PHARMACY",     label: { es: "Farmacias", en: "Pharmacies" }, match: (h) => h.type === "pharmacy" },
];

export function applyTagFilters(
  hospitals: EnrichedHospital[],
  activeIds: Set<string>
): EnrichedHospital[] {
  if (activeIds.size === 0) return hospitals;
  const activeTags = FILTER_TAGS.filter((tag) => activeIds.has(tag.id));
  return hospitals.filter((h) => activeTags.every((tag) => tag.match(h)));
}