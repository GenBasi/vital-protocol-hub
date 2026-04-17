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
import { procedures, machines, areas, modules, tests, type ProcedureStatus } from "@/data/procedures";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Search } from "lucide-react";

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
  const [q, setQ] = useState(initialQ);
  const [machine, setMachine] = useState<string>(ALL);
  const [area, setArea] = useState<string>(ALL);
  const [mod, setMod] = useState<string>(ALL);
  const [test, setTest] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);

  useEffect(() => setQ(initialQ), [initialQ]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return procedures.filter((p) => {
      if (machine !== ALL && p.machine !== machine) return false;
      if (area !== ALL && p.area !== area) return false;
      if (mod !== ALL && p.module !== mod) return false;
      if (test !== ALL && p.test !== test) return false;
      if (status !== ALL && p.status !== status) return false;
      if (ql) {
        const hay = `${p.title} ${p.shortDescription} ${p.machine} ${p.module} ${p.test} ${p.author}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [q, machine, area, mod, test, status]);

  const resetFilters = () => {
    setQ("");
    setMachine(ALL);
    setArea(ALL);
    setMod(ALL);
    setTest(ALL);
    setStatus(ALL);
  };

  return (
    <div className="p-6 md:p-8 space-y-5 max-w-[1400px]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Libreria procedure</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} di {procedures.length} procedure
          </p>
        </div>
        <Button asChild>
          <Link to="/procedures/new"><Plus className="h-4 w-4" /> Nuova procedura</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca per titolo, test, modulo, autore…"
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <FilterSelect value={machine} onChange={setMachine} options={machines} placeholder="Macchina" />
            <FilterSelect value={area} onChange={setArea} options={areas} placeholder="Area" />
            <FilterSelect value={mod} onChange={setMod} options={modules} placeholder="Modulo" />
            <FilterSelect value={test} onChange={setTest} options={tests} placeholder="Test" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Stato" /></SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={resetFilters}>Reset filtri</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titolo</TableHead>
                <TableHead>Macchina</TableHead>
                <TableHead>Modulo</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Autore</TableHead>
                <TableHead>Versione</TableHead>
                <TableHead>Ultima modifica</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Nessuna procedura trovata con i filtri correnti.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((p) => (
                <TableRow key={p.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <Link to={`/procedures/${p.id}`} className="hover:text-primary">
                      {p.title}
                    </Link>
                    <div className="text-xs text-muted-foreground font-normal">{p.shortDescription}</div>
                  </TableCell>
                  <TableCell className="text-sm">{p.machine}</TableCell>
                  <TableCell className="text-sm">{p.module}</TableCell>
                  <TableCell className="text-sm">{p.test}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-sm">{p.author}</TableCell>
                  <TableCell className="text-sm font-mono">{p.version}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.updatedAt}</TableCell>
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
      <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Tutti — {placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
