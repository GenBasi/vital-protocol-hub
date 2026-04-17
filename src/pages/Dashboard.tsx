import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { procedures } from "@/data/procedures";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, FileWarning, Plus, Wrench, Eye } from "lucide-react";

export default function Dashboard() {
  const total = procedures.length;
  const validated = procedures.filter((p) => p.status === "validata").length;
  const drafts = procedures.filter((p) => p.status === "bozza").length;
  const toReview = procedures.filter((p) => p.status === "da-revisionare").length;

  const mostViewed = [...procedures].sort((a, b) => b.views - a.views).slice(0, 4);
  const recent = [...procedures].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);
  const reviewList = procedures.filter((p) => p.status === "da-revisionare" || p.status === "bozza").slice(0, 4);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Panoramica delle procedure operative del laboratorio.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/troubleshooting"><Wrench className="h-4 w-4" /> Troubleshooting</Link>
          </Button>
          <Button asChild>
            <Link to="/procedures/new"><Plus className="h-4 w-4" /> Nuova procedura</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={<ClipboardList className="h-4 w-4" />} label="Procedure totali" value={total} tone="primary" />
        <KpiCard icon={<CheckCircle2 className="h-4 w-4" />} label="Validate" value={validated} tone="success" />
        <KpiCard icon={<BookOpen className="h-4 w-4" />} label="Bozze" value={drafts} tone="muted" />
        <KpiCard icon={<FileWarning className="h-4 w-4" />} label="Da revisionare" value={toReview} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ProcedureList title="Più consultate" items={mostViewed} showViews />
        <ProcedureList title="Recenti" items={recent} />
        <ProcedureList title="Da revisionare" items={reviewList} />
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "primary" | "success" | "warning" | "muted";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    muted: "bg-muted text-muted-foreground",
  } as const;
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-9 w-9 rounded-md flex items-center justify-center ${toneMap[tone]}`}>{icon}</div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProcedureList({
  title,
  items,
  showViews,
}: {
  title: string;
  items: typeof procedures;
  showViews?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          {title}
          <Link to="/procedures" className="text-xs font-normal text-primary hover:underline inline-flex items-center gap-1">
            Tutte <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 divide-y">
        {items.length === 0 && <p className="text-sm text-muted-foreground py-3">Nessun elemento.</p>}
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/procedures/${p.id}`}
            className="flex items-start justify-between py-3 first:pt-0 last:pb-0 gap-3 group"
          >
            <div className="min-w-0">
              <div className="text-sm font-medium group-hover:text-primary truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground truncate">
                {p.machine} · {p.module} · {p.test}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <StatusBadge status={p.status} />
              {showViews && (
                <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {p.views}
                </span>
              )}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
