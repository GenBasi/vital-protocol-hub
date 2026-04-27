import { supabase } from "@/integrations/supabase/client";
import type { Reagent } from "@/data/reagents";

type DbRow = {
  id: string;
  name: string;
  icon: string;
  module: string | null;
  expiration_date: string;
  lot_number: string;
  quantity: number;
  unit: string;
  min_stock: number;
  expiration_warning_days: number;
  created_at: string;
  updated_at: string;
};

function fromDb(row: DbRow): Reagent {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    module: row.module ?? undefined,
    expirationDate: row.expiration_date,
    lotNumber: row.lot_number,
    quantity: row.quantity,
    unit: row.unit,
    minStock: row.min_stock,
    expirationWarningDays: row.expiration_warning_days,
  };
}

function toDb(r: Omit<Reagent, "id">) {
  return {
    name: r.name,
    icon: r.icon,
    module: r.module ?? null,
    expiration_date: r.expirationDate,
    lot_number: r.lotNumber,
    quantity: r.quantity,
    unit: r.unit,
    min_stock: r.minStock,
    expiration_warning_days: r.expirationWarningDays,
  };
}

export async function listReagents(): Promise<Reagent[]> {
  const { data, error } = await supabase
    .from("reagents")
    .select("*")
    .order("expiration_date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(fromDb);
}

export async function createReagent(r: Omit<Reagent, "id">): Promise<Reagent> {
  const { data, error } = await supabase
    .from("reagents")
    .insert(toDb(r))
    .select()
    .single();
  if (error) throw error;
  return fromDb(data);
}

export async function updateReagent(id: string, r: Omit<Reagent, "id">): Promise<Reagent> {
  const { data, error } = await supabase
    .from("reagents")
    .update({ ...toDb(r), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromDb(data);
}

export async function deleteReagent(id: string): Promise<void> {
  const { error } = await supabase.from("reagents").delete().eq("id", id);
  if (error) throw error;
}export async function decrementReagent(id: string) {
  const { data: current, error: fetchError } = await supabase
    .from("reagents")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;
  if (current.quantity <= 0) throw new Error("Giacenza già a zero");
  const { data, error } = await supabase
    .from("reagents")
    .update({ quantity: current.quantity - 1, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromDb(data);
}
