export async function sendConfirmationEmail(
  toEmail: string,
  toName: string,
  code: string,
  hospitalName: string
): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

  if (!serviceId || !templateId || !publicKey) return;

  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          to_email: toEmail,
          to_name: toName,
          verification_code: code,
          hospital_name: hospitalName,
        },
      }),
    });
  } catch (e) {
    console.error("EmailJS error:", e);
  }
}
