export interface Project {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  description: string | null;
  category: 'commercial' | 'cinematic' | 'music_video' | 'stills';
  sub_category: string | null;
  year: number | null;
  thumbnail_url: string | null;
  vimeo_id: string | null;
  youtube_id: string | null;
  featured: boolean;
  display_order: number;
  // joined
  // derived client-side from the project's "Director" crew credits
  directors?: string[];
  stills?: ProjectStill[];
  credits?: ProjectCredit[];
}

export interface ProjectCredit {
  id: string;
  project_id: string;
  person_name: string;
  role: string;
  display_order: number;
  // Optional — only set when the credited person is still a current team member.
  // Free-text person_name is always the display source of truth; the link just
  // enables portfolio aggregation on that person's profile page.
  team_member_id: string | null;
  // joined
  team_member?: Pick<TeamMember, 'id' | 'name' | 'slug'>;
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
  slug: string;
  bio: string | null;
  role: string;
  location: string | null;
  email: string | null;
  photo_url: string | null;
  is_core: boolean;
  display_order: number;
  // joined
  credits?: Project[];
}

export interface CreditRole {
  id: string;
  name: string;
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
  vimeo_id: string | null;
  youtube_id: string | null;
  thumbnail_url: string | null;
  title: string | null;
  client: string | null;
  director: string | null;
  is_active: boolean;
  sort_order: number;
}
