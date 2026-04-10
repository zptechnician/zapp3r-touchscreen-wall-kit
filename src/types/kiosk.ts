/** Shared types for kiosk data — single source of truth */

export interface KioskEntry {
  id: string;
  name: string;
  logo: string;
  hero: string;
  challenge: string;
  solution: string;
  impact: string;
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
