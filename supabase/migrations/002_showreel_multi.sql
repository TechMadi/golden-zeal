-- Add multi-reel support columns to showreel table
ALTER TABLE showreel
  ADD COLUMN IF NOT EXISTS youtube_id   text,
  ADD COLUMN IF NOT EXISTS client       text,
  ADD COLUMN IF NOT EXISTS director     text,
  ADD COLUMN IF NOT EXISTS is_active    boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order   integer NOT NULL DEFAULT 0;
