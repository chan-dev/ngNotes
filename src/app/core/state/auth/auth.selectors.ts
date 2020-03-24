import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './auth.state';

export const getAuthFeatureState = createFeatureSelector('auth');
export const getUserLoggedIn = createSelector(
  getAuthFeatureState,
  (state: UserState) => state.user
);
export const getIsUserLoggedIn = createSelector(
  getAuthFeatureState,
  (state: UserState) => !!state.user
);
