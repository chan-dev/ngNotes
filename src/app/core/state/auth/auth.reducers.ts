import { createReducer, on, Action } from '@ngrx/store';
import { UserState } from './auth.state';
import * as authActions from './auth.actions';

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const featureReducer = createReducer(
  initialState,
  on(authActions.login, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(authActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(authActions.loginError, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    user: null,
  })),
  on(authActions.logout, state => ({
    ...state,
    loading: false,
    user: null,
  }))
);

export function reducer(state: UserState, action: Action) {
  return featureReducer(state, action);
}
