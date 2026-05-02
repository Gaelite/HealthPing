"use client";

import { useLang } from "@/i18n";

export function SurgeryComingSoon({ onBack }: { onBack: () => void }) {
  const { t } = useLang();
  return (
    <section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light flex items-center justify-center">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-hp-navy flex items-center justify-center mx-auto mb-6"><span className="text-3xl">🔬</span></div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-3">{t.comingSoon}</h1>
        <p className="text-hp-gray mb-8">{t.comingSoonSub}</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm mx-auto">
          <input type="email" placeholder="email" className="flex-1 border rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green" />
          <button className="bg-hp-green text-white px-5 py-3 rounded-xl font-semibold text-sm">OK</button>
        </form>
        <button onClick={onBack} className="mt-8 text-sm text-hp-gray">{t.back}</button>
      </div>
    </section>
  );
}
