import { SUPABASE_ANON_KEY, SUPABASE_URL } from 'shared';

export const environment = {
  production: false,
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_ANON_KEY,
  posthogKey: import.meta.env?.['NG_APP_POSTHOG_PROJECT_TOKEN'] ?? '',
  posthogHost: import.meta.env?.['NG_APP_POSTHOG_HOST'] ?? '',
};
