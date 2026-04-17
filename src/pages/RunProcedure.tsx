import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProcedure } from "@/data/procedures";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Target,
  X,
} from "lucide-react";

export default function RunProcedure() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const procedure = getProcedure(id);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  if (!procedure) {
    return <div className="p-8 text-sm text-muted-foreground">Procedura non trovata.</div>;
  }

  const total = procedure.steps.length;
  const completedCount = Object.values(done).filter(Boolean).length;
  const progress = finished ? 100 : Math.round((completedCount / total) * 100);
  const step = procedure.steps[current];

  const toggle = (stepId: string) =>
    setDone((d) => ({ ...d, [stepId]: !d[stepId] }));

  const next = () => {
    setDone((d) => ({ ...d, [step.id]: true }));
    if (current < total - 1) setCurrent(current + 1);
    else setFinished(true);
  };
  const prev = () => {
    if (finished) {
      setFinished(false);
      return;
    }
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/40 flex flex-col">
      {/* Top bar fissa, contesto sempre visibile */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-2.5 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Badge variant="outline" className="text-[10px] font-mono py-0">
                {procedure.module}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono py-0">
                {procedure.test}
              </Badge>
              <span className="truncate">{procedure.title}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {finished ? "Completata" : `Step ${current + 1}/${total}`}
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/procedures/${procedure.id}`)}>
            <X className="h-4 w-4" /> Esci
          </Button>
        </div>
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-5 md:p-6">
        {!finished ? (
          <div className="space-y-4">
            {/* Step hero */}
            <div className="bg-card rounded-lg border overflow-hidden">
              {/* Image grande */}
              {step.image ? (
                <div className="bg-muted/40 border-b flex items-center justify-center">
                  <img
                    src={step.image}
                    alt={`Step ${current + 1}: ${step.title}`}
                    className="w-full max-h-[440px] object-contain"
                  />
                </div>
              ) : (
                <div className="bg-muted/50 h-32 flex items-center justify-center text-xs text-muted-foreground border-b">
                  Nessuna immagine per questo step
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center shrink-0">
                    {current + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-semibold leading-tight">{step.title}</h1>
                    <p className="text-sm mt-1.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Verifica + se non funziona */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
                  {step.check && (
                    <div className="rounded-md border-2 border-primary/30 bg-primary-soft/60 p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Cosa verificare
                      </div>
                      <div className="text-sm mt-1 font-medium">{step.check}</div>
                    </div>
                  )}
                  {step.ifFails && (
                    <div className="rounded-md border border-warning/40 bg-warning-soft/60 p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-warning inline-flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Se non funziona
                      </div>
                      <div className="text-sm mt-1">{step.ifFails}</div>
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer select-none mt-4 pt-3 border-t">
                  <Checkbox
                    checked={!!done[step.id]}
                    onCheckedChange={() => toggle(step.id)}
                  />
                  <span className="font-medium">Step completato</span>
                </label>
              </div>
            </div>

            {/* Mini checklist orizzontale */}
            <div className="flex flex-wrap gap-1.5">
              {procedure.steps.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(i)}
                  className={`h-7 min-w-7 px-2 rounded text-[11px] font-medium border transition-colors ${
                    i === current
                      ? "bg-primary text-primary-foreground border-primary"
                      : done[s.id]
                      ? "bg-success-soft text-success border-success/30"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  }`}
                  title={s.title}
                >
                  {done[s.id] && i !== current ? "✓" : i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Schermata finale: esito atteso BEN visibile */
          <div className="bg-card rounded-lg border-2 border-success overflow-hidden">
            <div className="bg-success-soft p-6 text-center">
              <div className="h-14 w-14 mx-auto rounded-full bg-success text-success-foreground flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-semibold mt-3">Procedura completata</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Verifica ora che il risultato finale sia corretto.
              </p>
            </div>
            <div className="p-6">
              <div className="rounded-md border-2 border-success/40 bg-success-soft/40 p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-success inline-flex items-center gap-1">
                  <Target className="h-3 w-3" /> Esito atteso
                </div>
                <div className="text-base font-medium mt-1.5">{procedure.expectedResult}</div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" asChild>
                  <Link to={`/procedures/${procedure.id}`}>Torna al dettaglio</Link>
                </Button>
                <Button onClick={() => { setFinished(false); setCurrent(0); setDone({}); }}>
                  Esegui di nuovo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav fissa: avanti/indietro grandi */}
      {!finished && (
        <div className="bg-card border-t sticky bottom-0">
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
            <Button variant="outline" size="lg" onClick={prev} disabled={current === 0}>
              <ChevronLeft className="h-4 w-4" /> Indietro
            </Button>
            <div className="text-xs text-muted-foreground tabular-nums hidden md:block">
              {completedCount} di {total} completati
            </div>
            <Button size="lg" onClick={next}>
              {current === total - 1 ? "Verifica finale" : "Avanti"} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
