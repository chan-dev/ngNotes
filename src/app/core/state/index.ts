import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { reducer } from '@core/state/auth/auth.reducers';
import { State } from './app.state';

export * from './app.state';

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
  auth: reducer,
};

export const getRouterState = createFeatureSelector('router');
