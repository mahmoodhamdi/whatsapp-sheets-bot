import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Custom API Error class for structured error handling
 */
export class APIError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Pre-defined error factories for common scenarios
 */
export const Errors = {
  Unauthorized: (message = "Unauthorized") =>
    new APIError(message, 401, "UNAUTHORIZED"),

  Forbidden: (message = "Forbidden") =>
    new APIError(message, 403, "FORBIDDEN"),

  NotFound: (message = "Not found") =>
    new APIError(message, 404, "NOT_FOUND"),

  BadRequest: (message = "Bad request", details?: unknown) =>
    new APIError(message, 400, "BAD_REQUEST", details),

  Conflict: (message = "Conflict") =>
    new APIError(message, 409, "CONFLICT"),

  RateLimited: (message = "Too many requests") =>
    new APIError(message, 429, "RATE_LIMITED"),

  Internal: (message = "Internal server error") =>
    new APIError(message, 500, "INTERNAL_ERROR"),

  FeatureNotAvailable: (feature: string, requiredPlan: string) =>
    new APIError(
      `${feature} requires ${requiredPlan} plan or higher`,
      403,
      "FEATURE_NOT_AVAILABLE",
      { requiredPlan }
    ),

  LimitReached: (resource: string) =>
    new APIError(
      `${resource} limit reached for your plan`,
      403,
      "LIMIT_REACHED",
      { resource }
    ),
};

/**
 * Format a Zod validation error for API response
 */
function formatZodError(error: ZodError) {
  return {
    error: "Validation error",
    code: "VALIDATION_ERROR",
    details: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}

/**
 * Centralized API error handler
 * Use this in catch blocks of API routes
 *
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   try {
 *     // ... logic
 *   } catch (error) {
 *     return handleAPIError(error);
 *   }
 * }
 * ```
 */
export function handleAPIError(error: unknown): NextResponse {
  // Log the error for debugging
  console.error("API Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(formatZodError(error), { status: 400 });
  }

  // Handle custom API errors
  if (error instanceof APIError) {
    const response: Record<string, unknown> = {
      error: error.message,
      code: error.code,
    };

    if (error.details) {
      response.details = error.details;
    }

    return NextResponse.json(response, { status: error.status });
  }

  // Handle standard errors
  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message =
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : error.message;

    return NextResponse.json(
      { error: message, code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    { error: "Unknown error", code: "UNKNOWN_ERROR" },
    { status: 500 }
  );
}

/**
 * Type-safe wrapper for API route handlers with built-in error handling
 *
 * @example
 * ```typescript
 * export const POST = withErrorHandler(async (request) => {
 *   const body = await request.json();
 *   // ... logic
 *   return NextResponse.json({ success: true });
 * });
 * ```
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}
