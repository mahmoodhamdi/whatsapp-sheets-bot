import { z } from "zod";

/**
 * Server-side environment variables schema
 * These are validated at build time
 */
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL URL"),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),

  // Stripe (optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),

  // Sentry (optional)
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // WhatsApp
  WHATSAPP_SESSION_PATH: z.string().default("./sessions"),

  // Node environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

/**
 * Client-side environment variables schema
 * These are exposed to the browser (prefixed with NEXT_PUBLIC_)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validate server environment variables
 * Call this during app startup
 */
export function validateServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid server environment variables:");
    console.error(result.error.flatten().fieldErrors);
    throw new Error("Invalid server environment configuration");
  }

  return result.data;
}

/**
 * Validate client environment variables
 */
export function validateClientEnv(): ClientEnv {
  const clientEnv = {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };

  const result = clientEnvSchema.safeParse(clientEnv);

  if (!result.success) {
    console.error("❌ Invalid client environment variables:");
    console.error(result.error.flatten().fieldErrors);
    throw new Error("Invalid client environment configuration");
  }

  return result.data;
}

/**
 * Check if all required production environment variables are set
 */
export function checkProductionReadiness(): {
  ready: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Required for production
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!process.env.NEXTAUTH_SECRET) missing.push("NEXTAUTH_SECRET");
  if (!process.env.NEXTAUTH_URL) missing.push("NEXTAUTH_URL");

  // Recommended for production
  if (!process.env.STRIPE_SECRET_KEY) {
    warnings.push("STRIPE_SECRET_KEY not set - subscriptions will not work");
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    warnings.push("STRIPE_WEBHOOK_SECRET not set - webhooks will not be verified");
  }
  if (!process.env.RESEND_API_KEY) {
    warnings.push("RESEND_API_KEY not set - emails will not be sent");
  }
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    warnings.push("SENTRY_DSN not set - error tracking disabled");
  }

  // Security checks
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    missing.push("NEXTAUTH_SECRET must be at least 32 characters");
  }

  return {
    ready: missing.length === 0,
    missing,
    warnings,
  };
}

// Export validated env for use in the app
let _serverEnv: ServerEnv | null = null;
let _clientEnv: ClientEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (!_serverEnv) {
    _serverEnv = validateServerEnv();
  }
  return _serverEnv;
}

export function getClientEnv(): ClientEnv {
  if (!_clientEnv) {
    _clientEnv = validateClientEnv();
  }
  return _clientEnv;
}
