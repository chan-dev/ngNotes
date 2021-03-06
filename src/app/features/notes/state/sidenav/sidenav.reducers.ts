import { SidenavState, SidenavMenus } from './sidenav.state';
import { createReducer, on, Action } from '@ngrx/store';
import * as sidenavActions from './sidenav.actions';

const initialState: SidenavState = {
  isVisible: true,
  selectedMenu: SidenavMenus.Notes,
  filter: '',
  expandIcons: false,
};

const featureReducer = createReducer(
  initialState,
  on(sidenavActions.toggleSidenav, state => ({
    ...state,
    isVisible: !state.isVisible,
  })),
  on(sidenavActions.setSidenav, (state, { isMobile }) => ({
    ...state,
    expandIcons: !isMobile,
    isVisible: !isMobile,
  })),
  on(sidenavActions.selectNotesMenu, state => ({
    ...state,
    selectedMenu: SidenavMenus.Notes,
  })),
  on(sidenavActions.selectFavoritesMenu, state => ({
    ...state,
    selectedMenu: SidenavMenus.Favorites,
  })),
  on(sidenavActions.selectTrashMenu, state => ({
    ...state,
    selectedMenu: SidenavMenus.Trash,
  })),
  on(sidenavActions.selectSharedMenu, state => ({
    ...state,
    selectedMenu: SidenavMenus.Shared,
  })),
  on(sidenavActions.setSearchFilter, (state, { filter }) => ({
    ...state,
    filter,
  }))
);

export function reducer(state: SidenavState, action: Action) {
  return featureReducer(state, action);
}
