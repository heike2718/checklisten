import { createAction, props } from '@ngrx/store';
import { UserSession } from '../../shared/domain/user';


export const login = createAction(
	'[Navbar] login',
	props<{session: UserSession}>()
);

export const logout = createAction(
	'[Navbar/AuthService] logout'
);

export const refreshSession = createAction(
	'[AuthService] initSessionFromStorage',
	props<{session: UserSession}>()
);

export const startLoggingOut = createAction(
	'[AuthService] logout start'
);

