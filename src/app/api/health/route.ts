import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ProbeStatus = "ok" | "degraded" | "unconfigured" | "down";

interface Probe {
  status: ProbeStatus;
  latency_ms?: number;
  detail?: string;
}

async function probeDatabase(): Promise<Probe> {
  const t = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ok", latency_ms: Date.now() - t };
  } catch (error) {
    return {
      status: "down",
      latency_ms: Date.now() - t,
      detail: error instanceof Error ? error.message : "unknown",
    };
  }
}

function probeStripe(): Probe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("placeholder")) {
    return { status: "unconfigured", detail: "STRIPE_SECRET_KEY missing or placeholder" };
  }
  return { status: "ok" };
}

function probeMailer(): Probe {
  const mode = process.env.EMAIL_MODE;
  if (mode === "smtp") {
    const host = process.env.EMAIL_SMTP_HOST;
    if (!host) return { status: "unconfigured", detail: "EMAIL_SMTP_HOST missing" };
    return { status: "ok", detail: `smtp://${host}` };
  }
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || resendKey.includes("placeholder")) {
    return { status: "unconfigured", detail: "RESEND_API_KEY missing" };
  }
  return { status: "ok", detail: "resend" };
}

function probeWhatsApp(): Probe {
  const mode = process.env.WHATSAPP_MODE || "baileys";
  if (mode === "mock") return { status: "ok", detail: "mock adapter active" };
  if (mode === "cloud_api") {
    const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
    if (!token) return { status: "unconfigured", detail: "cloud_api selected but token missing" };
    return { status: "ok", detail: "cloud_api configured" };
  }
  return { status: "ok", detail: "baileys (session-based)" };
}

export async function GET() {
  const [db, stripe, mailer, whatsapp] = [
    await probeDatabase(),
    probeStripe(),
    probeMailer(),
    probeWhatsApp(),
  ];

  const components = { db, stripe, mailer, whatsapp };
  const anyDown = Object.values(components).some((p) => p.status === "down");
  const status = anyDown ? "unhealthy" : "healthy";

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      uptime_s: Math.floor(process.uptime()),
      components,
    },
    { status: anyDown ? 503 : 200 }
  );
}
