import { Injectable, inject } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from 'shared';
import type { SiteSetting, Showreel } from 'shared';

type Table = 'directors' | 'photographers' | 'projects' | 'project_stills' |
             'team_members' | 'regional_reps' | 'services' | 'faq' |
             'site_settings' | 'showreel';

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
    return from(promise) as Observable<T>;
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
