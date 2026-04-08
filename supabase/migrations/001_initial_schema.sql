-- ============================================================
-- Golden Zeal Pictures — Initial Schema
-- ============================================================

-- Directors
CREATE TABLE IF NOT EXISTS directors (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  bio           text,
  location      text,
  hero_image_url text,
  display_order  int NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- Photographers
CREATE TABLE IF NOT EXISTS photographers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  bio           text,
  location      text,
  specialty     text,
  hero_image_url text,
  display_order  int NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  slug             text UNIQUE NOT NULL,
  client           text,
  category         text NOT NULL CHECK (category IN ('commercial','cinematic','music_video','stills')),
  year             int,
  director_id      uuid REFERENCES directors(id) ON DELETE SET NULL,
  photographer_id  uuid REFERENCES photographers(id) ON DELETE SET NULL,
  thumbnail_url    text,
  vimeo_id         text,
  featured         boolean NOT NULL DEFAULT false,
  display_order    int NOT NULL DEFAULT 0,
  created_at       timestamptz DEFAULT now()
);

-- Project stills gallery
CREATE TABLE IF NOT EXISTS project_stills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url     text NOT NULL,
  display_order  int NOT NULL DEFAULT 0
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  role          text NOT NULL,
  location      text,
  email         text,
  photo_url     text,
  is_core       boolean NOT NULL DEFAULT true,
  display_order  int NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- Regional representatives
CREATE TABLE IF NOT EXISTS regional_reps (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  region        text NOT NULL,
  phone         text,
  email         text,
  display_order  int NOT NULL DEFAULT 0
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  description   text,
  icon          text,
  display_order  int NOT NULL DEFAULT 0
);

-- FAQ
CREATE TABLE IF NOT EXISTS faq (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question      text NOT NULL,
  answer        text NOT NULL,
  display_order  int NOT NULL DEFAULT 0
);

-- Site settings (key-value store)
CREATE TABLE IF NOT EXISTS site_settings (
  key   text PRIMARY KEY,
  value text NOT NULL
);

-- Showreel
CREATE TABLE IF NOT EXISTS showreel (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vimeo_id       text NOT NULL,
  thumbnail_url  text,
  title          text,
  created_at     timestamptz DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE directors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE photographers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stills  ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_reps   ENABLE ROW LEVEL SECURITY;
ALTER TABLE services        ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq             ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE showreel        ENABLE ROW LEVEL SECURITY;

-- anon: read-only
CREATE POLICY "public read directors"      ON directors       FOR SELECT TO anon USING (true);
CREATE POLICY "public read photographers"  ON photographers   FOR SELECT TO anon USING (true);
CREATE POLICY "public read projects"       ON projects        FOR SELECT TO anon USING (true);
CREATE POLICY "public read stills"         ON project_stills  FOR SELECT TO anon USING (true);
CREATE POLICY "public read team"           ON team_members    FOR SELECT TO anon USING (true);
CREATE POLICY "public read reps"           ON regional_reps   FOR SELECT TO anon USING (true);
CREATE POLICY "public read services"       ON services        FOR SELECT TO anon USING (true);
CREATE POLICY "public read faq"            ON faq             FOR SELECT TO anon USING (true);
CREATE POLICY "public read settings"       ON site_settings   FOR SELECT TO anon USING (true);
CREATE POLICY "public read showreel"       ON showreel        FOR SELECT TO anon USING (true);

-- authenticated: full access
CREATE POLICY "auth full directors"      ON directors       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full photographers"  ON photographers   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full projects"       ON projects        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full stills"         ON project_stills  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full team"           ON team_members    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full reps"           ON regional_reps   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full services"       ON services        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full faq"            ON faq             FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full settings"       ON site_settings   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full showreel"       ON showreel        FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Supabase Storage Bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed Data
-- ============================================================

-- Site settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_headline',    'GOLDEN ZEAL PICTURES'),
  ('hero_tagline',     'Film & Television Production Across Africa and Beyond'),
  ('hero_vimeo_id',    ''),
  ('about_text',       'Golden Zeal Pictures Ltd is a boutique Film and TV Technical Agency based in Nairobi, Kenya with over 30 years of combined industry experience across East, Central, West and Southern Africa, Southeast Asia and India.'),
  ('stat_founded',     '2024'),
  ('stat_producers',   '16+'),
  ('stat_projects',    '300+'),
  ('stat_awards',      '2'),
  ('contact_phone',    '+254 722 833 358'),
  ('contact_email',    'rodgers@goldenzealpictures.co.ke'),
  ('contact_address',  'Nairobi, Kenya')
ON CONFLICT (key) DO NOTHING;

-- Team members
INSERT INTO team_members (name, role, location, email, photo_url, is_core, display_order) VALUES
  ('Rodgers C. Gold',  'Executive Director / DOP',              'Nairobi, Kenya',          'rodgers@goldenzealpictures.co.ke', 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-1.jpeg', true,  1),
  ('Joseph Oduor',     'Director of Photography / Director',    'Nairobi, Kenya',          null, null, true,  2),
  ('Victor Mbuguah',   'Executive Producer / VFX Supervisor',   'Nairobi, Kenya',          null, null, true,  3),
  ('Kanyiri Kans',     'Cinematographer / Head of Technical',   'Nairobi, Kenya',          null, 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-5.jpg', true,  4),
  ('Jane Kariuki',     'Head of Editing / DIT / Colorist',      'Nairobi, Kenya',          null, 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-2.jpg', true,  5),
  ('Judy Kemboi',      'Focus Puller / Cam Tech / Cam Op',      'Nairobi, Kenya',          null, 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-3.png', true,  6),
  ('Eric Kimani',      'Director / CGI / Senior Editor',        'Nairobi, Kenya',          null, 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-1.jpg', true,  7)
ON CONFLICT DO NOTHING;

-- Directors
INSERT INTO directors (name, slug, bio, location, display_order) VALUES
  ('Joseph Oduor',  'joseph-oduor',  'Director of Photography and Director with extensive experience across East Africa and beyond. Known for visually arresting work that honours the texture and spirit of African storytelling.', 'Nairobi, Kenya', 1),
  ('Eric Kimani',   'eric-kimani',   'Director, CGI artist and senior editor. Brings a sharp visual language to both commercial and cinematic work, blending live action with high-end post-production.', 'Nairobi, Kenya', 2),
  ('Rodgers C. Gold', 'rodgers-gold', 'Executive Director and DOP. Founder of Golden Zeal Pictures with over a decade leading productions across Africa and Southeast Asia.', 'Nairobi, Kenya', 3)
ON CONFLICT DO NOTHING;

-- Photographers
INSERT INTO photographers (name, slug, bio, location, specialty, display_order) VALUES
  ('Kanyiri Kans', 'kanyiri-kans', 'Cinematographer with 6+ years specialising in lighting, grip and camera work. Trained with Panavision South Africa and Kenya Grip & Sparks Lighting.', 'Nairobi, Kenya', 'Lighting & Cinematography', 1)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO services (name, description, icon, display_order) VALUES
  ('Directing',               'Script interpretation, casting, team collaboration, on-set leadership and post-production oversight.',                                   'camera',       1),
  ('Camera Operation',        'Precision and creative visual capture for film, television and commercial productions.',                                                  'video',        2),
  ('Gimbal / Ronin Operation','Expert stabilisation and fluid motion for cinematic movement on any terrain.',                                                            'aperture',     3),
  ('Video Editing',           'Footage shaping, pacing, mood adjustment and colour grading to deliver polished final cuts.',                                             'film',         4),
  ('Technical Support',       '2nd AC / VT services: camera setup, slate operation, focus marking and video playback.',                                                 'settings',     5),
  ('CGI / VFX / SFX',        'High-end visual effects, computer-generated imagery and on-set practical effects supervision.',                                           'sparkles',     6)
ON CONFLICT DO NOTHING;

-- FAQ
INSERT INTO faq (question, answer, display_order) VALUES
  ('What types of projects do you produce?',                   'We produce commercials, documentaries, television content, branded films, corporate video, music videos and photography projects.',                                                         1),
  ('Do you work outside Kenya?',                               'Yes. We operate across East, Central, West and Southern Africa, with extended collaborations in India and Indonesia.',                                                                       2),
  ('Do you provide full production support?',                  'Absolutely. From development and pre-production through to delivery, including logistics, location permits, crew supply and post-production.',                                               3),
  ('Can you support international productions filming in Africa?', 'Yes. We act as a seamless extension of international production teams — providing local expertise, trusted crew and deep regional knowledge.',                                          4),
  ('How do I get a quote?',                                    'Get in touch via our contact page with a brief on your project — scope, timeline and location. We will respond within 48 hours.',                                                             5)
ON CONFLICT DO NOTHING;

-- Sample projects (placeholders — replace via CMS)
INSERT INTO projects (title, slug, client, category, year, featured, display_order) VALUES
  ('Sky Garden',    'sky-garden',    'Sky Garden Nairobi',  'commercial', 2024, true,  1),
  ('Jumia Kenya',   'jumia-kenya',   'Jumia',               'commercial', 2023, true,  2),
  ('KURA Documentary', 'kura-documentary', 'KURA',          'cinematic',  2023, true,  3),
  ('Naivas Kikwetu','naivas-kikwetu','Naivas Supermarket',  'commercial', 2024, false, 4)
ON CONFLICT DO NOTHING;
