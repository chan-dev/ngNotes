import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { exhaustMap, catchError, map, tap, filter } from 'rxjs/operators';

import * as sidenavActions from './sidenav.actions';

@Injectable({ providedIn: 'root' })
export class SidenavEffects {
  constructor(
    private action$: Actions,
    private store: Store<any>,
    private breakpoint: BreakpointObserver
  ) {}

  toggleSidenav$ = createEffect(() =>
    this.breakpoint.observe(['(min-width: 500px)']).pipe(
      map((state: BreakpointState) => {
        return sidenavActions.setSidenav({
          isMobile: !state.matches,
        });
      })
    )
  );
}
