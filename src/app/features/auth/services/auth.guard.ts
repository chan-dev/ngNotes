import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { map, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getIsUserLoggedIn } from '@core/state/auth/auth.selectors';
import * as noteActions from '@app/features/notes/state/notes/notes.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private redirectTo = '/auth/login';
  constructor(private router: Router, private store: Store<any>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(getIsUserLoggedIn).pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigateByUrl(this.redirectTo);
          return false;
        }
        return true;
      }),
      tap(isLoggedIn => {
        if (isLoggedIn) {
          this.store.dispatch(noteActions.fetchNotes());
        }
      }),
      take(1)
    );
  }
}
