import { z } from "zod";

// Pagination query params schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// Search query params schema
export const searchSchema = z.object({
  search: z.string().max(200).default(""),
});

export type SearchParams = z.infer<typeof searchSchema>;

// Combined pagination with search
export const paginatedSearchSchema = paginationSchema.merge(searchSchema);

export type PaginatedSearchParams = z.infer<typeof paginatedSearchSchema>;

// Contacts query params
export const contactsQuerySchema = paginatedSearchSchema;

export type ContactsQueryParams = z.infer<typeof contactsQuerySchema>;

// Messages query params
export const messagesQuerySchema = paginatedSearchSchema.extend({
  direction: z.enum(["INCOMING", "OUTGOING"]).optional(),
  contactId: z.string().uuid().optional(),
});

export type MessagesQueryParams = z.infer<typeof messagesQuerySchema>;

// Analytics query params
export const analyticsQuerySchema = z.object({
  period: z.enum(["day", "week", "month", "year"]).default("month"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type AnalyticsQueryParams = z.infer<typeof analyticsQuerySchema>;

// ID parameter validation
export const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export type IdParam = z.infer<typeof idParamSchema>;

// Phone number validation
export const phoneSchema = z.string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must be at most 15 digits")
  .regex(/^\+?[0-9]+$/, "Invalid phone number format");

// Helper to parse query params from URLSearchParams
export function parseQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const params: Record<string, string | undefined> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

// Contact mutations
export const createContactSchema = z.object({
  phone: phoneSchema,
  name: z.string().max(100).optional(),
});

export type CreateContactData = z.infer<typeof createContactSchema>;

export const updateContactSchema = z.object({
  name: z.string().max(100).optional(),
});

export type UpdateContactData = z.infer<typeof updateContactSchema>;
