import { createSelector } from '@ngrx/store';
import { getNotesFeatureState, NotesFeatureState } from '..';
import { Note } from '../../types/note';
import { SidenavMenus } from '../sidenav/sidenav.state';
import * as fromNotes from './notes.state';
import {
  getSidenavSelectedMenu,
  getSidenavSearchFilter,
} from '../sidenav/sidenav.selectors';

// notes selectors
export const getNotesState = createSelector(
  getNotesFeatureState,
  (state: NotesFeatureState) => state.notes
);

export const getAllNotes = createSelector(
  getNotesState,
  (state: fromNotes.NotesState) => state.items
);

export const getSharedNotes = createSelector(
  getNotesState,
  (state: fromNotes.NotesState) => state.sharedItems
);

export const getFilteredNotes = createSelector(
  getAllNotes,
  getSharedNotes,
  getSidenavSelectedMenu,
  getSidenavSearchFilter,
  (
    notes: Note[],
    sharedNotes: Note[],
    selectedMenu: SidenavMenus,
    filter: string
  ) => {
    return selectedMenu === SidenavMenus.Shared
      ? sharedNotes
      : notes
          .filter(note => {
            if (selectedMenu === SidenavMenus.Favorites) {
              return note.favorite && !note.deleted;
            }
            if (selectedMenu === SidenavMenus.Trash) {
              return note.deleted;
            }

            return !note.deleted;
          })
          .filter(note => {
            filter = filter.toLowerCase();
            return note.title.toLowerCase().startsWith(filter);
          });
  }
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

export const getSelectedNoteWithTags = createSelector(
  getNotesState,
  (state: fromNotes.NotesState) => state.selectedNote
);

// TODO: check if this is still needed
export const getSelectedNote = createSelector(
  getFilteredNotes,
  getSharedNotes,
  getSelectedNoteId,
  getSidenavSelectedMenu,
  // if there's no id, then set the first item as the default
  (
    notes: Note[],
    sharedNotes: Note[],
    id: string | null,
    selectedMenu: SidenavMenus
  ) => {
    if (id) {
      return selectedMenu === SidenavMenus.Shared
        ? sharedNotes.find(note => note.id === id)
        : notes.find(note => note.id === id);
    }
    return selectedMenu === SidenavMenus.Shared ? sharedNotes[0] : notes[0];
  }
);

// tags
export const getTags = createSelector(
  getNotesState,
  (state: fromNotes.NotesState) => state.tags
);
