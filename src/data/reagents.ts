export type ReagentStatus = "ok" | "scorta-bassa" | "in-scadenza" | "scaduto";

export interface Reagent {
  id: string;
  name: string;
  icon: string; // lucide icon name or emoji
  module?: string;
  expirationDate: string; // ISO yyyy-mm-dd
  lotNumber: string;
  quantity: number;
  unit: string;
  minStock: number;
  expirationWarningDays: number;
}

export const reagents: Reagent[] = [
  {
    id: "r-ft4",
    name: "FT4 Reagent Pack",
    icon: "🧪",
    module: "E1",
    expirationDate: "2026-08-12",
    lotNumber: "FT4-2025-A12",
    quantity: 8,
    unit: "kit",
    minStock: 4,
    expirationWarningDays: 30,
  },
  {
    id: "r-tsh",
    name: "TSH Reagent Pack",
    icon: "🧪",
    module: "E1",
    expirationDate: "2026-05-22",
    lotNumber: "TSH-2025-B07",
    quantity: 3,
    unit: "kit",
    minStock: 4,
    expirationWarningDays: 30,
  },
  {
    id: "r-iron2",
    name: "IRON2 Reagent",
    icon: "🩸",
    module: "C2",
    expirationDate: "2026-05-05",
    lotNumber: "IRN-2025-C19",
    quantity: 6,
    unit: "flacone",
    minStock: 3,
    expirationWarningDays: 21,
  },
  {
    id: "r-alb2",
    name: "ALB2 Albumina",
    icon: "🧫",
    module: "C2",
    expirationDate: "2026-11-30",
    lotNumber: "ALB-2025-D04",
    quantity: 12,
    unit: "flacone",
    minStock: 5,
    expirationWarningDays: 30,
  },
  {
    id: "r-ck2",
    name: "CK2 Creatinkinasi",
    icon: "🧬",
    module: "C2",
    expirationDate: "2025-04-10",
    lotNumber: "CK-2024-X88",
    quantity: 2,
    unit: "flacone",
    minStock: 3,
    expirationWarningDays: 30,
  },
  {
    id: "r-sb1",
    name: "SB1 Standard Buffer",
    icon: "💧",
    module: "E1",
    expirationDate: "2026-09-18",
    lotNumber: "SB-2025-A02",
    quantity: 2,
    unit: "tanica",
    minStock: 2,
    expirationWarningDays: 14,
  },
  {
    id: "r-glu",
    name: "Glucosio Reagente",
    icon: "🩸",
    module: "C1",
    expirationDate: "2026-07-08",
    lotNumber: "GLU-2025-F11",
    quantity: 18,
    unit: "flacone",
    minStock: 6,
    expirationWarningDays: 30,
  },
  {
    id: "r-hba1c",
    name: "HbA1c Cartridge",
    icon: "🧪",
    module: "H1",
    expirationDate: "2026-05-30",
    lotNumber: "HBA-2025-G05",
    quantity: 5,
    unit: "kit",
    minStock: 4,
    expirationWarningDays: 30,
  },
  {
    id: "r-wash",
    name: "Wash Solution",
    icon: "💧",
    module: "—",
    expirationDate: "2027-01-15",
    lotNumber: "WSH-2025-Z01",
    quantity: 9,
    unit: "tanica",
    minStock: 3,
    expirationWarningDays: 30,
  },
  {
    id: "r-cal",
    name: "Calibratore Multilevel",
    icon: "🧫",
    module: "C2",
    expirationDate: "2026-06-02",
    lotNumber: "CAL-2025-M09",
    quantity: 4,
    unit: "kit",
    minStock: 2,
    expirationWarningDays: 21,
  },
];

export function getReagentStatus(r: Reagent, today = new Date()): ReagentStatus {
  const exp = new Date(r.expirationDate);
  const daysToExp = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysToExp < 0) return "scaduto";
  if (r.quantity <= r.minStock && daysToExp <= r.expirationWarningDays) {
    // pick the most severe
    return daysToExp <= r.expirationWarningDays ? "in-scadenza" : "scorta-bassa";
  }
  if (r.quantity <= r.minStock) return "scorta-bassa";
  if (daysToExp <= r.expirationWarningDays) return "in-scadenza";
  return "ok";
}

export function daysUntilExpiration(r: Reagent, today = new Date()): number {
  const exp = new Date(r.expirationDate);
  return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
