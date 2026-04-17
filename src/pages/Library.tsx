import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { procedures, machines, areas, modules, type ProcedureStatus } from "@/data/procedures";
import { StatusBadge } from "@/components/StatusBadge";
import { Play, Plus, Search } from "lucide-react";

const ALL = "__all__";
const statuses: { value: ProcedureStatus | typeof ALL; label: string }[] = [
  { value: ALL, label: "Tutti gli stati" },
  { value: "validata", label: "Validata" },
  { value: "bozza", label: "Bozza" },
  { value: "da-revisionare", label: "Da revisionare" },
];

export default function Library() {
  const [params] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const initialStatus = params.get("status") ?? ALL;
  const [q, setQ] = useState(initialQ);
  const [machine, setMachine] = useState<string>(ALL);
  const [area, setArea] = useState<string>(ALL);
  const [mod, setMod] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(initialStatus);

  useEffect(() => setQ(initialQ), [initialQ]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return procedures.filter((p) => {
      if (machine !== ALL && p.machine !== machine) return false;
      if (area !== ALL && p.area !== area) return false;
      if (mod !== ALL && p.module !== mod) return false;
      if (status !== ALL && p.status !== status) return false;
      if (ql) {
        const hay = `${p.title} ${p.shortDescription} ${p.machine} ${p.module} ${p.test} ${p.author}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [q, machine, area, mod, status]);

  const resetFilters = () => {
    setQ("");
    setMachine(ALL);
    setArea(ALL);
    setMod(ALL);
    setStatus(ALL);
  };

  return (
    <div className="p-5 md:p-6 space-y-4 max-w-[1400px]">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Libreria procedure</h1>
          <p className="text-xs text-muted-foreground">
            {filtered.length} di {procedures.length} procedure
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/procedures/new"><Plus className="h-4 w-4" /> Nuova procedura</Link>
        </Button>
      </div>

      {/* Compact toolbar — single row */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cerca per titolo, test, modulo, autore…"
                className="pl-9 h-9"
              />
            </div>
            <FilterSelect value={machine} onChange={setMachine} options={machines} placeholder="Macchina" />
            <FilterSelect value={area} onChange={setArea} options={areas} placeholder="Area" />
            <FilterSelect value={mod} onChange={setMod} options={modules} placeholder="Modulo" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Stato" /></SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(q || machine !== ALL || area !== ALL || mod !== ALL || status !== ALL) && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dense table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9">Procedura</TableHead>
                <TableHead className="h-9">Modulo</TableHead>
                <TableHead className="h-9">Test</TableHead>
                <TableHead className="h-9">Tipo</TableHead>
                <TableHead className="h-9">Stato</TableHead>
                <TableHead className="h-9">Autore</TableHead>
                <TableHead className="h-9">Ver.</TableHead>
                <TableHead className="h-9">Aggiornata</TableHead>
                <TableHead className="h-9 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                    Nessuna procedura trovata.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((p) => (
                <TableRow key={p.id} className="group">
                  <TableCell className="py-2">
                    <Link to={`/procedures/${p.id}`} className="font-medium hover:text-primary block leading-tight">
                      {p.title}
                    </Link>
                    <div className="text-[11px] text-muted-foreground truncate max-w-md">
                      {p.machine}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-sm font-mono">{p.module}</TableCell>
                  <TableCell className="py-2 text-sm font-mono">{p.test}</TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">{p.type}</TableCell>
                  <TableCell className="py-2"><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">{p.author}</TableCell>
                  <TableCell className="py-2 text-xs font-mono">{p.version}</TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">{p.updatedAt}</TableCell>
                  <TableCell className="py-2">
                    <Button asChild size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                      <Link to={`/procedures/${p.id}/run`} title="Esegui">
                        <Play className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
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

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Tutte — {placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
