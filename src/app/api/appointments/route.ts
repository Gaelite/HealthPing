import { NextRequest, NextResponse } from "next/server";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "HP-";
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

// In-memory store (replace with Supabase later)
const appointments: Array<{
  code: string;
  hospitalName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  symptomDescription: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  scheduledTime?: string;
}> = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hospitalName, patientName, patientEmail, patientPhone, symptomDescription, scheduledTime } = body;
    if (!patientName || !patientEmail || !patientPhone) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }
    const code = generateCode();
    appointments.push({
      code, hospitalName: hospitalName || "No especificado",
      patientName, patientEmail, patientPhone,
      symptomDescription: symptomDescription || "",
      status: "PENDING", createdAt: new Date().toISOString(), scheduledTime,
    });
    return NextResponse.json({ code, message: "Solicitud creada" });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ appointments });
}
