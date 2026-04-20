import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReagentStatus } from "@/data/reagents";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";

const map: Record<
  ReagentStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  ok: {
    label: "OK",
    className: "bg-success-soft text-success border-success/20",
    icon: CheckCircle2,
  },
  "scorta-bassa": {
    label: "Scorta bassa",
    className: "bg-warning-soft text-warning border-warning/20",
    icon: AlertTriangle,
  },
  "in-scadenza": {
    label: "In scadenza",
    className: "bg-warning-soft text-warning border-warning/20",
    icon: Clock,
  },
  scaduto: {
    label: "Scaduto",
    className: "bg-destructive/10 text-destructive border-destructive/30",
    icon: XCircle,
  },
};

export function ReagentStatusBadge({
  status,
  className,
  showIcon = true,
}: {
  status: ReagentStatus;
  className?: string;
  showIcon?: boolean;
}) {
  const cfg = map[status];
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={cn("font-medium gap-1", cfg.className, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {cfg.label}
    </Badge>
  );
}
