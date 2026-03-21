"use client";

import { useState } from "react";

// ── Mock data ──
const MOCK_SYMPTOMS = [
  { id: 1, name: "Dolor de estómago", severity: "MEDIUM", icon: "🔴" },
  { id: 2, name: "Dolor de cabeza intenso", severity: "HIGH", icon: "🟠" },
  { id: 3, name: "Fiebre alta (+38.5°C)", severity: "HIGH", icon: "🟠" },
  { id: 4, name: "Dolor en el pecho", severity: "EMERGENCY", icon: "🔴" },
  { id: 5, name: "Fractura o golpe fuerte", severity: "HIGH", icon: "🟠" },
  { id: 6, name: "Dificultad para respirar", severity: "EMERGENCY", icon: "🔴" },
  { id: 7, name: "Infección en la piel", severity: "LOW", icon: "🟡" },
  { id: 8, name: "Dolor de muela", severity: "MEDIUM", icon: "🟡" },
];

const MOCK_HOSPITALS = [
  {
    id: 1,
    name: "Hospital San Javier",
    level: "THIRD",
    distance: "2.3 km",
    priceRange: "$800 - $2,500",
    waitTime: "~15 min",
    rating: 4.6,
    services: ["Urgencias", "Cirugía", "Laboratorio"],
    isPremium: true,
  },
  {
    id: 2,
    name: "Clínica del Valle",
    level: "SECOND",
    distance: "1.8 km",
    priceRange: "$500 - $1,800",
    waitTime: "~25 min",
    rating: 4.3,
    services: ["Urgencias", "Consulta", "Imagenología"],
    isPremium: false,
  },
  {
    id: 3,
    name: "Hospital Puerta de Hierro",
    level: "THIRD",
    distance: "4.1 km",
    priceRange: "$1,200 - $4,000",
    waitTime: "~10 min",
    rating: 4.8,
    services: ["Urgencias", "Cirugía", "UCI", "Lab"],
    isPremium: true,
  },
  {
    id: 4,
    name: "Médica Guadalajara",
    level: "FIRST",
    distance: "0.8 km",
    priceRange: "$350 - $900",
    waitTime: "~35 min",
    rating: 4.1,
    services: ["Consulta", "Laboratorio"],
    isPremium: false,
  },
];

function LevelBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; color: string }> = {
    FIRST: { label: "1er nivel", color: "bg-hp-teal-light text-hp-teal" },
    SECOND: { label: "2do nivel", color: "bg-hp-amber-light text-hp-amber" },
    THIRD: { label: "3er nivel", color: "bg-hp-blue-light text-hp-blue" },
  };
  const c = config[level] || config.FIRST;
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.color}`}>
      {c.label}
    </span>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const filteredSymptoms = MOCK_SYMPTOMS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSymptomSelect = (id: number) => {
    setSelectedSymptom(id);
    setSearchQuery(MOCK_SYMPTOMS.find((s) => s.id === id)?.name || "");
    setShowResults(true);
  };

  return (
    <main className="min-h-screen">
      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-hp-navy flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="font-[family-name:var(--font-display)] text-xl text-hp-navy">
              HealthPing
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-hp-gray">
            <a href="#como-funciona" className="hover:text-hp-navy transition-colors">
              Cómo funciona
            </a>
            <a href="#hospitales" className="hover:text-hp-navy transition-colors">
              Hospitales
            </a>
            <button className="bg-hp-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hp-navy/90 transition-colors">
              Soy hospital
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-hp-blue-light)_0%,_transparent_60%)] opacity-50" />
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-2xl">
            <div className="animate-fade-up">
              <span className="inline-block bg-hp-teal-light text-hp-teal text-xs font-semibold px-3 py-1 rounded-full mb-6">
                Disponible en Jalisco — FIFA World Cup 2026
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl leading-[1.1] text-hp-navy mb-6 animate-fade-up-delay-1">
              Haz ping a<br />
              <span className="italic text-hp-blue">tu salud</span>
            </h1>

            <p className="text-lg text-hp-gray max-w-lg mb-10 animate-fade-up-delay-2">
              Describe tu síntoma, compara hospitales con precios reales y
              agenda tu cita en minutos. Sin registro, sin sorpresas.
            </p>

            {/* ── Search Box ── */}
            <div className="animate-fade-up-delay-3">
              <div className="relative max-w-lg">
                <div className="bg-white rounded-2xl shadow-lg shadow-hp-navy/5 border border-gray-200 p-2">
                  <div className="flex items-center gap-3 px-4">
                    <svg
                      className="w-5 h-5 text-hp-gray flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="¿Qué síntoma tienes? ej. dolor de estómago"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedSymptom(null);
                        setShowResults(false);
                      }}
                      className="w-full py-3 text-base outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Dropdown */}
                {searchQuery.length > 0 && !selectedSymptom && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-10">
                    {filteredSymptoms.length > 0 ? (
                      filteredSymptoms.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSymptomSelect(s.id)}
                          className="w-full text-left px-5 py-3 hover:bg-hp-light transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-sm">{s.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-hp-dark">
                              {s.name}
                            </p>
                            <p className="text-xs text-hp-gray">
                              Severidad:{" "}
                              {s.severity === "EMERGENCY"
                                ? "Urgente"
                                : s.severity === "HIGH"
                                ? "Alta"
                                : s.severity === "MEDIUM"
                                ? "Media"
                                : "Baja"}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-4 text-sm text-hp-gray">
                        No encontramos ese síntoma. Intenta con otras palabras.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick symptom pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {MOCK_SYMPTOMS.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSymptomSelect(s.id)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-hp-gray hover:border-hp-blue hover:text-hp-blue transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md">
            {[
              { value: "434+", label: "Hospitales en Jalisco" },
              { value: "<2s", label: "Tiempo de respuesta" },
              { value: "$0", label: "Costo para el paciente" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">
                  {stat.value}
                </p>
                <p className="text-xs text-hp-gray mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hospital Results (shown after symptom selection) ── */}
      {showResults && (
        <section id="hospitales" className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy">
                  Hospitales disponibles
                </h2>
                <p className="text-hp-gray mt-1">
                  {MOCK_HOSPITALS.length} hospitales encontrados cerca de ti
                  para{" "}
                  <span className="font-medium text-hp-dark">
                    {MOCK_SYMPTOMS.find((s) => s.id === selectedSymptom)?.name}
                  </span>
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-hp-gray">Ordenar:</span>
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
                  <option>Distancia</option>
                  <option>Precio</option>
                  <option>Calificación</option>
                  <option>Tiempo de espera</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {MOCK_HOSPITALS.map((h) => (
                <div
                  key={h.id}
                  className={`bg-hp-light rounded-2xl p-6 border transition-all hover:shadow-md ${
                    h.isPremium
                      ? "border-hp-blue/30 ring-1 ring-hp-blue/10"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-hp-dark">
                          {h.name}
                        </h3>
                        <LevelBadge level={h.level} />
                        {h.isPremium && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-hp-navy text-white">
                            Convenio
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-hp-gray mt-2">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {h.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {h.waitTime}
                        </span>
                        <span className="flex items-center gap-1">
                          ★ {h.rating}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {h.services.map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2 py-0.5 rounded-md bg-white border border-gray-200 text-hp-gray"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="sm:text-right flex-shrink-0">
                      <p className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">
                        {h.priceRange}
                      </p>
                      <p className="text-xs text-hp-gray mt-0.5">
                        MXN aprox.
                      </p>
                      {h.isPremium ? (
                        <button className="mt-3 bg-hp-navy text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-hp-navy/90 transition-colors w-full sm:w-auto">
                          Solicitar cita
                        </button>
                      ) : (
                        <button className="mt-3 bg-white border border-gray-300 text-hp-gray px-5 py-2 rounded-lg text-sm font-medium hover:border-hp-navy hover:text-hp-navy transition-colors w-full sm:w-auto">
                          Ver detalles
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      <section id="como-funciona" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy text-center mb-14">
            ¿Cómo funciona?
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe tu síntoma",
                desc: "Escribe qué sientes. El sistema identifica posibles condiciones y el nivel de atención que necesitas.",
                color: "bg-hp-blue-light text-hp-blue",
              },
              {
                step: "02",
                title: "Compara hospitales",
                desc: "Ve hospitales cercanos con precios, tiempos de espera y servicios. Gráfica comparativa para elegir la mejor opción.",
                color: "bg-hp-teal-light text-hp-teal",
              },
              {
                step: "03",
                title: "Agenda sin registro",
                desc: "Llena tus datos básicos, envía la solicitud. Recibe confirmación por correo con tu código de verificación.",
                color: "bg-hp-amber-light text-hp-amber",
              },
            ].map((item) => (
              <div key={item.step} className="text-center sm:text-left">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.color} font-bold text-lg mb-4`}
                >
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-hp-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-hp-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA for hospitals ── */}
      <section className="py-20 px-6 bg-hp-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl mb-4">
            ¿Eres hospital o clínica?
          </h2>
          <p className="text-white/60 max-w-lg mx-auto mb-8">
            Únete como hospital convenio. Recibe pacientes cualificados, gestiona
            citas desde tu dashboard y aumenta tu ocupación.
          </p>
          <button className="bg-white text-hp-navy px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Quiero ser convenio
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 bg-hp-light border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-hp-navy flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="font-[family-name:var(--font-display)] text-sm text-hp-navy">
              HealthPing
            </span>
            <span className="text-xs text-hp-gray ml-2">
              Tu ping a la salud
            </span>
          </div>
          <p className="text-xs text-hp-gray">
            © 2026 HealthPing. Jalisco, México. Preparado para el Mundial.
          </p>
        </div>
      </footer>
    </main>
  );
}
