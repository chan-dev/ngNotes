import { createAction, props } from '@ngrx/store';
import { User } from '../../../features/auth/types/user';

export const login = createAction('[LoginComponent] Login');
export const loginSuccess = createAction(
  '[AuthService] Login Success',
  props<{ user: User }>()
);
export const loginError = createAction(
  '[AuthService] Login Error',
  props<{ error: string }>()
);
// TODO: replace later with correct event source
export const logout = createAction('[Test Component] Logout');
