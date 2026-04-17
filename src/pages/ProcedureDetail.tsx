import { Link, useParams, useNavigate } from "react-router-dom";
import { getProcedure } from "@/data/procedures";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Play,
  Pencil,
  Target,
  Activity,
} from "lucide-react";

export default function ProcedureDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const procedure = getProcedure(id);

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

      {/* HERO operativo: tutto in vista */}
      <Card className="border-primary/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-primary-soft/50 px-5 py-4 border-b border-primary/20">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className="bg-card text-xs">{procedure.area}</Badge>
                  <Badge variant="outline" className="bg-card text-xs font-mono">Modulo {procedure.module}</Badge>
                  <Badge variant="outline" className="bg-card text-xs font-mono">{procedure.test}</Badge>
                  <StatusBadge status={procedure.status} />
                  <Badge variant="outline" className="bg-card font-mono text-xs">{procedure.version}</Badge>
                </div>
                <h1 className="text-2xl font-semibold leading-tight">{procedure.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{procedure.shortDescription}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {procedure.type} · {procedure.machine}
                </p>
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

          {/* Azione + esito atteso visibilissimi */}
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
                  {procedure.steps.length} step · {procedure.type}
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
                <div className="text-sm font-medium mt-0.5">{procedure.expectedResult}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step list — compatta e scansionabile */}
      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-2.5 border-b flex items-center justify-between">
            <h2 className="text-sm font-semibold">Step procedura</h2>
            <span className="text-xs text-muted-foreground">{procedure.steps.length} passaggi</span>
          </div>
          <ol className="divide-y">
            {procedure.steps.map((step, idx) => (
              <li key={step.id} className="flex gap-3 p-3 hover:bg-muted/30">
                <div className="h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-tight">{step.title}</div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
                  {step.check && (
                    <div className="text-xs text-success mt-1.5 inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {step.check}
                    </div>
                  )}
                </div>
                {step.image && (
                  <img
                    src={step.image}
                    alt={`Step ${idx + 1}`}
                    loading="lazy"
                    className="h-14 w-20 object-cover rounded border shrink-0"
                  />
                )}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Dettagli avanzati collassabili */}
      <Card>
        <CardContent className="p-0">
          <Accordion type="multiple" className="divide-y">
            {procedure.prerequisites.length > 0 && (
              <AccordionItem value="prereq" className="border-0">
                <AccordionTrigger className="px-4 py-2.5 text-sm font-medium hover:no-underline">
                  Prerequisiti
                  <span className="ml-auto mr-2 text-xs text-muted-foreground font-normal">
                    {procedure.prerequisites.length}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <ul className="list-disc list-inside text-sm space-y-0.5 text-muted-foreground">
                    {procedure.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="errors" className="border-0">
              <AccordionTrigger className="px-4 py-2.5 text-sm font-medium hover:no-underline">
                <span className="inline-flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  Errori comuni e azioni correttive
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider mb-1.5">
                      Errori comuni
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-0.5">
                      {procedure.commonErrors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider mb-1.5">
                      Azioni correttive
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-0.5">
                      {procedure.correctiveActions.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="trace" className="border-0">
              <AccordionTrigger className="px-4 py-2.5 text-sm font-medium hover:no-underline">
                Tracciabilità e cronologia
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                  <Meta label="Fonte" value={procedure.source} />
                  <Meta label="Autore" value={procedure.author} />
                  {procedure.validatedBy && <Meta label="Validata da" value={procedure.validatedBy} />}
                  <Meta label="Versione" value={procedure.version} mono />
                </div>
                <div className="space-y-2">
                  {procedure.revisions.map((r) => (
                    <div key={r.version} className="text-sm border-l-2 border-primary/40 pl-3 py-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">{r.version}</Badge>
                        <span className="text-[11px] text-muted-foreground">{r.date} · {r.author}</span>
                      </div>
                      <div className="text-xs mt-0.5">{r.note}</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* CTA finale */}
      <div className="sticky bottom-0 bg-background/90 backdrop-blur border-t -mx-5 md:-mx-6 px-5 md:px-6 py-3 flex justify-end">
        <Button asChild size="lg">
          <Link to={`/procedures/${procedure.id}/run`}>
            <Play className="h-4 w-4" /> Esegui questa procedura
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">{label}</div>
      <div className={`text-sm ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
