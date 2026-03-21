"use client";

import { useState, useCallback, useEffect } from "react";
import HospitalMap from "@/components/HospitalMap";

/* ═══════ i18n ═══════ */
const T = {
  es: {
    badge: "Disponible en Jalisco — FIFA World Cup 2026",
    h1a: "Te ayudamos a decidir", h1b: "a dónde ir",
    sub: "Compara hospitales, revisa costos y da seguimiento a tu cuenta mientras te atienden. Sin registro, sin sorpresas.",
    cta1: "Me siento mal ahora", cta2: "Comparar hospitales", cta3: "Cotizar cirugía",
    stat1: "434+", stat1l: "Hospitales en Jalisco", stat2: "<2s", stat2l: "Tiempo de respuesta", stat3: "$0", stat3l: "Costo para ti",
    howLabel: "CÓMO FUNCIONA", howTitle: "De tu síntoma a tu cita en 3 pasos",
    s1t: "Describe qué sientes", s1d: "Zona, intensidad y síntomas. Sin formularios largos.",
    s2t: "Compara hospitales", s2d: "Solo los que pueden atenderte. Precios, seguros, mapa.",
    s3t: "Agenda sin registro", s3d: "Formulario simple. Confirmación con código por correo.",
    hospCta: "¿Eres hospital o clínica?", hospCtaSub: "Únete como hospital convenio.", hospCtaBtn: "Quiero ser convenio",
    sympTitle: "¿Qué sientes?", sympSub: "Selecciona rápido.", whereHurt: "¿Dónde te duele?",
    howBad: "¿Qué tan fuerte?", whatElse: "¿Qué más sientes?", sinceWhen: "¿Desde cuándo?",
    age: "¿Cuántos años tienes?", sex: "Sexo", male: "Hombre", female: "Mujer", noSay: "Prefiero no decir",
    next: "Siguiente", back: "← Volver",
    hasInsQ: "¿Tienes seguro médico?", yes: "Sí", no: "No",
    insTitle: "Selecciona tu aseguradora", insSub: "Los hospitales con tu seguro aparecerán primero.", noIns: "No tengo seguro", otherIns: "Otro",
    seeHosp: "Ver hospitales cercanos",
    resultsTitle: "Hospitales y farmacias disponibles", onlyConvenio: "Solo convenio",
    closest: "Más cercano", cheapest: "Más barato", bestRated: "Mejor calificado", mostTransp: "Más transparente",
    seeBreakdown: "Ver desglose", close: "Cerrar", requestAppt: "Solicitar cita",
    included: "Incluido normalmente", mayIncrease: "Puede elevar la cuenta",
    insAccepted: "Seguros aceptados", beforeEnter: "Antes de entrar, pregunta:",
    q1: "¿De cuánto es el anticipo?", q2: "¿Qué estudios podrían pedir?", q3: "¿Cómo cambia con cirugía?", q4: "¿Qué cubre mi seguro?",
    apptTitle: "Solicitar cita", apptAt: "En", apptNoSchedule: "Fuera de horario (9am-7pm). Se procesará mañana.",
    name: "Nombre completo", email: "Correo electrónico", phone: "Teléfono",
    describe: "Describe tu situación", send: "Enviar solicitud", sending: "Enviando...",
    confTitle: "Solicitud enviada", confSub: "Revisa tu correo. Tu código:", confSave: "Guarda este código para verificar tu cita.",
    verify: "Verificar mi cita", backHome: "Volver al inicio",
    portalHosp: "Portal Hospital", verifyCita: "Verificar cita",
    pharmacy: "Farmacia", openNow: "Abierta ahora", estimated: "Consulta estimada",
    noResults: "No hay opciones con esos filtros.", clearFilters: "Quitar filtros",
    comingSoon: "Próximamente", comingSoonSub: "Estamos preparando el cotizador de cirugías.",
    mild: "Leve", moderate: "Moderado", intense: "Intenso",
    currency: "MXN", deposit: "Anticipo estimado", initialCost: "Costo inicial",
    options: "opciones", accepts: "Acepta",
  },
  en: {
    badge: "Available in Jalisco — FIFA World Cup 2026",
    h1a: "We help you decide", h1b: "where to go",
    sub: "Compare hospitals, check costs and track your bill while you get treated. No sign-up, no surprises.",
    cta1: "I feel sick now", cta2: "Compare hospitals", cta3: "Quote surgery",
    stat1: "434+", stat1l: "Hospitals in Jalisco", stat2: "<2s", stat2l: "Response time", stat3: "$0", stat3l: "Cost for you",
    howLabel: "HOW IT WORKS", howTitle: "From symptom to appointment in 3 steps",
    s1t: "Describe how you feel", s1d: "Body area, intensity, and symptoms. No long forms.",
    s2t: "Compare hospitals", s2d: "Only those that can treat you. Prices, insurance, map.",
    s3t: "Book without sign-up", s3d: "Simple form. Email confirmation with code.",
    hospCta: "Are you a hospital or clinic?", hospCtaSub: "Join as a partner hospital.", hospCtaBtn: "I want to join",
    sympTitle: "What do you feel?", sympSub: "Select quickly.", whereHurt: "Where does it hurt?",
    howBad: "How bad is it?", whatElse: "What else do you feel?", sinceWhen: "Since when?",
    age: "How old are you?", sex: "Sex", male: "Male", female: "Female", noSay: "Prefer not to say",
    next: "Next", back: "← Back",
    hasInsQ: "Do you have health insurance?", yes: "Yes", no: "No",
    insTitle: "Select your insurer", insSub: "Hospitals with your insurance will show first.", noIns: "No insurance", otherIns: "Other",
    seeHosp: "See nearby hospitals",
    resultsTitle: "Available hospitals & pharmacies", onlyConvenio: "Partners only",
    closest: "Closest", cheapest: "Cheapest", bestRated: "Best rated", mostTransp: "Most transparent",
    seeBreakdown: "See breakdown", close: "Close", requestAppt: "Request appointment",
    included: "Usually included", mayIncrease: "May increase the bill",
    insAccepted: "Accepted insurers", beforeEnter: "Before you enter, ask:",
    q1: "What's the deposit?", q2: "What tests might they order?", q3: "How does it change with surgery?", q4: "What does my insurance cover?",
    apptTitle: "Request appointment", apptAt: "At", apptNoSchedule: "Outside hours (9am-7pm). Will be processed tomorrow.",
    name: "Full name", email: "Email", phone: "Phone",
    describe: "Describe your situation", send: "Send request", sending: "Sending...",
    confTitle: "Request sent", confSub: "Check your email. Your code:", confSave: "Save this code to check your appointment.",
    verify: "Check my appointment", backHome: "Back to home",
    portalHosp: "Hospital Portal", verifyCita: "Check appointment",
    pharmacy: "Pharmacy", openNow: "Open now", estimated: "Estimated consultation",
    noResults: "No options match those filters.", clearFilters: "Clear filters",
    comingSoon: "Coming soon", comingSoonSub: "We're building the surgery quote tool.",
    mild: "Mild", moderate: "Moderate", intense: "Intense",
    currency: "USD", deposit: "Estimated deposit", initialCost: "Initial cost",
    options: "options", accepts: "Accepts",
  },
};
type Lang = "es" | "en";

/* ═══════ DATA ═══════ */
const CAROUSEL = [
  { tip: { es: "Hidrátate bien, habrá mucho sol", en: "Stay hydrated, it'll be sunny" }, emoji: "💧", img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1400&q=80" },
  { tip: { es: "Cuidado con el dengue: usa repelente", en: "Watch out for dengue: use repellent" }, emoji: "🦟", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&q=80" },
  { tip: { es: "Protégete del sol: usa bloqueador", en: "Protect yourself from the sun" }, emoji: "☀️", img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1400&q=80" },
  { tip: { es: "Lávate las manos frecuentemente", en: "Wash your hands frequently" }, emoji: "🧼", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1400&q=80" },
  { tip: { es: "Si bebes alcohol, hazlo con moderación", en: "Drink alcohol in moderation" }, emoji: "🍺", img: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1400&q=80" },
];

const INSURERS_LIST = ["GNP", "AXA", "Metlife", "Seguros Monterrey", "Zurich", "BUPA", "Allianz", "Mapfre", "Inbursa"];
const BODY_ZONES = [
  { id: "head", label: "Cabeza", en: "Head", emoji: "🧠", needs: ["CONSULTATION","IMAGING"] as SC[] },
  { id: "chest", label: "Pecho", en: "Chest", emoji: "🫁", needs: ["EMERGENCY","IMAGING","LAB"] as SC[] },
  { id: "abdomen", label: "Abdomen", en: "Abdomen", emoji: "🫃", needs: ["EMERGENCY","SURGERY","IMAGING","LAB"] as SC[] },
  { id: "back", label: "Espalda", en: "Back", emoji: "🦴", needs: ["CONSULTATION","IMAGING"] as SC[] },
  { id: "limbs", label: "Extremidades", en: "Limbs", emoji: "💪", needs: ["EMERGENCY","IMAGING"] as SC[] },
  { id: "throat", label: "Garganta", en: "Throat", emoji: "🗣️", needs: ["CONSULTATION","LAB"] as SC[] },
  { id: "skin", label: "Piel", en: "Skin", emoji: "🩹", needs: ["CONSULTATION"] as SC[] },
  { id: "general", label: "General", en: "General", emoji: "🤒", needs: ["CONSULTATION","LAB"] as SC[] },
];
const EXTRA = { es: ["Fiebre","Náusea","Vómito","Dificultad para respirar","Mareo","Sangrado","Dolor intenso","Diarrea"], en: ["Fever","Nausea","Vomit","Breathing difficulty","Dizziness","Bleeding","Intense pain","Diarrhea"] };
const SINCE = { es: [{id:"1h",l:"< 1 hora"},{id:"1-6h",l:"1-6 horas"},{id:"6h+",l:"+6 horas"},{id:"days",l:"Varios días"}], en: [{id:"1h",l:"< 1 hour"},{id:"1-6h",l:"1-6 hours"},{id:"6h+",l:"+6 hours"},{id:"days",l:"Several days"}] };
type SC = "EMERGENCY"|"CONSULTATION"|"SURGERY"|"LAB"|"IMAGING";

const HOSPITALS = [
  { id:1, name:"Hospital San Javier", type:"hospital" as const, level:"THIRD", lat:20.6767, lng:-103.3812, anticipoRange:{es:"$8,000 - $15,000 MXN",en:"$450 - $850 USD"}, costoInicial:{es:"$2,500 - $6,000 MXN",en:"$140 - $340 USD"}, waitTime:"~15 min", rating:4.6, urgenciasOpen:true, acceptsInsurance:true, insurers:["GNP","AXA","Metlife","Seguros Monterrey"], transparency:4, sc:["EMERGENCY","SURGERY","LAB","IMAGING","CONSULTATION"] as SC[], services:["Urgencias 24h","Cirugía","Lab","Imagen"], isPremium:true, desglose:{es:[{n:"Admisión y valoración",p:"$800-$1,500",i:true},{n:"Lab básico",p:"$600-$1,200",i:true},{n:"Honorarios médico",p:"$1,000-$2,000",i:true},{n:"Medicamentos",p:"$300-$800",i:true},{n:"Ultrasonido/RX",p:"$1,500-$3,000",i:false},{n:"Tomografía",p:"$4,000-$8,000",i:false},{n:"Cirugía",p:"$15,000-$45,000",i:false},{n:"Cuarto/noche",p:"$3,000-$6,000",i:false}],en:[{n:"Admission",p:"$45-$85",i:true},{n:"Basic lab",p:"$34-$68",i:true},{n:"Doctor fees",p:"$57-$114",i:true},{n:"Medications",p:"$17-$45",i:true},{n:"Ultrasound/X-Ray",p:"$85-$170",i:false},{n:"CT Scan",p:"$227-$454",i:false},{n:"Surgery",p:"$852-$2,557",i:false},{n:"Room/night",p:"$170-$341",i:false}]} },
  { id:2, name:"Clínica del Valle", type:"hospital" as const, level:"SECOND", lat:20.6700, lng:-103.3650, anticipoRange:{es:"$5,000 - $10,000 MXN",en:"$280 - $570 USD"}, costoInicial:{es:"$1,800 - $4,000 MXN",en:"$100 - $227 USD"}, waitTime:"~25 min", rating:4.3, urgenciasOpen:true, acceptsInsurance:true, insurers:["GNP","AXA","BUPA"], transparency:3, sc:["EMERGENCY","CONSULTATION","LAB"] as SC[], services:["Urgencias 24h","Consulta","Lab"], isPremium:false, desglose:{es:[{n:"Admisión",p:"$500-$1,000",i:true},{n:"Lab básico",p:"$400-$900",i:true},{n:"Honorarios",p:"$700-$1,500",i:true},{n:"Medicamentos",p:"$200-$600",i:true},{n:"Rayos X",p:"$800-$1,500",i:false},{n:"Cuarto/noche",p:"$2,000-$4,000",i:false}],en:[{n:"Admission",p:"$28-$57",i:true},{n:"Basic lab",p:"$23-$51",i:true},{n:"Doctor fees",p:"$40-$85",i:true},{n:"Medications",p:"$11-$34",i:true},{n:"X-Ray",p:"$45-$85",i:false},{n:"Room/night",p:"$114-$227",i:false}]} },
  { id:3, name:"Hospital Puerta de Hierro", type:"hospital" as const, level:"THIRD", lat:20.7050, lng:-103.4100, anticipoRange:{es:"$12,000 - $25,000 MXN",en:"$680 - $1,420 USD"}, costoInicial:{es:"$4,000 - $8,000 MXN",en:"$227 - $454 USD"}, waitTime:"~10 min", rating:4.8, urgenciasOpen:true, acceptsInsurance:true, insurers:["GNP","AXA","Metlife","Seguros Monterrey","Zurich","BUPA","Allianz"], transparency:5, sc:["EMERGENCY","SURGERY","LAB","IMAGING","CONSULTATION"] as SC[], services:["Urgencias 24h","Cirugía","UCI","Lab","Imagen"], isPremium:true, desglose:{es:[{n:"Admisión",p:"$1,200-$2,000",i:true},{n:"Lab completo",p:"$900-$1,800",i:true},{n:"Honorarios",p:"$1,500-$3,000",i:true},{n:"Medicamentos",p:"$400-$1,000",i:true},{n:"Ultrasonido/RX",p:"$2,000-$4,000",i:false},{n:"Tomografía",p:"$5,000-$10,000",i:false},{n:"Cirugía",p:"$20,000-$60,000",i:false},{n:"Cuarto/noche",p:"$4,500-$8,000",i:false}],en:[{n:"Admission",p:"$68-$114",i:true},{n:"Full lab",p:"$51-$102",i:true},{n:"Doctor fees",p:"$85-$170",i:true},{n:"Medications",p:"$23-$57",i:true},{n:"Ultrasound/X-Ray",p:"$114-$227",i:false},{n:"CT Scan",p:"$284-$568",i:false},{n:"Surgery",p:"$1,136-$3,409",i:false},{n:"Room/night",p:"$256-$454",i:false}]} },
  { id:4, name:"Médica Sur GDL", type:"hospital" as const, level:"FIRST", lat:20.6600, lng:-103.3500, anticipoRange:{es:"$3,000 - $6,000 MXN",en:"$170 - $341 USD"}, costoInicial:{es:"$800 - $2,000 MXN",en:"$45 - $114 USD"}, waitTime:"~35 min", rating:4.1, urgenciasOpen:false, acceptsInsurance:false, insurers:[], transparency:2, sc:["CONSULTATION","LAB"] as SC[], services:["Consulta","Lab básico"], isPremium:false, desglose:{es:[{n:"Consulta",p:"$500-$800",i:true},{n:"Lab básico",p:"$300-$600",i:true},{n:"Medicamentos",p:"$150-$400",i:true},{n:"Rayos X",p:"$600-$1,200",i:false}],en:[{n:"Consultation",p:"$28-$45",i:true},{n:"Basic lab",p:"$17-$34",i:true},{n:"Medications",p:"$9-$23",i:true},{n:"X-Ray",p:"$34-$68",i:false}]} },
  { id:101, name:"Farmacia Guadalajara", type:"pharmacy" as const, level:"FIRST", lat:20.6730, lng:-103.3700, anticipoRange:{es:"$0",en:"$0"}, costoInicial:{es:"$100 - $500 MXN",en:"$6 - $28 USD"}, waitTime:"~5 min", rating:4.2, urgenciasOpen:true, acceptsInsurance:false, insurers:[], transparency:3, sc:["CONSULTATION"] as SC[], services:["Consulta","Medicamentos"], isPremium:false, desglose:{es:[{n:"Consulta",p:"$50-$100",i:true},{n:"Medicamentos",p:"$50-$400",i:true}],en:[{n:"Consultation",p:"$3-$6",i:true},{n:"Medications",p:"$3-$23",i:true}]} },
  { id:102, name:"Farmacias del Ahorro", type:"pharmacy" as const, level:"FIRST", lat:20.6680, lng:-103.3580, anticipoRange:{es:"$0",en:"$0"}, costoInicial:{es:"$80 - $400 MXN",en:"$5 - $23 USD"}, waitTime:"~10 min", rating:4.0, urgenciasOpen:true, acceptsInsurance:false, insurers:[], transparency:3, sc:["CONSULTATION"] as SC[], services:["Consulta","Medicamentos"], isPremium:false, desglose:{es:[{n:"Consulta",p:"$35-$80",i:true},{n:"Medicamentos",p:"$50-$350",i:true}],en:[{n:"Consultation",p:"$2-$5",i:true},{n:"Medications",p:"$3-$20",i:true}]} },
];

function getDist(a:number,b:number,c:number,d:number){const R=6371,x=((c-a)*Math.PI)/180,y=((d-b)*Math.PI)/180,z=Math.sin(x/2)**2+Math.cos((a*Math.PI)/180)*Math.cos((c*Math.PI)/180)*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(z),Math.sqrt(1-z));}
function inSchedule(){const h=new Date().getHours();return h>=9&&h<19;}

/* ═══════ COMPONENTS ═══════ */
function LB({level,type}:{level:string;type:string}){if(type==="pharmacy")return<span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-hp-amber-light text-hp-amber">💊</span>;const c:Record<string,{l:string;s:string}>={FIRST:{l:"1°",s:"bg-hp-green-light text-hp-green"},SECOND:{l:"2°",s:"bg-hp-blue-light text-hp-blue"},THIRD:{l:"3°",s:"bg-hp-blue-light text-hp-navy"}};const x=c[level]||c.FIRST;return<span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${x.s}`}>{x.l}</span>;}
function Dots({n}:{n:number}){return<div className="flex gap-0.5">{[1,2,3,4,5].map(i=><div key={i} className={`w-2 h-2 rounded-full ${i<=n?"bg-hp-green":"bg-gray-200"}`}/>)}</div>;}

async function sendEmailJS(to:string,name:string,code:string,hosp:string){const S=process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID||"",TT=process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID||"",K=process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY||"";if(!S||!TT||!K)return;try{await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:S,template_id:TT,user_id:K,template_params:{to_email:to,to_name:name,verification_code:code,hospital_name:hosp}})});}catch(e){console.error(e);}}

/* ═══════ PAGE ═══════ */
type Screen = "home"|"symptoms"|"hasInsurance"|"insurance"|"results"|"appointment"|"surgery";

export default function Home() {
  const [lang,setLang]=useState<Lang>("es");
  const t=T[lang];

  const [screen,setScreen]=useState<Screen>("home");
  const [zone,setZone]=useState<string|null>(null);
  const [pain,setPain]=useState(5);
  const [extra,setExtra]=useState<string[]>([]);
  const [since,setSince]=useState<string|null>(null);
  const [age,setAge]=useState("");
  const [sex,setSex]=useState<string|null>(null);
  const [sortBy,setSortBy]=useState("distance");
  const [expanded,setExpanded]=useState<number|null>(null);
  const [insurer,setInsurer]=useState<string|null>(null);
  const [otherInsurer,setOtherInsurer]=useState("");
  const [convenio,setConvenio]=useState(false);
  const [uLat,setULat]=useState<number|null>(null);
  const [uLng,setULng]=useState<number|null>(null);
  const [selHosp,setSelHosp]=useState<number|null>(null);
  const [ci,setCi]=useState(0);

  const [aN,setAN]=useState("");const [aE,setAE]=useState("");const [aPh,setAPh]=useState("");const [aD,setAD]=useState("");const [aSend,setASend]=useState(false);const [aCode,setACode]=useState<string|null>(null);const [aErr,setAErr]=useState<string|null>(null);

  // Carousel
  useEffect(()=>{const i=setInterval(()=>setCi(x=>(x+1)%CAROUSEL.length),5000);return()=>clearInterval(i);},[]);

  const geoAndGo=useCallback(()=>{navigator.geolocation.getCurrentPosition(p=>{setULat(p.coords.latitude);setULng(p.coords.longitude);setScreen("results");},()=>setScreen("results"),{enableHighAccuracy:true,timeout:8000});},[]);

  const needed:SC[]=zone?(BODY_ZONES.find(z=>z.id===zone)?.needs||[]):[];
  const enriched=HOSPITALS.map(h=>{const d=uLat&&uLng?getDist(uLat,uLng,h.lat,h.lng):null;const can=needed.length===0||needed.some(s=>h.sc.includes(s));const hasIns=insurer?(h.insurers as string[]).includes(insurer):null;return{...h,dist:d,can,hasIns};});
  const filt=enriched.filter(h=>h.can).filter(h=>!convenio||h.isPremium);
  const sorted=[...filt].sort((a,b)=>{if(insurer){if(a.hasIns&&!b.hasIns)return-1;if(!a.hasIns&&b.hasIns)return 1;}if(sortBy==="distance"&&a.dist!==null&&b.dist!==null)return a.dist-b.dist;if(sortBy==="cost")return parseInt(a.costoInicial[lang].replace(/\D/g,""))-parseInt(b.costoInicial[lang].replace(/\D/g,""));if(sortBy==="rating")return b.rating-a.rating;if(sortBy==="transparency")return b.transparency-a.transparency;return 0;});

  const selH=HOSPITALS.find(h=>h.id===selHosp);
  const handleAppt=async()=>{if(!aN||!aE||!aPh||!selHosp)return;setASend(true);setAErr(null);try{const r=await fetch("/api/appointments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hospitalName:selH?.name,patientName:aN,patientEmail:aE,patientPhone:aPh,symptomDescription:aD||zone||"-"})});const d=await r.json();if(d.code){setACode(d.code);sendEmailJS(aE,aN,d.code,selH?.name||"");}else setAErr(d.error||"Error");}catch{setAErr("Error");}setASend(false);};
  const mapSel=useCallback((id:number)=>{setExpanded(id);document.getElementById(`h-${id}`)?.scrollIntoView({behavior:"smooth",block:"center"});},[]);

  return(
  <main className="min-h-screen">
    {/* Nav */}
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <button onClick={()=>{setScreen("home");setExpanded(null);setACode(null);}} className="flex items-center gap-2 group">
          <img src="/logo-healthping.jpeg" alt="HealthPing" className="h-10 w-auto" />
          <span className="font-[family-name:var(--font-display)] text-xl text-hp-navy hidden sm:inline">Health<span className="text-hp-green">Ping</span></span>
        </button>
        <div className="flex items-center gap-3 text-sm">
          <a href="/verificar" className="hidden sm:inline text-hp-gray hover:text-hp-navy">{t.verifyCita}</a>
          <a href="/hospital" className="hidden sm:inline bg-hp-green text-white px-4 py-2 rounded-lg font-medium hover:bg-hp-green-dark">{t.portalHosp}</a>
          <button onClick={()=>setLang(lang==="es"?"en":"es")} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-hp-blue">
            <span className="text-base">{lang==="es"?"🇲🇽":"🇺🇸"}</span><span className="font-medium">{lang==="es"?"ES":"EN"}</span>
          </button>
        </div>
      </div>
    </nav>

    {/* ═══════ HOME ═══════ */}
    {screen==="home"&&(<>
      <section className="pt-14 relative overflow-hidden" style={{minHeight:"88vh"}}>
        {/* Carousel background image */}
        <div className="absolute inset-0">
          {CAROUSEL.map((c,i)=>(
            <img key={i} src={c.img} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i===ci?"opacity-100":"opacity-0"}`} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white" />
        </div>

        <div className="max-w-6xl mx-auto px-5 relative pt-16 pb-16">
          <div className="max-w-xl">
            {/* Tip overlay - synced with image */}
            <div className="mb-8 animate-fade-up">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 px-4 py-2.5 rounded-2xl">
                <span className="text-xl">{CAROUSEL[ci].emoji}</span>
                <span className="text-sm text-hp-dark font-medium">{CAROUSEL[ci].tip[lang]}</span>
                <div className="flex gap-1 ml-2">{CAROUSEL.map((_,i)=><div key={i} className={`w-1.5 h-1.5 rounded-full ${i===ci?"bg-hp-navy":"bg-gray-300"}`}/>)}</div>
              </div>
            </div>

            <div className="animate-fade-up-1">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-hp-green/20 text-hp-green text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-hp-green animate-pulse-ring"/>{t.badge}
              </div>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[3rem] sm:text-[3.5rem] leading-[1.08] text-hp-navy mb-5 animate-fade-up-2">
              {t.h1a}<br/><span className="italic text-hp-blue">{t.h1b}</span>
            </h1>
            <p className="text-base text-hp-gray max-w-md mb-10 leading-relaxed animate-fade-up-3">{t.sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up-4">
              <button onClick={()=>setScreen("symptoms")} className="flex items-center justify-center gap-3 bg-hp-navy text-white px-6 py-3.5 rounded-2xl font-semibold text-sm hover:bg-hp-navy/90 hover:shadow-lg"><span className="w-2.5 h-2.5 rounded-full bg-hp-coral animate-pulse-ring"/>{t.cta1}</button>
              <button onClick={()=>setScreen("results")} className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-hp-dark px-6 py-3.5 rounded-2xl font-semibold text-sm hover:border-hp-blue hover:text-hp-blue">{t.cta2}</button>
              <button onClick={()=>setScreen("surgery")} className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-hp-dark px-6 py-3.5 rounded-2xl font-semibold text-sm hover:border-hp-green hover:text-hp-green">🔬 {t.cta3}</button>
            </div>
          </div>
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm">
            {[{v:t.stat1,l:t.stat1l},{v:t.stat2,l:t.stat2l},{v:t.stat3,l:t.stat3l}].map(s=><div key={s.l}><p className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">{s.v}</p><p className="text-[11px] text-hp-gray mt-1">{s.l}</p></div>)}
          </div>
        </div>
      </section>
      <section className="py-20 px-5 bg-white"><div className="max-w-6xl mx-auto"><p className="text-xs font-semibold text-hp-green tracking-widest uppercase mb-3">{t.howLabel}</p><h2 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-14">{t.howTitle}</h2><div className="grid sm:grid-cols-3 gap-10">{[{s:"01",tt:t.s1t,d:t.s1d,c:"bg-hp-blue-light text-hp-blue"},{s:"02",tt:t.s2t,d:t.s2d,c:"bg-hp-green-light text-hp-green"},{s:"03",tt:t.s3t,d:t.s3d,c:"bg-hp-blue-light text-hp-navy"}].map(i=><div key={i.s}><div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${i.c} font-bold text-base mb-4`}>{i.s}</div><h3 className="font-semibold text-lg text-hp-dark mb-2">{i.tt}</h3><p className="text-sm text-hp-gray leading-relaxed">{i.d}</p></div>)}</div></div></section>
      <section className="py-20 px-5 bg-hp-navy"><div className="max-w-4xl mx-auto text-center"><h2 className="font-[family-name:var(--font-display)] text-3xl text-white mb-4">{t.hospCta}</h2><p className="text-white/50 max-w-md mx-auto mb-8 text-sm">{t.hospCtaSub}</p><a href="/convenio" className="inline-block bg-hp-green text-white px-8 py-3 rounded-xl font-semibold hover:bg-hp-green-dark">{t.hospCtaBtn}</a></div></section>
      <footer className="py-8 px-5 bg-hp-light border-t border-gray-100"><div className="max-w-6xl mx-auto flex items-center justify-between"><span className="text-xs text-hp-gray">HealthPing</span><p className="text-[11px] text-hp-gray-light">© 2026</p></div></footer>
    </>)}

    {/* ═══════ SURGERY ═══════ */}
    {screen==="surgery"&&(<section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light flex items-center justify-center"><div className="max-w-md text-center"><div className="w-20 h-20 rounded-2xl bg-hp-navy flex items-center justify-center mx-auto mb-6"><span className="text-3xl">🔬</span></div><h1 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-3">{t.comingSoon}</h1><p className="text-hp-gray mb-8 text-sm">{t.comingSoonSub}</p><form onSubmit={e=>e.preventDefault()} className="flex gap-2 max-w-sm mx-auto"><input type="email" placeholder="email" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green"/><button className="bg-hp-green text-white px-5 py-3 rounded-xl font-semibold text-sm">OK</button></form><button onClick={()=>setScreen("home")} className="mt-8 text-sm text-hp-gray">{t.back}</button></div></section>)}

    {/* ═══════ SYMPTOMS ═══════ */}
    {screen==="symptoms"&&(<section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light"><div className="max-w-lg mx-auto">
      <div className="flex gap-1.5 mb-8 mt-4"><div className="h-1 flex-1 rounded-full bg-hp-green"/><div className="h-1 flex-1 rounded-full bg-gray-200"/><div className="h-1 flex-1 rounded-full bg-gray-200"/></div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">{t.sympTitle}</h2><p className="text-sm text-hp-gray mb-8">{t.sympSub}</p>

      <div className="mb-6"><p className="text-sm font-medium text-hp-dark mb-3">{t.whereHurt}</p><div className="grid grid-cols-4 gap-2">{BODY_ZONES.map(z=>(<button key={z.id} onClick={()=>setZone(z.id)} className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 ${zone===z.id?"border-hp-green bg-hp-green-light":"border-gray-200 bg-white hover:border-hp-blue-mid"}`}><span className="text-xl">{z.emoji}</span><span className="text-[11px] font-medium">{lang==="es"?z.label:z.en}</span></button>))}</div></div>

      <div className="mb-6"><div className="flex justify-between mb-3"><p className="text-sm font-medium text-hp-dark">{t.howBad}</p><span className={`text-sm font-bold ${pain>=7?"text-hp-coral":pain>=4?"text-hp-amber":"text-hp-green"}`}>{pain}/10</span></div><input type="range" min={1} max={10} value={pain} onChange={e=>setPain(+e.target.value)} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-hp-green" style={{background:"linear-gradient(to right,#16A085,#F39C12 50%,#E74C3C)"}}/><div className="flex justify-between text-[10px] text-hp-gray mt-1"><span>{t.mild}</span><span>{t.moderate}</span><span>{t.intense}</span></div></div>

      <div className="mb-6"><p className="text-sm font-medium text-hp-dark mb-3">{t.whatElse}</p><div className="flex flex-wrap gap-2">{EXTRA[lang].map(s=>(<button key={s} onClick={()=>setExtra(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])} className={`text-xs px-3 py-2 rounded-full border font-medium ${extra.includes(s)?"border-hp-green bg-hp-green-light text-hp-green-dark":"border-gray-200 bg-white text-hp-gray"}`}>{s}</button>))}</div></div>

      <div className="mb-6"><p className="text-sm font-medium text-hp-dark mb-3">{t.sinceWhen}</p><div className="grid grid-cols-4 gap-2">{SINCE[lang].map(o=>(<button key={o.id} onClick={()=>setSince(o.id)} className={`text-xs px-2 py-3 rounded-xl border-2 font-medium ${since===o.id?"border-hp-green bg-hp-green-light text-hp-green-dark":"border-gray-200 bg-white text-hp-gray"}`}>{o.l}</button>))}</div></div>

      {/* Age */}
      <div className="mb-6"><p className="text-sm font-medium text-hp-dark mb-3">{t.age}</p><input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="25" min={1} max={120} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green"/></div>

      {/* Sex */}
      <div className="mb-8"><p className="text-sm font-medium text-hp-dark mb-3">{t.sex}</p><div className="grid grid-cols-3 gap-2">{([["male",t.male],["female",t.female],["na",t.noSay]] as [string,string][]).map(([v,l])=>(<button key={v} onClick={()=>setSex(v)} className={`text-xs px-3 py-3 rounded-xl border-2 font-medium ${sex===v?"border-hp-green bg-hp-green-light text-hp-green-dark":"border-gray-200 bg-white text-hp-gray"}`}>{l}</button>))}</div></div>

      <button onClick={()=>setScreen("hasInsurance")} disabled={!zone} className="w-full bg-hp-navy text-white py-4 rounded-2xl font-semibold disabled:opacity-40">{t.next}</button>
      <button onClick={()=>setScreen("home")} className="w-full mt-3 text-sm text-hp-gray py-2">{t.back}</button>
    </div></section>)}

    {/* ═══════ HAS INSURANCE? ═══════ */}
    {screen==="hasInsurance"&&(<section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light"><div className="max-w-lg mx-auto">
      <div className="flex gap-1.5 mb-8 mt-4"><div className="h-1 flex-1 rounded-full bg-hp-green"/><div className="h-1 flex-1 rounded-full bg-hp-green"/><div className="h-1 flex-1 rounded-full bg-gray-200"/></div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">{t.hasInsQ}</h2>
      <p className="text-sm text-hp-gray mb-10">{t.insSub}</p>
      <div className="flex gap-4">
        <button onClick={()=>setScreen("insurance")} className="flex-1 bg-hp-green text-white py-5 rounded-2xl font-semibold text-lg hover:bg-hp-green-dark">{t.yes}</button>
        <button onClick={()=>{setInsurer(null);geoAndGo();}} className="flex-1 bg-white border-2 border-gray-200 text-hp-dark py-5 rounded-2xl font-semibold text-lg hover:border-hp-navy hover:text-hp-navy">{t.no}</button>
      </div>
      <button onClick={()=>setScreen("symptoms")} className="w-full mt-6 text-sm text-hp-gray py-2">{t.back}</button>
    </div></section>)}

    {/* ═══════ INSURANCE SELECTOR ═══════ */}
    {screen==="insurance"&&(<section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light"><div className="max-w-lg mx-auto">
      <div className="flex gap-1.5 mb-8 mt-4"><div className="h-1 flex-1 rounded-full bg-hp-green"/><div className="h-1 flex-1 rounded-full bg-hp-green"/><div className="h-1 flex-1 rounded-full bg-gray-200"/></div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">{t.insTitle}</h2><p className="text-sm text-hp-gray mb-8">{t.insSub}</p>
      <div className="grid grid-cols-2 gap-2 mb-4">{INSURERS_LIST.map(ins=>(<button key={ins} onClick={()=>{setInsurer(ins);setOtherInsurer("");}} className={`text-sm px-4 py-3 rounded-xl border-2 font-medium text-left ${insurer===ins?"border-hp-green bg-hp-green-light text-hp-green-dark":"border-gray-200 bg-white text-hp-gray"}`}>{ins}</button>))}</div>
      {/* Other */}
      <div className="mb-6">
        <button onClick={()=>{setInsurer("__other");}} className={`w-full text-sm px-4 py-3 rounded-xl border-2 font-medium text-left ${insurer==="__other"?"border-hp-green bg-hp-green-light text-hp-green-dark":"border-gray-200 bg-white text-hp-gray"}`}>{t.otherIns}</button>
        {insurer==="__other"&&<input value={otherInsurer} onChange={e=>setOtherInsurer(e.target.value)} placeholder={lang==="es"?"Escribe tu aseguradora":"Type your insurer"} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green mt-2"/>}
      </div>
      <button onClick={geoAndGo} disabled={!insurer} className="w-full bg-hp-navy text-white py-4 rounded-2xl font-semibold disabled:opacity-40">{t.seeHosp}</button>
      <button onClick={()=>setScreen("hasInsurance")} className="w-full mt-3 text-sm text-hp-gray py-2">{t.back}</button>
    </div></section>)}

    {/* ═══════ RESULTS ═══════ */}
    {screen==="results"&&!aCode&&(<section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light"><div className="max-w-3xl mx-auto mt-4">
      <div className="mb-5"><HospitalMap hospitals={sorted.filter(h=>h.type==="hospital").map(h=>({id:h.id,name:h.name,lat:h.lat,lng:h.lng,isPremium:h.isPremium,level:h.level,anticipoRange:h.anticipoRange[lang]}))} userLat={uLat} userLng={uLng} onSelectHospital={mapSel}/></div>
      <div className="flex items-end justify-between mb-4"><div><h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy">{t.resultsTitle}</h2><p className="text-xs text-hp-gray mt-1">{sorted.length} {t.options}{insurer&&insurer!=="__other"?` · ${insurer}`:""}</p></div></div>
      <div className="flex flex-wrap gap-2 mb-4">
        {insurer&&insurer!=="__other"&&<span className="text-xs px-3 py-1.5 rounded-full bg-hp-blue-light border border-hp-blue/20 text-hp-blue font-medium flex items-center gap-1.5">🛡️ {insurer}<button onClick={()=>setInsurer(null)} className="ml-1 hover:text-hp-coral">✕</button></span>}
        <button onClick={()=>setConvenio(!convenio)} className={`text-xs px-3 py-1.5 rounded-full border ${convenio?"bg-hp-green-light border-hp-green text-hp-green":"border-gray-200 bg-white text-hp-gray"}`}>{convenio?`${t.onlyConvenio} ✓`:t.onlyConvenio}</button>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white"><option value="distance">{t.closest}</option><option value="cost">{t.cheapest}</option><option value="rating">{t.bestRated}</option><option value="transparency">{t.mostTransp}</option></select>
      </div>
      <div className="flex flex-col gap-3">
        {sorted.map(h=>(<div key={h.id} id={`h-${h.id}`} className={`bg-white rounded-2xl border transition-all ${h.isPremium?"border-hp-green/30 ring-1 ring-hp-green/10":h.type==="pharmacy"?"border-hp-amber/30":"border-gray-200"} ${expanded===h.id?"shadow-lg":"hover:shadow-md"}`}>
          <div className="p-5"><div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2"><h3 className="font-semibold text-base text-hp-dark">{h.name}</h3><LB level={h.level} type={h.type}/>{h.isPremium&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-hp-green text-white">Convenio</span>}{h.urgenciasOpen&&h.type==="hospital"&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-hp-green-light text-hp-green">Urgencias</span>}{h.type==="pharmacy"&&h.urgenciasOpen&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-hp-amber-light text-hp-amber">{t.openNow}</span>}{h.hasIns&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-hp-blue text-white">{t.accepts} {insurer}</span>}</div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-hp-gray mt-1"><span>{h.dist!==null?`📍 ${h.dist.toFixed(1)} km`:"📍 —"}</span><span>⏱ {h.waitTime}</span><span>★ {h.rating}</span>{h.type==="hospital"&&<span className="flex items-center gap-1.5">{lang==="es"?"Transp.":"Transp."} <Dots n={h.transparency}/></span>}</div>
              <div className="flex flex-wrap gap-1.5 mt-3">{h.services.map(s=><span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-hp-light border border-gray-100 text-hp-gray">{s}</span>)}</div>
            </div>
            <div className="sm:text-right flex-shrink-0 sm:min-w-[150px]">
              <p className="text-[10px] text-hp-gray uppercase tracking-wider mb-0.5">{h.type==="hospital"?t.deposit:t.estimated}</p>
              <p className={`font-[family-name:var(--font-display)] text-xl ${h.type==="pharmacy"?"text-hp-amber":"text-hp-navy"}`}>{h.type==="hospital"?h.anticipoRange[lang]:h.costoInicial[lang]}</p>
              {h.type==="hospital"&&<p className="text-[10px] text-hp-gray mt-0.5">{t.initialCost}: {h.costoInicial[lang]}</p>}
              <div className="flex flex-col gap-2 mt-3">
                {h.type==="hospital"&&<button onClick={()=>setExpanded(expanded===h.id?null:h.id)} className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-hp-gray hover:border-hp-blue hover:text-hp-blue">{expanded===h.id?t.close:t.seeBreakdown}</button>}
                {h.isPremium&&<button onClick={()=>{setSelHosp(h.id);setScreen("appointment");}} className="text-xs px-4 py-2 rounded-lg bg-hp-navy text-white font-medium">{t.requestAppt}</button>}
              </div>
            </div>
          </div></div>
          {expanded===h.id&&h.type==="hospital"&&(<div className="border-t border-gray-100 p-5 bg-hp-light/50 rounded-b-2xl animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-6"><div><p className="text-xs font-semibold text-hp-dark mb-3">{t.included}</p>{h.desglose[lang].filter(d=>d.i).map(d=><div key={d.n} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"><span className="text-xs text-hp-gray flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-green"/>{d.n}</span><span className="text-xs font-semibold text-hp-dark">{d.p}</span></div>)}</div><div><p className="text-xs font-semibold text-hp-dark mb-3">{t.mayIncrease}</p>{h.desglose[lang].filter(d=>!d.i).map(d=><div key={d.n} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"><span className="text-xs text-hp-gray flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-hp-amber"/>{d.n}</span><span className="text-xs font-semibold text-hp-dark">{d.p}</span></div>)}</div></div>
            {h.acceptsInsurance&&<div className="mt-4 p-3 bg-hp-blue-light rounded-xl"><p className="text-xs font-semibold text-hp-blue mb-1">{t.insAccepted}</p><div className="flex flex-wrap gap-1.5 mt-1">{h.insurers.map(ins=><span key={ins} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${insurer===ins?"bg-hp-blue text-white":"bg-white text-hp-blue"}`}>{ins}</span>)}</div></div>}
            <div className="mt-4 p-3 bg-hp-green-light rounded-xl"><p className="text-xs font-semibold text-hp-green-dark mb-1">{t.beforeEnter}</p><ul className="text-[11px] text-hp-gray space-y-1"><li>• {t.q1}</li><li>• {t.q2}</li><li>• {t.q3}</li><li>• {t.q4}</li></ul></div>
          </div>)}
        </div>))}
        {sorted.length===0&&<div className="text-center py-12"><p className="text-hp-gray text-sm">{t.noResults}</p><button onClick={()=>{setConvenio(false);setInsurer(null);}} className="mt-3 text-xs text-hp-blue hover:underline">{t.clearFilters}</button></div>}
      </div>
      <button onClick={()=>setScreen(zone?"hasInsurance":"home")} className="w-full mt-6 text-sm text-hp-gray py-2">{t.back}</button>
    </div></section>)}

    {/* ═══════ APPOINTMENT ═══════ */}
    {screen==="appointment"&&!aCode&&selH&&(<section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light"><div className="max-w-md mx-auto mt-4">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-1">{t.apptTitle}</h2>
      <p className="text-sm text-hp-gray mb-2">{t.apptAt} <span className="font-semibold text-hp-dark">{selH.name}</span></p>
      {!inSchedule()&&<div className="bg-hp-amber-light border border-hp-amber/20 rounded-xl p-3 mb-4"><p className="text-xs text-hp-amber font-medium">{t.apptNoSchedule}</p></div>}
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.name}</label><input value={aN} onChange={e=>setAN(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green"/></div>
        <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.email}</label><input value={aE} onChange={e=>setAE(e.target.value)} type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green"/></div>
        <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.phone}</label><input value={aPh} onChange={e=>setAPh(e.target.value)} type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green"/></div>
        <div><label className="text-xs font-medium text-hp-dark mb-1 block">{t.describe}</label><textarea value={aD} onChange={e=>setAD(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green resize-none"/></div>
      </div>
      {aErr&&<p className="text-xs text-hp-coral mt-3">{aErr}</p>}
      <button onClick={handleAppt} disabled={!aN||!aE||!aPh||aSend} className="w-full mt-6 bg-hp-navy text-white py-4 rounded-2xl font-semibold disabled:opacity-40">{aSend?t.sending:t.send}</button>
      <button onClick={()=>setScreen("results")} className="w-full mt-3 text-sm text-hp-gray py-2">{t.back}</button>
    </div></section>)}

    {/* ═══════ CONFIRMATION ═══════ */}
    {aCode&&(<section className="pt-20 pb-16 px-5 min-h-screen bg-hp-light flex items-center justify-center"><div className="max-w-md mx-auto text-center animate-fade-up">
      <div className="w-16 h-16 rounded-full bg-hp-green-light flex items-center justify-center mx-auto mb-6"><span className="text-hp-green text-2xl">✓</span></div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-hp-navy mb-2">{t.confTitle}</h2>
      <p className="text-sm text-hp-gray mb-6">{t.confSub}</p>
      <div className="bg-white border-2 border-hp-green rounded-2xl px-8 py-5 inline-block mb-6"><p className="font-mono text-3xl font-bold text-hp-navy tracking-widest">{aCode}</p></div>
      <p className="text-xs text-hp-gray mb-8">{t.confSave}</p>
      <a href={`/verificar?code=${aCode}`} className="bg-hp-navy text-white py-3 rounded-xl font-semibold text-sm block mb-3">{t.verify}</a>
      <button onClick={()=>{setScreen("home");setACode(null);setAN("");setAE("");setAPh("");setAD("");}} className="text-sm text-hp-gray py-2">{t.backHome}</button>
    </div></section>)}
  </main>);
}
