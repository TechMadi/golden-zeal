import { Injectable, InjectionToken, inject } from '@angular/core';
import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config/config';
import type { Database } from './models/database.types';

// Both the landing site and the CRM point at the same Supabase project, so by default
// they'd share the same auth storageKey — meaning any two tabs on the same origin
// (or / and /crm together in prod) race for the same navigator.locks lock and can
// throw "Acquiring an exclusive Navigator LockManager lock ... immediately failed".
// Each app provides its own auth config to give itself a distinct storageKey/behavior.
export const SUPABASE_AUTH_OPTIONS = new InjectionToken<SupabaseClientOptions<'public'>['auth']>(
  'SUPABASE_AUTH_OPTIONS'
);

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly authOptions = inject(SUPABASE_AUTH_OPTIONS, { optional: true });

  readonly client: SupabaseClient<Database> = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: this.authOptions ?? undefined,
  });
}
