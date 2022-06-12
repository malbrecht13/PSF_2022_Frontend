import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';


export const buildUserSession = createAction('[Users] Build User Session');

export const buildUserSessionSuccess = createAction(
  '[Users] Build User Session Success',
  props<{ user: User }>()
);

export const buildUsersSessionFailed = createAction('[Users] Build User Session Failure');
