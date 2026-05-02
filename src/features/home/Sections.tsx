"use client";

import { useLang } from "@/i18n";

export function HowItWorks() {
  const { t } = useLang();
  const steps = [
    { n: "01", title: t.s1t, desc: t.s1d, color: "bg-hp-blue-light text-hp-blue" },
    { n: "02", title: t.s2t, desc: t.s2d, color: "bg-hp-green-light text-hp-green" },
    { n: "03", title: t.s3t, desc: t.s3d, color: "bg-hp-blue-light text-hp-navy" },
  ];
  return (
    <section className="py-20 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm font-semibold text-hp-green tracking-widest uppercase mb-3">{t.howLabel}</p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-hp-navy mb-14">{t.howTitle}</h2>
        <div className="grid sm:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.n}>
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${s.color} font-bold text-lg mb-4`}>{s.n}</div>
              <h3 className="font-semibold text-xl text-hp-dark mb-2">{s.title}</h3>
              <p className="text-base text-hp-gray leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HospitalCTA() {
  const { t } = useLang();
  return (
    <section className="py-20 px-5 bg-hp-navy">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-white mb-4">{t.hospCta}</h2>
        <p className="text-white/50 max-w-md mx-auto mb-8 text-base">{t.hospCtaSub}</p>
        <a href="/partnership" className="inline-block bg-hp-green text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-hp-green-dark">{t.hospCtaBtn}</a>
      </div>
    </section>
  );
}
