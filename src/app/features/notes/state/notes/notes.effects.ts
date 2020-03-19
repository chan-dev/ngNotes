import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, combineLatest, from, defer } from 'rxjs';
import { exhaustMap, catchError, map, tap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as notesActions from './notes.actions';
import { NotesService } from '../../services/notes.service';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { NoteFormData } from '../../models/note';

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

  createNote$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.createNote),
      exhaustMap(action => {
        const { note, allTags } = action;

        const newNote$ = defer(() =>
          from(this.notesService.saveNote(note, allTags))
        );
        return newNote$.pipe(
          map(newNote => notesActions.createNoteSuccess({ note: newNote })),
          catchError(error => of(notesActions.createNoteError({ error })))
        );
      })
    )
  );

  updateNote$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.updateNote),
      exhaustMap(action => {
        const { id, note, allTags } = action;

        const updatedNote$ = defer(() =>
          from(this.notesService.updateNote(id, note, allTags))
        );
        return updatedNote$.pipe(
          map(updatedNote =>
            notesActions.updateNoteSuccess({ note: updatedNote })
          ),
          catchError(error => of(notesActions.updateNoteError({ error })))
        );
      })
    )
  );

  softDeleteNote$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.softDeleteNote),
      exhaustMap(action => {
        const { id } = action;

        const deleteNoteId$ = defer(() =>
          from(this.notesService.softDeleteNote(id))
        );
        return deleteNoteId$.pipe(
          map(() => notesActions.softDeleteNoteSuccess({ id })),
          catchError(error => of(notesActions.softDeleteNoteError({ error })))
        );
      })
    )
  );
}
