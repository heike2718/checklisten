import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { AuthConfig, AuthConfigService } from './configuration/auth.config';
import { STORAGE_KEY_USER_SESSION, UserSession } from '../shared/domain/user';


@Injectable({
	providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

	constructor(@Inject(AuthConfigService) private config: AuthConfig) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (this.config.production) {
			return next.handle(req);
		}

		// da auf localhost das cookie nicht in den Browser gesetzt und folglich zurückgesendet werden kann,
		// machen wir hier den Umweg über localstorage.
		const sessionSerialized = localStorage.getItem(STORAGE_KEY_USER_SESSION);
		if (sessionSerialized) {
			const session: UserSession = JSON.parse(sessionSerialized);
			if (session.sessionId) {
				const cloned = req.clone({
					headers: req.headers.set('X-SESSIONID', session.sessionId)
				});

				return next.handle(cloned);
			} else {
				return next.handle(req);
			}
		} else {
			return next.handle(req);
		}
	}
}
