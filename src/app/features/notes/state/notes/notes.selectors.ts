import { createSelector } from '@ngrx/store';
import { getNotesFeatureState, NotesFeatureState } from '..';
import { Note, Tag, NoteWithFetchedTags } from '../../types/note';
import { SidenavMenus } from '../sidenav/sidenav.state';
import * as fromNotes from './notes.state';
import {
  getSidenavSelectedMenu,
  getSidenavSearchFilter,
} from '../sidenav/sidenav.selectors';
import { getUserLoggedIn } from '@core/state/auth/auth.selectors';

import { User } from '@app/features/auth/types/user';

// notes selectors
export const getNotesState = createSelector(
  getNotesFeatureState,
  (state: NotesFeatureState) => state.notes
);

// tags
export const getTags = createSelector(
  getNotesState,
  (state: fromNotes.NotesState) => state.tags
);

export const getAllNotes = createSelector(
  getNotesState,
  // sort in descending order
  (state: fromNotes.NotesState) =>
    state.items.sort((a, b) => Number(b.created_at) - Number(a.created_at))
);

export const getSharedNotes = createSelector(
  getNotesState,
  // sort in descending order
  (state: fromNotes.NotesState) => {
    console.log({ sharedNotes: state.sharedItems });
    return state.sharedItems.sort(
      (a, b) => Number(b.created_at) - Number(a.created_at)
    );
  }
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
    const filteredNotes =
      selectedMenu === SidenavMenus.Shared
        ? sharedNotes.filter(note => {
            return !note.deleted;
          })
        : notes.filter(note => {
            if (selectedMenu === SidenavMenus.Favorites) {
              return note.favorite && !note.deleted;
            }
            if (selectedMenu === SidenavMenus.Trash) {
              return note.deleted;
            }

            return !note.deleted;
          });

    return filteredNotes.filter(note => {
      filter = filter.toLowerCase();
      return note.title.toLowerCase().startsWith(filter);
    });
  }
);

export const getFilteredNotesWithTags = createSelector(
  getFilteredNotes,
  getTags,
  (notes: Note[], tags: Tag[]) => {
    return notes.map(note => {
      const tagIds = Object.keys(note.tags);
      const noteTags = tagIds.map(id => tags.find(tag => tag.id === id));
      return {
        ...note,
        tags: noteTags,
      } as NoteWithFetchedTags;
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

export const getOwnedTags = createSelector(
  getTags,
  getUserLoggedIn,
  (tags: Tag[], user: User) => tags.filter(tag => tag.authorId === user.id)
);

export const getSelectedNoteWithTags = createSelector(
  getFilteredNotesWithTags,
  getSelectedNoteId,
  // if there's no id, then set the first item as the default
  (notes: NoteWithFetchedTags[], id: string | null) => {
    if (id) {
      return notes.find(note => note.id === id);
    }
    return notes[0];
  }
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
