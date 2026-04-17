import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { troubleshootingCases } from "@/data/troubleshooting";
import { procedures } from "@/data/procedures";
import { AlertTriangle, ArrowRight, PhoneCall, Search, Wrench } from "lucide-react";

export default function Troubleshooting() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return troubleshootingCases;
    return troubleshootingCases.filter((c) => {
      const hay = `${c.symptom} ${c.area} ${c.module ?? ""} ${c.possibleCauses.join(" ")} ${c.actions.join(" ")}`.toLowerCase();
      return hay.includes(ql);
    });
  }, [q]);

  return (
    <div className="p-6 md:p-8 space-y-5 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-semibold inline-flex items-center gap-2">
          <Wrench className="h-6 w-6 text-primary" /> Troubleshooting
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cerca un sintomo o un errore per trovare controlli, azioni e procedure correlate.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Es. calibrazione fallita, reagente non riconosciuto, backup…"
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 && (
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Nessun caso trovato.</CardContent></Card>
        )}
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
                  <div>
                    <CardTitle className="text-base">{c.symptom}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline">{c.area}</Badge>
                      {c.module && <Badge variant="outline">Modulo {c.module}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
              <Section title="Possibili cause" items={c.possibleCauses} />
              <Section title="Controlli rapidi" items={c.quickChecks} />
              <Section title="Azioni consigliate" items={c.actions} />

              <div className="md:col-span-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 border-t">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground mr-1">Procedure collegate:</span>
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
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <PhoneCall className="h-3 w-3" /> Escalation: {c.escalation}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">{title}</div>
      <ul className="list-disc list-inside text-sm space-y-1">
        {items.map((i, idx) => <li key={idx}>{i}</li>)}
      </ul>
    </div>
  );
}
