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
  switchMap,
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
import { getTags, getFilteredNotes } from './notes.selectors';
import { DeleteNoteConfirmComponent } from '../../containers/delete-note-confirm/delete-note-confirm.component';
import { UpdateNoteFormComponent } from '../../containers/update-note-form/update-note-form.component';
import { getSidenavSelectedMenu } from '../sidenav/sidenav.selectors';
import { SidenavMenus } from '../sidenav';

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

  private menuActions = [
    sidenavActions.selectNotesMenu,
    sidenavActions.selectFavoritesMenu,
    sidenavActions.selectSharedMenu,
    sidenavActions.selectTrashMenu,
  ];

  private switchToNotesMenuOnSuccessActions = [
    notesActions.createNoteSuccess,
    notesActions.softDeleteNoteSuccess,
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

  switchToNotesMenuOnSuccessActions$ = createEffect(() =>
    this.action$.pipe(
      ofType(...this.switchToNotesMenuOnSuccessActions),
      switchMap(_ => {
        return [sidenavActions.selectNotesMenu()];
      })
    )
  );

  updateNote$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.updateNote),
      mergeMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(getTags)),
          map(([{ note, id }, tags]) => ({ id, note, tags }))
        )
      ),
      exhaustMap(({ id, note, tags: allTags }) => {
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

  openUpdateNoteFormModal$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(notesActions.openUpdateNoteFormModal),
        tap(action => {
          this.modalService.show(UpdateNoteFormComponent, {
            ignoreBackdropClick: true,
            focus: true,
            keyboard: false,
            class: 'modal-lg',
            initialState: {
              note: action.note,
            },
          });
        })
      ),
    { dispatch: false }
  );

  openDeleteConfirmModal$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(notesActions.openDeleteConfirmModal),
        tap(action => {
          this.modalService.show(DeleteNoteConfirmComponent, {
            ignoreBackdropClick: true,
            focus: true,
            keyboard: false,
            class: 'modal-sm',
            // take note that we pass the id of the current note
            // when opening the modal
            initialState: { id: action.id },
          });
        })
      ),
    { dispatch: false }
  );

  openLoadingSpinner$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(...this.openSpinnerActions),
        tap(() => this.store.dispatch(notesActions.openLoadingSpinner())),
        tap(() => this.spinnerService.show())
      ),
    { dispatch: false }
  );

  closeLoadingSpinner$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(...this.closeSpinnerActions),
        tap(() => this.store.dispatch(notesActions.closeLoadingSpinner())),
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

  selectMenu$ = createEffect(() =>
    this.action$.pipe(
      ofType(...this.menuActions),
      switchMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(getFilteredNotes)),
          map(([_, note]) => note[0])
        )
      ),
      // filter(note => !!note),
      // TODO: set the correct id
      map(note => notesActions.selectNoteWithTags({ id: note?.id }))
    )
  );

  selectNote$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.selectNoteWithTags),
      // filter(action => !!action.id),
      switchMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(getSidenavSelectedMenu)),
          map(([{ id }, selectedMenu]) => ({ id, selectedMenu }))
        )
      ),
      switchMap(({ id, selectedMenu }) => {
        // if no id specified, no need to do some server requests
        if (!id) {
          return of(notesActions.selectNoteWithTagsSuccess({ note: null }));
        }
        const note$ =
          selectedMenu === SidenavMenus.Shared
            ? this.notesService.getSharedNoteWithTags(id)
            : this.notesService.getNoteWithTags(id);
        return note$.pipe(
          map(note => notesActions.selectNoteWithTagsSuccess({ note })),
          catchError(error =>
            of(notesActions.selectNoteWithTagsError({ error }))
          )
        );
      })
    )
  );
}
