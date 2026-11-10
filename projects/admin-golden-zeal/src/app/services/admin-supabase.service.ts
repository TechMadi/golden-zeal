import { Injectable, inject } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from 'shared';
import type { SiteSetting, Showreel, ProjectCredit } from 'shared';

type Table = 'projects' | 'project_stills' |
             'project_credits' | 'team_members' | 'regional_reps' | 'services' |
             'faq' | 'site_settings' | 'showreel' | 'credit_roles' | 'partners';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class AdminSupabaseService {
  // Untyped client — this service does dynamic generic CRUD across all tables,
  // which can't be expressed in the per-table strict SupabaseClient<Database> types.
  // The typed client is used in ContentService (public-facing main site).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly sb: any = inject(SupabaseService).client;

  private q<T>(promise: Promise<AnyRecord>): Observable<T> {
    return (from(promise) as Observable<AnyRecord>).pipe(
      map((r) => {
        if (r['error']) throw new Error(r['error'].message ?? JSON.stringify(r['error']));
        return r as T;
      })
    );
  }

  // ── Generic CRUD ───────────────────────────────────────────
  list<T>(table: Table, orderBy = 'display_order'): Observable<T[]> {
    const promise = orderBy === 'key'
      ? this.sb.from(table).select('*')
      : this.sb.from(table).select('*').order(orderBy, { ascending: true });
    return this.q<AnyRecord>(promise).pipe(map((r: AnyRecord) => (r['data'] as T[]) ?? []));
  }

  get<T>(table: Table, id: string): Observable<T | null> {
    return this.q<AnyRecord>(
      this.sb.from(table).select('*').eq('id', id).single()
    ).pipe(map((r: AnyRecord) => (r['data'] as T) ?? null));
  }

  create<T>(table: Table, data: Partial<T>): Observable<T> {
    return this.q<AnyRecord>(
      this.sb.from(table).insert(data).select().single()
    ).pipe(map((r: AnyRecord) => r['data'] as T));
  }

  update<T>(table: Table, id: string, data: Partial<T>): Observable<T> {
    return this.q<AnyRecord>(
      this.sb.from(table).update(data).eq('id', id).select().single()
    ).pipe(map((r: AnyRecord) => r['data'] as T));
  }

  delete(table: Table, id: string): Observable<void> {
    return this.q<AnyRecord>(
      this.sb.from(table).delete().eq('id', id)
    ).pipe(map(() => undefined));
  }

  // ── Project credits ────────────────────────────────────────
  // Keep existing credits in sync when a credit role is renamed.
  renameCreditRole(from: string, to: string): Observable<void> {
    return this.q<AnyRecord>(
      this.sb.from('project_credits').update({ role: to }).eq('role', from)
    ).pipe(map(() => undefined));
  }

  listCredits(projectId: string): Observable<ProjectCredit[]> {
    return this.q<AnyRecord>(
      this.sb.from('project_credits')
        .select('*, team_member:team_members(id,name,slug)')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true })
    ).pipe(map((r: AnyRecord) => (r['data'] as ProjectCredit[]) ?? []));
  }

  // ── Project ↔ partner links ────────────────────────────────
  // Same join table behind the partner form's "Projects together" and the project form's "Partners".
  listPartnerIdsForProject(projectId: string): Observable<string[]> {
    return this.q<AnyRecord>(
      this.sb.from('project_partners').select('partner_id').eq('project_id', projectId)
    ).pipe(map((r: AnyRecord) => ((r['data'] as { partner_id: string }[]) ?? []).map((x) => x.partner_id)));
  }

  listProjectIdsForPartner(partnerId: string): Observable<string[]> {
    return this.q<AnyRecord>(
      this.sb.from('project_partners').select('project_id').eq('partner_id', partnerId)
    ).pipe(map((r: AnyRecord) => ((r['data'] as { project_id: string }[]) ?? []).map((x) => x.project_id)));
  }

  // Number of linked projects per partner id, for the partners list.
  countProjectsPerPartner(): Observable<Record<string, number>> {
    return this.q<AnyRecord>(
      this.sb.from('project_partners').select('partner_id')
    ).pipe(map((r: AnyRecord) => {
      const counts: Record<string, number> = {};
      for (const row of (r['data'] as { partner_id: string }[]) ?? []) {
        counts[row.partner_id] = (counts[row.partner_id] ?? 0) + 1;
      }
      return counts;
    }));
  }

  linkProjectPartner(projectId: string, partnerId: string): Observable<void> {
    return this.q<AnyRecord>(
      this.sb.from('project_partners')
        .upsert({ project_id: projectId, partner_id: partnerId }, { ignoreDuplicates: true })
    ).pipe(map(() => undefined));
  }

  unlinkProjectPartner(projectId: string, partnerId: string): Observable<void> {
    return this.q<AnyRecord>(
      this.sb.from('project_partners').delete().eq('project_id', projectId).eq('partner_id', partnerId)
    ).pipe(map(() => undefined));
  }

  // ── Site settings (key-value) ──────────────────────────────
  getSetting(key: string): Observable<string> {
    return this.q<AnyRecord>(
      this.sb.from('site_settings').select('value').eq('key', key).single()
    ).pipe(map((r: AnyRecord) => (r['data'] as SiteSetting)?.value ?? ''));
  }

  upsertSetting(key: string, value: string): Observable<void> {
    return this.q<AnyRecord>(
      this.sb.from('site_settings').upsert({ key, value })
    ).pipe(map(() => undefined));
  }

  // ── Image upload ───────────────────────────────────────────
  async uploadImage(bucket: string, path: string, file: File): Promise<string> {
    const { data, error } = await this.sb.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = this.sb.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  }

  // ── Auth ───────────────────────────────────────────────────
  signIn(email: string, password: string) {
    return from(this.sb.auth.signInWithPassword({ email, password })) as Observable<AnyRecord>;
  }

  signOut() {
    return from(this.sb.auth.signOut()) as Observable<AnyRecord>;
  }

  getSession() {
    return from(this.sb.auth.getSession()) as Observable<AnyRecord>;
  }
}
