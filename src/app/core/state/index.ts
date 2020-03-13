import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { State } from './app.state';

export * from './app.state';

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
};

export const getRouterState = createFeatureSelector('router');
