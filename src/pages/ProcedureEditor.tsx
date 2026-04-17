import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProcedure, type ProcedureStatus } from "@/data/procedures";
import { procedureTemplates } from "@/data/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Check,
  Beaker,
  ShieldCheck,
  Wrench,
  RefreshCw,
  Power,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EditorStep {
  id: string;
  title: string;
  description: string;
  image?: string;
  check?: string;
  ifFails?: string;
}

const emptyStep = (): EditorStep => ({
  id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: "",
  description: "",
});

const templateIcons: Record<string, React.ElementType> = {
  "tpl-calibrazione": Beaker,
  "tpl-qc": ShieldCheck,
  "tpl-manutenzione": Wrench,
  "tpl-reagente": RefreshCw,
  "tpl-startup": Power,
};

const wizardSteps = [
  { key: "meta", label: "Metadati" },
  { key: "steps", label: "Step procedura" },
  { key: "result", label: "Esito e troubleshooting" },
  { key: "trace", label: "Tracciabilità" },
] as const;

export default function ProcedureEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = id ? getProcedure(id) : undefined;
  const isNew = !existing;

  // 0 = template picker (only for new), 1+ = wizard steps
  const [phase, setPhase] = useState<"template" | "wizard">(isNew ? "template" : "wizard");
  const [stepIdx, setStepIdx] = useState(0);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription ?? "");
  const [machine, setMachine] = useState(existing?.machine ?? "");
  const [area, setArea] = useState(existing?.area ?? "");
  const [module, setModule] = useState(existing?.module ?? "");
  const [test, setTest] = useState(existing?.test ?? "");
  const [type, setType] = useState(existing?.type ?? "");
  const [prerequisitesText, setPrerequisitesText] = useState(
    (existing?.prerequisites ?? []).join("\n"),
  );
  const [steps, setSteps] = useState<EditorStep[]>(
    existing?.steps.map((s) => ({ ...s })) ?? [emptyStep()],
  );
  const [expectedResult, setExpectedResult] = useState(existing?.expectedResult ?? "");
  const [commonErrorsText, setCommonErrorsText] = useState(
    (existing?.commonErrors ?? []).join("\n"),
  );
  const [correctiveActionsText, setCorrectiveActionsText] = useState(
    (existing?.correctiveActions ?? []).join("\n"),
  );
  const [source, setSource] = useState(existing?.source ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "");
  const [version, setVersion] = useState(existing?.version ?? "v0.1");
  const [status, setStatus] = useState<ProcedureStatus>(existing?.status ?? "bozza");

  const applyTemplate = (templateId: string) => {
    if (templateId === "blank") {
      setPhase("wizard");
      return;
    }
    const tpl = procedureTemplates.find((t) => t.id === templateId);
    if (!tpl) return;
    setArea(tpl.area);
    setType(tpl.type);
    setSteps(
      tpl.steps.map((s, i) => ({
        id: `tpl-${Date.now()}-${i}`,
        ...s,
      })),
    );
    setExpectedResult(tpl.expectedResult);
    setCommonErrorsText(tpl.commonErrors.join("\n"));
    setCorrectiveActionsText(tpl.correctiveActions.join("\n"));
    toast({
      title: `Template "${tpl.name}" applicato`,
      description: "Personalizza i campi nei prossimi step.",
    });
    setPhase("wizard");
  };

  const updateStep = (idx: number, patch: Partial<EditorStep>) => {
    setSteps((s) => s.map((st, i) => (i === idx ? { ...st, ...patch } : st)));
  };
  const removeStep = (idx: number) => setSteps((s) => s.filter((_, i) => i !== idx));
  const addStep = () => setSteps((s) => [...s, emptyStep()]);

  const handleImage = (idx: number, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateStep(idx, { image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    toast({
      title: existing ? "Procedura aggiornata" : "Procedura creata",
      description: `"${title || "Senza titolo"}" salvata come ${
        status === "bozza" ? "bozza" : status === "validata" ? "validata" : "da revisionare"
      }.`,
    });
    navigate("/procedures");
  };

  const canNext = stepIdx < wizardSteps.length - 1;
  const canPrev = stepIdx > 0;

  // ===== TEMPLATE PICKER =====
  if (phase === "template") {
    return (
      <div className="p-5 md:p-6 max-w-4xl space-y-5">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 h-7 text-xs">
            <Link to="/procedures"><ChevronLeft className="h-3.5 w-3.5" /> Libreria</Link>
          </Button>
          <h1 className="text-xl font-semibold mt-1">Nuova procedura</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Parti da un template per risparmiare tempo, oppure crea da zero.
          </p>
        </div>

        <div>
          <div className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider mb-2">
            Template rapidi
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {procedureTemplates.map((tpl) => {
              const Icon = templateIcons[tpl.id] ?? Beaker;
              return (
                <button
                  key={tpl.id}
                  onClick={() => applyTemplate(tpl.id)}
                  className="text-left rounded-lg border bg-card p-4 hover:border-primary hover:shadow-sm transition-all group"
                >
                  <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="font-semibold text-sm mt-3">{tpl.name}</div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="text-[10px] text-muted-foreground mt-2 font-mono">
                    {tpl.steps.length} step preimpostati
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => applyTemplate("blank")}
              className="text-left rounded-lg border-2 border-dashed bg-muted/30 p-4 hover:border-primary hover:bg-muted/50 transition-all"
            >
              <div className="h-9 w-9 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <div className="font-semibold text-sm mt-3">Procedura vuota</div>
              <p className="text-xs text-muted-foreground mt-1">
                Inizia con un foglio bianco.
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== WIZARD =====
  return (
    <div className="p-5 md:p-6 max-w-4xl space-y-4">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 h-7 text-xs">
          <Link to="/procedures"><ChevronLeft className="h-3.5 w-3.5" /> Libreria</Link>
        </Button>
        <h1 className="text-xl font-semibold mt-1">
          {existing ? "Modifica procedura" : "Nuova procedura"}
        </h1>
      </div>

      {/* Wizard stepper */}
      <div className="flex items-center gap-1.5">
        {wizardSteps.map((s, i) => {
          const active = i === stepIdx;
          const done = i < stepIdx;
          return (
            <button
              key={s.key}
              onClick={() => setStepIdx(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : done
                  ? "bg-success-soft text-success border-success/30"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full text-[10px] flex items-center justify-center ${
                  active ? "bg-primary-foreground/20" : done ? "bg-success/20" : "bg-muted"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          {stepIdx === 0 && (
            <>
              <div>
                <h2 className="text-base font-semibold">Metadati base</h2>
                <p className="text-xs text-muted-foreground">
                  Le informazioni minime per identificare la procedura.
                </p>
              </div>
              <Field label="Titolo">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Es. Calibrazione FT4" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Modulo">
                  <Input value={module} onChange={(e) => setModule(e.target.value)} placeholder="Es. E1" className="font-mono" />
                </Field>
                <Field label="Test">
                  <Input value={test} onChange={(e) => setTest(e.target.value)} placeholder="Es. FT4" className="font-mono" />
                </Field>
                <Field label="Area">
                  <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Es. Calibrazione" />
                </Field>
              </div>
              <Field label="Tipo procedura">
                <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Es. Calibrazione completa manuale" />
              </Field>

              <AdvancedToggle label="Dettagli avanzati">
                <Field label="Macchina / strumento">
                  <Input value={machine} onChange={(e) => setMachine(e.target.value)} placeholder="Es. Analizzatore IM-3000" />
                </Field>
                <Field label="Descrizione breve">
                  <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} />
                </Field>
                <Field label="Prerequisiti (uno per riga)">
                  <Textarea value={prerequisitesText} onChange={(e) => setPrerequisitesText(e.target.value)} rows={3} />
                </Field>
              </AdvancedToggle>
            </>
          )}

          {stepIdx === 1 && (
            <>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Step procedura</h2>
                  <p className="text-xs text-muted-foreground">
                    Aggiungi i passaggi nell'ordine in cui vanno eseguiti.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addStep}>
                  <Plus className="h-4 w-4" /> Aggiungi step
                </Button>
              </div>

              <div className="space-y-2">
                {steps.map((step, idx) => (
                  <div key={step.id} className="rounded-md border bg-card overflow-hidden">
                    <div className="flex items-start gap-2 p-3">
                      <div className="h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center mt-1">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(idx, { title: e.target.value })}
                          placeholder="Cosa fare in questo step"
                          className="h-8"
                        />
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateStep(idx, { description: e.target.value })}
                          placeholder="Descrizione (opzionale)"
                          rows={2}
                          className="text-sm"
                        />

                        <Collapsible>
                          <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                            <ChevronDown className="h-3 w-3" /> Verifica, immagine, fallback
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Input
                                value={step.check ?? ""}
                                onChange={(e) => updateStep(idx, { check: e.target.value })}
                                placeholder="✓ Cosa verificare"
                                className="h-8 text-sm"
                              />
                              <Input
                                value={step.ifFails ?? ""}
                                onChange={(e) => updateStep(idx, { ifFails: e.target.value })}
                                placeholder="⚠ Se non funziona…"
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="inline-flex items-center gap-1.5 text-xs text-primary cursor-pointer hover:underline">
                                <ImageIcon className="h-3.5 w-3.5" />
                                <span>{step.image ? "Sostituisci immagine" : "Carica immagine"}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImage(idx, e.target.files?.[0])}
                                />
                              </label>
                              {step.image && (
                                <img src={step.image} alt="" className="h-10 w-14 object-cover rounded border" />
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(idx)}
                        disabled={steps.length === 1}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        aria-label="Rimuovi step"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {stepIdx === 2 && (
            <>
              <div>
                <h2 className="text-base font-semibold">Esito atteso e troubleshooting</h2>
                <p className="text-xs text-muted-foreground">
                  Cosa deve risultare al termine, e cosa fare se qualcosa va storto.
                </p>
              </div>
              <Field label="Risultato atteso">
                <Textarea
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                  rows={2}
                  placeholder="Es. Riga FT4 con COMPL. in verde e Manuale visibile."
                />
              </Field>

              <AdvancedToggle label="Errori e azioni correttive (opzionale)">
                <Field label="Errori comuni (uno per riga)">
                  <Textarea value={commonErrorsText} onChange={(e) => setCommonErrorsText(e.target.value)} rows={3} />
                </Field>
                <Field label="Azioni correttive (una per riga)">
                  <Textarea value={correctiveActionsText} onChange={(e) => setCorrectiveActionsText(e.target.value)} rows={3} />
                </Field>
              </AdvancedToggle>
            </>
          )}

          {stepIdx === 3 && (
            <>
              <div>
                <h2 className="text-base font-semibold">Tracciabilità e validazione</h2>
                <p className="text-xs text-muted-foreground">
                  Da dove viene questa procedura e in che stato è.
                </p>
              </div>
              <Field label="Autore">
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nome e ruolo" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Versione">
                  <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="v1.0" className="font-mono" />
                </Field>
                <Field label="Stato">
                  <Select value={status} onValueChange={(v) => setStatus(v as ProcedureStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bozza">Bozza</SelectItem>
                      <SelectItem value="da-revisionare">Da revisionare</SelectItem>
                      <SelectItem value="validata">Validata</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <AdvancedToggle label="Fonte (opzionale)">
                <Field label="Fonte della procedura">
                  <Input
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Manuale, esperienza interna, SOP…"
                  />
                </Field>
              </AdvancedToggle>
            </>
          )}
        </CardContent>
      </Card>

      {/* Wizard nav */}
      <div className="flex items-center justify-between gap-2 sticky bottom-0 bg-background/90 backdrop-blur py-3 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          disabled={!canPrev}
        >
          <ChevronLeft className="h-4 w-4" /> Indietro
        </Button>
        <div className="text-xs text-muted-foreground">
          Step {stepIdx + 1} di {wizardSteps.length}
        </div>
        {canNext ? (
          <Button size="sm" onClick={() => setStepIdx((i) => i + 1)}>
            Avanti <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" /> Salva procedura
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider mb-1 block">
        {label}
      </Label>
      {children}
    </div>
  );
}

function AdvancedToggle({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Collapsible className="border-t pt-3">
      <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group">
        <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
        {label}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 mt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}
