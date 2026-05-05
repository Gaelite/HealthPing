"use client";

import { useState, useCallback } from "react";
import { LangProvider, useLang } from "@/i18n";
import { HOSPITALS } from "@/data/hospitals";
import { BODY_ZONES } from "@/data/constants";
import type { ServiceCategory, EnrichedHospital } from "@/data/types";
import { getDistance, requestGeolocation } from "@/lib/geo";
import { sendConfirmationEmail } from "@/lib/emailjs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection, CarouselBanner, HowItWorks, HospitalCTA } from "@/features/home";
import { SymptomFlow } from "@/features/symptoms/SymptomFlow";
import { InsuranceSelector } from "@/features/insurance/InsuranceSelector";
import { ResultsScreen } from "@/features/results/ResultsScreen";
import { AppointmentForm, ConfirmationScreen } from "@/features/appointment/AppointmentFlow";
import { SurgeryComingSoon } from "@/features/surgery/SurgeryComingSoon";
import { calculateUrgency, UrgencyResult, type ScoringInput } from "@/data/scoring";

type Screen = "home" | "symptoms" | "insurance" | "results" | "appointment" | "surgery";

function AppContent() {
  const { lang } = useLang();

  // ── Screen navigation ──
  const [screen, setScreen] = useState<Screen>("home");

  // ── Symptom state ──
  const [zone, setZone] = useState<string | null>(null);
  const [pain, setPain] = useState(5);
  const [extra, setExtra] = useState<string[]>([]);
  const [since, setSince] = useState<string | null>(null);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<string | null>(null);
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);

  // ── Insurance state ──
  const [insurer, setInsurer] = useState<string | null>(null);
  const [otherInsurer, setOtherInsurer] = useState("");

  // ── Results state ──
  const [sortBy, setSortBy] = useState("distance");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [convenio, setConvenio] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [urgencyResult, setUrgencyResult] = useState<UrgencyResult | null>(null);

  // ── Appointment state ──
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [apptName, setApptName] = useState("");
  const [apptEmail, setApptEmail] = useState("");
  const [apptPhone, setApptPhone] = useState("");
  const [apptDesc, setApptDesc] = useState("");
  const [apptSending, setApptSending] = useState(false);
  const [apptCode, setApptCode] = useState<string | null>(null);
  const [apptError, setApptError] = useState<string | null>(null);

  // ── Navigation handlers ──
  const goHome = () => { setScreen("home"); setExpanded(null); setApptCode(null); };

  // ── Symptom engine state ──
  const [category, setCategory] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [painScore, setPainScore] = useState(0);
  const [redFlagIds, setRedFlagIds] = useState<string[]>([]);
  const [riskFactorIds, setRiskFactorIds] = useState<string[]>([]);

  const afterSymptoms = () => {
    const input: ScoringInput = { symptoms, painScore, redFlagIds, riskFactorIds, categoryId: category || "" };
    const result = calculateUrgency(input);
    setUrgencyResult(result);
    if (hasInsurance) setScreen("insurance");
    else geoAndGoResults();
  };

  const geoAndGoResults = useCallback(() => {
    setScreen("results");
    // Request location in background, doesn't block navigation
    requestGeolocation().then((loc) => {
      if (loc) { setUserLat(loc.lat); setUserLng(loc.lng); }
    });
  }, []);

  const startAppointment = (hospitalId: number) => {
    setSelectedHospitalId(hospitalId);
    setScreen("appointment");
  };

  const submitAppointment = async () => {
    if (!apptName || !apptEmail || !apptPhone || !selectedHospitalId) return;
    setApptSending(true);
    setApptError(null);
    try {
      const hospital = HOSPITALS.find((h) => h.id === selectedHospitalId);
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalName: hospital?.name,
          patientName: apptName,
          patientEmail: apptEmail,
          patientPhone: apptPhone,
          symptomDescription: apptDesc || zone || "-",
        }),
      });
      const data = await response.json();
      if (data.code) {
        setApptCode(data.code);
        sendConfirmationEmail(apptEmail, apptName, data.code, hospital?.name || "");
      } else {
        setApptError(data.error || "Error");
      }
    } catch {
      setApptError("Error");
    }
    setApptSending(false);
  };

  const resetAppointment = () => {
    setApptCode(null);
    setApptName("");
    setApptEmail("");
    setApptPhone("");
    setApptDesc("");
    goHome();
  };

  const handleMapSelect = useCallback((id: number) => {
    setExpanded(id);
    document.getElementById(`h-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // ── Data enrichment ──
  const neededServices: ServiceCategory[] = zone
    ? (BODY_ZONES.find((z) => z.id === zone)?.needs || [])
    : [];

  const enrichedHospitals: EnrichedHospital[] = HOSPITALS.map((h) => ({
    ...h,
    dist: userLat && userLng ? getDistance(userLat, userLng, h.lat, h.lng) : null,
    can: neededServices.length === 0 || neededServices.some((s) => h.sc.includes(s)),
    myIns: insurer && insurer !== "__other" ? h.ins.includes(insurer) : null,
  }));

  const filteredHospitals = enrichedHospitals
    .filter((h) => h.can)
    .filter((h) => !convenio || h.prem);

  const sortedHospitals = [...filteredHospitals].sort((a, b) => {
    if (insurer && insurer !== "__other") {
      if (a.myIns && !b.myIns) return -1;
      if (!a.myIns && b.myIns) return 1;
    }
    if (sortBy === "distance" && a.dist !== null && b.dist !== null) return a.dist - b.dist;
    if (sortBy === "cost") return parseInt(a.ci[lang].replace(/\D/g, "")) - parseInt(b.ci[lang].replace(/\D/g, ""));
    if (sortBy === "rating") return b.rat - a.rat;
    if (sortBy === "transparency") return b.tr - a.tr;
    return 0;
  });

  const selectedHospital = HOSPITALS.find((h) => h.id === selectedHospitalId);

  // ── Render ──
  return (
    <main className="min-h-screen">
      <Navbar onLogoClick={goHome} />

      {screen === "home" && (
        <>
          <HeroSection onFeelSick={() => setScreen("symptoms")} onCompare={() => setScreen("results")} onSurgery={() => setScreen("surgery")} />
          <CarouselBanner />
          <HowItWorks />
          <HospitalCTA />
          <Footer />
        </>
      )}

      {screen === "surgery" && <SurgeryComingSoon onBack={goHome} />}

      {screen === "symptoms" && (
        <SymptomFlow
          category={category} setCategory={(id) => { setCategory(id); setSymptoms([]); setPainScore(0); }}
          symptoms={symptoms} setSymptoms={setSymptoms}
          painScore={painScore} setPainScore={setPainScore}
          redFlagIds={redFlagIds} setRedFlagIds={setRedFlagIds}
          riskFactorIds={riskFactorIds} setRiskFactorIds={setRiskFactorIds}
          age={age} setAge={setAge}
          sex={sex} setSex={setSex}
          hasInsurance={hasInsurance} setHasInsurance={setHasInsurance}
          onNext={afterSymptoms}
          onBack={goHome}
        />
      )}

      {screen === "insurance" && (
        <InsuranceSelector
          insurer={insurer} setInsurer={setInsurer}
          otherInsurer={otherInsurer} setOtherInsurer={setOtherInsurer}
          onNext={geoAndGoResults} onBack={() => setScreen("symptoms")}
        />
      )}

      {screen === "results" && !apptCode && (
        <ResultsScreen
          hospitals={sortedHospitals}
          insurer={insurer} setInsurer={setInsurer}
          convenio={convenio} setConvenio={setConvenio}
          sortBy={sortBy} setSortBy={setSortBy}
          expanded={expanded} setExpanded={setExpanded}
          userLat={userLat} userLng={userLng}
          onSelectHospital={handleMapSelect}
          onRequestAppt={startAppointment}
          categoryId={category}
          urgencyLevel={urgencyResult?.level}
          onBack={() => {
            if (insurer) setScreen("insurance");
            else if (category) setScreen("symptoms");
            else setScreen("home");
          }}
        />
      )}

      {screen === "appointment" && !apptCode && selectedHospital && (
        <AppointmentForm
          hospitalName={selectedHospital.name}
          name={apptName} setName={setApptName}
          email={apptEmail} setEmail={setApptEmail}
          phone={apptPhone} setPhone={setApptPhone}
          description={apptDesc} setDescription={setApptDesc}
          sending={apptSending} error={apptError}
          onSubmit={submitAppointment} onBack={() => setScreen("results")}
        />
      )}

      {apptCode && <ConfirmationScreen code={apptCode} onGoHome={resetAppointment} />}
    </main>
  );
}

export default function Home() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}
