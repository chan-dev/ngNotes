import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

import * as sidenavActions from './sidenav.actions';

@Injectable({ providedIn: 'root' })
export class SidenavEffects {
  constructor(private breakpoint: BreakpointObserver) {}

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
