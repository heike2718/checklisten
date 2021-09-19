import * as moment_ from 'moment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { STORAGE_KEY_SESSION_EXPIRES_AT, STORAGE_KEY_DEV_SESSION_ID, STORAGE_KEY_ID_REFERENCE, STORAGE_KEY_AUTH_STATE } from '../shared/domain/user';
import { LogService } from '../infrastructure/logging/log.service';

const moment = moment_;

@Injectable({
	providedIn: 'root'
})
export class SessionService {

	constructor(private router: Router
		, private logger: LogService) { }

	clearSession() {
		localStorage.removeItem(STORAGE_KEY_SESSION_EXPIRES_AT);
		localStorage.removeItem(STORAGE_KEY_DEV_SESSION_ID);
		localStorage.removeItem(STORAGE_KEY_ID_REFERENCE);
		localStorage.removeItem(STORAGE_KEY_AUTH_STATE);
		// TODO: URL aufrufen, um beim AuthProvider das idToken zu invalidieren?
		this.router.navigateByUrl('/home');
	}

	sessionExpired(): boolean {

		this.logger.debug('check session');

		// session expires at ist in Millisekunden seit 01.01.1970
		const expiration = this.getExpirationAsMoment();
		if (expiration === null) {
			return true;
		}
		const expired = moment().isAfter(expiration);

		return expired;
	}

	private getExpirationAsMoment() {

		const expiration = localStorage.getItem(STORAGE_KEY_SESSION_EXPIRES_AT);
		if (!expiration) {
			this.logger.debug('session present');
			return null;
		}

		const expiresAt = JSON.parse(expiration);
		return moment(expiresAt);
	}

}
