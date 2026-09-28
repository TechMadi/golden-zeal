import { Injectable, Injector, inject } from '@angular/core';
import { pendingUntilEvent } from '@angular/core/rxjs-interop';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from 'shared';
import type {
  Project,
  TeamMember,
  RegionalRep,
  FaqItem,
  SiteSetting,
  Showreel,
  ApprenticeshipCohort,
} from 'shared';

// Credits are pulled with project lists so cards can show who directed.
const PROJECT_LIST_SELECT = '*, credits:project_credits(role,person_name,display_order)';

// Fills `directors` from the project's "Director" crew credits, in credit order.
function withDirectors(project: Project): Project {
  const directors = [...(project.credits ?? [])]
    .sort((a, b) => a.display_order - b.display_order)
    .filter((c) => c.role.trim().toLowerCase() === 'director')
    .map((c) => c.person_name);
  return { ...project, directors };
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly sb = inject(SupabaseService).client;
  private readonly injector = inject(Injector);

  // Supabase requests aren't tracked by zoneless change detection, so without this
  // prerendering finishes before data arrives and ships empty pages to crawlers.
  private track<T>(request: PromiseLike<T>): Observable<T> {
    return from(Promise.resolve(request)).pipe(pendingUntilEvent(this.injector));
  }

  // ── Projects ───────────────────────────────────────────────
  getProjects(category?: string): Observable<Project[]> {
    let query = this.sb
      .from('projects')
      .select(PROJECT_LIST_SELECT)
      .order('display_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    return this.track(query).pipe(map((r) => ((r.data as unknown as Project[]) ?? []).map(withDirectors)));
  }

  getProjectBySlug(slug: string): Observable<Project | null> {
    return this.track(
      this.sb
        .from('projects')
        .select(
          '*, stills:project_stills(*), credits:project_credits(*, team_member:team_members(id,name,slug))'
        )
        .eq('slug', slug)
        .maybeSingle()
    ).pipe(
      map((r) => {
        const project = r.data as Project | null;
        if (!project) return null;
        project.credits = [...(project.credits ?? [])].sort((a, b) => a.display_order - b.display_order);
        return withDirectors(project);
      })
    );
  }

  // ── Team ───────────────────────────────────────────────────
  getTeam(): Observable<TeamMember[]> {
    return this.track(
      this.sb.from('team_members').select('*').order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as TeamMember[]) ?? []));
  }

  getTeamMemberBySlug(slug: string): Observable<TeamMember | null> {
    return this.track(
      this.sb.from('team_members').select('*').eq('slug', slug).maybeSingle()
    ).pipe(map((r) => (r.data as TeamMember) ?? null));
  }

  // Portfolio for a team member's profile page — every project they have a *linked*
  // credit on (unlinked/free-text credits can't be attributed to a specific person).
  getProjectsByTeamMember(teamMemberId: string): Observable<Project[]> {
    return this.track(
      this.sb
        .from('project_credits')
        .select(`project:projects(${PROJECT_LIST_SELECT})`)
        .eq('team_member_id', teamMemberId)
    ).pipe(
      map((r) => {
        const rows = (r.data as any[]) ?? [];
        const seen = new Set<string>();
        const projects: Project[] = [];
        for (const row of rows) {
          const p = row.project as Project | null;
          if (p && !seen.has(p.id)) {
            seen.add(p.id);
            projects.push(withDirectors(p));
          }
        }
        return projects.sort((a, b) => a.display_order - b.display_order);
      })
    );
  }

  // ── Regional Reps ──────────────────────────────────────────
  getReps(): Observable<RegionalRep[]> {
    return this.track(
      this.sb.from('regional_reps').select('*').order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as RegionalRep[]) ?? []));
  }

  // ── FAQ ────────────────────────────────────────────────────
  getFaq(): Observable<FaqItem[]> {
    return this.track(
      this.sb.from('faq').select('*').order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as FaqItem[]) ?? []));
  }

  // ── Site Settings ──────────────────────────────────────────
  getSettings(): Observable<Record<string, string>> {
    return this.track(
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

  // ── Apprenticeship Cohorts ─────────────────────────────────
  getCohorts(): Observable<ApprenticeshipCohort[]> {
    return this.track(
      this.sb.from('apprenticeship_cohorts').select('*').order('display_order', { ascending: true })
    ).pipe(map((r) => (r.data as ApprenticeshipCohort[]) ?? []));
  }

  getCohortBySlug(slug: string): Observable<ApprenticeshipCohort | null> {
    return this.track(
      this.sb.from('apprenticeship_cohorts').select('*').eq('slug', slug).maybeSingle()
    ).pipe(map((r) => (r.data as ApprenticeshipCohort) ?? null));
  }

  getCohortProjects(cohortId: string): Observable<Project[]> {
    return this.track(
      this.sb
        .from('cohort_projects')
        .select(`project:projects(${PROJECT_LIST_SELECT})`)
        .eq('cohort_id', cohortId)
    ).pipe(map((r) => ((r.data as any[]) ?? []).map((row: any) => row.project).filter(Boolean).map(withDirectors)));
  }

  getCohortMembers(cohortId: string): Observable<{ role: string; member: TeamMember }[]> {
    return this.track(
      this.sb
        .from('cohort_members')
        .select('role, team_member:team_members(*)')
        .eq('cohort_id', cohortId)
    ).pipe(map((r) => ((r.data as any[]) ?? []).map((row: any) => ({ role: row.role, member: row.team_member }))));
  }

  // ── Showreel ───────────────────────────────────────────────
  getShowreels(): Observable<Showreel[]> {
    return this.track(
      this.sb.from('showreel').select('*').eq('is_active', true).order('sort_order', { ascending: true })
    ).pipe(map((r) => (r.data as Showreel[]) ?? []));
  }
}
