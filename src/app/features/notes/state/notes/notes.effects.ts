import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, combineLatest, from, defer } from 'rxjs';
import {
  exhaustMap,
  catchError,
  map,
  tap,
  filter,
  withLatestFrom,
  mergeMap,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as notesActions from './notes.actions';
import { NotesService } from '../../services/notes.service';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { NoteFormData } from '../../types/note';
import { TagsService } from '../../services/tags.service';
import { getTags } from '..';

@Injectable({ providedIn: 'root' })
export class NotesEffects {
  private pathToCheck = '/notes';

  constructor(
    private action$: Actions,
    private store: Store<any>,
    private notesService: NotesService
    private tagsService: TagsService
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
          this.tagsService.getTags(),
        ]).pipe(
          map(([notes, sharedNotes, tags]) => {
            return notesActions.fetchNotesSuccess({
              items: notes,
              sharedItems: sharedNotes,
              tags,
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
      mergeMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(getTags)),
          map(([{ note }, tags]) => ({ note, tags }))
        )
      ),
      exhaustMap(({ note, tags: allTags }) => {
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
