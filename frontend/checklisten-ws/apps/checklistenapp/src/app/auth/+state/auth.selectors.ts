import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';


export const selectAuthState =
	createFeatureSelector<fromAuth.AuthState>(fromAuth.authFeatureKey);

export const session = createSelector(selectAuthState, s => s.session);
export const isLoggedIn = createSelector(session, s => s.sessionId ? true : false);

export const onLoggingOut = createSelector(selectAuthState, s => s.loggingOut);
export const isLoggedOut = createSelector(isLoggedIn, loggedIn => !loggedIn);

