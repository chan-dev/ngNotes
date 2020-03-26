import { createReducer, on, Action } from '@ngrx/store';
import { NotesState } from './notes.state';
import * as notesActions from './notes.actions';

const initialState: NotesState = {
  items: [],
  sharedItems: [],
  tags: [],
  error: null,
  loading: false,
  selectedNoteId: null,
  selectedNote: null,
};

const featureReducer = createReducer(
  initialState,
  on(notesActions.fetchNotes, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(notesActions.fetchNotesSuccess, (state, { items, sharedItems, tags }) => ({
    ...state,
    items,
    tags,
    sharedItems,
    loading: false,
    error: null,
  })),
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
  on(notesActions.softDeleteNoteSuccess, (state, { id }) => ({
    ...state,
    // NOTE: we aren't really deleting an item,
    // items: state.items.filter(item => item.id !== id),
    loading: false,
    error: null,
  })),
  on(notesActions.softDeleteNoteError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(notesActions.selectNoteWithTags, (state, { id }) => ({
    ...state,
    selectedNoteId: id,
    error: null,
    loading: false,
  })),
  on(notesActions.selectNoteWithTagsSuccess, (state, { note }) => ({
    ...state,
    selectedNote: note,
    error: null,
    loading: false,
  })),
  on(notesActions.selectNoteWithTagsError, (state, { error }) => ({
    ...state,
    selectedNote: null,
    selectedNoteId: null,
    error,
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
  }))
);

export function reducer(state: NotesState, action: Action) {
  return featureReducer(state, action);
}
