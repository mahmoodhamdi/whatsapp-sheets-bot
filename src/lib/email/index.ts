import { Resend } from "resend";

// Lazy-load Resend client to avoid build-time errors
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const client = getResendClient();

  // In development without API key, log and skip
  if (!client) {
    console.log("=== EMAIL (dev mode - no RESEND_API_KEY) ===");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("HTML:", html.substring(0, 200) + "...");
    console.log("=============================================");
    return { id: "dev-mode" };
  }

  try {
    const { data, error } = await client.emails.send({
      from: process.env.EMAIL_FROM || "WhatsApp Bot <noreply@example.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email send error:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}
