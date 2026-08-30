-- Give team_members the same "profile page" capability directors/photographers have
-- (bio + slug), and let a project_credits row optionally link to a real team member
-- for portfolio aggregation. Linking is optional on purpose: freelancers, client-side
-- people, and former crew who are no longer team_members stay as plain text credits.

ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS bio  text;

-- Backfill slugs for existing rows from their name (e.g. "Rodgers C. Gold" -> "rodgers-c-gold")
UPDATE team_members
SET slug = trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

ALTER TABLE team_members
  ALTER COLUMN slug SET NOT NULL,
  ADD CONSTRAINT team_members_slug_key UNIQUE (slug);

ALTER TABLE project_credits
  ADD COLUMN IF NOT EXISTS team_member_id uuid REFERENCES team_members(id) ON DELETE SET NULL;
