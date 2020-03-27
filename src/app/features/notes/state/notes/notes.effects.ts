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
  take,
  toArray,
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
import {
  getTags,
  getFilteredNotes,
  getFilteredNotesWithTags,
} from './notes.selectors';
import { DeleteNoteConfirmComponent } from '../../containers/delete-note-confirm/delete-note-confirm.component';
import { UpdateNoteFormComponent } from '../../containers/update-note-form/update-note-form.component';
import { getSidenavSelectedMenu } from '../sidenav/sidenav.selectors';
import * as authActions from '@core/state/auth/auth.actions';
import { SidenavMenus } from '../sidenav';
import { getUserLoggedIn } from '@core/state/auth/auth.selectors';
import { UsersService } from '../../services/users.service';
import { ShareNoteFormComponent } from '../../containers/share-note-form/share-note-form.component';

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
    notesActions.shareNoteSuccess,
  ];

  private errorToasterActions = [
    notesActions.createNoteError,
    notesActions.updateNoteError,
    notesActions.softDeleteNoteError,
    notesActions.shareNoteError,
  ];

  private switchToNotesMenuOnSuccessActions = [
    notesActions.createNoteSuccess,
    notesActions.softDeleteNoteSuccess,
  ];

  private menuActions = [
    sidenavActions.selectNotesMenu,
    sidenavActions.selectFavoritesMenu,
    sidenavActions.selectSharedMenu,
    sidenavActions.selectTrashMenu,
  ];

  constructor(
    private action$: Actions,
    private store: Store<any>,
    private spinnerService: NgxSpinnerService,
    private notesService: NotesService,
    private modalService: BsModalService,
    private tagsService: TagsService,
    private toaster: ToastrService,
    private usersService: UsersService
  ) {}

  // during the navigation to /notes, dispatch the load action
  fetchNotesEffect$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.fetchNotes),
      switchMap(action =>
        of(action).pipe(withLatestFrom(this.store.select(getUserLoggedIn)))
      ),
      switchMap(([action, user]) =>
        combineLatest([
          this.notesService.getNotes(user.uid),
          this.notesService.getSharedNotes(user.uid),
          this.tagsService.getTags(user.uid),
        ]).pipe(
          tap(() => console.log('fetch notes effect executes again')),
          // take(1),
          switchMap(([notes, sharedNotes, tags]) => {
            return [
              notesActions.fetchNotesSuccess({
                items: notes,
                sharedItems: sharedNotes,
                tags,
              }),
              sidenavActions.selectNotesMenu(),
            ];
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
          withLatestFrom(
            this.store.select(getTags),
            this.store.select(getUserLoggedIn)
          ),
          map(([{ note }, tags, user]) => ({ note, tags, user }))
        )
      ),
      exhaustMap(({ note, tags: allTags, user }) => {
        const newNote$ = defer(() =>
          from(this.notesService.saveNote(user.uid, note, allTags))
        );
        return newNote$.pipe(
          map(newNote => notesActions.createNoteSuccess({ note: newNote })),
          catchError(error => of(notesActions.createNoteError({ error })))
        );
      })
    )
  );

  // when creating a note, a side effect is it creates tags in firebase
  // behind the scenes, so we need to intercept it
  // to update the state on our store
  fetchCreatedTagsOnCreate$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.createNoteSuccess),
      switchMap(({ note }) => {
        const tagIds = Object.keys(note.tags);
        return from(tagIds)
          .pipe(
            mergeMap(tagId => this.tagsService.getTag(tagId)),
            take(tagIds.length),
            toArray()
          )
          .pipe(
            map(tags => notesActions.fetchTagsSuccess({ tags })),
            catchError(error => of(notesActions.fetchTagsError({ error })))
          );
      })
    )
  );

  setDefaultNoteOnDelete$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.softDeleteNoteSuccess),
      map(_ => notesActions.selectNote({ id: null }))
    )
  );

  // TODO: check this one if this still needed?
  switchToNotesMenuOnSuccessActions$ = createEffect(() =>
    this.action$.pipe(
      ofType(...this.switchToNotesMenuOnSuccessActions),
      map(_ => {
        return sidenavActions.selectNotesMenu();
      })
    )
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
      map(note => notesActions.selectNote({ id: note?.id }))
    )
  );

  updateNote$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.updateNote),
      mergeMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.select(getTags),
            this.store.select(getUserLoggedIn)
          ),
          map(([{ note, id }, tags, user]) => ({ id, note, tags, user }))
        )
      ),
      exhaustMap(({ id, note, tags: allTags, user }) => {
        const updatedNote$ = defer(() =>
          from(this.notesService.updateNote(user.uid, id, note, allTags))
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

  shareNote$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.shareNote),
      switchMap(action => {
        const { note, receiverId } = action;

        const sharedNote$ = defer(() =>
          from(this.notesService.saveSharedNotes(note, receiverId))
        );
        return sharedNote$.pipe(
          map(sharedNote => notesActions.shareNoteSuccess({ sharedNote })),
          catchError(error =>
            of(notesActions.shareNoteError({ error: error.toString() }))
          )
        );
      })
    )
  );

  softDeleteNote$ = createEffect(() =>
    this.action$.pipe(
      ofType(notesActions.softDeleteNote),
      exhaustMap(action => {
        const { note } = action;

        const deleteNoteId$ = defer(() =>
          from(this.notesService.softDeleteNote(note))
        );
        return deleteNoteId$.pipe(
          map(softDeletedNote =>
            notesActions.softDeleteNoteSuccess({ note: softDeletedNote })
          ),
          catchError(error => of(notesActions.softDeleteNoteError({ error })))
        );
      })
    )
  );

  openCreateNoteFormModal$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(notesActions.openCreateNoteFormModal),
        switchMap(action =>
          of(action).pipe(
            withLatestFrom(this.store.select(getTags)),
            map(([_, allTags]) => allTags)
          )
        ),
        tap(allTags =>
          this.modalService.show(CreateNoteFormComponent, {
            ignoreBackdropClick: true,
            focus: true,
            keyboard: false,
            class: 'modal-lg',
            initialState: {
              allTags,
            },
          })
        )
      ),
    { dispatch: false }
  );

  openUpdateNoteFormModal$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(notesActions.openUpdateNoteFormModal),
        switchMap(action =>
          of(action).pipe(
            withLatestFrom(this.store.select(getTags)),
            map(([{ note }, allTags]) => ({ note, allTags }))
          )
        ),
        tap(({ note, allTags }) => {
          this.modalService.show(UpdateNoteFormComponent, {
            ignoreBackdropClick: true,
            focus: true,
            keyboard: false,
            class: 'modal-lg',
            initialState: {
              note,
              allTags,
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
            initialState: { note: action.note },
          });
        })
      ),
    { dispatch: false }
  );

  openShareNoteModal$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(notesActions.openShareNoteFormModal),
        tap(() => console.log('opening shared modal')),
        switchMap(action =>
          combineLatest([of(action), this.usersService.getUsers()]).pipe(
            tap(([{ note }, users]) =>
              this.modalService.show(ShareNoteFormComponent, {
                ignoreBackdropClick: true,
                focus: true,
                keyboard: false,
                class: 'modal-sm',
                initialState: {
                  note,
                  users,
                },
              })
            )
          )
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
        // tap(() => this.store.dispatch(notesActions.showToasterSuccess())),
        tap(action => {
          let message: string;
          const { type } = action;

          if (type === notesActions.createNoteSuccess.type) {
            message = 'New note created';
          } else if (type === notesActions.updateNoteSuccess.type) {
            message = 'Note updated';
          } else if (type === notesActions.shareNoteSuccess.type) {
            message = 'Note shared';
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
        // tap(() => this.store.dispatch(notesActions.showToasterError())),
        tap(action => {
          let message: string;
          const { type } = action;

          if (type === notesActions.createNoteError.type) {
            message = 'Create note failed';
          } else if (type === notesActions.updateNoteError.type) {
            message = 'Updating note failed';
          } else if (type === notesActions.shareNoteError.type) {
            message = 'Sharing note failed';
          } else {
            message = 'Deleting note failed';
          }
          this.toaster.error(message);
        })
      ),
    { dispatch: false }
  );
  syncSharedNote$ = createEffect(() =>
    this.notesService.getNotesStateChanges().pipe(
      tap(notes => console.log({ updatedNotes: notes })),
      map(notes =>
        notesActions.syncSharedNote({
          updatedNotes: notes,
        })
      ),
      tap(() => {
        //     // this.store.dispatch(sidenavActions.selectSharedMenu());
        //     this.store.dispatch(notesActions.selectNoteWithTags({ id: null }));
        //   if (notes.updatedNotes[0].deleted) {
      })
    )
  );
}
