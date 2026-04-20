import { supabase } from "@/integrations/supabase/client";

export interface ProcedureStep {
  id: string;
  procedure_id: string;
  step_order: number;
  title: string;
  description: string | null;
  image_url: string | null;
}

export interface Procedure {
  id: string;
  title: string;
  module: string | null;
  test: string | null;
  area: string | null;
  instrument: string | null;
  expected_result: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProcedureWithSteps extends Procedure {
  steps: ProcedureStep[];
}

export interface ProcedureInput {
  title: string;
  module?: string | null;
  test?: string | null;
  area?: string | null;
  instrument?: string | null;
  expected_result?: string | null;
}

export interface StepInput {
  title: string;
  description?: string | null;
  image_url?: string | null;
}

export async function listProcedures(): Promise<Procedure[]> {
  const { data, error } = await supabase
    .from("procedures")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProcedureWithSteps(
  id: string,
): Promise<ProcedureWithSteps | null> {
  const { data: proc, error } = await supabase
    .from("procedures")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!proc) return null;

  const { data: steps, error: stepsErr } = await supabase
    .from("procedure_steps")
    .select("*")
    .eq("procedure_id", id)
    .order("step_order", { ascending: true });
  if (stepsErr) throw stepsErr;

  return { ...proc, steps: steps ?? [] };
}

export async function createProcedure(
  input: ProcedureInput,
  steps: StepInput[],
): Promise<string> {
  const { data: proc, error } = await supabase
    .from("procedures")
    .insert(input)
    .select("id")
    .single();
  if (error) throw error;

  if (steps.length > 0) {
    const rows = steps.map((s, i) => ({
      procedure_id: proc.id,
      step_order: i,
      title: s.title,
      description: s.description ?? null,
      image_url: s.image_url ?? null,
    }));
    const { error: stepsErr } = await supabase.from("procedure_steps").insert(rows);
    if (stepsErr) throw stepsErr;
  }

  return proc.id;
}

export async function updateProcedure(
  id: string,
  input: ProcedureInput,
  steps: StepInput[],
): Promise<void> {
  const { error } = await supabase
    .from("procedures")
    .update(input)
    .eq("id", id);
  if (error) throw error;

  // Replace steps: delete + insert (simple, ordering stays clean)
  const { error: delErr } = await supabase
    .from("procedure_steps")
    .delete()
    .eq("procedure_id", id);
  if (delErr) throw delErr;

  if (steps.length > 0) {
    const rows = steps.map((s, i) => ({
      procedure_id: id,
      step_order: i,
      title: s.title,
      description: s.description ?? null,
      image_url: s.image_url ?? null,
    }));
    const { error: insErr } = await supabase.from("procedure_steps").insert(rows);
    if (insErr) throw insErr;
  }
}

export async function deleteProcedure(id: string): Promise<void> {
  const { error } = await supabase.from("procedures").delete().eq("id", id);
  if (error) throw error;
}
