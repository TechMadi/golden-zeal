export interface Director {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  location: string | null;
  hero_image_url: string | null;
  display_order: number;
}

export interface Photographer {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  location: string | null;
  specialty: string | null;
  hero_image_url: string | null;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  description: string | null;
  category: 'commercial' | 'cinematic' | 'music_video' | 'stills';
  year: number | null;
  director_id: string | null;
  photographer_id: string | null;
  thumbnail_url: string | null;
  vimeo_id: string | null;
  featured: boolean;
  display_order: number;
  // joined
  director?: Pick<Director, 'id' | 'name' | 'slug'>;
  photographer?: Pick<Photographer, 'id' | 'name' | 'slug'>;
  stills?: ProjectStill[];
}

export interface ProjectStill {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  location: string | null;
  email: string | null;
  photo_url: string | null;
  is_core: boolean;
  display_order: number;
}

export interface RegionalRep {
  id: string;
  name: string;
  region: string;
  phone: string | null;
  email: string | null;
  display_order: number;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface ApprenticeshipCohort {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  year: number | null;
  cohort_number: number | null;
  start_date: string | null;
  end_date: string | null;
  enrolled_count: number;
  status: 'upcoming' | 'active' | 'completed';
  display_order: number;
  // joined
  projects?: Project[];
  members?: CohortMember[];
}

export interface CohortMember {
  team_member_id: string;
  role: string;
  team_member?: TeamMember;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export interface Showreel {
  id: string;
  vimeo_id: string;
  thumbnail_url: string | null;
  title: string | null;
}
