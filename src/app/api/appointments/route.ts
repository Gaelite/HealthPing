import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "re_placeholder");
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "HP-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// In-memory store for now (replace with Supabase later)
const appointments: Array<{
  code: string;
  hospitalName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  symptomDescription: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}> = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hospitalName, patientName, patientEmail, patientPhone, symptomDescription } = body;

    if (!patientName || !patientEmail || !patientPhone) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const code = generateCode();

    // Store appointment
    appointments.push({
      code,
      hospitalName: hospitalName || "No especificado",
      patientName,
      patientEmail,
      patientPhone,
      symptomDescription: symptomDescription || "",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    });

    // Send email via Resend
    try {
      await getResend().emails.send({
        from: "HealthPing <onboarding@resend.dev>",
        to: patientEmail,
        subject: `Tu solicitud de cita — Código: ${code}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <div style="background: #0A2540; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Health<span style="color: #16A085;">Ping</span></h1>
            </div>
            <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="color: #0F172A; font-size: 16px; margin-top: 0;">Hola <strong>${patientName}</strong>,</p>
              <p style="color: #64748B; font-size: 14px;">Tu solicitud de cita fue enviada a <strong>${hospitalName}</strong>. El hospital revisará tu solicitud y te confirmaremos por correo.</p>
              
              <div style="background: white; border: 2px solid #16A085; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
                <p style="color: #64748B; font-size: 12px; margin: 0 0 8px;">Tu código de verificación</p>
                <p style="color: #0A2540; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0; font-family: monospace;">${code}</p>
              </div>

              <p style="color: #64748B; font-size: 13px;">Con este código puedes verificar el estado de tu cita en cualquier momento desde nuestra página.</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="color: #94A3B8; font-size: 11px; margin: 0;">HealthPing — Tu ping a la salud | Jalisco, México</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
      // Still return the code even if email fails
    }

    return NextResponse.json({ code, message: "Solicitud creada" });
  } catch (err) {
    console.error("Appointment error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// GET: list all appointments (for hospital dashboard)
export async function GET() {
  return NextResponse.json({ appointments });
}
