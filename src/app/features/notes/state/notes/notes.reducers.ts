import { createReducer, on, Action } from '@ngrx/store';
import { NotesState } from './notes.state';
import * as notesActions from './notes.actions';

const initialState: NotesState = {
  items: [],
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
  on(notesActions.fetchNotesSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
    error: null,
  })),
  on(notesActions.fetchNotesError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(notesActions.selectNote, (state, { id }) => ({
    ...state,
    selectedNoteId: id,
    error: null,
    loading: false,
  }))
);

export function reducer(state: NotesState, action: Action) {
  return featureReducer(state, action);
}
