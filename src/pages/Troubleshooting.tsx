import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { troubleshootingCases } from "@/data/troubleshooting";
import { procedures } from "@/data/procedures";
import {
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  Search,
  Wrench,
  Lightbulb,
  CheckSquare,
  Zap,
} from "lucide-react";

export default function Troubleshooting() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return troubleshootingCases;
    return troubleshootingCases.filter((c) => {
      const hay = `${c.symptom} ${c.area} ${c.module ?? ""} ${c.possibleCauses.join(" ")} ${c.actions.join(" ")}`.toLowerCase();
      return hay.includes(ql);
    });
  }, [q]);

  return (
    <div className="p-5 md:p-6 space-y-4 max-w-[1100px]">
      <div>
        <h1 className="text-xl font-semibold inline-flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" /> Troubleshooting
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Trova rapidamente cause, controlli e azioni per ogni problema.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca un sintomo: calibrazione fallita, RFID, backup…"
          className="pl-9 h-10"
          autoFocus
        />
      </div>

      <div className="text-xs text-muted-foreground">
        {filtered.length} di {troubleshootingCases.length} casi
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground text-center">
              Nessun caso trovato.
            </div>
          ) : (
            <Accordion type="multiple" className="divide-y">
              {filtered.map((c) => (
                <AccordionItem key={c.id} value={c.id} className="border-0">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                    <div className="flex items-start gap-3 text-left flex-1 min-w-0">
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm leading-tight">{c.symptom}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="outline" className="text-[10px] py-0">{c.area}</Badge>
                          {c.module && (
                            <Badge variant="outline" className="text-[10px] py-0 font-mono">
                              {c.module}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
                      <Block
                        tone="warning"
                        icon={<Lightbulb className="h-3 w-3" />}
                        title="Possibili cause"
                        items={c.possibleCauses}
                      />
                      <Block
                        tone="primary"
                        icon={<CheckSquare className="h-3 w-3" />}
                        title="Controlli rapidi"
                        items={c.quickChecks}
                      />
                      <Block
                        tone="success"
                        icon={<Zap className="h-3 w-3" />}
                        title="Azione consigliata"
                        items={c.actions}
                      />
                    </div>

                    <div className="mt-3 pt-3 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">
                          Procedure collegate:
                        </span>
                        {c.relatedProcedureIds.map((pid) => {
                          const p = procedures.find((x) => x.id === pid);
                          if (!p) return null;
                          return (
                            <Link
                              key={pid}
                              to={`/procedures/${pid}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              {p.title} <ArrowRight className="h-3 w-3" />
                            </Link>
                          );
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5 bg-muted/60 rounded px-2 py-1">
                        <PhoneCall className="h-3 w-3" />
                        <span className="font-medium">Escalation:</span>
                        <span>{c.escalation}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Block({
  tone,
  icon,
  title,
  items,
}: {
  tone: "warning" | "primary" | "success";
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  const toneClass = {
    warning: "border-warning/30 bg-warning-soft/40 text-warning",
    primary: "border-primary/30 bg-primary-soft/50 text-primary",
    success: "border-success/30 bg-success-soft/50 text-success",
  }[tone];
  return (
    <div className={`rounded-md border p-3 ${toneClass}`}>
      <div className="text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
        {icon} {title}
      </div>
      <ul className="mt-1.5 space-y-1 text-sm text-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="text-muted-foreground mt-1">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
