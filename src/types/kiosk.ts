/** Shared types for kiosk data — single source of truth */

export interface KioskEntry {
  id: string;
  name: string;
  logo: string;
  hero: string;
  challenge: string;
  solution: string;
  impact: string;
  /**
   * Optional header logo — shown in the top-right of the T-layout detail page.
   * Falls back to `logo` when omitted.
   *
   * Use this when the brand has a horizontal wordmark or alternate lockup
   * that reads better at header scale than the square grid icon.
   *
   * Path convention: /assets/logos/brand-a-header.png
   */
  logoHeader?: string;
  /**
   * Controls whether tapping this entry navigates to a case study detail page.
   *   true  (default when omitted) → navigates to /detail/:id
   *   false → navigates to the Customer Wall (/customers) instead
   *
   * Set to false for logo-only partner entries that have no case study content.
   */
  hasDetailPage?: boolean;
}

export interface KioskSettings {
  partnerWallTitle: string;
  customerWallTitle: string;
}

export interface KioskData {
  partners: KioskEntry[];
  customers: KioskEntry[];
  settings: KioskSettings;
}
