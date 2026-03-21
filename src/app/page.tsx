"use client";

import { useState } from "react";

/* ══════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════ */

const BODY_ZONES = [
  { id: "head", label: "Cabeza", emoji: "🧠" },
  { id: "chest", label: "Pecho", emoji: "🫁" },
  { id: "abdomen", label: "Abdomen", emoji: "🫃" },
  { id: "back", label: "Espalda", emoji: "🦴" },
  { id: "limbs", label: "Extremidades", emoji: "💪" },
  { id: "throat", label: "Garganta", emoji: "🗣️" },
  { id: "skin", label: "Piel", emoji: "🩹" },
  { id: "general", label: "Malestar general", emoji: "🤒" },
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

const MOCK_HOSPITALS = [
  {
    id: 1,
    name: "Hospital San Javier",
    level: "THIRD",
    distance: "2.3 km",
    time: "8 min",
    anticipoRange: "$8,000 - $15,000",
    costoInicial: "$2,500 - $6,000",
    waitTime: "~15 min",
    rating: 4.6,
    urgenciasOpen: true,
    acceptsInsurance: true,
    transparency: 4,
    services: ["Urgencias 24h", "Cirugía", "Lab", "Imagen"],
    isPremium: true,
  },
  {
    id: 2,
    name: "Clínica del Valle",
    level: "SECOND",
    distance: "1.8 km",
    time: "6 min",
    anticipoRange: "$5,000 - $10,000",
    costoInicial: "$1,800 - $4,000",
    waitTime: "~25 min",
    rating: 4.3,
    urgenciasOpen: true,
    acceptsInsurance: true,
    transparency: 3,
    services: ["Urgencias 24h", "Consulta", "Lab"],
    isPremium: false,
  },
  {
    id: 3,
    name: "Hospital Puerta de Hierro",
    level: "THIRD",
    distance: "4.1 km",
    time: "14 min",
    anticipoRange: "$12,000 - $25,000",
    costoInicial: "$4,000 - $8,000",
    waitTime: "~10 min",
    rating: 4.8,
    urgenciasOpen: true,
    acceptsInsurance: true,
    transparency: 5,
    services: ["Urgencias 24h", "Cirugía", "UCI", "Lab", "Imagen"],
    isPremium: true,
  },
  {
    id: 4,
    name: "Médica Sur Guadalajara",
    level: "FIRST",
    distance: "0.8 km",
    time: "3 min",
    anticipoRange: "$3,000 - $6,000",
    costoInicial: "$800 - $2,000",
    waitTime: "~35 min",
    rating: 4.1,
    urgenciasOpen: false,
    acceptsInsurance: false,
    transparency: 2,
    services: ["Consulta", "Lab básico"],
    isPremium: false,
  },
];

/* ══════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════ */

function LevelBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    FIRST: { label: "1er nivel", bg: "bg-hp-green-light", text: "text-hp-green" },
    SECOND: { label: "2do nivel", bg: "bg-hp-blue-light", text: "text-hp-blue" },
    THIRD: { label: "3er nivel", bg: "bg-hp-blue-light", text: "text-hp-navy" },
  };
  const c = config[level] || config.FIRST;
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function TransparencyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i <= level ? "bg-hp-green" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════ */

type Screen = "home" | "symptoms" | "results";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [painLevel, setPainLevel] = useState(5);
  const [extraSymptoms, setExtraSymptoms] = useState<string[]>([]);
  const [since, setSince] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("distance");
  const [expandedHospital, setExpandedHospital] = useState<number | null>(null);

  const isUrgent = painLevel >= 7 || extraSymptoms.includes("Dificultad para respirar") || extraSymptoms.includes("Dolor intenso repentino") || extraSymptoms.includes("Sangrado");

  const sortedHospitals = [...MOCK_HOSPITALS].sort((a, b) => {
    if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
    if (sortBy === "cost") return parseInt(a.costoInicial.replace(/\D/g, "")) - parseInt(b.costoInicial.replace(/\D/g, ""));
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "transparency") return b.transparency - a.transparency;
    return 0;
  });

  return (
    <main className="min-h-screen">
      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => { setScreen("home"); setExpandedHospital(null); }} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-hp-navy flex items-center justify-center group-hover:bg-hp-blue transition-colors">
              <span className="text-white text-sm font-bold tracking-tight">HP</span>
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg text-hp-navy">
              Health<span className="text-hp-green">Ping</span>
            </span>
          </button>
          <div className="hidden sm:flex items-center gap-5 text-sm">
            <a href="#como-funciona" className="text-hp-gray hover:text-hp-navy transition-colors">Cómo funciona</a>
            <button className="bg-hp-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hp-green-dark transition-colors">
              Soy hospital
            </button>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════
         SCREEN: HOME
         ════════════════════════════════════ */}
      {screen === "home" && (
        <>
          <section className="pt-28 pb-20 px-5 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-hp-blue-pale via-white to-hp-green-light opacity-60" />
            <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-hp-green/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-hp-blue/5 blur-3xl" />

            <div className="max-w-6xl mx-auto relative">
              <div className="max-w-xl">
                <div className="animate-fade-up">
                  <div className="inline-flex items-center gap-2 bg-white border border-hp-green/20 text-hp-green text-xs font-semibold px-3 py-1.5 rounded-full mb-7">
                    <span className="w-2 h-2 rounded-full bg-hp-green animate-pulse-ring" />
                    Disponible en Jalisco — FIFA World Cup 2026
                  </div>
                </div>

                <h1 className="font-[family-name:var(--font-display)] text-[3.2rem] sm:text-6xl leading-[1.08] text-hp-navy mb-5 animate-fade-up-1">
                  Te ayudamos a decidir<br />
                  <span className="italic text-hp-blue">a dónde ir</span>
                </h1>

                <p className="text-base sm:text-lg text-hp-gray max-w-md mb-10 leading-relaxed animate-fade-up-2">
                  Compara hospitales, revisa costos y da seguimiento a tu cuenta mientras te atienden. Sin registro, sin sorpresas.
                </p>

                {/* ── Main CTAs (from Ana doc) ── */}
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-up-3">
                  <button
                    onClick={() => setScreen("symptoms")}
                    className="flex items-center justify-center gap-3 bg-hp-navy text-white px-7 py-4 rounded-2xl font-semibold text-base hover:bg-hp-navy/90 transition-all hover:shadow-lg hover:shadow-hp-navy/10 group"
                  >
                    <span className="w-3 h-3 rounded-full bg-hp-coral animate-pulse-ring" />
                    Me siento mal ahora
                  </button>
                  <button
                    onClick={() => setScreen("results")}
                    className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-hp-dark px-7 py-4 rounded-2xl font-semibold text-base hover:border-hp-blue hover:text-hp-blue transition-all"
                  >
                    Solo quiero comparar hospitales
                  </button>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-3 mt-6 animate-fade-up-4">
                  <button className="text-xs px-3 py-1.5 rounded-full bg-white/80 border border-gray-200 text-hp-gray hover:border-hp-blue hover:text-hp-blue transition-colors flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Usar mi ubicación
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-full bg-white/80 border border-gray-200 text-hp-gray hover:border-hp-green hover:text-hp-green transition-colors">
                    Tengo seguro
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm">
                {[
                  { value: "434+", label: "Hospitales en Jalisco" },
                  { value: "<2s", label: "Tiempo de respuesta" },
                  { value: "$0", label: "Costo para ti" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">{s.value}</p>
                    <p className="text-[11px] text-hp-gray mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── How it works ── */}
          <section id="como-funciona" className="py-20 px-5 bg-white">
            <div className="max-w-6xl mx-auto">
              <p className="text-xs font-semibold text-hp-green tracking-widest uppercase mb-3">Cómo funciona</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-14">
                De tu síntoma a tu cita<br />en 3 pasos
              </h2>
              <div className="grid sm:grid-cols-3 gap-10">
                {[
                  { step: "01", title: "Describe qué sientes", desc: "Selecciona la zona del cuerpo, intensidad y síntomas extra. Sin formularios largos.", color: "bg-hp-blue-light text-hp-blue" },
                  { step: "02", title: "Compara hospitales", desc: "Ve hospitales cercanos con precios estimados, tiempos de espera, disponibilidad y qué tan transparentes son.", color: "bg-hp-green-light text-hp-green" },
                  { step: "03", title: "Decide y llega preparado", desc: "Elige hospital, ve qué llevar, qué preguntar en admisión y cuánto podría costarte el anticipo.", color: "bg-hp-blue-light text-hp-navy" },
                ].map((item) => (
                  <div key={item.step}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.color} font-bold text-base mb-4`}>
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg text-hp-dark mb-2">{item.title}</h3>
                    <p className="text-sm text-hp-gray leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA Hospital ── */}
          <section className="py-20 px-5 bg-hp-navy">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-4">¿Eres hospital o clínica?</h2>
              <p className="text-white/50 max-w-md mx-auto mb-8 text-sm">
                Únete como hospital convenio. Recibe pacientes cualificados desde tu dashboard.
              </p>
              <button className="bg-hp-green text-white px-8 py-3 rounded-xl font-semibold hover:bg-hp-green-dark transition-colors">
                Quiero ser convenio
              </button>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="py-8 px-5 bg-hp-light border-t border-gray-100">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-hp-navy flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">HP</span>
                </div>
                <span className="text-xs text-hp-gray">HealthPing — Tu ping a la salud</span>
              </div>
              <p className="text-[11px] text-hp-gray-light">© 2026 HealthPing. Jalisco, México.</p>
            </div>
          </footer>
        </>
      )}

      {/* ════════════════════════════════════
         SCREEN: SYMPTOM CAPTURE (Express)
         ════════════════════════════════════ */}
      {screen === "symptoms" && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
          <div className="max-w-lg mx-auto">
            {/* Progress */}
            <div className="flex gap-1.5 mb-8 mt-4">
              <div className="h-1 flex-1 rounded-full bg-hp-green" />
              <div className="h-1 flex-1 rounded-full bg-gray-200" />
              <div className="h-1 flex-1 rounded-full bg-gray-200" />
            </div>

            <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">
              ¿Qué sientes?
            </h2>
            <p className="text-sm text-hp-gray mb-8">Selecciona rápido, sin formularios largos.</p>

            {/* Zone selection */}
            <div className="mb-8">
              <p className="text-sm font-medium text-hp-dark mb-3">¿Dónde te duele?</p>
              <div className="grid grid-cols-4 gap-2">
                {BODY_ZONES.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setSelectedZone(z.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${
                      selectedZone === z.id
                        ? "border-hp-green bg-hp-green-light"
                        : "border-gray-200 bg-white hover:border-hp-blue-mid"
                    }`}
                  >
                    <span className="text-xl">{z.emoji}</span>
                    <span className="text-[11px] font-medium text-hp-dark">{z.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pain level */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-hp-dark">¿Qué tan fuerte?</p>
                <span className={`text-sm font-bold ${painLevel >= 7 ? "text-hp-coral" : painLevel >= 4 ? "text-hp-amber" : "text-hp-green"}`}>
                  {painLevel}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-hp-green"
                style={{
                  background: `linear-gradient(to right, #16A085 0%, #F39C12 50%, #E74C3C 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-hp-gray mt-1">
                <span>Leve</span>
                <span>Moderado</span>
                <span>Intenso</span>
              </div>
            </div>

            {/* Extra symptoms */}
            <div className="mb-8">
              <p className="text-sm font-medium text-hp-dark mb-3">¿Qué más sientes?</p>
              <div className="flex flex-wrap gap-2">
                {EXTRA_SYMPTOMS.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setExtraSymptoms((prev) =>
                        prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                      )
                    }
                    className={`text-xs px-3 py-2 rounded-full border transition-all font-medium ${
                      extraSymptoms.includes(s)
                        ? "border-hp-green bg-hp-green-light text-hp-green-dark"
                        : "border-gray-200 bg-white text-hp-gray hover:border-hp-blue"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Since when */}
            <div className="mb-10">
              <p className="text-sm font-medium text-hp-dark mb-3">¿Desde cuándo?</p>
              <div className="grid grid-cols-2 gap-2">
                {SINCE_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSince(o.id)}
                    className={`text-xs px-3 py-3 rounded-xl border-2 transition-all font-medium ${
                      since === o.id
                        ? "border-hp-green bg-hp-green-light text-hp-green-dark"
                        : "border-gray-200 bg-white text-hp-gray hover:border-hp-blue"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setScreen("results")}
              disabled={!selectedZone}
              className="w-full bg-hp-navy text-white py-4 rounded-2xl font-semibold text-base hover:bg-hp-navy/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Ver opciones cercanas
            </button>

            <button
              onClick={() => setScreen("home")}
              className="w-full mt-3 text-sm text-hp-gray hover:text-hp-dark transition-colors py-2"
            >
              ← Volver
            </button>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════
         SCREEN: RESULTS (Hospital comparison)
         ════════════════════════════════════ */}
      {screen === "results" && (
        <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
          <div className="max-w-3xl mx-auto">
            {/* Urgency banner */}
            {isUrgent ? (
              <div className="bg-hp-coral-light border border-hp-coral/20 rounded-2xl p-4 mb-6 mt-4 animate-fade-up">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-hp-coral flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">!</span>
                  </span>
                  <div>
                    <p className="font-semibold text-hp-coral text-sm">Por lo que nos dices, sí conviene que te atiendan hoy.</p>
                    <p className="text-xs text-hp-gray mt-1">Te recomendamos ir a urgencias lo antes posible. Estos hospitales están cerca y abiertos ahora.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-hp-green-light border border-hp-green/20 rounded-2xl p-4 mb-6 mt-4 animate-fade-up">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-hp-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">✓</span>
                  </span>
                  <div>
                    <p className="font-semibold text-hp-green-dark text-sm">Tu caso parece moderado.</p>
                    <p className="text-xs text-hp-gray mt-1">Aquí tienes opciones para decidir mejor. Compara precios, distancia y transparencia.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Header + sort */}
            <div className="flex items-end justify-between mb-5 animate-fade-up-1">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">Hospitales disponibles</h2>
                <p className="text-xs text-hp-gray mt-1">{MOCK_HOSPITALS.length} opciones cerca de ti</p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-hp-dark"
              >
                <option value="distance">Cercanía</option>
                <option value="cost">Costo estimado</option>
                <option value="rating">Calificación</option>
                <option value="transparency">Transparencia</option>
              </select>
            </div>

            {/* Hospital cards */}
            <div className="flex flex-col gap-3 animate-fade-up-2">
              {sortedHospitals.map((h) => (
                <div key={h.id}>
                  <div
                    className={`bg-white rounded-2xl border transition-all ${
                      h.isPremium
                        ? "border-hp-green/30 ring-1 ring-hp-green/10"
                        : "border-gray-200"
                    } ${expandedHospital === h.id ? "shadow-lg" : "hover:shadow-md"}`}
                  >
                    <div className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-semibold text-base text-hp-dark">{h.name}</h3>
                            <LevelBadge level={h.level} />
                            {h.isPremium && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-hp-green text-white">
                                Convenio
                              </span>
                            )}
                            {h.urgenciasOpen && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-hp-green-light text-hp-green">
                                Urgencias abiertas
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-hp-gray mt-1">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {h.distance} · {h.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {h.waitTime}
                            </span>
                            <span>★ {h.rating}</span>
                            <span className="flex items-center gap-1.5">
                              Transparencia <TransparencyDots level={h.transparency} />
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {h.services.map((s) => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-hp-light border border-gray-100 text-hp-gray">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="sm:text-right flex-shrink-0 sm:min-w-[160px]">
                          <p className="text-[10px] text-hp-gray uppercase tracking-wider mb-0.5">Anticipo estimado</p>
                          <p className="font-[family-name:var(--font-display)] text-xl text-hp-navy">
                            {h.anticipoRange}
                          </p>
                          <p className="text-[10px] text-hp-gray mt-0.5">
                            Costo inicial: {h.costoInicial}
                          </p>
                          <div className="flex flex-col gap-2 mt-3">
                            <button
                              onClick={() => setExpandedHospital(expandedHospital === h.id ? null : h.id)}
                              className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-hp-gray hover:border-hp-blue hover:text-hp-blue transition-colors"
                            >
                              {expandedHospital === h.id ? "Cerrar detalle" : "Ver desglose"}
                            </button>
                            {h.isPremium && (
                              <button className="text-xs px-4 py-2 rounded-lg bg-hp-navy text-white font-medium hover:bg-hp-navy/90 transition-colors">
                                Elegir este hospital
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded detail (from Pantalla 4 of the doc) */}
                    {expandedHospital === h.id && (
                      <div className="border-t border-gray-100 p-5 bg-hp-light/50 rounded-b-2xl animate-fade-in">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-hp-dark mb-2">Qué incluye normalmente</p>
                            <ul className="text-xs text-hp-gray space-y-1.5">
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-green" />Admisión y valoración inicial</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-green" />Laboratorio básico</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-green" />Honorarios base del médico</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-green" />Medicamentos iniciales</li>
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-hp-dark mb-2">Qué puede elevar la cuenta</p>
                            <ul className="text-xs text-hp-gray space-y-1.5">
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-amber" />Cirugía y anestesia</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-amber" />Estudios de imagen</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-amber" />Cuarto y día extra</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-amber" />Honorarios de especialistas</li>
                            </ul>
                          </div>
                        </div>

                        {h.acceptsInsurance && (
                          <div className="mt-4 p-3 bg-hp-blue-light rounded-xl">
                            <p className="text-xs font-semibold text-hp-blue mb-1">Seguro</p>
                            <p className="text-[11px] text-hp-gray">Este hospital trabaja con las principales aseguradoras. Aunque tengas seguro, puede haber deducible, coaseguro y conceptos no cubiertos.</p>
                          </div>
                        )}

                        <div className="mt-4 p-3 bg-hp-green-light rounded-xl">
                          <p className="text-xs font-semibold text-hp-green-dark mb-1">Antes de entrar, pregunta esto</p>
                          <ul className="text-[11px] text-hp-gray space-y-1">
                            <li>• ¿De cuánto es el anticipo y qué incluye?</li>
                            <li>• ¿Qué estudios podrían pedir primero?</li>
                            <li>• ¿Qué no está incluido?</li>
                            <li>• ¿Cómo cambia si hay cirugía?</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setScreen(selectedZone ? "symptoms" : "home")}
              className="w-full mt-6 text-sm text-hp-gray hover:text-hp-dark transition-colors py-2"
            >
              ← Volver
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
