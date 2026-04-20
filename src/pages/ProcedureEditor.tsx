import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  createProcedure,
  getProcedureWithSteps,
  updateProcedure,
} from "@/lib/procedures-api";

interface EditorStep {
  localId: string;
  title: string;
  description: string;
  image_url?: string | null;
}

const emptyStep = (): EditorStep => ({
  localId: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: "",
  description: "",
});

const wizardSteps = [
  { key: "meta", label: "Metadati" },
  { key: "steps", label: "Step procedura" },
  { key: "result", label: "Esito atteso" },
] as const;

export default function ProcedureEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  const [title, setTitle] = useState("");
  const [module, setModule] = useState("");
  const [test, setTest] = useState("");
  const [area, setArea] = useState("");
  const [instrument, setInstrument] = useState("");
  const [steps, setSteps] = useState<EditorStep[]>([emptyStep()]);
  const [expectedResult, setExpectedResult] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const proc = await getProcedureWithSteps(id);
        if (cancelled || !proc) return;
        setTitle(proc.title);
        setModule(proc.module ?? "");
        setTest(proc.test ?? "");
        setArea(proc.area ?? "");
        setInstrument(proc.instrument ?? "");
        setExpectedResult(proc.expected_result ?? "");
        setSteps(
          proc.steps.length > 0
            ? proc.steps.map((s) => ({
                localId: s.id,
                title: s.title,
                description: s.description ?? "",
                image_url: s.image_url,
              }))
            : [emptyStep()],
        );
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

  const updateStep = (idx: number, patch: Partial<EditorStep>) =>
    setSteps((s) => s.map((st, i) => (i === idx ? { ...st, ...patch } : st)));
  const removeStep = (idx: number) =>
    setSteps((s) => (s.length === 1 ? s : s.filter((_, i) => i !== idx)));
  const addStep = () => setSteps((s) => [...s, emptyStep()]);

  const handleImage = (idx: number, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateStep(idx, { image_url: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Titolo richiesto", variant: "destructive" });
      setStepIdx(0);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        module: module.trim() || null,
        test: test.trim() || null,
        area: area.trim() || null,
        instrument: instrument.trim() || null,
        expected_result: expectedResult.trim() || null,
      };
      const cleanSteps = steps
        .filter((s) => s.title.trim() || s.description.trim())
        .map((s) => ({
          title: s.title.trim() || "Step",
          description: s.description.trim() || null,
          image_url: s.image_url ?? null,
        }));

      if (isEdit && id) {
        await updateProcedure(id, payload, cleanSteps);
        toast({ title: "Procedura aggiornata" });
        navigate(`/procedures/${id}`);
      } else {
        const newId = await createProcedure(payload, cleanSteps);
        toast({ title: "Procedura creata" });
        navigate(`/procedures/${newId}`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({ title: "Errore salvataggio", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const canNext = stepIdx < wizardSteps.length - 1;
  const canPrev = stepIdx > 0;

  if (loading) {
    return (
      <div className="p-8 text-sm text-muted-foreground">Caricamento procedura…</div>
    );
  }

  return (
    <div className="p-5 md:p-6 max-w-4xl space-y-4">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 h-7 text-xs">
          <Link to="/procedures"><ChevronLeft className="h-3.5 w-3.5" /> Libreria</Link>
        </Button>
        <h1 className="text-xl font-semibold mt-1">
          {isEdit ? "Modifica procedura" : "Nuova procedura"}
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
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Es. Calibrazione FT4"
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Modulo">
                  <Input
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    placeholder="Es. E1"
                    className="font-mono"
                  />
                </Field>
                <Field label="Test">
                  <Input
                    value={test}
                    onChange={(e) => setTest(e.target.value)}
                    placeholder="Es. FT4"
                    className="font-mono"
                  />
                </Field>
                <Field label="Area">
                  <Input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Es. Calibrazione"
                  />
                </Field>
                <Field label="Strumento">
                  <Input
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    placeholder="Es. Analizzatore IM-3000"
                  />
                </Field>
              </div>
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
                  <div key={step.localId} className="rounded-md border bg-card overflow-hidden">
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
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-1.5 text-xs text-primary cursor-pointer hover:underline">
                            <ImageIcon className="h-3.5 w-3.5" />
                            <span>{step.image_url ? "Sostituisci immagine" : "Carica immagine"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImage(idx, e.target.files?.[0])}
                            />
                          </label>
                          {step.image_url && (
                            <img
                              src={step.image_url}
                              alt=""
                              className="h-10 w-14 object-cover rounded border"
                            />
                          )}
                        </div>
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
                <h2 className="text-base font-semibold">Risultato atteso</h2>
                <p className="text-xs text-muted-foreground">
                  Cosa deve risultare al termine della procedura.
                </p>
              </div>
              <Field label="Risultato atteso">
                <Textarea
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                  rows={3}
                  placeholder="Es. Riga FT4 con COMPL. in verde e Manuale visibile."
                />
              </Field>
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
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Salvataggio…" : "Salva procedura"}
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
