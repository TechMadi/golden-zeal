// Type declarations for Angular build environment variables accessed via import.meta.env
// env is optional because it may be undefined in SSR/prerendering contexts
interface ImportMeta {
  readonly env?: Record<string, string | undefined>;
}
