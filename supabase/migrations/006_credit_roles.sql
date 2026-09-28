-- Crew credit roles, managed from the admin (Credit Roles page) and offered in
-- the project form's role picker. project_credits.role stays free text.
CREATE TABLE IF NOT EXISTS credit_roles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL UNIQUE,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE credit_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read credit roles" ON credit_roles FOR SELECT TO anon USING (true);
CREATE POLICY "auth full credit roles"   ON credit_roles FOR ALL    TO authenticated USING (true) WITH CHECK (true);

INSERT INTO credit_roles (name, display_order) VALUES
  ('Director',                1),
  ('Director of Photography', 2),
  ('Cinematographer',         3),
  ('Producer',                4),
  ('Client Producer',         5),
  ('Grip',                    6),
  ('Lighting',                7),
  ('Logistics',               8),
  ('Production Assistant',    9),
  ('Sound Engineer',         10),
  ('DIT',                    11),
  ('Editor',                 12),
  ('Colorist',               13),
  ('Graphics',               14),
  ('Wardrobe',               15),
  ('Talent Coordinator',     16)
ON CONFLICT (name) DO NOTHING;
