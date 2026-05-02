import type { Lang } from "@/i18n/types";

export type ServiceCategory = "EMERGENCY" | "CONSULTATION" | "SURGERY" | "LAB" | "IMAGING";

export type HospitalType = "hospital" | "pharmacy";

export interface DesgloseItem {
  n: string;
  p: string;
  i: boolean;
}

export interface Hospital {
  id: number;
  name: string;
  type: HospitalType;
  level: "FIRST" | "SECOND" | "THIRD";
  lat: number;
  lng: number;
  ap: Record<Lang, string>;
  ci: Record<Lang, string>;
  wt: string;
  rat: number;
  urg: boolean;
  hasIns: boolean;
  ins: string[];
  tr: number;
  sc: ServiceCategory[];
  sv: string[];
  prem: boolean;
  dsg: Record<Lang, DesgloseItem[]>;
}

export interface EnrichedHospital extends Hospital {
  dist: number | null;
  can: boolean;
  myIns: boolean | null;
}

export interface BodyZone {
  id: string;
  es: string;
  en: string;
  emoji: string;
  needs: ServiceCategory[];
}

export interface CarouselSlide {
  tip: Record<Lang, string>;
  emoji: string;
  img: string;
}

export interface SinceOption {
  id: string;
  l: string;
}
