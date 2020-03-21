import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromSidenav from './sidenav';
import * as fromNotes from './notes';

export interface NotesFeatureState {
  sidenav: fromSidenav.SidenavState;
  notes: fromNotes.NotesState;
}

export const reducers: ActionReducerMap<NotesFeatureState> = {
  sidenav: fromSidenav.reducer,
  notes: fromNotes.reducer,
};

export const getNotesFeatureState = createFeatureSelector('notes');
