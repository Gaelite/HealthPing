"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<null | {
    code: string; hospitalName: string; patientName: string;
    status: string; createdAt: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const verify = async () => {
    if (!code) return;
    setLoading(true); setError(null); setAppointment(null);
    try {
      const res = await fetch(`/api/appointments/verify?code=${code.toUpperCase()}`);
      const data = await res.json();
      if (data.appointment) setAppointment(data.appointment);
      else setError(data.error || "Cita no encontrada");
    } catch { setError("Error de conexión"); }
    setLoading(false);
  };

  useEffect(() => { if (searchParams.get("code")) verify(); }, []); // eslint-disable-line

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Pendiente", color: "text-hp-amber", bg: "bg-hp-amber-light" },
    ACCEPTED: { label: "Aceptada", color: "text-hp-green", bg: "bg-hp-green-light" },
    REJECTED: { label: "Rechazada", color: "text-hp-coral", bg: "bg-hp-coral-light" },
  };

  return (
    <main className="min-h-screen bg-hp-light pt-20 px-5">
      <div className="max-w-md mx-auto mt-8">
        <a href="/" className="flex items-center gap-2 mb-8 text-hp-gray hover:text-hp-navy transition-colors text-sm">← Volver al inicio</a>

        <h1 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-2">Verificar cita</h1>
        <p className="text-sm text-hp-gray mb-8">Ingresa tu código de verificación.</p>

        <div className="flex gap-2 mb-6">
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="HP-XXXX"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-center font-mono text-lg tracking-widest outline-none focus:border-hp-green transition-colors uppercase" />
          <button onClick={verify} disabled={!code || loading}
            className="bg-hp-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-hp-navy/90 transition-colors disabled:opacity-40">
            {loading ? "..." : "Verificar"}
          </button>
        </div>

        {error && (
          <div className="bg-hp-coral-light border border-hp-coral/20 rounded-xl p-4">
            <p className="text-sm text-hp-coral font-medium">{error}</p>
          </div>
        )}

        {appointment && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-lg font-bold text-hp-navy">{appointment.code}</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig[appointment.status]?.bg || ""} ${statusConfig[appointment.status]?.color || ""}`}>
                {statusConfig[appointment.status]?.label || appointment.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-hp-gray">Hospital</span><span className="font-medium text-hp-dark">{appointment.hospitalName}</span></div>
              <div className="flex justify-between"><span className="text-hp-gray">Paciente</span><span className="font-medium text-hp-dark">{appointment.patientName}</span></div>
              <div className="flex justify-between"><span className="text-hp-gray">Fecha</span><span className="font-medium text-hp-dark">{new Date(appointment.createdAt).toLocaleDateString("es-MX")}</span></div>
            </div>
            {appointment.status === "PENDING" && (
              <div className="mt-4 p-3 bg-hp-amber-light rounded-xl">
                <p className="text-xs text-hp-amber font-medium">El hospital está revisando tu solicitud. Recibirás un correo cuando respondan.</p>
              </div>
            )}
            {appointment.status === "ACCEPTED" && (
              <div className="mt-4 p-3 bg-hp-green-light rounded-xl">
                <p className="text-xs text-hp-green font-medium">¡Tu cita fue aceptada! Revisa tu correo para los detalles.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function VerificarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hp-light pt-20 px-5"><div className="max-w-md mx-auto mt-8 text-hp-gray">Cargando...</div></div>}>
      <VerifyContent />
    </Suspense>
  );
}
