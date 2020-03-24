import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import { getIsUserLoggedIn } from '../../../core/state/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  private redirectTo = '/notes';
  constructor(private store: Store<any>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(getIsUserLoggedIn).pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          this.router.navigateByUrl(this.redirectTo);
          return false;
        }
        return true;
      }),
      take(1)
    );
  }
}
