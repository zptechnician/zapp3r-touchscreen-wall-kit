import { z } from "zod";

/**
 * Zapp3r Data Integrity Schema
 *
 * Enforces the kiosk-data.json contract at runtime using Zod.
 * This schema is the single source of truth for what the kiosk
 * will accept — any deviation is caught before it reaches the UI.
 *
 * Key invariants enforced:
 *   - Partner IDs follow the format: partner-[a-z0-9-]+
 *   - Customer IDs follow the format: customer-[a-z0-9-]+
 *   - Logo paths must be relative to /assets/logos/ and end in .png
 *   - Hero paths must be relative to /assets/heroes/ and end in .webp
 *   - No path traversal: paths must start with /assets/ (not ../ or /)
 *   - Case study text fields are required for customers (non-empty)
 *   - hasDetailPage defaults to true when omitted
 */

// ---------------------------------------------------------------------------
// Partner Schema — logo-only entries on the Partner Wall
// Partners have hasDetailPage: false by convention, but the schema
// allows true for flexibility (e.g., a featured partner with a case study).
// ---------------------------------------------------------------------------
export const PartnerSchema = z.object({
  id: z
    .string()
    .regex(
      /^partner-[a-z0-9-]+$/,
      "Partner ID must follow the format: partner-[a-z0-9-]+ (e.g. partner-a, partner-acme)"
    ),
  name: z.string().min(1, "Partner name is required"),
  logo: z
    .string()
    .startsWith("/assets/logos/", "Logo path must start with /assets/logos/")
    .endsWith(".png", "Logo must be a .png file"),
  hero: z
    .string()
    .startsWith("/assets/heroes/", "Hero path must start with /assets/heroes/")
    .endsWith(".webp", "Hero must be a .webp file"),
  challenge: z.string().min(1, "Challenge text is required"),
  solution: z.string().min(1, "Solution text is required"),
  impact: z.string().min(1, "Impact text is required"),
  /**
   * Controls whether tapping this entry navigates to a detail page.
   * Defaults to true. Set to false for logo-only partner entries.
   */
  hasDetailPage: z.boolean().optional().default(true),
});

// ---------------------------------------------------------------------------
// Customer Schema — full case study entries on the Customer Wall
// Customers always have detail pages, so hasDetailPage is not included.
// ---------------------------------------------------------------------------
export const CustomerSchema = z.object({
  id: z
    .string()
    .regex(
      /^customer-[a-z0-9-]+$/,
      "Customer ID must follow the format: customer-[a-z0-9-]+ (e.g. customer-a, customer-acme)"
    ),
  name: z.string().min(1, "Customer name is required"),
  logo: z
    .string()
    .startsWith("/assets/logos/", "Logo path must start with /assets/logos/")
    .endsWith(".png", "Logo must be a .png file"),
  hero: z
    .string()
    .startsWith("/assets/heroes/", "Hero path must start with /assets/heroes/")
    .endsWith(".webp", "Hero must be a .webp file"),
  challenge: z.string().min(1, "Challenge text is required"),
  solution: z.string().min(1, "Solution text is required"),
  impact: z.string().min(1, "Impact text is required"),
});

// ---------------------------------------------------------------------------
// Settings Schema — wall titles
// ---------------------------------------------------------------------------
export const KioskSettingsSchema = z.object({
  partnerWallTitle: z.string().min(1, "Partner wall title is required"),
  customerWallTitle: z.string().min(1, "Customer wall title is required"),
});

// ---------------------------------------------------------------------------
// Root Schema — the full kiosk-data.json contract
// ---------------------------------------------------------------------------
export const KioskDataSchema = z.object({
  partners: z
    .array(PartnerSchema)
    .min(1, "At least one partner entry is required"),
  customers: z
    .array(CustomerSchema)
    .min(1, "At least one customer entry is required"),
  settings: KioskSettingsSchema,
});

// ---------------------------------------------------------------------------
// Inferred TypeScript types — replaces the manual interfaces in kiosk.ts
// These are derived directly from the schema, so they stay in sync automatically.
// ---------------------------------------------------------------------------
export type Partner = z.infer<typeof PartnerSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type KioskSettings = z.infer<typeof KioskSettingsSchema>;
export type KioskData = z.infer<typeof KioskDataSchema>;
