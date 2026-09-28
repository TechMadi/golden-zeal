-- Spell out the DOP credit role in full.
UPDATE project_credits
SET role = 'Director of Photography'
WHERE upper(trim(role)) IN ('DOP', 'D.O.P', 'D.O.P.');
