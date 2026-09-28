-- Directors and photographers are replaced by crew credits (project_credits).
-- Carry any existing project links over as credits before dropping them.

INSERT INTO credit_roles (name, display_order)
VALUES ('Photographer', 17)
ON CONFLICT (name) DO NOTHING;

INSERT INTO project_credits (project_id, person_name, role, display_order)
SELECT p.id, d.name, 'Director', -2
FROM projects p
JOIN directors d ON d.id = p.director_id
WHERE NOT EXISTS (
  SELECT 1 FROM project_credits c
  WHERE c.project_id = p.id AND lower(c.role) = 'director' AND lower(c.person_name) = lower(d.name)
);

INSERT INTO project_credits (project_id, person_name, role, display_order)
SELECT p.id, ph.name, 'Photographer', -1
FROM projects p
JOIN photographers ph ON ph.id = p.photographer_id
WHERE NOT EXISTS (
  SELECT 1 FROM project_credits c
  WHERE c.project_id = p.id AND lower(c.role) = 'photographer' AND lower(c.person_name) = lower(ph.name)
);

ALTER TABLE projects DROP COLUMN IF EXISTS director_id;
ALTER TABLE projects DROP COLUMN IF EXISTS photographer_id;

DROP TABLE IF EXISTS directors;
DROP TABLE IF EXISTS photographers;
