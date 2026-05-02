"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<null | { code: string; hospitalName: string; patientName: string; status: string; createdAt: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const verify = async () => {
    if (!code) return;
    setLoading(true); setError(null); setAppointment(null);
    try {
      const res = await fetch(`/api/appointments/verify?code=${code.toUpperCase()}`);
      const data = await res.json();
      if (data.appointment) setAppointment(data.appointment);
      else setError(data.error || "Appointment not found");
    } catch { setError("Connection error"); }
    setLoading(false);
  };

  useEffect(() => { if (searchParams.get("code")) verify(); }, []); // eslint-disable-line

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Pending", color: "text-hp-amber", bg: "bg-hp-amber-light" },
    ACCEPTED: { label: "Accepted", color: "text-hp-green", bg: "bg-hp-green-light" },
    REJECTED: { label: "Rejected", color: "text-hp-coral", bg: "bg-hp-coral-light" },
  };

  return (
    <main className="min-h-screen bg-hp-light pt-20 px-5">
      <div className="max-w-md mx-auto mt-8">
        <a href="/" className="flex items-center gap-2 mb-8 text-hp-gray hover:text-hp-navy transition-colors text-sm">← Back</a>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-2">Verify appointment</h1>
        <p className="text-sm text-hp-gray mb-8">Enter your verification code.</p>
        <div className="flex gap-2 mb-6">
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="HP-XXXX" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-center font-mono text-lg tracking-widest outline-none focus:border-hp-green uppercase" />
          <button onClick={verify} disabled={!code || loading} className="bg-hp-navy text-white px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-40">{loading ? "..." : "Verify"}</button>
        </div>
        {error && <div className="bg-hp-coral-light border border-hp-coral/20 rounded-xl p-4"><p className="text-sm text-hp-coral font-medium">{error}</p></div>}
        {appointment && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-lg font-bold text-hp-navy">{appointment.code}</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig[appointment.status]?.bg || ""} ${statusConfig[appointment.status]?.color || ""}`}>{statusConfig[appointment.status]?.label || appointment.status}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-hp-gray">Hospital</span><span className="font-medium text-hp-dark">{appointment.hospitalName}</span></div>
              <div className="flex justify-between"><span className="text-hp-gray">Patient</span><span className="font-medium text-hp-dark">{appointment.patientName}</span></div>
              <div className="flex justify-between"><span className="text-hp-gray">Date</span><span className="font-medium text-hp-dark">{new Date(appointment.createdAt).toLocaleDateString()}</span></div>
            </div>
            {/* Companion mode */}
            <div className="bg-white border border-hp-green/20 rounded-2xl p-6 mt-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-full bg-hp-green-light flex items-center justify-center text-hp-green text-sm">🏥</span>
                <div><p className="text-sm font-semibold text-hp-dark">Companion mode</p><p className="text-[11px] text-hp-gray">We guide you during your visit</p></div>
              </div>
              <div className="space-y-3">
                {[{n:"1",l:"Admission",d:"Ask about the deposit",a:true},{n:"2",l:"Assessment",d:"Doctor examines you",a:false},{n:"3",l:"Tests",d:"Lab, imaging as needed",a:false},{n:"4",l:"Diagnosis",d:"Treatment options",a:false},{n:"5",l:"Discharge",d:"Review final bill",a:false}].map(s=>(
                  <div key={s.n} className={`flex items-start gap-3 p-3 rounded-xl ${s.a?"bg-hp-green-light border border-hp-green/20":"bg-hp-light"}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${s.a?"bg-hp-green text-white":"bg-gray-200 text-hp-gray"}`}>{s.n}</span>
                    <div><p className={`text-sm font-semibold ${s.a?"text-hp-green-dark":"text-hp-gray"}`}>{s.l}</p><p className="text-[11px] text-hp-gray">{s.d}</p></div>
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

export default function VerifyPage() {
  return (<Suspense fallback={<div className="min-h-screen bg-hp-light pt-20 px-5"><div className="max-w-md mx-auto mt-8 text-hp-gray">Loading...</div></div>}><VerifyContent /></Suspense>);
}
