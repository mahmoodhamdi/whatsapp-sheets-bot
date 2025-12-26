import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "@/lib/validations/auth";

describe("registerSchema", () => {
  it("should validate correct data", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      acceptTerms: true,
    });
    expect(result.success).toBe(true);
  });

  it("should reject short name", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((issue) =>
        issue.path.includes("name")
      );
      expect(nameError).toBeDefined();
    }
  });

  it("should reject invalid email", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "invalid-email",
      password: "Password1",
      confirmPassword: "Password1",
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((issue) =>
        issue.path.includes("email")
      );
      expect(emailError).toBeDefined();
    }
  });

  it("should reject short password", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Pass1",
      confirmPassword: "Pass1",
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find(
        (issue) =>
          issue.path.includes("password") &&
          issue.message.includes("8 characters")
      );
      expect(passwordError).toBeDefined();
    }
  });

  it("should reject password without uppercase", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password1",
      confirmPassword: "password1",
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find(
        (issue) =>
          issue.path.includes("password") &&
          issue.message.includes("uppercase")
      );
      expect(passwordError).toBeDefined();
    }
  });

  it("should reject password without number", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password",
      confirmPassword: "Password",
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find(
        (issue) =>
          issue.path.includes("password") && issue.message.includes("number")
      );
      expect(passwordError).toBeDefined();
    }
  });

  it("should reject mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password1",
      confirmPassword: "Password2",
      acceptTerms: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find(
        (issue) =>
          issue.path.includes("confirmPassword") &&
          issue.message.toLowerCase().includes("match")
      );
      expect(confirmError).toBeDefined();
    }
  });

  it("should reject when terms not accepted", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      acceptTerms: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const termsError = result.error.issues.find((issue) =>
        issue.path.includes("acceptTerms")
      );
      expect(termsError).toBeDefined();
    }
  });

  it("should accept Arabic names", () => {
    const result = registerSchema.safeParse({
      name: "محمد أحمد",
      email: "mohamed@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      acceptTerms: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("should validate correct credentials", () => {
    const result = loginSchema.safeParse({
      email: "john@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = loginSchema.safeParse({
      email: "invalid",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((issue) =>
        issue.path.includes("email")
      );
      expect(emailError).toBeDefined();
    }
  });

  it("should reject empty password", () => {
    const result = loginSchema.safeParse({
      email: "john@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find((issue) =>
        issue.path.includes("password")
      );
      expect(passwordError).toBeDefined();
    }
  });
});
