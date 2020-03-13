import { SidenavState } from './sidenav.state';
import { createReducer, on, Action } from '@ngrx/store';
import * as sidenavActions from './sidenav.actions';

const initialState: SidenavState = {
  isVisible: true,
};

const featureReducer = createReducer(
  initialState,
  on(sidenavActions.toggleSidenav, state => ({
    ...state,
    isVisible: !state.isVisible,
  }))
);

export function reducer(state: SidenavState, action: Action) {
  return featureReducer(state, action);
}
