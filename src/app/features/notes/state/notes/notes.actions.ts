import { createAction, props } from '@ngrx/store';
import { Note } from '../../models/note.model';

// actions for items slice
export const fetchNotes = createAction('[Route Navigation] Fetch Notes');
export const fetchNotesSuccess = createAction(
  '[Notes Api] Fetch Success',
  props<{ items: Note[] }>()
);
export const fetchNotesError = createAction(
  '[Notes Api] Fetch Error',
  props<{ error: string }>()
);

// actions for selectedNoteId slice
// TODO: replace with correct component
export const selectNote = createAction(
  '[SidenavContainerComponent] Selected Note',
  props<{ id: string }>()
);
