"use client";

import { useLang } from "@/i18n";
import { LevelBadge, TransparencyDots } from "@/components/ui/Badges";
import type { EnrichedHospital } from "@/data/types";
import { getRelevantDesglose, type UrgencyLevel } from "@/data/scoring";

interface HospitalCardProps {
  hospital: EnrichedHospital;
  insurer: string | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRequestAppt: () => void;
  categoryId?: string | null; 
  urgencyLevel?: UrgencyLevel;     
}

export function HospitalCard({ hospital: h, insurer, isExpanded, onToggleExpand, onRequestAppt, categoryId, urgencyLevel }: HospitalCardProps) {  const { lang, t } = useLang();

  return (
    <div id={`h-${h.id}`} className={`bg-white rounded-2xl border ${h.prem ? "border-hp-green/30 ring-1 ring-hp-green/10" : h.type === "pharmacy" ? "border-hp-amber/30" : "border-gray-200"} ${isExpanded ? "shadow-lg" : "hover:shadow-md"} transition-all`}>
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="font-semibold text-lg text-hp-dark">{h.name}</h3>
              <LevelBadge level={h.level} type={h.type} />
              {h.prem && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-hp-green text-white">{t.convenio}</span>}
              {h.urg && h.type === "hospital" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-hp-green-light text-hp-green">{t.urgencias}</span>}
              {h.type === "pharmacy" && h.urg && <span className="text-[10px] px-2 py-0.5 rounded-full bg-hp-amber-light text-hp-amber">{t.openNow}</span>}
              {h.myIns && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-hp-blue text-white">{t.accepts} {insurer}</span>}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-hp-gray mt-1">
              <span>{h.dist !== null ? `📍 ${h.dist.toFixed(1)} km` : "📍 —"}</span>
              <span>⏱ {h.wt}</span><span>★ {h.rat}</span>
              {h.type === "hospital" && <span className="flex items-center gap-1.5">Transp. <TransparencyDots level={h.tr} /></span>}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">{h.sv.map((s) => <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-hp-light border border-gray-100 text-hp-gray">{s}</span>)}</div>
          </div>
          <div className="sm:text-right flex-shrink-0 sm:min-w-[160px]">
            <p className="text-[11px] text-hp-gray uppercase tracking-wider mb-0.5">{h.type === "hospital" ? t.deposit : t.estimated}</p>
            <p className={`font-[family-name:var(--font-display)] text-2xl ${h.type === "pharmacy" ? "text-hp-amber" : "text-hp-navy"}`}>{h.type === "hospital" ? h.ap[lang] : h.ci[lang]}</p>
            {h.type === "hospital" && <p className="text-[11px] text-hp-gray mt-0.5">{t.initialCost}: {h.ci[lang]}</p>}
            <div className="flex flex-col gap-2 mt-3">
              {h.type === "hospital" && <button onClick={onToggleExpand} className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-hp-gray hover:border-hp-blue hover:text-hp-blue">{isExpanded ? t.close : t.seeBreakdown}</button>}
              {h.prem && <button onClick={onRequestAppt} className="text-xs px-4 py-2 rounded-lg bg-hp-navy text-white font-medium">{t.requestAppt}</button>}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded breakdown */}
      {isExpanded && h.type === "hospital" && (
        <div className="border-t border-gray-100 p-5 bg-hp-light/50 rounded-b-2xl">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              {(() => {
                const items = categoryId && urgencyLevel
                  ? getRelevantDesglose(h.dsg[lang], categoryId, urgencyLevel)
                  : h.dsg[lang].map((d) => ({ ...d, relevant: true }));

                const relevant = items.filter((d) => d.relevant);
                const notRelevant = items.filter((d) => !d.relevant);
                const included = relevant.filter((d) => d.i);
                const extras = relevant.filter((d) => !d.i);

                return (
                  <>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {included.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-hp-dark mb-3">{t.included}</p>
                          {included.map((d) => (
                            <div key={d.n} className="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0">
                              <span className="text-xs text-hp-gray flex items-center gap-2 flex-1 min-w-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-hp-green flex-shrink-0" />
                                {d.n}
                              </span>
                              <span className="text-xs font-semibold text-hp-dark ml-2">{d.p}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {notRelevant.length > 0 && (
                      <details className="mt-3">
                        <summary className="text-[11px] text-hp-gray cursor-pointer hover:text-hp-blue">
                          {lang === "es" ? `+ ${notRelevant.length} servicios no relacionados con tu caso` : `+ ${notRelevant.length} services not related to your case`}
                        </summary>
                        <div className="mt-2 space-y-1">
                          {notRelevant.map((d) => (
                            <div key={d.n} className="flex justify-between py-1 opacity-50">
                              <span className="text-[11px] text-hp-gray">{d.n}</span>
                              <span className="text-[11px] text-hp-gray">{d.p}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </>
                );
              })()}
            </div>
            <div>
              <p className="text-xs font-semibold text-hp-dark mb-3">{t.mayIncrease}</p>
              {h.dsg[lang].filter((d) => !d.i).map((d) => (
                <div key={d.n} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-xs text-hp-gray flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-amber" />{d.n}</span>
                  <span className="text-xs font-semibold text-hp-dark">{d.p}</span>
                </div>
              ))}
            </div>
          </div>
          {h.hasIns && (
            <div className="mt-4 p-3 bg-hp-blue-light rounded-xl">
              <p className="text-xs font-semibold text-hp-blue mb-1">{t.insAccepted}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">{h.ins.map((i) => <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${insurer === i ? "bg-hp-blue text-white" : "bg-white text-hp-blue"}`}>{i}</span>)}</div>
            </div>
          )}
          <div className="mt-4 p-3 bg-hp-green-light rounded-xl">
            <p className="text-xs font-semibold text-hp-green-dark mb-1">{t.beforeEnter}</p>
            <ul className="text-[11px] text-hp-gray space-y-1"><li>• {t.q1}</li><li>• {t.q2}</li><li>• {t.q3}</li><li>• {t.q4}</li></ul>
          </div>
        </div>
      )}
    </div>
  );
}
