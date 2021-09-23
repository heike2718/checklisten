import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { tap } from 'rxjs/operators';
import { STORAGE_KEY_USER_SESSION } from '../../shared/domain/user';
import { AuthConfig, AuthConfigService } from '../configuration/auth.config';


@Injectable()
export class AuthEffects {

	login$ = createEffect(() =>
		this.actions$
			.pipe(
				ofType(AuthActions.login),
				tap(action => {

					if (action.session) {
						localStorage.setItem(STORAGE_KEY_USER_SESSION,
							JSON.stringify(action.session));
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
					localStorage.removeItem(STORAGE_KEY_USER_SESSION);
				})
			)
		, { dispatch: false });


	constructor(private actions$: Actions,
		@Inject(AuthConfigService) private config: AuthConfig) {

	}

}
