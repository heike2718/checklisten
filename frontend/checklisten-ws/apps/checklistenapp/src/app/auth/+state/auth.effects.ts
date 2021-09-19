import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { tap } from 'rxjs/operators';
import { STORAGE_KEY_DEV_SESSION_ID, STORAGE_KEY_ID_REFERENCE, STORAGE_KEY_SESSION_EXPIRES_AT } from '../../shared/domain/user';
import { AuthConfig, AuthConfigService } from '../configuration/auth.config';


@Injectable()
export class AuthEffects {

	login$ = createEffect(() =>
		this.actions$
			.pipe(
				ofType(AuthActions.login),
				tap(action => {

					const sessionId = action.session.sessionId;
					if (sessionId) {
						localStorage.setItem(this.config.storagePrefix + STORAGE_KEY_ID_REFERENCE,
							JSON.stringify(action.session.idReference));

						if (action.session.sessionId) {
							localStorage.setItem(this.config.storagePrefix + STORAGE_KEY_DEV_SESSION_ID, action.session.sessionId)
						}

						localStorage.setItem(this.config.storagePrefix + STORAGE_KEY_SESSION_EXPIRES_AT, JSON.stringify(action.session.expiresAt))
					}

				})
			)
		,
		{ dispatch: false });

	logout$ = createEffect(() =>
		this.actions$
			.pipe(
				ofType(AuthActions.logout),
				tap(_action => {
					localStorage.removeItem(this.config.storagePrefix + STORAGE_KEY_DEV_SESSION_ID);
					localStorage.removeItem(this.config.storagePrefix + STORAGE_KEY_ID_REFERENCE);
					localStorage.removeItem(this.config.storagePrefix + STORAGE_KEY_SESSION_EXPIRES_AT);

				})
			)
		, { dispatch: false });


	constructor(private actions$: Actions,
		@Inject(AuthConfigService) private config: AuthConfig) {

	}

}
