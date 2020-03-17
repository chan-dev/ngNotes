import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, combineLatest } from 'rxjs';
import { exhaustMap, catchError, map, tap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as notesActions from './notes.actions';
import { NotesService } from '../../services/notes.service';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';

@Injectable({ providedIn: 'root' })
export class NotesEffects {
  private pathToCheck = '/notes';

  constructor(
    private action$: Actions,
    private store: Store<any>,
    private notesService: NotesService
  ) {}

  // during the navigation to /notes, dispatch the load action
  fetchNotesEffect$ = createEffect(() =>
    this.action$.pipe(
      ofType<RouterNavigationAction>(ROUTER_NAVIGATION),
      filter(action => {
        console.log({ action });
        return action.payload.routerState.url.includes(this.pathToCheck);
      }),
      tap(() => this.store.dispatch(notesActions.fetchNotes())),
      exhaustMap(() =>
        combineLatest([
          this.notesService.getNotes(),
          this.notesService.getSharedNotes(),
        ]).pipe(
          map(([notes, sharedNotes]) => {
            console.log({ notes, sharedNotes });
            return notesActions.fetchNotesSuccess({
              items: notes,
              sharedItems: sharedNotes,
            });
          }),
          catchError(error => of(notesActions.fetchNotesError({ error })))
        )
      )
    )
  );
}
