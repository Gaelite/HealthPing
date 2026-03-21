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
            {/* Modo acompañamiento */}
            <div className="bg-white border border-hp-green/20 rounded-2xl p-6 mt-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-full bg-hp-green-light flex items-center justify-center text-hp-green text-sm">🏥</span>
                <div>
                  <p className="text-sm font-semibold text-hp-dark">Modo acompañamiento</p>
                  <p className="text-[11px] text-hp-gray">Te guiamos durante tu visita</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  {step:"1",label:"Admisión",desc:"Pregunta por el anticipo y qué incluye",status:"next"},
                  {step:"2",label:"Valoración",desc:"El médico te revisará y pedirá estudios",status:"pending"},
                  {step:"3",label:"Estudios",desc:"Lab, imagen, rayos X según tu caso",status:"pending"},
                  {step:"4",label:"Diagnóstico",desc:"Te dirán qué tienes y opciones de tratamiento",status:"pending"},
                  {step:"5",label:"Alta",desc:"Revisa tu cuenta final vs el estimado",status:"pending"},
                ].map(s=>(
                  <div key={s.step} className={`flex items-start gap-3 p-3 rounded-xl ${s.status==="next"?"bg-hp-green-light border border-hp-green/20":"bg-hp-light"}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${s.status==="next"?"bg-hp-green text-white":"bg-gray-200 text-hp-gray"}`}>{s.step}</span>
                    <div>
                      <p className={`text-sm font-semibold ${s.status==="next"?"text-hp-green-dark":"text-hp-gray"}`}>{s.label}</p>
                      <p className="text-[11px] text-hp-gray">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
