import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromSidenav from './sidenav';
import * as fromNotes from './notes';
import { Note } from '../models/note.model';

export interface NotesFeatureState {
  sidenav: fromSidenav.SidenavState;
  notes: fromNotes.NotesState;
}

export const reducers: ActionReducerMap<NotesFeatureState> = {
  sidenav: fromSidenav.reducer,
  notes: fromNotes.reducer,
};

export const getNotesFeatureState = createFeatureSelector('notes');

// sidenav selectors
export const getSidenavState = createSelector(
  getNotesFeatureState,
  (state: NotesFeatureState) => state.sidenav
);
export const getSidenavIsOpen = createSelector(
  getSidenavState,
  (state: fromSidenav.SidenavState) => state.isVisible
);

// notes selectors
export const getNotesState = createSelector(
  getNotesFeatureState,
  (state: NotesFeatureState) => state.notes
);

export const getAllNotes = createSelector(
  getNotesState,
  (state: fromNotes.NotesState) => state.items
);

export const getFavoritesNotes = createSelector(getAllNotes, (state: Note[]) =>
  state.filter(item => item.favorite)
);

export const getDeletedNotes = createSelector(getAllNotes, (state: Note[]) =>
  state.filter(item => item.deleted)
);

export const getNotesLoading = createSelector(
  getNotesState,
  (state: fromNotes.NotesState) => state.loading
);

export const getNotesError = createSelector(
  getNotesState,
  (state: fromNotes.NotesState) => state.error
);

export const getSelectedNoteId = createSelector(
  getNotesState,
  (state: fromNotes.NotesState) => state.selectedNoteId
);

export const getSelectedNote = createSelector(
  getAllNotes,
  getSelectedNoteId,
  // if there's no id, then set the first item as the default
  (notes: Note[], id: string | null) => {
    return id ? notes.find(note => note.id === id) : notes[0];
  }
);
