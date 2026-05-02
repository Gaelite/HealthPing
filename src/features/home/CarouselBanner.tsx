"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/i18n";
import { CAROUSEL_SLIDES } from "@/data/constants";

export function CarouselBanner() {
  const { lang } = useLang();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % CAROUSEL_SLIDES.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ height: "320px" }}>
      {CAROUSEL_SLIDES.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-hp-navy/80 via-hp-navy/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-6xl mx-auto px-5 w-full">
              <div className="max-w-md">
                <span className="text-4xl mb-3 block">{slide.emoji}</span>
                <p className="text-white text-2xl font-semibold leading-snug">{slide.tip[lang]}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/40"}`} />
        ))}
      </div>
    </section>
  );
}
