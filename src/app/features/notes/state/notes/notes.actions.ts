import { createAction, props } from '@ngrx/store';
import { Note, NoteFormData, Tag, NoteWithFetchedTags } from '../../types/note';

// actions for items slice
export const fetchNotes = createAction('[Route Navigation] Fetch Notes');
export const fetchNotesSuccess = createAction(
  '[Notes Api] Fetch Success',
  props<{ items: Note[]; sharedItems: Note[]; tags: Tag[] }>()
);
export const fetchNotesError = createAction(
  '[Notes Api] Fetch Error',
  props<{ error: string }>()
);

// TODO: replace action source
export const createNote = createAction(
  '[CreateNoteForm component] Create Note',
  props<{ note: NoteFormData }>()
);
export const createNoteSuccess = createAction(
  '[Notes Api] Create Note Success',
  props<{ note: Note }>()
);
export const createNoteError = createAction(
  '[Notes Api] Create Note Error',
  props<{ error: string }>()
);
export const updateNote = createAction(
  '[Test Component] Update Note',
  props<{ id: string; note: NoteFormData }>()
);
export const updateNoteSuccess = createAction(
  '[Test Component] Update Note Success',
  props<{ note: Note }>()
);
export const updateNoteError = createAction(
  '[Test Component] Update Note Error',
  props<{ error: string }>()
);
export const softDeleteNote = createAction(
  '[Test Component] Soft Delete Note',
  props<{ id: string }>()
);
export const softDeleteNoteSuccess = createAction(
  '[Test Component] Soft Delete Note Success',
  props<{ id: string }>()
);
export const softDeleteNoteError = createAction(
  '[Test Component] Soft Delete Note Error',
  props<{ error: string }>()
);
export const openCreateNoteFormModal = createAction(
  '[CurrentNoteContainer component] Open Create Note Form'
);
export const openUpdateNoteFormModal = createAction(
  '[CurrentNoteContainer component] Open Update Note Form',
  props<{ note: NoteWithFetchedTags }>()
);
// TODO: rename event source
export const openDeleteConfirmModal = createAction(
  '[CurrentNoteContainer component] Open Delete Confirm',
  props<{ id: string }>()
);
// TODO: should we move it to AppEffects since it's global
export const openLoadingSpinner = createAction('[App] Open Loading Spinner');
export const closeLoadingSpinner = createAction('[App] Close Loading Spinner');
// actions for selectedNoteId slice
// TODO: replace with correct component
// move to sidenav actions
export const selectNote = createAction(
  '[SidenavContainerComponent] Selected Note',
  props<{ id: string | null }>()
);
// TODO: tentative solution for now before re-write
export const selectNoteWithTags = createAction(
  '[Notes Api] Select Note With Tags',
  props<{ id: string | null }>()
);
export const selectNoteWithTagsSuccess = createAction(
  '[Notes Api] Select Note With Tags Success',
  props<{ note: NoteWithFetchedTags }>()
);

export const selectNoteWithTagsError = createAction(
  '[Notes Api] Select Note With Tags Error',
  props<{ error: string }>()
);

// TODO: move to AppEffects since it's global
export const showToasterSuccess = createAction('[App] Show Toaster Succcess');
export const showToasterError = createAction('[App] Show Toaster Error');
