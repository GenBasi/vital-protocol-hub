import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listProcedures, deleteProcedure, type Procedure } from "@/lib/procedures-api";
import { Play, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Library() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listProcedures();
      setItems(data);
    } catch (e) {
      toast({ title: "Errore caricamento", description: String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return items;
    return items.filter((p) => {
      const hay = `${p.title} ${p.module ?? ""} ${p.test ?? ""} ${p.area ?? ""} ${p.instrument ?? ""}`.toLowerCase();
      return hay.includes(ql);
    });
  }, [q, items]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Eliminare "${title}"?`)) return;
    try {
      await deleteProcedure(id);
      toast({ title: "Procedura eliminata" });
      setItems((arr) => arr.filter((p) => p.id !== id));
    } catch (e) {
      toast({ title: "Errore eliminazione", description: String(e), variant: "destructive" });
    }
  };

  return (
    <div className="p-5 md:p-6 space-y-4 max-w-[1400px]">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Libreria procedure</h1>
          <p className="text-xs text-muted-foreground">
            {loading ? "Caricamento…" : `${filtered.length} di ${items.length} procedure`}
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/procedures/new"><Plus className="h-4 w-4" /> Nuova procedura</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca per titolo, test, modulo, strumento…"
              className="pl-9 h-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9">Procedura</TableHead>
                <TableHead className="h-9">Modulo</TableHead>
                <TableHead className="h-9">Test</TableHead>
                <TableHead className="h-9">Area</TableHead>
                <TableHead className="h-9">Strumento</TableHead>
                <TableHead className="h-9">Aggiornata</TableHead>
                <TableHead className="h-9 w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    {items.length === 0
                      ? "Nessuna procedura. Crea la prima."
                      : "Nessuna procedura trovata."}
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((p) => (
                <TableRow key={p.id} className="group">
                  <TableCell className="py-2">
                    <Link to={`/procedures/${p.id}`} className="font-medium hover:text-primary">
                      {p.title}
                    </Link>
                  </TableCell>
                  <TableCell className="py-2 text-sm font-mono">{p.module ?? "—"}</TableCell>
                  <TableCell className="py-2 text-sm font-mono">{p.test ?? "—"}</TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">{p.area ?? "—"}</TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">{p.instrument ?? "—"}</TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button asChild size="icon" variant="ghost" className="h-7 w-7">
                        <Link to={`/procedures/${p.id}/run`} title="Esegui">
                          <Play className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(p.id, p.title)}
                        title="Elimina"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
