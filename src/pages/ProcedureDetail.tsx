import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Play,
  Pencil,
  Target,
  Activity,
} from "lucide-react";
import { getProcedureWithSteps, type ProcedureWithSteps } from "@/lib/procedures-api";
import { toast } from "@/hooks/use-toast";

export default function ProcedureDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [procedure, setProcedure] = useState<ProcedureWithSteps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const proc = await getProcedureWithSteps(id);
        if (!cancelled) setProcedure(proc);
      } catch (e) {
        toast({ title: "Errore caricamento", description: String(e), variant: "destructive" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="p-8 text-sm text-muted-foreground">Caricamento…</div>;
  }

  if (!procedure) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">Procedura non trovata.</p>
        <Button variant="link" asChild><Link to="/procedures">← Torna alla libreria</Link></Button>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-6 max-w-[1200px] space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2 h-7 text-xs">
        <ChevronLeft className="h-3.5 w-3.5" /> Indietro
      </Button>

      <Card className="border-primary/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-primary-soft/50 px-5 py-4 border-b border-primary/20">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {procedure.area && <Badge variant="outline" className="bg-card text-xs">{procedure.area}</Badge>}
                  {procedure.module && <Badge variant="outline" className="bg-card text-xs font-mono">Modulo {procedure.module}</Badge>}
                  {procedure.test && <Badge variant="outline" className="bg-card text-xs font-mono">{procedure.test}</Badge>}
                </div>
                <h1 className="text-2xl font-semibold leading-tight">{procedure.title}</h1>
                {procedure.instrument && (
                  <p className="text-xs text-muted-foreground mt-1">{procedure.instrument}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/procedures/${procedure.id}/edit`}><Pencil className="h-4 w-4" /> Modifica</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to={`/procedures/${procedure.id}/run`}><Play className="h-4 w-4" /> Esegui</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
            <div className="p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">
                  Azione da fare
                </div>
                <div className="text-sm font-medium mt-0.5">
                  {procedure.steps.length} step
                </div>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3 bg-success-soft/30">
              <div className="h-9 w-9 rounded-md bg-success-soft text-success flex items-center justify-center shrink-0">
                <Target className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase font-semibold text-success tracking-wider">
                  Esito corretto
                </div>
                <div className="text-sm font-medium mt-0.5">
                  {procedure.expected_result || "—"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-2.5 border-b flex items-center justify-between">
            <h2 className="text-sm font-semibold">Step procedura</h2>
            <span className="text-xs text-muted-foreground">{procedure.steps.length} passaggi</span>
          </div>
          {procedure.steps.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground text-center">
              Nessuno step. Modifica la procedura per aggiungerne.
            </div>
          ) : (
            <ol className="divide-y">
              {procedure.steps.map((step, idx) => (
                <li key={step.id} className="flex gap-3 p-3 hover:bg-muted/30">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm leading-tight">{step.title}</div>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
                    )}
                  </div>
                  {step.image_url && (
                    <img
                      src={step.image_url}
                      alt={`Step ${idx + 1}`}
                      loading="lazy"
                      className="h-14 w-20 object-cover rounded border shrink-0"
                    />
                  )}
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-background/90 backdrop-blur border-t -mx-5 md:-mx-6 px-5 md:px-6 py-3 flex justify-end">
        <Button asChild size="lg" disabled={procedure.steps.length === 0}>
          <Link to={`/procedures/${procedure.id}/run`}>
            <Play className="h-4 w-4" /> Esegui questa procedura
          </Link>
        </Button>
      </div>
    </div>
  );
}
