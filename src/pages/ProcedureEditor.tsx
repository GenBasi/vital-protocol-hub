import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProcedure, type ProcedureStatus } from "@/data/procedures";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeft, GripVertical, Image as ImageIcon, Plus, Save, Trash2 } from "lucide-react";
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

export default function ProcedureEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = id ? getProcedure(id) : undefined;

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
      description: `"${title || "Senza titolo"}" salvata come ${status === "bozza" ? "bozza" : status === "validata" ? "validata" : "da revisionare"}.`,
    });
    navigate("/procedures");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/procedures"><ChevronLeft className="h-4 w-4" /> Libreria procedure</Link>
        </Button>
        <h1 className="text-2xl font-semibold mt-1">
          {existing ? "Modifica procedura" : "Nuova procedura"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compila metadati, step e informazioni di tracciabilità.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Metadati</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Titolo" className="md:col-span-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Es. Calibrazione FT4" />
          </Field>
          <Field label="Descrizione breve" className="md:col-span-2">
            <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} />
          </Field>
          <Field label="Macchina / strumento"><Input value={machine} onChange={(e) => setMachine(e.target.value)} /></Field>
          <Field label="Area"><Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Es. Calibrazione" /></Field>
          <Field label="Modulo"><Input value={module} onChange={(e) => setModule(e.target.value)} placeholder="Es. E1" /></Field>
          <Field label="Test"><Input value={test} onChange={(e) => setTest(e.target.value)} placeholder="Es. FT4" /></Field>
          <Field label="Tipo procedura" className="md:col-span-2">
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Es. Calibrazione completa manuale" />
          </Field>
          <Field label="Prerequisiti (uno per riga)" className="md:col-span-2">
            <Textarea value={prerequisitesText} onChange={(e) => setPrerequisitesText(e.target.value)} rows={3} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Step della procedura</CardTitle>
          <Button variant="outline" size="sm" onClick={addStep}><Plus className="h-4 w-4" /> Aggiungi step</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="rounded-md border p-4 bg-card space-y-3">
              <div className="flex items-start gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground mt-2 shrink-0" />
                <div className="h-7 w-7 shrink-0 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-1">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <Input
                    value={step.title}
                    onChange={(e) => updateStep(idx, { title: e.target.value })}
                    placeholder="Titolo step"
                  />
                  <Textarea
                    value={step.description}
                    onChange={(e) => updateStep(idx, { description: e.target.value })}
                    placeholder="Descrizione dettagliata di cosa fare in questo step"
                    rows={2}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={step.check ?? ""}
                      onChange={(e) => updateStep(idx, { check: e.target.value })}
                      placeholder="Cosa verificare"
                    />
                    <Input
                      value={step.ifFails ?? ""}
                      onChange={(e) => updateStep(idx, { ifFails: e.target.value })}
                      placeholder="Se non funziona…"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-primary cursor-pointer">
                      <ImageIcon className="h-4 w-4" />
                      <span>{step.image ? "Sostituisci immagine" : "Carica immagine"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImage(idx, e.target.files?.[0])}
                      />
                    </label>
                    {step.image && (
                      <img src={step.image} alt="" className="h-12 w-16 object-cover rounded border" />
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(idx)}
                  disabled={steps.length === 1}
                  aria-label="Rimuovi step"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Risultato e troubleshooting</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Risultato atteso">
            <Textarea value={expectedResult} onChange={(e) => setExpectedResult(e.target.value)} rows={2} />
          </Field>
          <Field label="Errori comuni (uno per riga)">
            <Textarea value={commonErrorsText} onChange={(e) => setCommonErrorsText(e.target.value)} rows={3} />
          </Field>
          <Field label="Azioni correttive (una per riga)">
            <Textarea value={correctiveActionsText} onChange={(e) => setCorrectiveActionsText(e.target.value)} rows={3} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Tracciabilità e stato</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Fonte della procedura" className="md:col-span-2">
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Manuale, esperienza interna, SOP…" />
          </Field>
          <Field label="Autore"><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
          <Field label="Versione"><Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="v1.0" /></Field>
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
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2 sticky bottom-0 bg-background/80 backdrop-blur py-3 border-t">
        <Button variant="outline" asChild><Link to="/procedures">Annulla</Link></Button>
        <Button onClick={handleSave}><Save className="h-4 w-4" /> Salva procedura</Button>
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
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
