import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import * as authActions from './auth.actions';
import { AuthService } from '../../../features/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthEffects {
  constructor(
    private action$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.action$.pipe(
      ofType(authActions.login),
      switchMap(_ =>
        from(this.authService.googleSignin()).pipe(
          map(user => authActions.loginSuccess({ user })),
          catchError(error =>
            of(authActions.loginError({ error: error.toString() }))
          )
        )
      ),
      tap(() => this.router.navigateByUrl('/notes'))
    )
  );

  logout$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(authActions.logout),
        tap(_ => this.router.navigateByUrl('/auth/login'))
      ),
    { dispatch: false }
  );
}
