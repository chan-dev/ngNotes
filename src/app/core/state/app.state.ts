import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router';

export interface State {
  router: RouterReducerState<RouterStateUrl>;
}
