import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router';
import { UserState } from './auth/auth.state';

export interface State {
  router: RouterReducerState<RouterStateUrl>;
  auth: UserState;
}
