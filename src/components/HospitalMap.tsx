"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type HospitalPin = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  isPremium: boolean;
  level: string;
  anticipoRange: string;
};

type Props = {
  hospitals: HospitalPin[];
  userLat: number | null;
  userLng: number | null;
  onSelectHospital?: (id: number) => void;
};

function MapInner({ hospitals, userLat, userLng, onSelectHospital }: Props) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("leaflet").then((mod) => { setL(mod.default || mod); setReady(true); });
  }, []);

  useEffect(() => {
    if (!ready || !L) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const centerLat = userLat || 20.6767;
    const centerLng = userLng || -103.3812;
    const container = document.getElementById("hp-map");
    if (!container) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((container as any)._leaflet_id) { container.innerHTML = ""; delete (container as any)._leaflet_id; }

    const map = L.map("hp-map").setView([centerLat, centerLng], 13);

    // CartoDB Positron: clean, minimal, no highway labels like MEX 15D
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://osm.org/copyright">OSM</a>',
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    if (userLat && userLng) {
      const userIcon = L.divIcon({
        html: '<div style="width:18px;height:18px;background:#1A73B5;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
        className: "", iconSize: [18, 18], iconAnchor: [9, 9],
      });
      L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup("<strong>Tu ubicación</strong>");
    }

    hospitals.forEach((h) => {
      const color = h.isPremium ? "#16A085" : "#94A3B8";
      const size = h.isPremium ? 14 : 11;
      const icon = L.divIcon({
        html: `<div style="width:${size}px;height:${size}px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.25);"></div>`,
        className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2],
      });
      const levelLabel: Record<string, string> = { FIRST: "1er nivel", SECOND: "2do nivel", THIRD: "3er nivel" };
      const marker = L.marker([h.lat, h.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:system-ui;min-width:160px;">
          <strong style="font-size:13px;">${h.name}</strong><br/>
          <span style="font-size:11px;color:#64748B;">${levelLabel[h.level] || ""}</span>
          ${h.isPremium ? '<span style="font-size:10px;background:#16A085;color:white;padding:1px 6px;border-radius:8px;margin-left:4px;">Convenio</span>' : ""}
          <br/><span style="font-size:12px;font-weight:600;color:#0A2540;">${h.anticipoRange}</span>
          <br/><button onclick="window.__hpSelect&&window.__hpSelect(${h.id})" style="margin-top:6px;padding:4px 12px;background:#0A2540;color:white;border:none;border-radius:8px;font-size:11px;cursor:pointer;font-weight:600;">Ver detalles</button>
        </div>
      `);
    });

    if (hospitals.length > 0) {
      const pts: [number, number][] = hospitals.map((h) => [h.lat, h.lng]);
      if (userLat && userLng) pts.push([userLat, userLng]);
      map.fitBounds(pts, { padding: [40, 40], maxZoom: 14 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__hpSelect = (id: number) => onSelectHospital?.(id);
    return () => { map.remove(); delete (window as any).__hpSelect; }; // eslint-disable-line @typescript-eslint/no-explicit-any
  }, [ready, L, hospitals, userLat, userLng, onSelectHospital]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div id="hp-map" style={{ width: "100%", height: "280px", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" }} />
    </>
  );
}

const HospitalMap = dynamic(() => Promise.resolve(MapInner), { ssr: false });
export default HospitalMap;
