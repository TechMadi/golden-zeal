import { SUPABASE_ANON_KEY, SUPABASE_URL } from 'shared';

export const environment = {
  production: true,
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_ANON_KEY,
  emailJs: {
    serviceId: 'YOUR_EMAILJS_SERVICE_ID',
    templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
  },
  posthogKey: import.meta.env?.['NG_APP_POSTHOG_PROJECT_TOKEN'] ?? '',
  posthogHost: import.meta.env?.['NG_APP_POSTHOG_HOST'] ?? '',
};
