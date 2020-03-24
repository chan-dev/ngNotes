import { User } from '../../../features/auth/types/user';

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
