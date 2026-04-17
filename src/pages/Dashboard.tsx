import { Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { procedures } from "@/data/procedures";
import { troubleshootingCases } from "@/data/troubleshooting";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowRight, Eye, Play, Plus, Search, Wrench, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [q, setQ] = useState("");
  const ql = q.trim().toLowerCase();

  const matches = ql
    ? procedures.filter((p) =>
        `${p.title} ${p.machine} ${p.module} ${p.test} ${p.area}`
          .toLowerCase()
          .includes(ql),
      )
    : [];

  const mostViewed = [...procedures].sort((a, b) => b.views - a.views).slice(0, 5);
  const recent = [...procedures]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);
  const critical = procedures.filter(
    (p) => p.status === "da-revisionare" || p.status === "bozza",
  );

  return (
    <div className="p-5 md:p-6 space-y-5 max-w-[1400px]">
      {/* Operational hero: search + quick actions */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary-soft/60 via-card to-card">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                Strumento operativo
              </div>
              <h1 className="text-2xl font-semibold mt-0.5">
                Cosa devi fare oggi?
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Cerca una procedura per test, modulo o macchina.
              </p>
              <div className="relative mt-3 max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Es. FT4, calibrazione E1, IRON2…"
                  className="pl-9 h-10 bg-card"
                  autoFocus
                />
                {ql && (
                  <div className="absolute z-20 top-11 left-0 right-0 bg-popover border rounded-md shadow-lg max-h-80 overflow-auto">
                    {matches.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground">
                        Nessuna procedura trovata.
                      </div>
                    ) : (
                      matches.slice(0, 8).map((p) => (
                        <Link
                          key={p.id}
                          to={`/procedures/${p.id}`}
                          className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted text-sm border-b last:border-b-0"
                        >
                          <div className="min-w-0">
                            <div className="font-medium truncate">{p.title}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {p.module} · {p.test} · {p.machine}
                            </div>
                          </div>
                          <StatusBadge status={p.status} />
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button asChild size="sm">
                <Link to="/procedures"><ArrowRight className="h-4 w-4" /> Tutte le procedure</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/troubleshooting"><Wrench className="h-4 w-4" /> Troubleshooting</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link to="/procedures/new"><Plus className="h-4 w-4" /> Nuova procedura</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section
          title="Procedure recenti"
          subtitle="Ultime modificate"
          to="/procedures"
        >
          {recent.map((p) => (
            <ProcedureRow key={p.id} p={p} meta={p.updatedAt} />
          ))}
        </Section>

        <Section
          title="Più consultate"
          subtitle="Le più usate dal team"
          to="/procedures"
        >
          {mostViewed.map((p) => (
            <ProcedureRow
              key={p.id}
              p={p}
              meta={
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {p.views}
                </span>
              }
            />
          ))}
        </Section>

        <Section
          title="Critiche"
          subtitle={`${critical.length} da revisionare o in bozza`}
          to="/procedures?status=da-revisionare"
          tone="warning"
        >
          {critical.length === 0 && (
            <div className="text-xs text-muted-foreground py-2">
              Nessuna procedura critica.
            </div>
          )}
          {critical.slice(0, 5).map((p) => (
            <ProcedureRow key={p.id} p={p} showStatus />
          ))}
        </Section>
      </div>

      {/* Troubleshooting rapido */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h2 className="text-sm font-semibold">Troubleshooting rapido</h2>
            </div>
            <Link
              to="/troubleshooting"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Tutti i casi <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {troubleshootingCases.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                to={`/troubleshooting?q=${encodeURIComponent(c.symptom.slice(0, 20))}`}
                className="flex items-start gap-2 rounded-md border p-2.5 text-sm hover:border-primary/40 hover:bg-muted/40 transition-colors"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium leading-tight truncate">{c.symptom}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {c.area}
                    {c.module && ` · ${c.module}`}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({
  title,
  subtitle,
  to,
  tone,
  children,
}: {
  title: string;
  subtitle: string;
  to: string;
  tone?: "warning";
  children: React.ReactNode;
}) {
  return (
    <Card className={tone === "warning" ? "border-warning/30" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
          <Link to={to} className="text-xs text-primary hover:underline">
            Vedi
          </Link>
        </div>
        <div className="divide-y">{children}</div>
      </CardContent>
    </Card>
  );
}

function ProcedureRow({
  p,
  meta,
  showStatus,
}: {
  p: (typeof procedures)[number];
  meta?: React.ReactNode;
  showStatus?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0 group">
      <Link
        to={`/procedures/${p.id}`}
        className="flex-1 min-w-0 group-hover:text-primary"
      >
        <div className="text-sm font-medium truncate leading-tight">{p.title}</div>
        <div className="text-[11px] text-muted-foreground truncate">
          {p.module} · {p.test}
        </div>
      </Link>
      <div className="flex items-center gap-2 shrink-0">
        {showStatus && <StatusBadge status={p.status} />}
        {meta && (
          <span className="text-[11px] text-muted-foreground">{meta}</span>
        )}
        <Link
          to={`/procedures/${p.id}/run`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
          title="Esegui"
        >
          <Play className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
