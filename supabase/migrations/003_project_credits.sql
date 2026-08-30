-- Full crew credits per project (Director/Photographer stay as dedicated FK fields;
-- everyone else — Producer, Cinematographer, Grip, Sound, Editor, etc. — lives here).
CREATE TABLE IF NOT EXISTS project_credits (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  person_name   text NOT NULL,
  role          text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE project_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read credits" ON project_credits FOR SELECT TO anon USING (true);
CREATE POLICY "auth full credits"   ON project_credits FOR ALL    TO authenticated USING (true) WITH CHECK (true);
