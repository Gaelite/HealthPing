"use client";

import { useState, useEffect, useCallback } from "react";

type Appointment = {
  code: string;
  hospitalName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  symptomDescription: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
};

export default function HospitalDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"PENDING" | "ACCEPTED">("PENDING");

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleAction = async (code: string, action: "ACCEPTED" | "REJECTED") => {
    // In-memory update (in production: PATCH to API → Supabase)
    setAppointments((prev) =>
      prev.map((a) => (a.code === code ? { ...a, status: action } : a))
    );
  };

  const filtered = appointments.filter((a) => a.status === tab);

  return (
    <main className="min-h-screen bg-hp-light">
      {/* Header */}
      <div className="bg-hp-navy">
        <div className="max-w-4xl mx-auto px-5 py-6">
          <div className="flex items-center justify-between">
            <div>
              <a href="/" className="text-white/50 text-xs hover:text-white transition-colors">← Volver a HealthPing</a>
              <h1 className="font-[family-name:var(--font-display)] text-2xl text-white mt-1">Dashboard Hospital</h1>
              <p className="text-white/40 text-sm">Gestiona solicitudes de cita</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Total solicitudes</p>
              <p className="font-[family-name:var(--font-display)] text-3xl text-white">{appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("PENDING")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "PENDING" ? "bg-hp-amber-light text-hp-amber border border-hp-amber/20" : "bg-white border border-gray-200 text-hp-gray hover:border-hp-amber"}`}>
            Pendientes ({appointments.filter((a) => a.status === "PENDING").length})
          </button>
          <button onClick={() => setTab("ACCEPTED")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "ACCEPTED" ? "bg-hp-green-light text-hp-green border border-hp-green/20" : "bg-white border border-gray-200 text-hp-gray hover:border-hp-green"}`}>
            Aceptadas ({appointments.filter((a) => a.status === "ACCEPTED").length})
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-hp-gray">Cargando solicitudes...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-300">{tab === "PENDING" ? "📋" : "✓"}</span>
            </div>
            <p className="text-hp-gray text-sm">
              {tab === "PENDING" ? "No hay solicitudes pendientes" : "No hay solicitudes aceptadas aún"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((a) => (
              <div key={a.code} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-bold text-hp-navy bg-hp-blue-light px-2 py-0.5 rounded">{a.code}</span>
                      <span className="text-xs text-hp-gray">{new Date(a.createdAt).toLocaleString("es-MX")}</span>
                    </div>
                    <h3 className="font-semibold text-base text-hp-dark">{a.patientName}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-hp-gray mt-1">
                      <span>{a.patientEmail}</span>
                      <span>{a.patientPhone}</span>
                    </div>
                    {a.symptomDescription && (
                      <p className="text-xs text-hp-gray mt-2 bg-hp-light rounded-lg px-3 py-2">
                        &ldquo;{a.symptomDescription}&rdquo;
                      </p>
                    )}
                  </div>

                  {tab === "PENDING" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleAction(a.code, "ACCEPTED")}
                        className="text-xs px-4 py-2.5 rounded-xl bg-hp-green text-white font-semibold hover:bg-hp-green-dark transition-colors">
                        Aceptar
                      </button>
                      <button onClick={() => handleAction(a.code, "REJECTED")}
                        className="text-xs px-4 py-2.5 rounded-xl border border-gray-200 text-hp-gray hover:border-hp-coral hover:text-hp-coral transition-colors">
                        Rechazar
                      </button>
                    </div>
                  )}

                  {tab === "ACCEPTED" && (
                    <div className="flex-shrink-0">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-hp-green-light text-hp-green">Aceptada</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
