-- Timestamp helper (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Procedures table
CREATE TABLE public.procedures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  module TEXT,
  test TEXT,
  area TEXT,
  instrument TEXT,
  expected_result TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;

-- Open access for internal MVP (no auth yet)
CREATE POLICY "Anyone can view procedures"
ON public.procedures FOR SELECT
USING (true);

CREATE POLICY "Anyone can create procedures"
ON public.procedures FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update procedures"
ON public.procedures FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete procedures"
ON public.procedures FOR DELETE
USING (true);

CREATE TRIGGER update_procedures_updated_at
BEFORE UPDATE ON public.procedures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Procedure steps table
CREATE TABLE public.procedure_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  procedure_id UUID NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_procedure_steps_procedure_id_order
ON public.procedure_steps(procedure_id, step_order);

ALTER TABLE public.procedure_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view procedure steps"
ON public.procedure_steps FOR SELECT
USING (true);

CREATE POLICY "Anyone can create procedure steps"
ON public.procedure_steps FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update procedure steps"
ON public.procedure_steps FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete procedure steps"
ON public.procedure_steps FOR DELETE
USING (true);