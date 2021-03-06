import { createAction, props } from '@ngrx/store';
import { Note, NoteFormData, Tag, NoteWithFetchedTags } from '../../types/note';

export const fetchNotes = createAction('[Route Navigation] Fetch Notes');
export const fetchNotesSuccess = createAction(
  '[Notes Service] Fetch Success',
  props<{
    items: Note[];
    sharedItems: Note[];
    tags: Tag[];
    sharedTags: Tag[];
  }>()
);
export const fetchNotesError = createAction(
  '[Notes Service] Fetch Error',
  props<{ error: string }>()
);

export const createNote = createAction(
  '[CreateNoteForm component] Create Note',
  props<{ note: NoteFormData }>()
);
export const createNoteSuccess = createAction(
  '[Notes Service] Create Note Success',
  props<{ note: Note }>()
);
export const createNoteError = createAction(
  '[Notes Service] Create Note Error',
  props<{ error: string }>()
);
export const updateNote = createAction(
  '[UpdateNoteForm Component] Update Note',
  props<{ id: string; note: NoteFormData }>()
);
export const updateNoteSuccess = createAction(
  '[Notes Service] Update Note Success',
  props<{ note: Note }>()
);
export const updateNoteError = createAction(
  '[Notes Service] Update Note Error',
  props<{ error: string }>()
);
export const softDeleteNote = createAction(
  '[DeleteNoteConfirm component] Soft Delete Note',
  props<{ note: NoteWithFetchedTags }>()
);
export const softDeleteNoteSuccess = createAction(
  '[Notes Service] Soft Delete Note Success',
  props<{ note: Note }>()
);
export const softDeleteNoteError = createAction(
  '[Notes Service] Soft Delete Note Error',
  props<{ error: string }>()
);
export const openCreateNoteFormModal = createAction(
  '[CurrentNoteContainer component] Open Create Note Form'
);
export const openUpdateNoteFormModal = createAction(
  '[CurrentNoteContainer component] Open Update Note Form',
  props<{ note: NoteWithFetchedTags }>()
);

export const openDeleteConfirmModal = createAction(
  '[CurrentNoteContainer component] Open Delete Confirm',
  props<{ note: NoteWithFetchedTags }>()
);
export const openShareNoteFormModal = createAction(
  '[CurrentNoteContainer component] Open ShareNoteFormModal',
  props<{ note: NoteWithFetchedTags }>()
);
// TODO: should we move it to AppEffects since it's global
export const openLoadingSpinner = createAction('[App] Open Loading Spinner');
export const closeLoadingSpinner = createAction('[App] Close Loading Spinner');

export const selectNote = createAction(
  '[SidenavContainerComponent] Select Note',
  props<{ id: string | null }>()
);
export const selectNoteWithTags = createAction(
  '[Notes Service] Select Note With Tags',
  props<{ id: string | null }>()
);
export const selectNoteWithTagsSuccess = createAction(
  '[Notes Service] Select Note With Tags Success',
  props<{ note: NoteWithFetchedTags }>()
);

export const selectNoteWithTagsError = createAction(
  '[Notes Service] Select Note With Tags Error',
  props<{ error: string }>()
);

// TODO: move to AppEffects since it's global
export const showToasterSuccess = createAction('[App] Show Toaster Succcess');
export const showToasterError = createAction('[App] Show Toaster Error');

export const shareNote = createAction(
  '[Test Component] Share Note',
  props<{ note: NoteWithFetchedTags; receiverId: string }>()
);
export const shareNoteSuccess = createAction(
  '[Notes Service] Share Note Success',
  props<{ sharedNote: Note }>()
);
export const shareNoteError = createAction(
  '[Notes Service] Share Note Error',
  props<{ error: string }>()
);
export const syncSharedNote = createAction(
  '[AngularFire StateChange API] Sync Shared Note',
  props<{ updatedNotes: Note[] }>()
);

export const fetchTags = createAction(
  '[Notes Service] Fetch Tags',
  props<{ tagIds: string[] }>()
);
export const fetchTagsSuccess = createAction(
  '[Notes Service] Fetch Tags Success',
  props<{ tags: Tag[] }>()
);
export const fetchTagsError = createAction(
  '[Notes Service] Fetch Tags Error',
  props<{ error: string }>()
);
export const fetchSharedTags = createAction(
  '[Notes Service] Fetch Shared Tags',
  props<{ tagIds: string[] }>()
);
export const fetchSharedTagsSuccess = createAction(
  '[Notes Service] Fetch Shared Tags Success',
  props<{ sharedTags: Tag[] }>()
);
export const fetchSharedTagsError = createAction(
  '[Notes Service] Fetch Shared Tags Error',
  props<{ error: string }>()
);
