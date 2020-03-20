import { createAction, props } from '@ngrx/store';
import { Note, NoteFormData, Tag } from '../../types/note';

// actions for items slice
export const fetchNotes = createAction('[Route Navigation] Fetch Notes');
export const fetchNotesSuccess = createAction(
  '[Notes Api] Fetch Success',
  props<{ items: Note[]; sharedItems: Note[] }>()
);
export const fetchNotesError = createAction(
  '[Notes Api] Fetch Error',
  props<{ error: string }>()
);

// TODO: replace action source
export const createNote = createAction(
  '[Test Component] Create Note',
  props<{ note: NoteFormData; allTags: Tag[] }>()
);
export const createNoteSuccess = createAction(
  '[Test Component] Create Note Success',
  props<{ note: Note }>()
);
export const createNoteError = createAction(
  '[Test Component] Create Note Error',
  props<{ error: string }>()
);
export const updateNote = createAction(
  '[Test Component] Update Note',
  props<{ id: string; note: NoteFormData; allTags: Tag[] }>()
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
// actions for selectedNoteId slice
// TODO: replace with correct component
// move to sidenav actions
export const selectNote = createAction(
  '[SidenavContainerComponent] Selected Note',
  props<{ id: string | null }>()
);
