import { createReducer, on, Action } from '@ngrx/store';
import { NotesState } from './notes.state';
import * as notesActions from './notes.actions';

const initialState: NotesState = {
  items: [],
  sharedItems: [],
  tags: [],
  sharedTags: [],
  error: null,
  loading: false,
  selectedNoteId: null,
};

const featureReducer = createReducer(
  initialState,
  on(notesActions.fetchNotes, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    notesActions.fetchNotesSuccess,
    (state, { items, sharedItems, tags, sharedTags }) => ({
      ...state,
      items,
      tags,
      sharedItems,
      sharedTags,
      loading: false,
      error: null,
    })
  ),
  on(notesActions.fetchNotesError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(notesActions.createNote, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(notesActions.createNoteSuccess, (state, { note }) => ({
    ...state,
    items: [...state.items, note],
    loading: false,
    error: null,
  })),
  on(notesActions.createNoteError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(notesActions.updateNote, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(notesActions.updateNoteSuccess, (state, { note }) => ({
    ...state,
    items: state.items.map(item => (item.id === note.id ? note : item)),
    loading: false,
    error: null,
  })),
  on(notesActions.updateNoteError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(notesActions.softDeleteNote, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(notesActions.softDeleteNoteSuccess, (state, { note }) => ({
    ...state,
    // NOTE: we aren't really deleting an item,
    items: state.items.map(item => (item.id === note.id ? note : item)),
    loading: false,
    error: null,
  })),
  on(notesActions.softDeleteNoteError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(notesActions.selectNote, (state, { id }) => ({
    ...state,
    selectedNoteId: id,
    error: null,
    loading: false,
  })),
  on(notesActions.shareNote, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(notesActions.shareNoteSuccess, (state, { sharedNote }) => ({
    ...state,
    sharedItems: state.sharedItems.map(item =>
      item.id === sharedNote.id ? sharedNote : item
    ),
    loading: false,
    error: null,
  })),
  on(notesActions.shareNoteError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(notesActions.fetchTagsSuccess, (state, { tags }) => ({
    ...state,
    tags: [...state.tags, ...tags],
    loading: false,
    error: null,
  })),
  on(notesActions.fetchTagsError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(notesActions.fetchSharedTagsSuccess, (state, { sharedTags }) => ({
    ...state,
    sharedTags: [...state.sharedTags, ...sharedTags],
    loading: false,
    error: null,
  })),
  on(notesActions.fetchSharedTagsError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(notesActions.syncSharedNote, (state, { updatedNotes }) => ({
    ...state,
    sharedItems: state.sharedItems.map(item => {
      const match = updatedNotes.find(
        updatedNote => updatedNote.id === item.id
      );
      return match ? { ...item, ...match } : item;
    }),
  }))
);

export function reducer(state: NotesState, action: Action) {
  return featureReducer(state, action);
}
