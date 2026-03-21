import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthPing — Tu ping a la salud",
  description:
    "Describe tu síntoma, compara hospitales con precios reales y agenda tu cita en minutos. Marketplace de servicios hospitalarios en Jalisco.",
  keywords: ["hospitales", "salud", "Jalisco", "Guadalajara", "citas médicas", "comparador", "precios"],
  openGraph: {
    title: "HealthPing — Tu ping a la salud",
    description: "Compara hospitales, conoce precios y agenda citas en minutos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-hp-light antialiased">{children}</body>
    </html>
  );
}
