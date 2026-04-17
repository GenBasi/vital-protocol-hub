import { Link, useParams, useNavigate } from "react-router-dom";
import { getProcedure } from "@/data/procedures";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ChevronLeft, Play, Pencil, FileText, User, ShieldCheck } from "lucide-react";

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
    <div className="p-6 md:p-8 max-w-[1400px] space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2 -ml-2">
          <ChevronLeft className="h-4 w-4" /> Indietro
        </Button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold">{procedure.title}</h1>
              <StatusBadge status={procedure.status} />
              <Badge variant="outline" className="font-mono">{procedure.version}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{procedure.shortDescription}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/procedures/${procedure.id}/edit`}><Pencil className="h-4 w-4" /> Modifica</Link>
            </Button>
            <Button asChild>
              <Link to={`/procedures/${procedure.id}/run`}><Play className="h-4 w-4" /> Esegui procedura</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Metadati</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <Meta label="Macchina" value={procedure.machine} />
              <Meta label="Area" value={procedure.area} />
              <Meta label="Modulo" value={procedure.module} />
              <Meta label="Test" value={procedure.test} />
              <Meta label="Tipo procedura" value={procedure.type} />
              <Meta label="Ultima modifica" value={procedure.updatedAt} />
            </CardContent>
          </Card>

          {procedure.prerequisites.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Prerequisiti</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {procedure.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Step della procedura</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {procedure.steps.map((step, idx) => (
                <div key={step.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="h-7 w-7 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{step.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    {step.check && (
                      <p className="text-xs text-success mt-2 inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verifica: {step.check}
                      </p>
                    )}
                  </div>
                  {step.image && (
                    <img
                      src={step.image}
                      alt={`Step ${idx + 1}: ${step.title}`}
                      loading="lazy"
                      className="h-20 w-28 object-cover rounded border shrink-0"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-success/30 bg-success-soft/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-success">
                <CheckCircle2 className="h-4 w-4" /> Risultato atteso
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">{procedure.expectedResult}</CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" /> Errori comuni
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {procedure.commonErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Azioni correttive</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {procedure.correctiveActions.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Tracciabilità</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow icon={<FileText className="h-4 w-4" />} label="Fonte" value={procedure.source} />
              <InfoRow icon={<User className="h-4 w-4" />} label="Autore" value={procedure.author} />
              {procedure.validatedBy && (
                <InfoRow icon={<ShieldCheck className="h-4 w-4" />} label="Validata da" value={procedure.validatedBy} />
              )}
              <InfoRow label="Versione" value={procedure.version} mono />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Cronologia revisioni</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {procedure.revisions.map((r) => (
                <div key={r.version} className="text-sm border-l-2 border-primary/40 pl-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">{r.version}</Badge>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.author}</div>
                  <div className="mt-1">{r.note}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-muted-foreground mt-0.5">{icon}</span>}
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={mono ? "font-mono" : ""}>{value}</div>
      </div>
    </div>
  );
}
