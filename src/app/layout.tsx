import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthPing — Tu ping a la salud",
  description:
    "Te ayudamos a decidir a qué hospital ir y cuánto podría costarte. Compara hospitales, revisa seguro y da seguimiento a tu cuenta mientras te atienden.",
  keywords: ["hospitales", "salud", "Jalisco", "Guadalajara", "urgencias", "comparador", "precios", "emergencias"],
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
      <body className="bg-hp-white antialiased">{children}</body>
    </html>
  );
}
