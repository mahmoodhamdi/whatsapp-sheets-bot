interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export function createRateLimiter(config: RateLimitConfig) {
  return function checkRateLimit(identifier: string): {
    success: boolean;
    remaining: number;
    resetIn: number;
  } {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return {
        success: true,
        remaining: config.max - 1,
        resetIn: config.windowMs,
      };
    }

    if (record.count >= config.max) {
      return {
        success: false,
        remaining: 0,
        resetIn: record.resetTime - now,
      };
    }

    record.count++;
    return {
      success: true,
      remaining: config.max - record.count,
      resetIn: record.resetTime - now,
    };
  };
}

// Pre-configured limiters
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
});

export const passwordResetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
});

export const verificationLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 request per minute
});

// Helper to get IP from request
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "unknown";
}
