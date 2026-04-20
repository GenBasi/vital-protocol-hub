import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  reagents,
  getReagentStatus,
  daysUntilExpiration,
} from "@/data/reagents";
import { ReagentStatusBadge } from "@/components/ReagentStatusBadge";
import { listProcedures, type Procedure } from "@/lib/procedures-api";
import {
  ArrowRight,
  BookOpen,
  Package,
  Plus,
  Search,
  Play,
} from "lucide-react";

export default function Dashboard() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Procedure[]>([]);
  const ql = q.trim().toLowerCase();

  useEffect(() => {
    listProcedures().then(setItems).catch(() => setItems([]));
  }, []);

  const matches = ql
    ? items.filter((p) =>
        `${p.title} ${p.instrument ?? ""} ${p.module ?? ""} ${p.test ?? ""} ${p.area ?? ""}`
          .toLowerCase()
          .includes(ql),
      )
    : [];

  const recent = items.slice(0, 5);

  const attentionReagents = useMemo(
    () =>
      reagents
        .map((r) => ({ ...r, status: getReagentStatus(r), daysToExp: daysUntilExpiration(r) }))
        .filter((r) => r.status !== "ok")
        .sort((a, b) => a.daysToExp - b.daysToExp)
        .slice(0, 5),
    [],
  );

  return (
    <div className="p-5 md:p-8 max-w-[1100px] mx-auto space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold">Cosa devi fare oggi?</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cerca una procedura o accedi alle aree principali.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca per test, modulo, strumento (es. FT4, E1…)"
            className="pl-10 h-11 text-sm"
            autoFocus
          />
          {ql && (
            <div className="absolute z-20 top-12 left-0 right-0 bg-popover border rounded-md shadow-lg max-h-80 overflow-auto">
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
                        {[p.module, p.test, p.instrument].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction
          to="/procedures"
          icon={BookOpen}
          title="Libreria procedure"
          subtitle={`${items.length} procedure salvate`}
        />
        <QuickAction
          to="/reagents"
          icon={Package}
          title="Scorte reattivi"
          subtitle={`${reagents.length} reattivi monitorati`}
        />
        <QuickAction
          to="/procedures/new"
          icon={Plus}
          title="Nuova procedura"
          subtitle="Crea in pochi step"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold">Procedure recenti</h2>
                <p className="text-[11px] text-muted-foreground">Ultime modificate</p>
              </div>
              <Link
                to="/procedures"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Tutte <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {recent.length === 0 ? (
              <div className="text-xs text-muted-foreground py-3">
                Nessuna procedura. <Link to="/procedures/new" className="text-primary hover:underline">Crea la prima</Link>.
              </div>
            ) : (
              <div className="divide-y">
                {recent.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0 group"
                  >
                    <Link
                      to={`/procedures/${p.id}`}
                      className="flex-1 min-w-0 group-hover:text-primary"
                    >
                      <div className="text-sm font-medium truncate leading-tight">{p.title}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {[p.module, p.test].filter(Boolean).join(" · ") || "—"}
                      </div>
                    </Link>
                    <Link
                      to={`/procedures/${p.id}/run`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                      title="Esegui"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={attentionReagents.length > 0 ? "border-warning/30" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold">Da controllare</h2>
                <p className="text-[11px] text-muted-foreground">
                  Reattivi in scadenza o sotto soglia
                </p>
              </div>
              <Link
                to="/reagents"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Inventario <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {attentionReagents.length === 0 ? (
              <div className="text-xs text-muted-foreground py-3">
                Tutti i reattivi sono OK.
              </div>
            ) : (
              <div className="divide-y">
                {attentionReagents.map((r) => (
                  <Link
                    key={r.id}
                    to="/reagents"
                    className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0 hover:text-primary"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{r.icon}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate leading-tight">
                          {r.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          Lotto {r.lotNumber} ·{" "}
                          {r.daysToExp < 0
                            ? `scaduto da ${Math.abs(r.daysToExp)}g`
                            : `scade tra ${r.daysToExp}g`}
                        </div>
                      </div>
                    </div>
                    <ReagentStatusBadge status={r.status} showIcon={false} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  subtitle,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-lg border bg-card p-4 hover:border-primary/40 hover:bg-primary-soft/30 transition-colors"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold leading-tight">{title}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{subtitle}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}
