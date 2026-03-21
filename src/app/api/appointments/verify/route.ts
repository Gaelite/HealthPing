import { NextRequest, NextResponse } from "next/server";

// Import the same in-memory store
// In production this would query Supabase
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código requerido" }, { status: 400 });
  }

  // Fetch from the appointments API
  try {
    const baseUrl = req.nextUrl.origin;
    const res = await fetch(`${baseUrl}/api/appointments`);
    const data = await res.json();

    const appointment = data.appointments?.find(
      (a: { code: string }) => a.code === code.toUpperCase()
    );

    if (!appointment) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ appointment });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
