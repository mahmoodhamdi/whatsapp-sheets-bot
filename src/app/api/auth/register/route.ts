import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createVerificationToken } from "@/lib/auth/verification";
import { sendEmail } from "@/lib/email";
import { verificationEmailTemplate } from "@/lib/email/templates";
import { createOrGetStripeCustomer } from "@/lib/stripe/customer";
import { createFreeSubscription } from "@/lib/services/subscription";
import { registerLimiter, getClientIP } from "@/lib/security/rate-limit";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  locale: z.string().optional().default("ar"),
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const { success, resetIn } = registerLimiter(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many registration attempts. Please try again later.",
          retryAfter: Math.ceil(resetIn / 1000),
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, locale } = result.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with emailVerified: false (default)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        emailVerified: false,
      },
    });

    // Create Stripe customer (if Stripe is configured)
    try {
      await createOrGetStripeCustomer(user.id);
    } catch (stripeError) {
      console.error("Failed to create Stripe customer:", stripeError);
      // Don't fail registration if Stripe fails
    }

    // Create free subscription for the user
    try {
      await createFreeSubscription(user.id);
    } catch (subscriptionError) {
      console.error("Failed to create free subscription:", subscriptionError);
      // Don't fail registration if subscription creation fails
    }

    // Create verification token and send email
    try {
      const token = await createVerificationToken(user.id);
      await sendEmail({
        to: user.email,
        subject:
          locale === "ar"
            ? "تأكيد بريدك الإلكتروني - واتساب بوت"
            : "Verify Your Email - WhatsApp Bot",
        html: verificationEmailTemplate(token, locale),
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email fails - user can resend
    }

    return NextResponse.json(
      {
        message: "Registration successful",
        user: { id: user.id, email: user.email, name: user.name },
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
