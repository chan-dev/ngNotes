import { localStorageSync, LocalStorageConfig } from 'ngrx-store-localstorage';
import { ActionReducer } from '@ngrx/store';

export function createLocalStorageSyncReducer(config: LocalStorageConfig) {
  return (reducer: ActionReducer<any>): ActionReducer<any> =>
    localStorageSync({ ...config })(reducer);
}
