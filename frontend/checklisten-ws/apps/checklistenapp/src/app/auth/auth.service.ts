import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, publishLast, refCount } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LogService } from '../infrastructure/logging/log.service';
import { ResponsePayload } from '../shared/messages/messages.model';
import { SignUpPayload } from '../shared/domain/signup-payload';
import { UserSession, STORAGE_KEY_ID_REFERENCE, STORAGE_KEY_AUTH_STATE, STORAGE_KEY_SESSION_EXPIRES_AT, STORAGE_KEY_DEV_SESSION_ID, AuthResult } from '../shared/domain/user';
import { GlobalErrorHandlerService } from '../infrastructure/global-error-handler.service';
import { SessionService } from './session.service';
import { Store } from '@ngrx/store';
import { AuthState } from './+state/auth.reducer';
import { isLoggedIn, isLoggedOut, onLoggingOut } from './+state/auth.selectors';



@Injectable({
	providedIn: 'root'
})
export class AuthService {

	isLoggedIn$ = this.store.select(isLoggedIn);
	isLoggedOut$ = this.store.select(isLoggedOut);
	onLoggingOut$ = this.store.select(onLoggingOut);


	constructor(private store: Store<AuthState>
		, private httpClient: HttpClient
		, private errorHandlerService: GlobalErrorHandlerService
		, private sessionService: SessionService
		, private logger: LogService
		, private router: Router) {
	}


	checkMaySignUp(signUpPayload: SignUpPayload): Observable<ResponsePayload> {
		const url = environment.apiUrl + '/signup/secret';
		return this.httpClient.post<ResponsePayload>(url, signUpPayload);
	}

	logIn() {

		const url = environment.apiUrl + '/auth/login';

		this.httpClient.get(url).pipe(
			map(res => res as ResponsePayload),
			publishLast(),
			refCount()
		).subscribe(
			payload => {
				window.location.href = payload.message.message;
			},
			(error => {
				this.errorHandlerService.handleError(error);
			}));
	}

	logOut() {

		let url = environment.apiUrl;

		const sessionId = localStorage.getItem(STORAGE_KEY_DEV_SESSION_ID);


		if (sessionId) {
			url = url + '/auth/dev/logout/' + sessionId;
		} else {
			url = url + '/auth/dev/logout/unknown';
		}

		if (environment.production) {
			url = environment.apiUrl + '/auth/logout';
		}

		this.logger.debug('url=' + url);

		this.httpClient.delete(url).pipe(
			map(res => res as ResponsePayload),
			publishLast(),
			refCount()
		).subscribe(
			_payload => {
				this.sessionService.clearSession();
			},
			(_error => {
				// ist nicht schlimm: die session bleibt auf dem Server
				this.sessionService.clearSession();
			}));

	}

	createSession(authResult: AuthResult) {

		window.location.hash = '';

		const url = environment.apiUrl + '/auth/session';

		this.httpClient.post(url, authResult.idToken).pipe(
			map(res => res as ResponsePayload),
			publishLast(),
			refCount()
		).subscribe(
			payload => {
				if (payload.data) {
					const userSession = payload.data as UserSession;

					localStorage.setItem(STORAGE_KEY_SESSION_EXPIRES_AT, JSON.stringify(userSession.expiresAt));
					localStorage.setItem(STORAGE_KEY_ID_REFERENCE, userSession.idReference);

					if (authResult.state) {
						localStorage.setItem(STORAGE_KEY_AUTH_STATE, authResult.state);
					}

					if (userSession.sessionId && !environment.production) {
						localStorage.setItem(STORAGE_KEY_DEV_SESSION_ID, userSession.sessionId);
					}

					if ('login' === authResult.state) {
						this.router.navigateByUrl('/listen');
					}
				}
			},
			(error => {
				this.errorHandlerService.handleError(error);
			})
		);
	}
}

