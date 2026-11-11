-- Partners: companies Golden Zeal makes films with. Each has a public profile at
-- /partners/:slug and is linked to the Golden Zeal projects made together.
CREATE TABLE IF NOT EXISTS partners (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  specialty     text NOT NULL,
  -- One sentence on what they do with Golden Zeal; shown on the card and profile hero.
  role_with_us  text NOT NULL,
  bio           text,
  location      text,
  website       text,
  cover_url     text,
  gallery_urls  text[] NOT NULL DEFAULT '{}',
  published     boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- Projects made together. Edited from both the partner form and the project form.
CREATE TABLE IF NOT EXISTS project_partners (
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, partner_id)
);

CREATE INDEX IF NOT EXISTS project_partners_partner_id_idx ON project_partners (partner_id);

ALTER TABLE partners         ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_partners ENABLE ROW LEVEL SECURITY;

-- The public site only sees published partners, and only links to them.
CREATE POLICY "public read partners" ON partners FOR SELECT TO anon USING (published);
CREATE POLICY "public read project partners" ON project_partners FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM partners p WHERE p.id = partner_id AND p.published));

CREATE POLICY "auth full partners"         ON partners         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full project partners" ON project_partners FOR ALL TO authenticated USING (true) WITH CHECK (true);
