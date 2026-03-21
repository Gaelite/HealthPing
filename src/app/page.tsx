"use client";

import { useState, useCallback } from "react";
import HospitalMap from "@/components/HospitalMap";

/* ═══════ MOCK DATA ═══════ */

const BODY_ZONES = [
  { id: "head", label: "Cabeza", emoji: "🧠", needs: ["CONSULTATION", "IMAGING"] },
  { id: "chest", label: "Pecho", emoji: "🫁", needs: ["EMERGENCY", "IMAGING", "LAB"] },
  { id: "abdomen", label: "Abdomen", emoji: "🫃", needs: ["EMERGENCY", "SURGERY", "IMAGING", "LAB"] },
  { id: "back", label: "Espalda", emoji: "🦴", needs: ["CONSULTATION", "IMAGING"] },
  { id: "limbs", label: "Extremidades", emoji: "💪", needs: ["EMERGENCY", "IMAGING"] },
  { id: "throat", label: "Garganta", emoji: "🗣️", needs: ["CONSULTATION", "LAB"] },
  { id: "skin", label: "Piel", emoji: "🩹", needs: ["CONSULTATION"] },
  { id: "general", label: "Malestar general", emoji: "🤒", needs: ["CONSULTATION", "LAB"] },
];

const EXTRA_SYMPTOMS = [
  "Fiebre", "Náusea", "Vómito", "Dificultad para respirar",
  "Mareo", "Sangrado", "Dolor intenso repentino", "Diarrea",
];

const SINCE_OPTIONS = [
  { id: "1h", label: "Menos de 1 hora" },
  { id: "1-6h", label: "1 a 6 horas" },
  { id: "6h+", label: "Más de 6 horas" },
  { id: "days", label: "Varios días" },
];

type ServiceCat = "EMERGENCY" | "CONSULTATION" | "SURGERY" | "LAB" | "IMAGING";

const MOCK_HOSPITALS = [
  {
    id: 1, name: "Hospital San Javier", level: "THIRD",
    lat: 20.6767, lng: -103.3812,
    anticipoRange: "$8,000 - $15,000", costoInicial: "$2,500 - $6,000",
    waitTime: "~15 min", rating: 4.6, urgenciasOpen: true,
    acceptsInsurance: true,
    insurers: ["GNP", "AXA", "Metlife", "Seguros Monterrey"],
    transparency: 4,
    serviceCategories: ["EMERGENCY", "SURGERY", "LAB", "IMAGING", "CONSULTATION"] as ServiceCat[],
    services: ["Urgencias 24h", "Cirugía", "Lab", "Imagen"],
    isPremium: true,
    desglose: [
      { name: "Admisión y valoración", price: "$800 - $1,500", included: true },
      { name: "Laboratorio básico", price: "$600 - $1,200", included: true },
      { name: "Honorarios médico urgencias", price: "$1,000 - $2,000", included: true },
      { name: "Medicamentos iniciales", price: "$300 - $800", included: true },
      { name: "Ultrasonido / Rayos X", price: "$1,500 - $3,000", included: false },
      { name: "Tomografía", price: "$4,000 - $8,000", included: false },
      { name: "Cirugía (si aplica)", price: "$15,000 - $45,000", included: false },
      { name: "Cuarto por noche", price: "$3,000 - $6,000", included: false },
    ],
  },
  {
    id: 2, name: "Clínica del Valle", level: "SECOND",
    lat: 20.6700, lng: -103.3650,
    anticipoRange: "$5,000 - $10,000", costoInicial: "$1,800 - $4,000",
    waitTime: "~25 min", rating: 4.3, urgenciasOpen: true,
    acceptsInsurance: true,
    insurers: ["GNP", "AXA", "BUPA"],
    transparency: 3,
    serviceCategories: ["EMERGENCY", "CONSULTATION", "LAB"] as ServiceCat[],
    services: ["Urgencias 24h", "Consulta", "Lab"],
    isPremium: false,
    desglose: [
      { name: "Admisión y valoración", price: "$500 - $1,000", included: true },
      { name: "Laboratorio básico", price: "$400 - $900", included: true },
      { name: "Honorarios médico", price: "$700 - $1,500", included: true },
      { name: "Medicamentos iniciales", price: "$200 - $600", included: true },
      { name: "Rayos X", price: "$800 - $1,500", included: false },
      { name: "Cuarto por noche", price: "$2,000 - $4,000", included: false },
    ],
  },
  {
    id: 3, name: "Hospital Puerta de Hierro", level: "THIRD",
    lat: 20.7050, lng: -103.4100,
    anticipoRange: "$12,000 - $25,000", costoInicial: "$4,000 - $8,000",
    waitTime: "~10 min", rating: 4.8, urgenciasOpen: true,
    acceptsInsurance: true,
    insurers: ["GNP", "AXA", "Metlife", "Seguros Monterrey", "Zurich", "BUPA", "Allianz"],
    transparency: 5,
    serviceCategories: ["EMERGENCY", "SURGERY", "LAB", "IMAGING", "CONSULTATION"] as ServiceCat[],
    services: ["Urgencias 24h", "Cirugía", "UCI", "Lab", "Imagen"],
    isPremium: true,
    desglose: [
      { name: "Admisión y valoración", price: "$1,200 - $2,000", included: true },
      { name: "Laboratorio completo", price: "$900 - $1,800", included: true },
      { name: "Honorarios médico urgencias", price: "$1,500 - $3,000", included: true },
      { name: "Medicamentos", price: "$400 - $1,000", included: true },
      { name: "Ultrasonido / Rayos X", price: "$2,000 - $4,000", included: false },
      { name: "Tomografía", price: "$5,000 - $10,000", included: false },
      { name: "Cirugía (si aplica)", price: "$20,000 - $60,000", included: false },
      { name: "Anestesiólogo", price: "$5,000 - $12,000", included: false },
      { name: "Cuarto por noche", price: "$4,500 - $8,000", included: false },
    ],
  },
  {
    id: 4, name: "Médica Sur Guadalajara", level: "FIRST",
    lat: 20.6600, lng: -103.3500,
    anticipoRange: "$3,000 - $6,000", costoInicial: "$800 - $2,000",
    waitTime: "~35 min", rating: 4.1, urgenciasOpen: false,
    acceptsInsurance: false,
    insurers: [],
    transparency: 2,
    serviceCategories: ["CONSULTATION", "LAB"] as ServiceCat[],
    services: ["Consulta", "Lab básico"],
    isPremium: false,
    desglose: [
      { name: "Consulta médica", price: "$500 - $800", included: true },
      { name: "Laboratorio básico", price: "$300 - $600", included: true },
      { name: "Medicamentos", price: "$150 - $400", included: true },
      { name: "Rayos X", price: "$600 - $1,200", included: false },
    ],
  },
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ═══════ SUB-COMPONENTS ═══════ */

function LevelBadge({ level }: { level: string }) {
  const c: Record<string, { label: string; cls: string }> = {
    FIRST: { label: "1er nivel", cls: "bg-hp-green-light text-hp-green" },
    SECOND: { label: "2do nivel", cls: "bg-hp-blue-light text-hp-blue" },
    THIRD: { label: "3er nivel", cls: "bg-hp-blue-light text-hp-navy" },
  };
  const x = c[level] || c.FIRST;
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${x.cls}`}>{x.label}</span>;
}

function Dots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? "bg-hp-green" : "bg-gray-200"}`} />)}
    </div>
  );
}

/* ═══════ MAIN ═══════ */

type Screen = "home" | "symptoms" | "results" | "appointment";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [painLevel, setPainLevel] = useState(5);
  const [extraSymptoms, setExtraSymptoms] = useState<string[]>([]);
  const [since, setSince] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("distance");
  const [expandedHospital, setExpandedHospital] = useState<number | null>(null);
  const [insuranceFilter, setInsuranceFilter] = useState(false);
  const [convenioFilter, setConvenioFilter] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);

  const [apptName, setApptName] = useState("");
  const [apptEmail, setApptEmail] = useState("");
  const [apptPhone, setApptPhone] = useState("");
  const [apptDesc, setApptDesc] = useState("");
  const [apptSending, setApptSending] = useState(false);
  const [apptCode, setApptCode] = useState<string | null>(null);
  const [apptError, setApptError] = useState<string | null>(null);

  const isUrgent = painLevel >= 7 || extraSymptoms.includes("Dificultad para respirar") || extraSymptoms.includes("Dolor intenso repentino") || extraSymptoms.includes("Sangrado");

  const requestLocation = useCallback(() => {
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); setGeoStatus("done"); },
      () => setGeoStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Get needed service categories based on symptom selection
  const neededServices: ServiceCat[] = selectedZone
    ? (BODY_ZONES.find((z) => z.id === selectedZone)?.needs as ServiceCat[]) || []
    : [];

  // Enrich hospitals with distance and match score
  const enriched = MOCK_HOSPITALS.map((h) => {
    const distanceKm = userLat && userLng ? getDistance(userLat, userLng, h.lat, h.lng) : null;
    const matchCount = neededServices.filter((s) => h.serviceCategories.includes(s)).length;
    const canServe = neededServices.length === 0 || matchCount > 0;
    return { ...h, distanceKm, matchCount, canServe };
  });

  // Filter
  const filtered = enriched
    .filter((h) => h.canServe)
    .filter((h) => !insuranceFilter || h.acceptsInsurance)
    .filter((h) => !convenioFilter || h.isPremium);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "distance" && a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
    if (sortBy === "cost") return parseInt(a.costoInicial.replace(/\D/g, "")) - parseInt(b.costoInicial.replace(/\D/g, ""));
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "transparency") return b.transparency - a.transparency;
    if (sortBy === "cost-desc") return parseInt(b.costoInicial.replace(/\D/g, "")) - parseInt(a.costoInicial.replace(/\D/g, ""));
    return 0;
  });

  const selectedHospital = MOCK_HOSPITALS.find((h) => h.id === selectedHospitalId);

  const handleAppointment = async () => {
    if (!apptName || !apptEmail || !apptPhone || !selectedHospitalId) return;
    setApptSending(true); setApptError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalName: selectedHospital?.name, patientName: apptName, patientEmail: apptEmail, patientPhone: apptPhone, symptomDescription: apptDesc || selectedZone || "No especificado" }),
      });
      const data = await res.json();
      if (data.code) setApptCode(data.code);
      else setApptError(data.error || "Error al crear cita");
    } catch { setApptError("Error de conexión"); }
    setApptSending(false);
  };

  const handleMapSelect = useCallback((id: number) => {
    setExpandedHospital(id);
    document.getElementById(`hospital-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => { setScreen("home"); setExpandedHospital(null); setApptCode(null); }} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-hp-navy flex items-center justify-center group-hover:bg-hp-blue transition-colors">
              <span className="text-white text-sm font-bold tracking-tight">HP</span>
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg text-hp-navy">Health<span className="text-hp-green">Ping</span></span>
          </button>
          <div className="hidden sm:flex items-center gap-5 text-sm">
            <a href="/verificar" className="text-hp-gray hover:text-hp-navy transition-colors">Verificar cita</a>
            <a href="/hospital" className="text-hp-gray hover:text-hp-navy transition-colors">Dashboard</a>
            <a href="/convenio" className="bg-hp-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hp-green-dark transition-colors">Soy hospital</a>
          </div>
        </div>
      </nav>

      {/* ═══════ HOME ═══════ */}
      {screen === "home" && (
        <>
          <section className="pt-28 pb-20 px-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-hp-blue-pale via-white to-hp-green-light opacity-60" />
            <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-hp-green/5 blur-3xl" />
            <div className="max-w-6xl mx-auto relative">
              <div className="max-w-xl">
                <div className="animate-fade-up">
                  <div className="inline-flex items-center gap-2 bg-white border border-hp-green/20 text-hp-green text-xs font-semibold px-3 py-1.5 rounded-full mb-7">
                    <span className="w-2 h-2 rounded-full bg-hp-green animate-pulse-ring" />
                    Disponible en Jalisco — FIFA World Cup 2026
                  </div>
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-[3.2rem] sm:text-6xl leading-[1.08] text-hp-navy mb-5 animate-fade-up-1">
                  Te ayudamos a decidir<br /><span className="italic text-hp-blue">a dónde ir</span>
                </h1>
                <p className="text-base sm:text-lg text-hp-gray max-w-md mb-10 leading-relaxed animate-fade-up-2">
                  Compara hospitales, revisa costos y da seguimiento a tu cuenta mientras te atienden. Sin registro, sin sorpresas.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-up-3">
                  <button onClick={() => setScreen("symptoms")} className="flex items-center justify-center gap-3 bg-hp-navy text-white px-7 py-4 rounded-2xl font-semibold text-base hover:bg-hp-navy/90 transition-all hover:shadow-lg hover:shadow-hp-navy/10">
                    <span className="w-3 h-3 rounded-full bg-hp-coral animate-pulse-ring" />Me siento mal ahora
                  </button>
                  <button onClick={() => setScreen("results")} className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-hp-dark px-7 py-4 rounded-2xl font-semibold text-base hover:border-hp-blue hover:text-hp-blue transition-all">
                    Solo quiero comparar hospitales
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 mt-6 animate-fade-up-4">
                  <button onClick={requestLocation}
                    className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${geoStatus === "done" ? "bg-hp-green-light border-hp-green text-hp-green" : geoStatus === "loading" ? "bg-hp-blue-light border-hp-blue text-hp-blue" : geoStatus === "error" ? "bg-hp-coral-light border-hp-coral text-hp-coral" : "bg-white/80 border-gray-200 text-hp-gray hover:border-hp-blue hover:text-hp-blue"}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {geoStatus === "done" ? "Ubicación activada ✓" : geoStatus === "loading" ? "Obteniendo..." : geoStatus === "error" ? "No disponible" : "Usar mi ubicación"}
                  </button>
                  <button onClick={() => setInsuranceFilter(!insuranceFilter)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${insuranceFilter ? "bg-hp-green-light border-hp-green text-hp-green" : "bg-white/80 border-gray-200 text-hp-gray hover:border-hp-green hover:text-hp-green"}`}>
                    {insuranceFilter ? "Seguro: filtrado ✓" : "Tengo seguro"}
                  </button>
                </div>
              </div>
              <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm">
                {[{ value: "434+", label: "Hospitales en Jalisco" }, { value: "<2s", label: "Tiempo de respuesta" }, { value: "$0", label: "Costo para ti" }].map((s) => (
                  <div key={s.label}><p className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">{s.value}</p><p className="text-[11px] text-hp-gray mt-1">{s.label}</p></div>
                ))}
              </div>
            </div>
          </section>
          <section id="como-funciona" className="py-20 px-5 bg-white">
            <div className="max-w-6xl mx-auto">
              <p className="text-xs font-semibold text-hp-green tracking-widest uppercase mb-3">Cómo funciona</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-14">De tu síntoma a tu cita<br />en 3 pasos</h2>
              <div className="grid sm:grid-cols-3 gap-10">
                {[
                  { step: "01", title: "Describe qué sientes", desc: "Selecciona la zona, intensidad y síntomas extra. Sin formularios largos.", color: "bg-hp-blue-light text-hp-blue" },
                  { step: "02", title: "Compara hospitales", desc: "Solo ves los que pueden atenderte. Precios, seguros, transparencia y mapa.", color: "bg-hp-green-light text-hp-green" },
                  { step: "03", title: "Agenda y llega preparado", desc: "Solicita cita sin registro. Confirmación por correo con código.", color: "bg-hp-blue-light text-hp-navy" },
                ].map((item) => (
                  <div key={item.step}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.color} font-bold text-base mb-4`}>{item.step}</div>
                    <h3 className="font-semibold text-lg text-hp-dark mb-2">{item.title}</h3>
                    <p className="text-sm text-hp-gray leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-20 px-5 bg-hp-navy">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-4">¿Eres hospital o clínica?</h2>
              <p className="text-white/50 max-w-md mx-auto mb-8 text-sm">Únete como hospital convenio.</p>
              <a href="/convenio" className="inline-block bg-hp-green text-white px-8 py-3 rounded-xl font-semibold hover:bg-hp-green-dark transition-colors">Quiero ser convenio</a>
            </div>
          </section>
          <footer className="py-8 px-5 bg-hp-light border-t border-gray-100">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-hp-gray">HealthPing — Tu ping a la salud</span>
              <p className="text-[11px] text-hp-gray-light">© 2026 HealthPing. Jalisco, México.</p>
            </div>
          </footer>
        </>
      )}

      {/* ═══════ SYMPTOMS ═══════ */}
      {screen === "symptoms" && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
          <div className="max-w-lg mx-auto">
            <div className="flex gap-1.5 mb-8 mt-4"><div className="h-1 flex-1 rounded-full bg-hp-green" /><div className="h-1 flex-1 rounded-full bg-gray-200" /><div className="h-1 flex-1 rounded-full bg-gray-200" /></div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">¿Qué sientes?</h2>
            <p className="text-sm text-hp-gray mb-8">Selecciona rápido, sin formularios largos.</p>
            <div className="mb-8">
              <p className="text-sm font-medium text-hp-dark mb-3">¿Dónde te duele?</p>
              <div className="grid grid-cols-4 gap-2">
                {BODY_ZONES.map((z) => (
                  <button key={z.id} onClick={() => setSelectedZone(z.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${selectedZone === z.id ? "border-hp-green bg-hp-green-light" : "border-gray-200 bg-white hover:border-hp-blue-mid"}`}>
                    <span className="text-xl">{z.emoji}</span>
                    <span className="text-[11px] font-medium text-hp-dark">{z.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-hp-dark">¿Qué tan fuerte?</p>
                <span className={`text-sm font-bold ${painLevel >= 7 ? "text-hp-coral" : painLevel >= 4 ? "text-hp-amber" : "text-hp-green"}`}>{painLevel}/10</span>
              </div>
              <input type="range" min={1} max={10} value={painLevel} onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-hp-green"
                style={{ background: "linear-gradient(to right, #16A085 0%, #F39C12 50%, #E74C3C 100%)" }} />
              <div className="flex justify-between text-[10px] text-hp-gray mt-1"><span>Leve</span><span>Moderado</span><span>Intenso</span></div>
            </div>
            <div className="mb-8">
              <p className="text-sm font-medium text-hp-dark mb-3">¿Qué más sientes?</p>
              <div className="flex flex-wrap gap-2">
                {EXTRA_SYMPTOMS.map((s) => (
                  <button key={s} onClick={() => setExtraSymptoms((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])}
                    className={`text-xs px-3 py-2 rounded-full border transition-all font-medium ${extraSymptoms.includes(s) ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray hover:border-hp-blue"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-10">
              <p className="text-sm font-medium text-hp-dark mb-3">¿Desde cuándo?</p>
              <div className="grid grid-cols-2 gap-2">
                {SINCE_OPTIONS.map((o) => (
                  <button key={o.id} onClick={() => setSince(o.id)}
                    className={`text-xs px-3 py-3 rounded-xl border-2 transition-all font-medium ${since === o.id ? "border-hp-green bg-hp-green-light text-hp-green-dark" : "border-gray-200 bg-white text-hp-gray hover:border-hp-blue"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { if (!geoStatus.match(/done/)) requestLocation(); setScreen("results"); }} disabled={!selectedZone}
              className="w-full bg-hp-navy text-white py-4 rounded-2xl font-semibold text-base hover:bg-hp-navy/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Ver opciones cercanas
            </button>
            <button onClick={() => setScreen("home")} className="w-full mt-3 text-sm text-hp-gray hover:text-hp-dark transition-colors py-2">← Volver</button>
          </div>
        </section>
      )}

      {/* ═══════ RESULTS ═══════ */}
      {screen === "results" && !apptCode && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
          <div className="max-w-3xl mx-auto">
            {isUrgent ? (
              <div className="bg-hp-coral-light border border-hp-coral/20 rounded-2xl p-4 mb-5 mt-4 animate-fade-up">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-hp-coral flex items-center justify-center flex-shrink-0"><span className="text-white text-sm font-bold">!</span></span>
                  <div><p className="font-semibold text-hp-coral text-sm">Sí conviene que te atiendan hoy.</p><p className="text-xs text-hp-gray mt-1">Te recomendamos ir a urgencias lo antes posible.</p></div>
                </div>
              </div>
            ) : (
              <div className="bg-hp-green-light border border-hp-green/20 rounded-2xl p-4 mb-5 mt-4 animate-fade-up">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-hp-green flex items-center justify-center flex-shrink-0"><span className="text-white text-sm">✓</span></span>
                  <div><p className="font-semibold text-hp-green-dark text-sm">Tu caso parece moderado.</p><p className="text-xs text-hp-gray mt-1">Compara opciones con calma.</p></div>
                </div>
              </div>
            )}

            {/* MAP */}
            <div className="mb-5 animate-fade-up-1">
              <HospitalMap hospitals={sorted.map((h) => ({ id: h.id, name: h.name, lat: h.lat, lng: h.lng, isPremium: h.isPremium, level: h.level, anticipoRange: h.anticipoRange }))} userLat={userLat} userLng={userLng} onSelectHospital={handleMapSelect} />
            </div>

            {/* Filters */}
            <div className="flex items-end justify-between mb-5 animate-fade-up-2">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">Hospitales disponibles</h2>
                <p className="text-xs text-hp-gray mt-1">
                  {sorted.length} de {MOCK_HOSPITALS.length} pueden atenderte
                  {neededServices.length > 0 && <span className="text-hp-green font-medium"> (filtrado por servicios)</span>}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setInsuranceFilter(!insuranceFilter)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${insuranceFilter ? "bg-hp-green-light border-hp-green text-hp-green" : "border-gray-200 bg-white text-hp-gray"}`}>
                {insuranceFilter ? "Con seguro ✓" : "Con seguro"}
              </button>
              <button onClick={() => setConvenioFilter(!convenioFilter)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${convenioFilter ? "bg-hp-green-light border-hp-green text-hp-green" : "border-gray-200 bg-white text-hp-gray"}`}>
                {convenioFilter ? "Solo convenio ✓" : "Solo convenio"}
              </button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white">
                <option value="distance">Más cercano</option>
                <option value="cost">Más barato</option>
                <option value="cost-desc">Mayor calidad/precio</option>
                <option value="rating">Mejor calificado</option>
                <option value="transparency">Más transparente</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              {sorted.map((h) => (
                <div key={h.id} id={`hospital-${h.id}`} className={`bg-white rounded-2xl border transition-all ${h.isPremium ? "border-hp-green/30 ring-1 ring-hp-green/10" : "border-gray-200"} ${expandedHospital === h.id ? "shadow-lg" : "hover:shadow-md"}`}>
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-semibold text-base text-hp-dark">{h.name}</h3>
                          <LevelBadge level={h.level} />
                          {h.isPremium && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-hp-green text-white">Convenio</span>}
                          {h.urgenciasOpen && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-hp-green-light text-hp-green">Urgencias abiertas</span>}
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-hp-gray mt-1">
                          <span>{h.distanceKm !== null ? `📍 ${h.distanceKm.toFixed(1)} km` : "📍 —"}</span>
                          <span>⏱ {h.waitTime}</span>
                          <span>★ {h.rating}</span>
                          <span className="flex items-center gap-1.5">Transparencia <Dots level={h.transparency} /></span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {h.services.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-hp-light border border-gray-100 text-hp-gray">{s}</span>)}
                        </div>
                        {h.acceptsInsurance && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {h.insurers.map((ins) => <span key={ins} className="text-[9px] px-1.5 py-0.5 rounded bg-hp-blue-light text-hp-blue font-medium">{ins}</span>)}
                          </div>
                        )}
                      </div>
                      <div className="sm:text-right flex-shrink-0 sm:min-w-[160px]">
                        <p className="text-[10px] text-hp-gray uppercase tracking-wider mb-0.5">Anticipo estimado</p>
                        <p className="font-[family-name:var(--font-display)] text-xl text-hp-navy">{h.anticipoRange}</p>
                        <p className="text-[10px] text-hp-gray mt-0.5">Costo inicial: {h.costoInicial}</p>
                        <div className="flex flex-col gap-2 mt-3">
                          <button onClick={() => setExpandedHospital(expandedHospital === h.id ? null : h.id)}
                            className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-hp-gray hover:border-hp-blue hover:text-hp-blue transition-colors">
                            {expandedHospital === h.id ? "Cerrar" : "Ver desglose"}
                          </button>
                          {h.isPremium && (
                            <button onClick={() => { setSelectedHospitalId(h.id); setScreen("appointment"); }}
                              className="text-xs px-4 py-2 rounded-lg bg-hp-navy text-white font-medium hover:bg-hp-navy/90 transition-colors">
                              Solicitar cita
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedHospital === h.id && (
                    <div className="border-t border-gray-100 p-5 bg-hp-light/50 rounded-b-2xl animate-fade-in">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs font-semibold text-hp-dark mb-3">Incluido normalmente</p>
                          {h.desglose.filter((d) => d.included).map((d) => (
                            <div key={d.name} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                              <span className="text-xs text-hp-gray flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-green" />{d.name}</span>
                              <span className="text-xs font-semibold text-hp-dark">{d.price}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-hp-dark mb-3">Puede elevar la cuenta</p>
                          {h.desglose.filter((d) => !d.included).map((d) => (
                            <div key={d.name} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                              <span className="text-xs text-hp-gray flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-amber" />{d.name}</span>
                              <span className="text-xs font-semibold text-hp-dark">{d.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {h.acceptsInsurance && (
                        <div className="mt-4 p-3 bg-hp-blue-light rounded-xl">
                          <p className="text-xs font-semibold text-hp-blue mb-1">Seguros aceptados</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">{h.insurers.map((ins) => <span key={ins} className="text-[10px] px-2 py-0.5 rounded-full bg-white text-hp-blue font-medium">{ins}</span>)}</div>
                          <p className="text-[11px] text-hp-gray mt-2">Puede haber deducible, coaseguro y conceptos no cubiertos.</p>
                        </div>
                      )}
                      <div className="mt-4 p-3 bg-hp-green-light rounded-xl">
                        <p className="text-xs font-semibold text-hp-green-dark mb-1">Antes de entrar, pregunta:</p>
                        <ul className="text-[11px] text-hp-gray space-y-1">
                          <li>• ¿De cuánto es el anticipo y qué incluye?</li>
                          <li>• ¿Qué estudios podrían pedir primero?</li>
                          <li>• ¿Cómo cambia si hay cirugía?</li>
                          <li>• ¿Qué cubre mi seguro desde urgencias?</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {sorted.length === 0 && (
                <div className="text-center py-12"><p className="text-hp-gray text-sm">No hay hospitales que coincidan con tus filtros.</p>
                  <button onClick={() => { setInsuranceFilter(false); setConvenioFilter(false); }} className="mt-3 text-xs text-hp-blue hover:underline">Quitar filtros</button>
                </div>
              )}
            </div>
            <button onClick={() => setScreen(selectedZone ? "symptoms" : "home")} className="w-full mt-6 text-sm text-hp-gray hover:text-hp-dark transition-colors py-2">← Volver</button>
          </div>
        </section>
      )}

      {/* ═══════ APPOINTMENT ═══════ */}
      {screen === "appointment" && !apptCode && selectedHospital && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
          <div className="max-w-md mx-auto mt-4">
            <div className="flex gap-1.5 mb-8"><div className="h-1 flex-1 rounded-full bg-hp-green" /><div className="h-1 flex-1 rounded-full bg-hp-green" /><div className="h-1 flex-1 rounded-full bg-hp-green" /></div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">Solicitar cita</h2>
            <p className="text-sm text-hp-gray mb-2">En <span className="font-semibold text-hp-dark">{selectedHospital.name}</span></p>
            <p className="text-xs text-hp-gray mb-8">Sin registro. Confirmación por correo.</p>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-hp-dark mb-1 block">Nombre completo</label><input value={apptName} onChange={(e) => setApptName(e.target.value)} placeholder="Ana García" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green transition-colors" /></div>
              <div><label className="text-xs font-medium text-hp-dark mb-1 block">Correo electrónico</label><input value={apptEmail} onChange={(e) => setApptEmail(e.target.value)} type="email" placeholder="ana@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green transition-colors" /></div>
              <div><label className="text-xs font-medium text-hp-dark mb-1 block">Teléfono</label><input value={apptPhone} onChange={(e) => setApptPhone(e.target.value)} type="tel" placeholder="33 1234 5678" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green transition-colors" /></div>
              <div><label className="text-xs font-medium text-hp-dark mb-1 block">Describe tu situación</label><textarea value={apptDesc} onChange={(e) => setApptDesc(e.target.value)} rows={3} placeholder="Dolor en abdomen desde hace 3 horas..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green transition-colors resize-none" /></div>
            </div>
            {apptError && <p className="text-xs text-hp-coral mt-3">{apptError}</p>}
            <button onClick={handleAppointment} disabled={!apptName || !apptEmail || !apptPhone || apptSending}
              className="w-full mt-6 bg-hp-navy text-white py-4 rounded-2xl font-semibold text-base hover:bg-hp-navy/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {apptSending ? "Enviando..." : "Enviar solicitud"}
            </button>
            <button onClick={() => setScreen("results")} className="w-full mt-3 text-sm text-hp-gray hover:text-hp-dark transition-colors py-2">← Volver</button>
          </div>
        </section>
      )}

      {/* ═══════ CONFIRMATION ═══════ */}
      {apptCode && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light flex items-center justify-center">
          <div className="max-w-md mx-auto text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-hp-green-light flex items-center justify-center mx-auto mb-6"><span className="text-hp-green text-2xl">✓</span></div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-2">Solicitud enviada</h2>
            <p className="text-sm text-hp-gray mb-6">Te enviamos un correo. Tu código:</p>
            <div className="bg-white border-2 border-hp-green rounded-2xl px-8 py-5 inline-block mb-6">
              <p className="font-mono text-3xl font-bold text-hp-navy tracking-widest">{apptCode}</p>
            </div>
            <p className="text-xs text-hp-gray mb-8">Guarda este código para verificar tu cita.</p>
            <div className="flex flex-col gap-3">
              <a href={`/verificar?code=${apptCode}`} className="bg-hp-navy text-white py-3 rounded-xl font-semibold text-sm hover:bg-hp-navy/90 transition-colors block">Verificar mi cita</a>
              <button onClick={() => { setScreen("home"); setApptCode(null); setApptName(""); setApptEmail(""); setApptPhone(""); setApptDesc(""); }}
                className="text-sm text-hp-gray hover:text-hp-dark transition-colors py-2">Volver al inicio</button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
