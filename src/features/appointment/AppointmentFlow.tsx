"use client";

import { useLang } from "@/i18n";
import { isInSchedule } from "@/lib/utils";

/** Companion mode timeline shown after booking */
export function CompanionMode() {
  const { t } = useLang();
  const steps = [
    { n: "1", label: t.stepAdmission, desc: t.stepAdmissionDesc, active: true },
    { n: "2", label: t.stepAssessment, desc: t.stepAssessmentDesc, active: false },
    { n: "3", label: t.stepTests, desc: t.stepTestsDesc, active: false },
    { n: "4", label: t.stepDiagnosis, desc: t.stepDiagnosisDesc, active: false },
    { n: "5", label: t.stepDischarge, desc: t.stepDischargeDesc, active: false },
  ];
  return (
    <div className="bg-white border border-hp-green/20 rounded-2xl p-6 mt-6 text-left">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-full bg-hp-green-light flex items-center justify-center text-hp-green text-sm">🏥</span>
        <div><p className="text-sm font-semibold text-hp-dark">{t.companionMode}</p><p className="text-[11px] text-hp-gray">{t.companionSub}</p></div>
      </div>
      <div className="space-y-3">
        {steps.map((s) => (
          <div key={s.n} className={`flex items-start gap-3 p-3 rounded-xl ${s.active ? "bg-hp-green-light border border-hp-green/20" : "bg-hp-light"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${s.active ? "bg-hp-green text-white" : "bg-gray-200 text-hp-gray"}`}>{s.n}</span>
            <div><p className={`text-sm font-semibold ${s.active ? "text-hp-green-dark" : "text-hp-gray"}`}>{s.label}</p><p className="text-[11px] text-hp-gray">{s.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Appointment form */
interface AppointmentFormProps {
  hospitalName: string;
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  sending: boolean; error: string | null;
  onSubmit: () => void;
  onBack: () => void;
}

export function AppointmentForm({ hospitalName, name, setName, email, setEmail, phone, setPhone, description, setDescription, sending, error, onSubmit, onBack }: AppointmentFormProps) {
  const { t } = useLang();
  return (
    <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light">
      <div className="max-w-md mx-auto mt-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">{t.apptTitle}</h2>
        <p className="text-sm text-hp-gray mb-6">{t.apptAt} <span className="font-semibold text-hp-dark">{hospitalName}</span></p>
        {!isInSchedule() && <div className="bg-hp-amber-light border border-hp-amber/20 rounded-xl p-3 mb-4"><p className="text-xs text-hp-amber font-medium">{t.apptNoSchedule}</p></div>}
        <div className="space-y-4">
          <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.name}</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green" /></div>
          <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.email}</label><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green" /></div>
          <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.phone}</label><input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green" /></div>
          <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.describe}</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green resize-none" /></div>
        </div>
        {error && <p className="text-xs text-hp-coral mt-3">{error}</p>}
        <button onClick={onSubmit} disabled={!name || !email || !phone || sending} className="w-full mt-6 bg-hp-navy text-white py-4 rounded-2xl font-semibold disabled:opacity-40">{sending ? t.sending : t.send}</button>
        <button onClick={onBack} className="w-full mt-3 text-sm text-hp-gray py-2">{t.back}</button>
      </div>
    </section>
  );
}

/** Confirmation screen with code and companion mode */
interface ConfirmationProps {
  code: string;
  onGoHome: () => void;
}

export function ConfirmationScreen({ code, onGoHome }: ConfirmationProps) {
  const { t } = useLang();
  return (
    <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light flex items-center justify-center">
      <div className="max-w-md mx-auto text-center animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-hp-green-light flex items-center justify-center mx-auto mb-6"><span className="text-hp-green text-2xl">✓</span></div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-2">{t.confTitle}</h2>
        <p className="text-sm text-hp-gray mb-6">{t.confSub}</p>
        <div className="bg-white border-2 border-hp-green rounded-2xl px-8 py-5 inline-block mb-6"><p className="font-mono text-3xl font-bold text-hp-navy tracking-widest">{code}</p></div>
        <p className="text-xs text-hp-gray mb-4">{t.confSave}</p>
        <a href={`/verify?code=${code}`} className="bg-hp-navy text-white py-3 rounded-xl font-semibold text-sm block mb-3">{t.verify}</a>
        <CompanionMode />
        <button onClick={onGoHome} className="text-sm text-hp-gray py-2 mt-4">{t.backHome}</button>
      </div>
    </section>
  );
}
