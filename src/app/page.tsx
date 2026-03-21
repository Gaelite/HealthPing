"use client";

import { useState, useCallback, useEffect, createContext, useContext } from "react";
import HospitalMap from "@/components/HospitalMap";

/* ═══════ i18n ═══════ */
const TEXTS = {
  es: {
    badge: "Disponible en Jalisco — FIFA World Cup 2026",
    h1a: "Te ayudamos a decidir", h1b: "a dónde ir",
    sub: "Compara hospitales, revisa costos y da seguimiento a tu cuenta mientras te atienden. Sin registro, sin sorpresas.",
    cta1: "Me siento mal ahora", cta2: "Comparar hospitales", cta3: "Cotizar cirugía",
    stat1: "434+", stat1l: "Hospitales en Jalisco", stat2: "<2s", stat2l: "Tiempo de respuesta", stat3: "$0", stat3l: "Costo para ti",
    howTitle: "De tu síntoma a tu cita en 3 pasos", howLabel: "CÓMO FUNCIONA",
    s1t: "Describe qué sientes", s1d: "Zona, intensidad y síntomas. Sin formularios largos.",
    s2t: "Compara hospitales", s2d: "Solo los que pueden atenderte. Precios, seguros, mapa.",
    s3t: "Agenda sin registro", s3d: "Formulario simple. Confirmación con código por correo.",
    hospCta: "¿Eres hospital o clínica?", hospCtaSub: "Únete como hospital convenio.", hospCtaBtn: "Quiero ser convenio",
    sympTitle: "¿Qué sientes?", sympSub: "Selecciona rápido.", whereHurt: "¿Dónde te duele?",
    howBad: "¿Qué tan fuerte?", whatElse: "¿Qué más sientes?", sinceWhen: "¿Desde cuándo?",
    next: "Siguiente", back: "← Volver",
    insTitle: "¿Tienes seguro médico?", insSub: "Selecciona tu aseguradora.", noIns: "No tengo seguro",
    seeHosp: "Ver hospitales cercanos",
    resultsTitle: "Hospitales y farmacias disponibles", onlyConvenio: "Solo convenio",
    closest: "Más cercano", cheapest: "Más barato", bestRated: "Mejor calificado", mostTransp: "Más transparente",
    seeBreakdown: "Ver desglose", close: "Cerrar", requestAppt: "Solicitar cita",
    included: "Incluido normalmente", mayIncrease: "Puede elevar la cuenta",
    insAccepted: "Seguros aceptados", beforeEnter: "Antes de entrar, pregunta:",
    q1: "¿De cuánto es el anticipo y qué incluye?", q2: "¿Qué estudios podrían pedir?", q3: "¿Cómo cambia si hay cirugía?", q4: "¿Qué cubre mi seguro?",
    apptTitle: "Solicitar cita", apptAt: "En", apptNoSchedule: "Fuera de horario (9am-7pm). Se procesará mañana.",
    name: "Nombre completo", email: "Correo electrónico", phone: "Teléfono", when: "¿Cuándo prefieres?",
    morning: "Mañana (9-1pm)", afternoon: "Tarde (1-7pm)", describe: "Describe tu situación", send: "Enviar solicitud", sending: "Enviando...",
    confTitle: "Solicitud enviada", confSub: "Revisa tu correo. Tu código:", confSave: "Guarda este código para verificar tu cita.",
    verify: "Verificar mi cita", backHome: "Volver al inicio",
    portalHosp: "Portal Hospital", verifyCita: "Verificar cita",
    pharmacy: "Farmacia", openNow: "Abierta ahora", estimated: "Consulta estimada",
    noResults: "No hay opciones con esos filtros.", clearFilters: "Quitar filtros",
    comingSoon: "Próximamente", comingSoonSub: "Estamos preparando el cotizador de cirugías. Déjanos tu correo.",
    mild: "Leve", moderate: "Moderado", intense: "Intenso",
  },
  en: {
    badge: "Available in Jalisco — FIFA World Cup 2026",
    h1a: "We help you decide", h1b: "where to go",
    sub: "Compare hospitals, check costs and track your bill while you get treated. No sign-up, no surprises.",
    cta1: "I feel sick now", cta2: "Compare hospitals", cta3: "Quote surgery",
    stat1: "434+", stat1l: "Hospitals in Jalisco", stat2: "<2s", stat2l: "Response time", stat3: "$0", stat3l: "Cost for you",
    howTitle: "From symptom to appointment in 3 steps", howLabel: "HOW IT WORKS",
    s1t: "Describe how you feel", s1d: "Body area, intensity, and symptoms. No long forms.",
    s2t: "Compare hospitals", s2d: "Only those that can treat you. Prices, insurance, map.",
    s3t: "Book without sign-up", s3d: "Simple form. Email confirmation with code.",
    hospCta: "Are you a hospital or clinic?", hospCtaSub: "Join as a partner hospital.", hospCtaBtn: "I want to join",
    sympTitle: "What do you feel?", sympSub: "Select quickly.", whereHurt: "Where does it hurt?",
    howBad: "How bad is it?", whatElse: "What else do you feel?", sinceWhen: "Since when?",
    next: "Next", back: "← Back",
    insTitle: "Do you have health insurance?", insSub: "Select your insurer.", noIns: "No insurance",
    seeHosp: "See nearby hospitals",
    resultsTitle: "Available hospitals & pharmacies", onlyConvenio: "Partners only",
    closest: "Closest", cheapest: "Cheapest", bestRated: "Best rated", mostTransp: "Most transparent",
    seeBreakdown: "See breakdown", close: "Close", requestAppt: "Request appointment",
    included: "Usually included", mayIncrease: "May increase the bill",
    insAccepted: "Accepted insurers", beforeEnter: "Before you enter, ask:",
    q1: "What's the deposit and what does it cover?", q2: "What tests might they order?", q3: "How does it change with surgery?", q4: "What does my insurance cover?",
    apptTitle: "Request appointment", apptAt: "At", apptNoSchedule: "Outside hours (9am-7pm). Will be processed tomorrow.",
    name: "Full name", email: "Email", phone: "Phone", when: "When do you prefer?",
    morning: "Morning (9-1pm)", afternoon: "Afternoon (1-7pm)", describe: "Describe your situation", send: "Send request", sending: "Sending...",
    confTitle: "Request sent", confSub: "Check your email. Your code:", confSave: "Save this code to check your appointment status.",
    verify: "Check my appointment", backHome: "Back to home",
    portalHosp: "Hospital Portal", verifyCita: "Check appointment",
    pharmacy: "Pharmacy", openNow: "Open now", estimated: "Estimated consultation",
    noResults: "No options match those filters.", clearFilters: "Clear filters",
    comingSoon: "Coming soon", comingSoonSub: "We're building the surgery quote tool. Leave your email.",
    mild: "Mild", moderate: "Moderate", intense: "Intense",
  },
};

type Lang = "es" | "en";
const LangCtx = createContext<{ lang: Lang; t: typeof TEXTS.es; setLang: (l: Lang) => void }>({ lang: "es", t: TEXTS.es, setLang: () => {} });
function useLang() { return useContext(LangCtx); }

/* ═══════ DATA ═══════ */
const HERO_TIPS = {
  es: [
    { text: "Hidrátate bien, habrá mucho sol", emoji: "💧" },
    { text: "Cuidado con el dengue: usa repelente", emoji: "🦟" },
    { text: "Protégete del sol: usa bloqueador", emoji: "☀️" },
    { text: "Lávate las manos frecuentemente", emoji: "🧼" },
    { text: "Si bebes alcohol, hazlo con moderación", emoji: "🍺" },
  ],
  en: [
    { text: "Stay hydrated, it will be very sunny", emoji: "💧" },
    { text: "Watch out for dengue: use repellent", emoji: "🦟" },
    { text: "Protect yourself from the sun", emoji: "☀️" },
    { text: "Wash your hands frequently", emoji: "🧼" },
    { text: "If you drink alcohol, do it moderately", emoji: "🍺" },
  ],
};

const INSURERS_LIST = ["GNP", "AXA", "Metlife", "Seguros Monterrey", "Zurich", "BUPA", "Allianz", "Mapfre", "Inbursa", "Otro"];

const BODY_ZONES_ES = [
  { id: "head", label: "Cabeza", labelEn: "Head", emoji: "🧠", needs: ["CONSULTATION", "IMAGING"] as SC[] },
  { id: "chest", label: "Pecho", labelEn: "Chest", emoji: "🫁", needs: ["EMERGENCY", "IMAGING", "LAB"] as SC[] },
  { id: "abdomen", label: "Abdomen", labelEn: "Abdomen", emoji: "🫃", needs: ["EMERGENCY", "SURGERY", "IMAGING", "LAB"] as SC[] },
  { id: "back", label: "Espalda", labelEn: "Back", emoji: "🦴", needs: ["CONSULTATION", "IMAGING"] as SC[] },
  { id: "limbs", label: "Extremidades", labelEn: "Limbs", emoji: "💪", needs: ["EMERGENCY", "IMAGING"] as SC[] },
  { id: "throat", label: "Garganta", labelEn: "Throat", emoji: "🗣️", needs: ["CONSULTATION", "LAB"] as SC[] },
  { id: "skin", label: "Piel", labelEn: "Skin", emoji: "🩹", needs: ["CONSULTATION"] as SC[] },
  { id: "general", label: "General", labelEn: "General", emoji: "🤒", needs: ["CONSULTATION", "LAB"] as SC[] },
];

const EXTRA_ES = ["Fiebre", "Náusea", "Vómito", "Dificultad para respirar", "Mareo", "Sangrado", "Dolor intenso", "Diarrea"];
const EXTRA_EN = ["Fever", "Nausea", "Vomit", "Breathing difficulty", "Dizziness", "Bleeding", "Intense pain", "Diarrhea"];
const SINCE_ES = [{ id: "1h", l: "< 1 hora" }, { id: "1-6h", l: "1-6 horas" }, { id: "6h+", l: "+6 horas" }, { id: "days", l: "Varios días" }];
const SINCE_EN = [{ id: "1h", l: "< 1 hour" }, { id: "1-6h", l: "1-6 hours" }, { id: "6h+", l: "+6 hours" }, { id: "days", l: "Several days" }];

type SC = "EMERGENCY" | "CONSULTATION" | "SURGERY" | "LAB" | "IMAGING";

const MOCK_HOSPITALS = [
  { id: 1, name: "Hospital San Javier", type: "hospital" as const, level: "THIRD", lat: 20.6767, lng: -103.3812, anticipoRange: "$8,000 - $15,000", costoInicial: "$2,500 - $6,000", waitTime: "~15 min", rating: 4.6, urgenciasOpen: true, acceptsInsurance: true, insurers: ["GNP", "AXA", "Metlife", "Seguros Monterrey"], transparency: 4, serviceCategories: ["EMERGENCY", "SURGERY", "LAB", "IMAGING", "CONSULTATION"] as SC[], services: ["Urgencias 24h", "Cirugía", "Lab", "Imagen"], isPremium: true, desglose: [{ name: "Admisión y valoración", price: "$800 - $1,500", included: true }, { name: "Laboratorio básico", price: "$600 - $1,200", included: true }, { name: "Honorarios médico", price: "$1,000 - $2,000", included: true }, { name: "Medicamentos", price: "$300 - $800", included: true }, { name: "Ultrasonido / Rayos X", price: "$1,500 - $3,000", included: false }, { name: "Tomografía", price: "$4,000 - $8,000", included: false }, { name: "Cirugía", price: "$15,000 - $45,000", included: false }, { name: "Cuarto/noche", price: "$3,000 - $6,000", included: false }] },
  { id: 2, name: "Clínica del Valle", type: "hospital" as const, level: "SECOND", lat: 20.6700, lng: -103.3650, anticipoRange: "$5,000 - $10,000", costoInicial: "$1,800 - $4,000", waitTime: "~25 min", rating: 4.3, urgenciasOpen: true, acceptsInsurance: true, insurers: ["GNP", "AXA", "BUPA"], transparency: 3, serviceCategories: ["EMERGENCY", "CONSULTATION", "LAB"] as SC[], services: ["Urgencias 24h", "Consulta", "Lab"], isPremium: false, desglose: [{ name: "Admisión", price: "$500 - $1,000", included: true }, { name: "Lab básico", price: "$400 - $900", included: true }, { name: "Honorarios", price: "$700 - $1,500", included: true }, { name: "Medicamentos", price: "$200 - $600", included: true }, { name: "Rayos X", price: "$800 - $1,500", included: false }, { name: "Cuarto/noche", price: "$2,000 - $4,000", included: false }] },
  { id: 3, name: "Hospital Puerta de Hierro", type: "hospital" as const, level: "THIRD", lat: 20.7050, lng: -103.4100, anticipoRange: "$12,000 - $25,000", costoInicial: "$4,000 - $8,000", waitTime: "~10 min", rating: 4.8, urgenciasOpen: true, acceptsInsurance: true, insurers: ["GNP", "AXA", "Metlife", "Seguros Monterrey", "Zurich", "BUPA", "Allianz"], transparency: 5, serviceCategories: ["EMERGENCY", "SURGERY", "LAB", "IMAGING", "CONSULTATION"] as SC[], services: ["Urgencias 24h", "Cirugía", "UCI", "Lab", "Imagen"], isPremium: true, desglose: [{ name: "Admisión", price: "$1,200 - $2,000", included: true }, { name: "Lab completo", price: "$900 - $1,800", included: true }, { name: "Honorarios", price: "$1,500 - $3,000", included: true }, { name: "Medicamentos", price: "$400 - $1,000", included: true }, { name: "Ultrasonido/RX", price: "$2,000 - $4,000", included: false }, { name: "Tomografía", price: "$5,000 - $10,000", included: false }, { name: "Cirugía", price: "$20,000 - $60,000", included: false }, { name: "Cuarto/noche", price: "$4,500 - $8,000", included: false }] },
  { id: 4, name: "Médica Sur GDL", type: "hospital" as const, level: "FIRST", lat: 20.6600, lng: -103.3500, anticipoRange: "$3,000 - $6,000", costoInicial: "$800 - $2,000", waitTime: "~35 min", rating: 4.1, urgenciasOpen: false, acceptsInsurance: false, insurers: [], transparency: 2, serviceCategories: ["CONSULTATION", "LAB"] as SC[], services: ["Consulta", "Lab básico"], isPremium: false, desglose: [{ name: "Consulta", price: "$500 - $800", included: true }, { name: "Lab básico", price: "$300 - $600", included: true }, { name: "Medicamentos", price: "$150 - $400", included: true }, { name: "Rayos X", price: "$600 - $1,200", included: false }] },
  // Pharmacies
  { id: 101, name: "Farmacia Guadalajara", type: "pharmacy" as const, level: "FIRST", lat: 20.6730, lng: -103.3700, anticipoRange: "$0", costoInicial: "$100 - $500", waitTime: "~5 min", rating: 4.2, urgenciasOpen: true, acceptsInsurance: false, insurers: [], transparency: 3, serviceCategories: ["CONSULTATION"] as SC[], services: ["Consulta médica", "Medicamentos"], isPremium: false, desglose: [{ name: "Consulta médica", price: "$50 - $100", included: true }, { name: "Medicamentos", price: "$50 - $400", included: true }] },
  { id: 102, name: "Farmacias del Ahorro", type: "pharmacy" as const, level: "FIRST", lat: 20.6680, lng: -103.3580, anticipoRange: "$0", costoInicial: "$80 - $400", waitTime: "~10 min", rating: 4.0, urgenciasOpen: true, acceptsInsurance: false, insurers: [], transparency: 3, serviceCategories: ["CONSULTATION"] as SC[], services: ["Consulta", "Medicamentos"], isPremium: false, desglose: [{ name: "Consulta", price: "$35 - $80", included: true }, { name: "Medicamentos", price: "$50 - $350", included: true }] },
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; const d1 = ((lat2 - lat1) * Math.PI) / 180; const d2 = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(d1 / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(d2 / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function isInSchedule() { const h = new Date().getHours(); return h >= 9 && h < 19; }

/* ═══════ COMPONENTS ═══════ */
function LevelBadge({ level, type }: { level: string; type: string }) {
  if (type === "pharmacy") return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-hp-amber-light text-hp-amber">Farmacia</span>;
  const c: Record<string, { l: string; cls: string }> = { FIRST: { l: "1er nivel", cls: "bg-hp-green-light text-hp-green" }, SECOND: { l: "2do nivel", cls: "bg-hp-blue-light text-hp-blue" }, THIRD: { l: "3er nivel", cls: "bg-hp-blue-light text-hp-navy" } };
  const x = c[level] || c.FIRST; return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${x.cls}`}>{x.l}</span>;
}
function Dots({ level }: { level: number }) { return <div className="flex gap-0.5">{[1,2,3,4,5].map(i=><div key={i} className={`w-2 h-2 rounded-full ${i<=level?"bg-hp-green":"bg-gray-200"}`}/>)}</div>; }

async function sendEmailJS(toEmail: string, toName: string, code: string, hospitalName: string) {
  const S = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
  const T = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
  const K = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
  if (!S || !T || !K) return;
  try { await fetch("https://api.emailjs.com/api/v1.0/email/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ service_id: S, template_id: T, user_id: K, template_params: { to_email: toEmail, to_name: toName, verification_code: code, hospital_name: hospitalName } }) }); } catch (e) { console.error(e); }
}

/* ═══════ PAGE ═══════ */
type Screen = "home" | "symptoms" | "insurance" | "results" | "appointment" | "surgery";

export default function Home() {
  const [lang, setLang] = useState<Lang>("es");
  const t = TEXTS[lang];
  const tips = HERO_TIPS[lang];
  const extras = lang === "es" ? EXTRA_ES : EXTRA_EN;
  const sinceOpts = lang === "es" ? SINCE_ES : SINCE_EN;

  const [screen, setScreen] = useState<Screen>("home");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [painLevel, setPainLevel] = useState(5);
  const [extraSymptoms, setExtraSymptoms] = useState<string[]>([]);
  const [since, setSince] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("distance");
  const [expandedHospital, setExpandedHospital] = useState<number | null>(null);
  const [selectedInsurer, setSelectedInsurer] = useState<string | null>(null);
  const [convenioFilter, setConvenioFilter] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [apptName, setApptName] = useState(""); const [apptEmail, setApptEmail] = useState(""); const [apptPhone, setApptPhone] = useState(""); const [apptDesc, setApptDesc] = useState(""); const [apptTime, setApptTime] = useState("morning"); const [apptSending, setApptSending] = useState(false); const [apptCode, setApptCode] = useState<string | null>(null); const [apptError, setApptError] = useState<string | null>(null);

  useEffect(() => { const i = setInterval(() => setTipIndex(x => (x + 1) % tips.length), 4000); return () => clearInterval(i); }, [tips.length]);

  const requestLocationAndGo = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); setScreen("results"); },
      () => setScreen("results"), { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const neededServices: SC[] = selectedZone ? (BODY_ZONES_ES.find(z => z.id === selectedZone)?.needs || []) : [];
  const enriched = MOCK_HOSPITALS.map(h => {
    const distanceKm = userLat && userLng ? getDistance(userLat, userLng, h.lat, h.lng) : null;
    const canServe = neededServices.length === 0 || neededServices.some(s => h.serviceCategories.includes(s));
    const hasMyInsurance = selectedInsurer ? (h.insurers as string[]).includes(selectedInsurer) : null;
    return { ...h, distanceKm, canServe, hasMyInsurance };
  });
  const filtered = enriched.filter(h => h.canServe).filter(h => !convenioFilter || h.isPremium);
  const sorted = [...filtered].sort((a, b) => {
    if (selectedInsurer) { if (a.hasMyInsurance && !b.hasMyInsurance) return -1; if (!a.hasMyInsurance && b.hasMyInsurance) return 1; }
    if (sortBy === "distance" && a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
    if (sortBy === "cost") return parseInt(a.costoInicial.replace(/\D/g, "")) - parseInt(b.costoInicial.replace(/\D/g, ""));
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "transparency") return b.transparency - a.transparency;
    return 0;
  });

  const selectedHospital = MOCK_HOSPITALS.find(h => h.id === selectedHospitalId);

  const handleAppointment = async () => {
    if (!apptName || !apptEmail || !apptPhone || !selectedHospitalId) return;
    setApptSending(true); setApptError(null);
    try {
      const res = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hospitalName: selectedHospital?.name, patientName: apptName, patientEmail: apptEmail, patientPhone: apptPhone, symptomDescription: apptDesc || selectedZone || "-", scheduledTime: apptTime }) });
      const data = await res.json();
      if (data.code) { setApptCode(data.code); sendEmailJS(apptEmail, apptName, data.code, selectedHospital?.name || ""); }
      else setApptError(data.error || "Error");
    } catch { setApptError("Error de conexión"); }
    setApptSending(false);
  };

  const handleMapSelect = useCallback((id: number) => { setExpandedHospital(id); document.getElementById(`hospital-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }, []);

  return (
    <LangCtx.Provider value={{ lang, t, setLang }}>
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => { setScreen("home"); setExpandedHospital(null); setApptCode(null); }} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-hp-navy flex items-center justify-center group-hover:bg-hp-blue transition-colors"><span className="text-white text-sm font-bold">HP</span></div>
            <span className="font-[family-name:var(--font-display)] text-lg text-hp-navy">Health<span className="text-hp-green">Ping</span></span>
          </button>
          <div className="flex items-center gap-4 text-sm">
            <a href="/verificar" className="hidden sm:inline text-hp-gray hover:text-hp-navy transition-colors">{t.verifyCita}</a>
            <a href="/hospital" className="hidden sm:inline bg-hp-green text-white px-4 py-2 rounded-lg font-medium hover:bg-hp-green-dark transition-colors">{t.portalHosp}</a>
            {/* Language toggle */}
            <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-hp-blue transition-colors">
              <span className="text-base">{lang === "es" ? "🇲🇽" : "🇺🇸"}</span>
              <span className="font-medium text-hp-dark">{lang === "es" ? "ES" : "EN"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════ HOME ═══════ */}
      {screen === "home" && (
        <>
          <section className="pt-14 relative overflow-hidden" style={{ minHeight: "85vh" }}>
            {/* Background image with gradient overlay */}
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1400&q=80" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/30" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white" />
            </div>

            <div className="max-w-6xl mx-auto px-5 relative pt-14 pb-16">
              {/* Tips carousel on the image area */}
              <div className="mb-8 animate-fade-up">
                <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 px-4 py-2.5 rounded-2xl transition-all duration-500">
                  <span className="text-xl">{tips[tipIndex].emoji}</span>
                  <span className="text-sm text-hp-dark font-medium">{tips[tipIndex].text}</span>
                  <div className="flex gap-1 ml-2">{tips.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === tipIndex ? "bg-hp-navy" : "bg-gray-300"}`} />)}</div>
                </div>
              </div>

              <div className="max-w-xl">
                <div className="animate-fade-up-1">
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-hp-green/20 text-hp-green text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                    <span className="w-2 h-2 rounded-full bg-hp-green animate-pulse-ring" />{t.badge}
                  </div>
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-[3rem] sm:text-[3.5rem] leading-[1.08] text-hp-navy mb-5 animate-fade-up-2">
                  {t.h1a}<br /><span className="italic text-hp-blue">{t.h1b}</span>
                </h1>
                <p className="text-base text-hp-gray max-w-md mb-10 leading-relaxed animate-fade-up-3">{t.sub}</p>

                {/* 3 CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-up-4">
                  <button onClick={() => setScreen("symptoms")} className="flex items-center justify-center gap-3 bg-hp-navy text-white px-6 py-3.5 rounded-2xl font-semibold text-sm hover:bg-hp-navy/90 transition-all hover:shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-hp-coral animate-pulse-ring" />{t.cta1}
                  </button>
                  <button onClick={() => setScreen("results")} className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-hp-dark px-6 py-3.5 rounded-2xl font-semibold text-sm hover:border-hp-blue hover:text-hp-blue transition-all">
                    {t.cta2}
                  </button>
                  <button onClick={() => setScreen("surgery")} className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-hp-dark px-6 py-3.5 rounded-2xl font-semibold text-sm hover:border-hp-green hover:text-hp-green transition-all">
                    🔬 {t.cta3}
                  </button>
                </div>
              </div>

              <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm">
                {[{ v: t.stat1, l: t.stat1l }, { v: t.stat2, l: t.stat2l }, { v: t.stat3, l: t.stat3l }].map(s => (
                  <div key={s.l}><p className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">{s.v}</p><p className="text-[11px] text-hp-gray mt-1">{s.l}</p></div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-20 px-5 bg-white">
            <div className="max-w-6xl mx-auto">
              <p className="text-xs font-semibold text-hp-green tracking-widest uppercase mb-3">{t.howLabel}</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-14">{t.howTitle}</h2>
              <div className="grid sm:grid-cols-3 gap-10">
                {[{ s: "01", tt: t.s1t, d: t.s1d, c: "bg-hp-blue-light text-hp-blue" }, { s: "02", tt: t.s2t, d: t.s2d, c: "bg-hp-green-light text-hp-green" }, { s: "03", tt: t.s3t, d: t.s3d, c: "bg-hp-blue-light text-hp-navy" }].map(i => (
                  <div key={i.s}><div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${i.c} font-bold text-base mb-4`}>{i.s}</div><h3 className="font-semibold text-lg text-hp-dark mb-2">{i.tt}</h3><p className="text-sm text-hp-gray leading-relaxed">{i.d}</p></div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-20 px-5 bg-hp-navy"><div className="max-w-4xl mx-auto text-center"><h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-4">{t.hospCta}</h2><p className="text-white/50 max-w-md mx-auto mb-8 text-sm">{t.hospCtaSub}</p><a href="/convenio" className="inline-block bg-hp-green text-white px-8 py-3 rounded-xl font-semibold hover:bg-hp-green-dark transition-colors">{t.hospCtaBtn}</a></div></section>
          <footer className="py-8 px-5 bg-hp-light border-t border-gray-100"><div className="max-w-6xl mx-auto flex items-center justify-between"><span className="text-xs text-hp-gray">HealthPing — Tu ping a la salud</span><p className="text-[11px] text-hp-gray-light">© 2026 HealthPing</p></div></footer>
        </>
      )}

      {/* ═══════ SURGERY (Coming Soon) ═══════ */}
      {screen === "surgery" && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light flex items-center justify-center">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 rounded-2xl bg-hp-navy flex items-center justify-center mx-auto mb-6"><span className="text-3xl">🔬</span></div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-3">{t.comingSoon}</h1>
            <p className="text-hp-gray mb-8 text-sm leading-relaxed">{t.comingSoonSub}</p>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2 max-w-sm mx-auto">
              <input type="email" placeholder="tu@email.com" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green transition-colors" />
              <button type="submit" className="bg-hp-green text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-hp-green-dark transition-colors">OK</button>
            </form>
            <button onClick={() => setScreen("home")} className="mt-8 text-sm text-hp-gray hover:text-hp-navy transition-colors">{t.back}</button>
          </div>
        </section>
      )}

      {/* ═══════ SYMPTOMS ═══════ */}
      {screen === "symptoms" && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
          <div className="max-w-lg mx-auto">
            <div className="flex gap-1.5 mb-8 mt-4"><div className="h-1 flex-1 rounded-full bg-hp-green" /><div className="h-1 flex-1 rounded-full bg-gray-200" /><div className="h-1 flex-1 rounded-full bg-gray-200" /></div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">{t.sympTitle}</h2>
            <p className="text-sm text-hp-gray mb-8">{t.sympSub}</p>
            <div className="mb-8"><p className="text-sm font-medium text-hp-dark mb-3">{t.whereHurt}</p><div className="grid grid-cols-4 gap-2">{BODY_ZONES_ES.map(z => (<button key={z.id} onClick={() => setSelectedZone(z.id)} className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${selectedZone === z.id ? "border-hp-green bg-hp-green-light" : "border-gray-200 bg-white hover:border-hp-blue-mid"}`}><span className="text-xl">{z.emoji}</span><span className="text-[11px] font-medium text-hp-dark">{lang === "es" ? z.label : z.labelEn}</span></button>))}</div></div>
            <div className="mb-8"><div className="flex items-center justify-between mb-3"><p className="text-sm font-medium text-hp-dark">{t.howBad}</p><span className={`text-sm font-bold ${painLevel >= 7 ? "text-hp-coral" : painLevel >= 4 ? "text-hp-amber" : "text-hp-green"}`}>{painLevel}/10</span></div><input type="range" min={1} max={10} value={painLevel} onChange={e => setPainLevel(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-hp-green" style={{ background: "linear-gradient(to right, #16A085 0%, #F39C12 50%, #E74C3C 100%)" }} /><div className="flex justify-between text-[10px] text-hp-gray mt-1"><span>{t.mild}</span><span>{t.moderate}</span><span>{t.intense}</span></div></div>
            <div className="mb-8"><p className="text-sm font-medium text-hp-dark mb-3">{t.whatElse}</p><div className="flex flex-wrap gap-2">{extras.map(s => (<button key={s} onClick={() => setExtraSymptoms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])} className={`text-xs px-3 py-2 rounded-full border transition-all font-medium ${extraSymptoms.includes(s) ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{s}</button>))}</div></div>
            <div className="mb-10"><p className="text-sm font-medium text-hp-dark mb-3">{t.sinceWhen}</p><div className="grid grid-cols-4 gap-2">{sinceOpts.map(o => (<button key={o.id} onClick={() => setSince(o.id)} className={`text-xs px-2 py-3 rounded-xl border-2 transition-all font-medium ${since === o.id ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{o.l}</button>))}</div></div>
            <button onClick={() => setScreen("insurance")} disabled={!selectedZone} className="w-full bg-hp-navy text-white py-4 rounded-2xl font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed">{t.next}</button>
            <button onClick={() => setScreen("home")} className="w-full mt-3 text-sm text-hp-gray hover:text-hp-dark transition-colors py-2">{t.back}</button>
          </div>
        </section>
      )}

      {/* ═══════ INSURANCE ═══════ */}
      {screen === "insurance" && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
          <div className="max-w-lg mx-auto">
            <div className="flex gap-1.5 mb-8 mt-4"><div className="h-1 flex-1 rounded-full bg-hp-green" /><div className="h-1 flex-1 rounded-full bg-hp-green" /><div className="h-1 flex-1 rounded-full bg-gray-200" /></div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">{t.insTitle}</h2>
            <p className="text-sm text-hp-gray mb-8">{t.insSub}</p>
            <div className="grid grid-cols-2 gap-2 mb-6">{INSURERS_LIST.map(ins => (<button key={ins} onClick={() => setSelectedInsurer(selectedInsurer === ins ? null : ins)} className={`text-sm px-4 py-3 rounded-xl border-2 font-medium text-left ${selectedInsurer === ins ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{ins}</button>))}</div>
            <button onClick={() => { setSelectedInsurer(null); requestLocationAndGo(); }} className="w-full text-sm text-hp-gray py-3 mb-3 border border-gray-200 rounded-xl bg-white">{t.noIns}</button>
            <button onClick={requestLocationAndGo} className="w-full bg-hp-navy text-white py-4 rounded-2xl font-semibold text-base">{t.seeHosp}</button>
            <button onClick={() => setScreen("symptoms")} className="w-full mt-3 text-sm text-hp-gray py-2">{t.back}</button>
          </div>
        </section>
      )}

      {/* ═══════ RESULTS ═══════ */}
      {screen === "results" && !apptCode && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
          <div className="max-w-3xl mx-auto mt-4">
            <div className="mb-5"><HospitalMap hospitals={sorted.filter(h => h.type === "hospital").map(h => ({ id: h.id, name: h.name, lat: h.lat, lng: h.lng, isPremium: h.isPremium, level: h.level, anticipoRange: h.anticipoRange }))} userLat={userLat} userLng={userLng} onSelectHospital={handleMapSelect} /></div>
            <div className="flex items-end justify-between mb-4"><div><h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">{t.resultsTitle}</h2><p className="text-xs text-hp-gray mt-1">{sorted.length} {lang === "es" ? "opciones" : "options"}{selectedInsurer && ` · ${selectedInsurer}`}</p></div></div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedInsurer && <span className="text-xs px-3 py-1.5 rounded-full bg-hp-blue-light border border-hp-blue/20 text-hp-blue font-medium flex items-center gap-1.5">🛡️ {selectedInsurer}<button onClick={() => setSelectedInsurer(null)} className="ml-1 hover:text-hp-coral">✕</button></span>}
              <button onClick={() => setConvenioFilter(!convenioFilter)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${convenioFilter ? "bg-hp-green-light border-hp-green text-hp-green" : "border-gray-200 bg-white text-hp-gray"}`}>{convenioFilter ? `${t.onlyConvenio} ✓` : t.onlyConvenio}</button>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white"><option value="distance">{t.closest}</option><option value="cost">{t.cheapest}</option><option value="rating">{t.bestRated}</option><option value="transparency">{t.mostTransp}</option></select>
            </div>

            <div className="flex flex-col gap-3">
              {sorted.map(h => (
                <div key={h.id} id={`hospital-${h.id}`} className={`bg-white rounded-2xl border transition-all ${h.isPremium ? "border-hp-green/30 ring-1 ring-hp-green/10" : h.type === "pharmacy" ? "border-hp-amber/30" : "border-gray-200"} ${expandedHospital === h.id ? "shadow-lg" : "hover:shadow-md"}`}>
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-semibold text-base text-hp-dark">{h.name}</h3>
                          <LevelBadge level={h.level} type={h.type} />
                          {h.isPremium && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-hp-green text-white">Convenio</span>}
                          {h.urgenciasOpen && h.type === "hospital" && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-hp-green-light text-hp-green">Urgencias</span>}
                          {h.type === "pharmacy" && h.urgenciasOpen && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-hp-amber-light text-hp-amber">{t.openNow}</span>}
                          {h.hasMyInsurance && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-hp-blue text-white">{lang === "es" ? "Acepta" : "Accepts"} {selectedInsurer}</span>}
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-hp-gray mt-1">
                          <span>{h.distanceKm !== null ? `📍 ${h.distanceKm.toFixed(1)} km` : "📍 —"}</span>
                          <span>⏱ {h.waitTime}</span><span>★ {h.rating}</span>
                          {h.type === "hospital" && <span className="flex items-center gap-1.5">{lang === "es" ? "Transparencia" : "Transparency"} <Dots level={h.transparency} /></span>}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">{h.services.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-hp-light border border-gray-100 text-hp-gray">{s}</span>)}</div>
                      </div>
                      <div className="sm:text-right flex-shrink-0 sm:min-w-[150px]">
                        {h.type === "hospital" && <><p className="text-[10px] text-hp-gray uppercase tracking-wider mb-0.5">{lang === "es" ? "Anticipo estimado" : "Estimated deposit"}</p><p className="font-[family-name:var(--font-display)] text-xl text-hp-navy">{h.anticipoRange}</p></>}
                        {h.type === "pharmacy" && <><p className="text-[10px] text-hp-gray uppercase tracking-wider mb-0.5">{t.estimated}</p><p className="font-[family-name:var(--font-display)] text-xl text-hp-amber">{h.costoInicial}</p></>}
                        <p className="text-[10px] text-hp-gray mt-0.5">{h.type === "hospital" ? `Costo inicial: ${h.costoInicial}` : ""}</p>
                        <div className="flex flex-col gap-2 mt-3">
                          {h.type === "hospital" && <button onClick={() => setExpandedHospital(expandedHospital === h.id ? null : h.id)} className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-hp-gray hover:border-hp-blue hover:text-hp-blue transition-colors">{expandedHospital === h.id ? t.close : t.seeBreakdown}</button>}
                          {h.isPremium && <button onClick={() => { setSelectedHospitalId(h.id); setScreen("appointment"); }} className="text-xs px-4 py-2 rounded-lg bg-hp-navy text-white font-medium">{t.requestAppt}</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedHospital === h.id && h.type === "hospital" && (
                    <div className="border-t border-gray-100 p-5 bg-hp-light/50 rounded-b-2xl animate-fade-in">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div><p className="text-xs font-semibold text-hp-dark mb-3">{t.included}</p>{h.desglose.filter(d => d.included).map(d => (<div key={d.name} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"><span className="text-xs text-hp-gray flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-green" />{d.name}</span><span className="text-xs font-semibold text-hp-dark">{d.price}</span></div>))}</div>
                        <div><p className="text-xs font-semibold text-hp-dark mb-3">{t.mayIncrease}</p>{h.desglose.filter(d => !d.included).map(d => (<div key={d.name} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"><span className="text-xs text-hp-gray flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-amber" />{d.name}</span><span className="text-xs font-semibold text-hp-dark">{d.price}</span></div>))}</div>
                      </div>
                      {h.acceptsInsurance && <div className="mt-4 p-3 bg-hp-blue-light rounded-xl"><p className="text-xs font-semibold text-hp-blue mb-1">{t.insAccepted}</p><div className="flex flex-wrap gap-1.5 mt-1">{h.insurers.map(ins => <span key={ins} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${selectedInsurer === ins ? "bg-hp-blue text-white" : "bg-white text-hp-blue"}`}>{ins}</span>)}</div></div>}
                      <div className="mt-4 p-3 bg-hp-green-light rounded-xl"><p className="text-xs font-semibold text-hp-green-dark mb-1">{t.beforeEnter}</p><ul className="text-[11px] text-hp-gray space-y-1"><li>• {t.q1}</li><li>• {t.q2}</li><li>• {t.q3}</li><li>• {t.q4}</li></ul></div>
                    </div>
                  )}
                </div>
              ))}
              {sorted.length === 0 && <div className="text-center py-12"><p className="text-hp-gray text-sm">{t.noResults}</p><button onClick={() => { setConvenioFilter(false); setSelectedInsurer(null); }} className="mt-3 text-xs text-hp-blue hover:underline">{t.clearFilters}</button></div>}
            </div>
            <button onClick={() => setScreen(selectedZone ? "insurance" : "home")} className="w-full mt-6 text-sm text-hp-gray py-2">{t.back}</button>
          </div>
        </section>
      )}

      {/* ═══════ APPOINTMENT ═══════ */}
      {screen === "appointment" && !apptCode && selectedHospital && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
          <div className="max-w-md mx-auto mt-4">
            <div className="flex gap-1.5 mb-8"><div className="h-1 flex-1 rounded-full bg-hp-green" /><div className="h-1 flex-1 rounded-full bg-hp-green" /><div className="h-1 flex-1 rounded-full bg-hp-green" /></div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">{t.apptTitle}</h2>
            <p className="text-sm text-hp-gray mb-2">{t.apptAt} <span className="font-semibold text-hp-dark">{selectedHospital.name}</span></p>
            {!isInSchedule() && <div className="bg-hp-amber-light border border-hp-amber/20 rounded-xl p-3 mb-4"><p className="text-xs text-hp-amber font-medium">{t.apptNoSchedule}</p></div>}
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.name}</label><input value={apptName} onChange={e => setApptName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green" /></div>
              <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.email}</label><input value={apptEmail} onChange={e => setApptEmail(e.target.value)} type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green" /></div>
              <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.phone}</label><input value={apptPhone} onChange={e => setApptPhone(e.target.value)} type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green" /></div>
              <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.when}</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setApptTime("morning")} className={`text-xs px-3 py-3 rounded-xl border-2 font-medium ${apptTime === "morning" ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{t.morning}</button><button onClick={() => setApptTime("afternoon")} className={`text-xs px-3 py-3 rounded-xl border-2 font-medium ${apptTime === "afternoon" ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray"}`}>{t.afternoon}</button></div></div>
              <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.describe}</label><textarea value={apptDesc} onChange={e => setApptDesc(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green resize-none" /></div>
            </div>
            {apptError && <p className="text-xs text-hp-coral mt-3">{apptError}</p>}
            <button onClick={handleAppointment} disabled={!apptName || !apptEmail || !apptPhone || apptSending} className="w-full mt-6 bg-hp-navy text-white py-4 rounded-2xl font-semibold disabled:opacity-40">{apptSending ? t.sending : t.send}</button>
            <button onClick={() => setScreen("results")} className="w-full mt-3 text-sm text-hp-gray py-2">{t.back}</button>
          </div>
        </section>
      )}

      {/* ═══════ CONFIRMATION ═══════ */}
      {apptCode && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light flex items-center justify-center">
          <div className="max-w-md mx-auto text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-hp-green-light flex items-center justify-center mx-auto mb-6"><span className="text-hp-green text-2xl">✓</span></div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-2">{t.confTitle}</h2>
            <p className="text-sm text-hp-gray mb-6">{t.confSub}</p>
            <div className="bg-white border-2 border-hp-green rounded-2xl px-8 py-5 inline-block mb-6"><p className="font-mono text-3xl font-bold text-hp-navy tracking-widest">{apptCode}</p></div>
            <p className="text-xs text-hp-gray mb-8">{t.confSave}</p>
            <div className="flex flex-col gap-3">
              <a href={`/verificar?code=${apptCode}`} className="bg-hp-navy text-white py-3 rounded-xl font-semibold text-sm block">{t.verify}</a>
              <button onClick={() => { setScreen("home"); setApptCode(null); setApptName(""); setApptEmail(""); setApptPhone(""); setApptDesc(""); }} className="text-sm text-hp-gray py-2">{t.backHome}</button>
            </div>
          </div>
        </section>
      )}
    </main>
    </LangCtx.Provider>
  );
}
