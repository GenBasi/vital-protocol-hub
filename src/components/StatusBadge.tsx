import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProcedureStatus } from "@/data/procedures";

const map: Record<ProcedureStatus, { label: string; className: string }> = {
  validata: {
    label: "Validata",
    className: "bg-success-soft text-success border-success/20",
  },
  bozza: {
    label: "Bozza",
    className: "bg-muted text-muted-foreground border-border",
  },
  "da-revisionare": {
    label: "Da revisionare",
    className: "bg-warning-soft text-warning border-warning/20",
  },
};

export function StatusBadge({ status, className }: { status: ProcedureStatus; className?: string }) {
  const cfg = map[status];
  return (
    <Badge variant="outline" className={cn("font-medium", cfg.className, className)}>
      {cfg.label}
    </Badge>
  );
}
