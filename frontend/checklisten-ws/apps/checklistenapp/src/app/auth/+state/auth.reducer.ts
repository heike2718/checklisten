import { Action, createReducer, on } from '@ngrx/store';
import { UserSession } from '../../shared/domain/user';
import * as AuthActions from './auth.actions';


export const authFeatureKey = 'auth';

export interface AuthState {
	session: UserSession,
	loggingOut: boolean
};

export const initialAuthState: AuthState = {
	session: {
		sessionId: undefined,
		idReference: '',
		expiresAt: 0		
	},
	loggingOut: false
};


const authReducer = createReducer(initialAuthState,

	on(AuthActions.login, (state, action) => {
		return { ...state, session: action.session, loggingOut: false };
	}),

	on(AuthActions.logout, (_state, _action) => {
		return initialAuthState;
	}),

	on(AuthActions.refreshSession, (state, action) => {
		return { ...state, session: action.session };
	}),

	on(AuthActions.startLoggingOut, (state,_action) => {
		return {...state, loggingOut: true};
	})

);

export function reducer(state: AuthState | undefined, action: Action) {
	return authReducer(state, action);
}

