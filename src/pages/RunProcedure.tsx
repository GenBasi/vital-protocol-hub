import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProcedure } from "@/data/procedures";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Eye, Flag, X } from "lucide-react";

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

  const toggle = (stepId: string) => setDone((d) => ({ ...d, [stepId]: !d[stepId] }));

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
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link to={`/procedures/${procedure.id}`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Torna al dettaglio
            </Link>
            <h1 className="text-xl font-semibold mt-1">Esegui — {procedure.title}</h1>
            <div className="text-xs text-muted-foreground mt-0.5">
              {procedure.machine} · Modulo {procedure.module} · {procedure.test} · {procedure.version}
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate(`/procedures/${procedure.id}`)}>
            <X className="h-4 w-4" /> Esci
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>
              {finished ? "Completata" : `Step ${current + 1} di ${total}`}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {!finished ? (
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                  {current + 1}
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {step.image && (
                <div className="rounded-md overflow-hidden border bg-muted">
                  <img
                    src={step.image}
                    alt={`Step ${current + 1}: ${step.title}`}
                    className="w-full max-h-[420px] object-contain bg-white"
                  />
                </div>
              )}
              <p className="text-sm leading-relaxed">{step.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step.check && (
                  <div className="rounded-md border border-primary/20 bg-primary-soft p-3">
                    <div className="text-xs font-medium text-primary inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Cosa verificare
                    </div>
                    <div className="text-sm mt-1 text-foreground">{step.check}</div>
                  </div>
                )}
                {step.ifFails && (
                  <div className="rounded-md border border-warning/30 bg-warning-soft p-3">
                    <div className="text-xs font-medium text-warning inline-flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Se non funziona
                    </div>
                    <div className="text-sm mt-1">{step.ifFails}</div>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <Checkbox
                  checked={!!done[step.id]}
                  onCheckedChange={() => toggle(step.id)}
                />
                Step completato
              </label>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-success/30">
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-full bg-success-soft text-success flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Procedura completata</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl mx-auto">
                  {procedure.expectedResult}
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="bg-success-soft text-success border-success/30">
                  <Flag className="h-3 w-3" /> Esito: OK
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={current === 0 && !finished}>
            <ChevronLeft className="h-4 w-4" /> Indietro
          </Button>
          {!finished ? (
            <Button onClick={next}>
              {current === total - 1 ? "Completa procedura" : "Avanti"} <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button asChild>
              <Link to={`/procedures/${procedure.id}`}>Torna al dettaglio</Link>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {procedure.steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={!!done[s.id]}
                  onCheckedChange={() => toggle(s.id)}
                />
                <button
                  onClick={() => { setFinished(false); setCurrent(i); }}
                  className={`text-left ${i === current && !finished ? "font-medium text-primary" : ""}`}
                >
                  {i + 1}. {s.title}
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
