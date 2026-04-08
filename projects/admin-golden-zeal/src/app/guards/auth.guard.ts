import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from 'shared';
import { from, map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService).client;
  const router = inject(Router);

  return from(supabase.auth.getSession()).pipe(
    map(({ data }) => {
      if (data.session) return true;
      return router.createUrlTree(['/login']);
    })
  );
};
