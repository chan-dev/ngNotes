import { createSelector } from '@ngrx/store';
import { getNotesFeatureState, NotesFeatureState } from '..';
import * as fromSidenav from './sidenav.state';

// sidenav selectors
export const getSidenavState = createSelector(
  getNotesFeatureState,
  (state: NotesFeatureState) => state.sidenav
);
export const getSidenavIsVisible = createSelector(
  getSidenavState,
  (state: fromSidenav.SidenavState) => state.isVisible
);
export const getSidenavExpandIcons = createSelector(
  getSidenavState,
  (state: fromSidenav.SidenavState) => state.expandIcons
);
export const getSidenavSelectedMenu = createSelector(
  getSidenavState,
  (state: fromSidenav.SidenavState) => state.selectedMenu
);
export const getSidenavSearchFilter = createSelector(
  getSidenavState,
  (state: fromSidenav.SidenavState) => state.filter
);
