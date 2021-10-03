import * as moment_ from 'moment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, publishLast, refCount } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LogService } from '../infrastructure/logging/log.service';
import { ResponsePayload } from '../shared/messages/messages.model';
import { SignUpPayload } from '../shared/domain/signup-payload';
import { UserSession, STORAGE_KEY_USER_SESSION, AuthResult } from '../shared/domain/user';
import { GlobalErrorHandlerService } from '../infrastructure/global-error-handler.service';
import { Store } from '@ngrx/store';
import { AuthState } from './+state/auth.reducer';
import { isLoggedIn, isLoggedOut, onLoggingOut } from './+state/auth.selectors';
import * as AuthActions from './+state/auth.actions';
const moment = moment_;



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

	logOut(redirectToProfileApp: boolean ): void {

		let url = environment.apiUrl;

		const sessionSerialized = localStorage.getItem(STORAGE_KEY_USER_SESSION);

		if (sessionSerialized) {

			const session: UserSession = JSON.parse(sessionSerialized);

			if (session.sessionId) {
				url = url + '/auth/dev/logout/' + session.sessionId;
			} else {
				url = url + '/auth/dev/logout/unknown';
			}
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
				this.clearSession(redirectToProfileApp);
			},
			(_error => {
				// ist nicht schlimm: die session bleibt auf dem Server
				this.clearSession(redirectToProfileApp);
			}));

	}

	parseHash(hash: string): AuthResult {		

		const hashStr = hash.replace(/^#?\/?/, '');

		const result: AuthResult = {
			expiresAt: 0,
			nonce: undefined,
			state: undefined,
			idToken: '',
			oauthFlowType: undefined
		};

		if (hashStr.length > 0) {

			const tokens = hashStr.split('&');
			tokens.forEach(
				(token) => {
					const keyVal = token.split('=');
					switch (keyVal[0]) {
						case 'expiresAt': result.expiresAt = JSON.parse(keyVal[1]); break;
						case 'nonce': result.nonce = keyVal[1]; break;
						case 'state': result.state = keyVal[1]; break;
						case 'idToken': result.idToken = keyVal[1]; break;
						case 'oauthFlowType': result.oauthFlowType = keyVal[1]; break;
					}
				}
			);
		}
		return result;
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
					const serialized = JSON.stringify(userSession);

					localStorage.setItem(STORAGE_KEY_USER_SESSION, serialized);

					if ('login' === authResult.state) {
						this.store.dispatch(AuthActions.login({session: userSession}));
						this.router.navigateByUrl('/listen');
					}
				}
			},
			(error => {
				this.errorHandlerService.handleError(error);
			})
		);
	}
	public clearOrRestoreSession() {

		if (this.sessionExpired()) {
			this.clearSession(false);
		} else {
			this.initSessionFromStorage();
		}
	}

	private sessionExpired(): boolean {

		this.logger.debug('check session');

		// session expires at ist in Millisekunden seit 01.01.1970
		const expiration = this.getExpirationAsMoment();
		if (expiration === null) {
			return true;
		}
		const expired = moment().isAfter(expiration);

		return expired;
	}



	private clearSession(redirectToProfileApp: boolean) {

		localStorage.removeItem(STORAGE_KEY_USER_SESSION);
		this.store.dispatch(AuthActions.logout());

		if (redirectToProfileApp) {
			window.location.href = environment.profileUrl;
		}
	}

	private initSessionFromStorage() {


		const userSessionSerialized = localStorage.getItem(STORAGE_KEY_USER_SESSION);

		if (userSessionSerialized) {

			const userSession: UserSession = JSON.parse(userSessionSerialized);
			const expiration = userSession.expiresAt;

			if (expiration) {

				this.store.dispatch(AuthActions.refreshSession({ session: userSession }));				
			}
		}		
	}

	private getExpirationAsMoment() {

		const userSessionSerialized = localStorage.getItem(STORAGE_KEY_USER_SESSION);

		if (!userSessionSerialized) {
			return null;
		}

		const session: UserSession = JSON.parse(userSessionSerialized);

		const expiration = session.expiresAt;
		if (!expiration || expiration === 0) {
			return null;
		}
		return moment(expiration);
	}
}

