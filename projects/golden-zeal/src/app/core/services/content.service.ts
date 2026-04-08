import { Injectable, inject } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from 'shared';
import type {
  Director,
  Photographer,
  Project,
  TeamMember,
  RegionalRep,
  FaqItem,
  SiteSetting,
  Showreel,
} from 'shared';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly sb = inject(SupabaseService).client;

  // ── Directors ──────────────────────────────────────────────
  getDirectors(): Observable<Director[]> {
    return from(
      this.sb.from('directors').select('*').order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as Director[]) ?? []));
  }

  getDirectorBySlug(slug: string): Observable<Director | null> {
    return from(
      this.sb.from('directors').select('*').eq('slug', slug).maybeSingle()
    ).pipe(map((r) => (r.data as Director) ?? null));
  }

  // ── Photographers ──────────────────────────────────────────
  getPhotographers(): Observable<Photographer[]> {
    return from(
      this.sb.from('photographers').select('*').order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as Photographer[]) ?? []));
  }

  getPhotographerBySlug(slug: string): Observable<Photographer | null> {
    return from(
      this.sb.from('photographers').select('*').eq('slug', slug).maybeSingle()
    ).pipe(map((r) => (r.data as Photographer) ?? null));
  }

  // ── Projects ───────────────────────────────────────────────
  getProjects(category?: string): Observable<Project[]> {
    let query = this.sb
      .from('projects')
      .select('*, director:directors(id,name,slug), photographer:photographers(id,name,slug)')
      .order('display_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    return from(query).pipe(map((r) => (r.data as Project[]) ?? []));
  }

  getFeaturedProjects(): Observable<Project[]> {
    return from(
      this.sb
        .from('projects')
        .select('*, director:directors(id,name,slug), photographer:photographers(id,name,slug)')
        .eq('featured', true)
        .order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as Project[]) ?? []));
  }

  getProjectBySlug(slug: string): Observable<Project | null> {
    return from(
      this.sb
        .from('projects')
        .select(
          '*, director:directors(id,name,slug), photographer:photographers(id,name,slug), stills:project_stills(*)'
        )
        .eq('slug', slug)
        .maybeSingle()
    ).pipe(map((r) => (r.data as Project) ?? null));
  }

  getProjectsByDirector(directorId: string): Observable<Project[]> {
    return from(
      this.sb
        .from('projects')
        .select('*')
        .eq('director_id', directorId)
        .order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as Project[]) ?? []));
  }

  getProjectsByPhotographer(photographerId: string): Observable<Project[]> {
    return from(
      this.sb
        .from('projects')
        .select('*')
        .eq('photographer_id', photographerId)
        .order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as Project[]) ?? []));
  }

  // ── Team ───────────────────────────────────────────────────
  getTeam(): Observable<TeamMember[]> {
    return from(
      this.sb.from('team_members').select('*').order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as TeamMember[]) ?? []));
  }

  // ── Regional Reps ──────────────────────────────────────────
  getReps(): Observable<RegionalRep[]> {
    return from(
      this.sb.from('regional_reps').select('*').order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as RegionalRep[]) ?? []));
  }

  // ── FAQ ────────────────────────────────────────────────────
  getFaq(): Observable<FaqItem[]> {
    return from(
      this.sb.from('faq').select('*').order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as FaqItem[]) ?? []));
  }

  // ── Site Settings ──────────────────────────────────────────
  getSettings(): Observable<Record<string, string>> {
    return from(
      this.sb.from('site_settings').select('*')
    ).pipe(
      map((r) => {
        const settings: Record<string, string> = {};
        ((r.data as SiteSetting[]) ?? []).forEach((s) => {
          settings[s.key] = s.value;
        });
        return settings;
      })
    );
  }

  // ── Showreel ───────────────────────────────────────────────
  getShowreel(): Observable<Showreel | null> {
    return from(
      this.sb.from('showreel').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle()
    ).pipe(map((r) => (r.data as Showreel) ?? null));
  }
}
