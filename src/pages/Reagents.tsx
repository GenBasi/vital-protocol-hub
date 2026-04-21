import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  reagents as initialReagents,
  getReagentStatus,
  daysUntilExpiration,
  type Reagent,
  type ReagentStatus,
} from "@/data/reagents";
import { ReagentStatusBadge } from "@/components/ReagentStatusBadge";
import { Download, Pencil, Plus, Search, Trash2, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ICONS = ["🧪", "🩸", "🧫", "🧬", "💧", "⚗️", "🔬"];

const emptyReagent = (): Reagent => ({
  id: `r-${Date.now()}`,
  name: "",
  icon: "🧪",
  module: "",
  expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString().slice(0, 10),
  lotNumber: "",
  quantity: 1,
  unit: "kit",
  minStock: 1,
  expirationWarningDays: 30,
});

export default function Reagents() {
  const [items, setItems] = useState<Reagent[]>(initialReagents);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReagentStatus>("all");
  const [sortBy, setSortBy] = useState<"name" | "expiration" | "quantity">("expiration");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Reagent | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const enriched = useMemo(
    () =>
      items.map((r) => ({
        ...r,
        status: getReagentStatus(r),
        daysToExp: daysUntilExpiration(r),
      })),
    [items],
  );

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    let res = enriched.filter((r) => {
      if (ql && !`${r.name} ${r.lotNumber} ${r.module ?? ""}`.toLowerCase().includes(ql))
        return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    });
    res = [...res].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "quantity") return a.quantity - b.quantity;
      return a.expirationDate.localeCompare(b.expirationDate);
    });
    return res;
  }, [enriched, q, statusFilter, sortBy]);

  const counts = useMemo(() => {
    const c = { ok: 0, "scorta-bassa": 0, "in-scadenza": 0, scaduto: 0 } as Record<
      ReagentStatus,
      number
    >;
    enriched.forEach((r) => c[r.status]++);
    return c;
  }, [enriched]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((r) => selectedIds.has(r.id));
  const someSelected = selectedIds.size > 0;

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openNew = () => {
    setEditing(emptyReagent());
    setDialogOpen(true);
  };
  const openEdit = (r: Reagent) => {
    setEditing({ ...r });
    setDialogOpen(true);
  };
  const save = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.lotNumber.trim()) {
      toast.error("Nome e numero di lotto sono obbligatori");
      return;
    }
    setItems((prev) => {
      const exists = prev.some((p) => p.id === editing.id);
      return exists ? prev.map((p) => (p.id === editing.id ? editing : p)) : [editing, ...prev];
    });
    toast.success("Reattivo salvato");
    setDialogOpen(false);
    setEditing(null);
  };
  const remove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast.success("Reattivo eliminato");
    setDeleteId(null);
  };

  const exportPdf = () => {
    const selectedFiltered = filtered.filter((r) => selectedIds.has(r.id));
    const rows = selectedFiltered.length > 0 ? selectedFiltered : filtered;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("LabFlow — Inventario Reattivi", 14, 16);
    doc.setFontSize(9);
    doc.text(`Generato: ${new Date().toLocaleString("it-IT")}`, 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["Reattivo", "Modulo", "Lotto", "Scadenza", "Q.tà", "Min", "Stato"]],
      body: rows.map((r) => [
        stripEmoji(r.name),
        r.module ?? "—",
        r.lotNumber,
        new Date(r.expirationDate).toLocaleDateString("it-IT"),
        `${r.quantity} ${r.unit}`,
        String(r.minStock),
        statusLabel(r.status),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 156] },
    });
    doc.save(`inventario-reattivi-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF esportato");
  };

  return (
    <div className="p-5 md:p-6 space-y-4 max-w-[1400px]">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <FlaskConical className="h-3.5 w-3.5" /> Inventario
          </div>
          <h1 className="text-2xl font-semibold mt-0.5">Scorte reattivi</h1>
          <p className="text-sm text-muted-foreground">
            Monitora giacenze, lotti e scadenze dei reattivi del laboratorio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {someSelected && (
            <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-0.5 border border-primary/20">
              {selectedIds.size} selezionat{selectedIds.size === 1 ? "o" : "i"}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={exportPdf}>
            <Download className="h-4 w-4" /> Esporta PDF
          </Button>
          <Button size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" /> Nuovo reattivo
          </Button>
        </div>
      </div>

      {/* Compact KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <KpiPill label="Totali" value={enriched.length} tone="muted" />
        <KpiPill label="OK" value={counts.ok} tone="success" />
        <KpiPill
          label="Da controllare"
          value={counts["scorta-bassa"] + counts["in-scadenza"]}
          tone="warning"
        />
        <KpiPill label="Scaduti" value={counts.scaduto} tone="destructive" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cerca per nome, lotto o modulo…"
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="ok">OK</SelectItem>
                <SelectItem value="scorta-bassa">Scorta bassa</SelectItem>
                <SelectItem value="in-scadenza">In scadenza</SelectItem>
                <SelectItem value="scaduto">Scaduto</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expiration">Ordina per scadenza</SelectItem>
                <SelectItem value="quantity">Ordina per giacenza</SelectItem>
                <SelectItem value="name">Ordina per nome</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground ml-auto">
              {filtered.length} reattivi
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Seleziona tutti"
                  />
                </TableHead>
                <TableHead className="w-10"></TableHead>
                <TableHead>Reattivo</TableHead>
                <TableHead className="hidden md:table-cell">Modulo</TableHead>
                <TableHead>Lotto</TableHead>
                <TableHead>Scadenza</TableHead>
                <TableHead>Giacenza</TableHead>
                <TableHead className="hidden lg:table-cell">Soglie</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-20 text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="text-sm">
                  <TableCell className="pl-4 py-2">
                    <Checkbox
                      checked={selectedIds.has(r.id)}
                      onCheckedChange={() => toggleOne(r.id)}
                      aria-label={`Seleziona ${r.name}`}
                    />
                  </TableCell>
                  <TableCell className="text-xl py-2">{r.icon}</TableCell>
                  <TableCell className="font-medium py-2">{r.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground py-2">
                    {r.module || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs py-2">{r.lotNumber}</TableCell>
                  <TableCell className="py-2">
                    <div className="leading-tight">
                      <div>{new Date(r.expirationDate).toLocaleDateString("it-IT")}</div>
                      <div
                        className={`text-[11px] ${
                          r.daysToExp < 0
                            ? "text-destructive"
                            : r.daysToExp <= r.expirationWarningDays
                              ? "text-warning"
                              : "text-muted-foreground"
                        }`}
                      >
                        {r.daysToExp < 0
                          ? `Scaduto da ${Math.abs(r.daysToExp)}g`
                          : `tra ${r.daysToExp}g`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <span
                      className={
                        r.quantity <= r.minStock ? "text-warning font-medium" : "font-medium"
                      }
                    >
                      {r.quantity}
                    </span>{" "}
                    <span className="text-xs text-muted-foreground">{r.unit}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground py-2">
                    min {r.minStock} · {r.expirationWarningDays}g
                  </TableCell>
                  <TableCell className="py-2">
                    <ReagentStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(r)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(r.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    Nessun reattivo trovato.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing && items.some((i) => i.id === editing.id) ? "Modifica reattivo" : "Nuovo reattivo"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3 py-2">
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div>
                  <Label className="text-xs">Icona</Label>
                  <Select
                    value={editing.icon}
                    onValueChange={(v) => setEditing({ ...editing, icon: v })}
                  >
                    <SelectTrigger className="h-9 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICONS.map((i) => (
                        <SelectItem key={i} value={i} className="text-lg">
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Nome reattivo *</Label>
                  <Input
                    className="h-9"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="es. FT4 Reagent Pack"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">N. lotto *</Label>
                  <Input
                    className="h-9 font-mono text-sm"
                    value={editing.lotNumber}
                    onChange={(e) => setEditing({ ...editing, lotNumber: e.target.value })}
                    placeholder="es. FT4-2025-A12"
                  />
                </div>
                <div>
                  <Label className="text-xs">Modulo</Label>
                  <Input
                    className="h-9"
                    value={editing.module ?? ""}
                    onChange={(e) => setEditing({ ...editing, module: e.target.value })}
                    placeholder="es. E1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Data di scadenza</Label>
                <Input
                  type="date"
                  className="h-9"
                  value={editing.expirationDate}
                  onChange={(e) => setEditing({ ...editing, expirationDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Giacenza</Label>
                  <Input
                    type="number"
                    className="h-9"
                    value={editing.quantity}
                    onChange={(e) =>
                      setEditing({ ...editing, quantity: Number(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Unità</Label>
                  <Input
                    className="h-9"
                    value={editing.unit}
                    onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
                    placeholder="kit, flacone…"
                  />
                </div>
                <div>
                  <Label className="text-xs">Soglia minima</Label>
                  <Input
                    type="number"
                    className="h-9"
                    value={editing.minStock}
                    onChange={(e) =>
                      setEditing({ ...editing, minStock: Number(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Avviso scadenza (giorni)</Label>
                <Input
                  type="number"
                  className="h-9"
                  value={editing.expirationWarningDays}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      expirationWarningDays: Number(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Mostra alert "In scadenza" quando mancano meno giorni di questo valore.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={save}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il reattivo?</AlertDialogTitle>
            <AlertDialogDescription>
              L'operazione è permanente e rimuoverà il reattivo dall'inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && remove(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function KpiPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "muted" | "success" | "warning" | "destructive";
}) {
  const toneClass = {
    muted: "border-border bg-card",
    success: "border-success/20 bg-success-soft text-success",
    warning: "border-warning/20 bg-warning-soft text-warning",
    destructive: "border-destructive/20 bg-destructive/5 text-destructive",
  }[tone];
  return (
    <div className={`rounded-md border px-3 py-2 ${toneClass}`}>
      <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-xl font-semibold leading-tight">{value}</div>
    </div>
  );
}

function stripEmoji(text: string) {
  return text
    .replace(/\p{Emoji_Presentation}/gu, "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .trim();
}

function statusLabel(s: ReagentStatus) {
  return {
    ok: "OK",
    "scorta-bassa": "Scorta bassa",
    "in-scadenza": "In scadenza",
    scaduto: "Scaduto",
  }[s];
}
