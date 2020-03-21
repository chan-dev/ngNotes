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
import { ToastrService } from 'ngx-toastr';
import * as notesActions from './notes.actions';
import * as sidenavActions from '../sidenav/sidenav.actions';
import { NotesService } from '../../services/notes.service';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateNoteFormComponent } from '../../containers/create-note-form/create-note-form.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { TagsService } from '../../services/tags.service';
import { getTags } from './notes.selectors';

@Injectable({ providedIn: 'root' })
export class NotesEffects {
  private pathToCheck = '/notes';

  private openSpinnerActions = [
    notesActions.fetchNotes,
    notesActions.createNote,
    notesActions.updateNote,
    notesActions.softDeleteNote,
  ];

  private closeSpinnerActions = [
    notesActions.fetchNotesSuccess,
    notesActions.fetchNotesError,
    notesActions.createNoteSuccess,
    notesActions.createNoteError,
    notesActions.updateNoteSuccess,
    notesActions.updateNoteError,
    notesActions.softDeleteNoteSuccess,
    notesActions.softDeleteNoteError,
  ];

  private successToasterActions = [
    notesActions.createNoteSuccess,
    notesActions.updateNoteSuccess,
    notesActions.softDeleteNoteSuccess,
  ];

  private errorToasterActions = [
    notesActions.createNoteError,
    notesActions.updateNoteError,
    notesActions.softDeleteNoteError,
  ];

  constructor(
    private action$: Actions,
    private store: Store<any>,
    private spinnerService: NgxSpinnerService,
    private notesService: NotesService,
    private modalService: BsModalService,
    private tagsService: TagsService,
    private toaster: ToastrService
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

  setNewNoteAsActive$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.createNoteSuccess),
      map(action => {
        const { note } = action;
        return notesActions.selectNote({ id: note.id });
      })
    )
  );

  setNotesMenuAsActive$$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.createNoteSuccess),
      map(() => {
        return sidenavActions.selectNotesMenu();
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

  openCreateNoteFormModal$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(notesActions.openCreateNoteFormModal),
        tap(() =>
          this.modalService.show(CreateNoteFormComponent, {
            ignoreBackdropClick: true,
            focus: true,
            keyboard: false,
            class: 'modal-lg',
          })
        )
      ),
    { dispatch: false }
  );

  openLoadingSpinner$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(...this.openSpinnerActions),
        tap(() => this.spinnerService.show())
      ),
    { dispatch: false }
  );

  closeLoadingSpinner$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(...this.closeSpinnerActions),
        tap(() => this.spinnerService.hide())
      ),
    { dispatch: false }
  );

  // TODO: move to AppEffect
  // TODO: find a better approach
  showToasterSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(...this.successToasterActions),
        tap(() => this.store.dispatch(notesActions.showToasterSuccess())),
        tap(action => {
          let message: string;
          const { type } = action;

          if (type === notesActions.createNoteSuccess.type) {
            message = 'New note created';
          } else if (type === notesActions.updateNoteSuccess.type) {
            message = 'Note updated';
          } else {
            message = 'Note deleted';
          }
          this.toaster.success(message);
        })
      ),
    { dispatch: false }
  );

  showToasterError$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(...this.errorToasterActions),
        tap(() => this.store.dispatch(notesActions.showToasterError())),
        tap(action => {
          let message: string;
          const { type } = action;

          if (type === notesActions.createNoteError.type) {
            message = 'Create note failed';
          } else if (type === notesActions.updateNoteError.type) {
            message = 'Updating note failed';
          } else {
            message = 'Deleting note failed';
          }
          this.toaster.error(message);
        })
      ),
    { dispatch: false }
  );
}
