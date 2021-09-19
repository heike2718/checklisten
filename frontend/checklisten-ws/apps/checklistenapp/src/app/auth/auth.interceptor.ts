import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { AuthConfig, AuthConfigService } from './configuration/auth.config';
import { STORAGE_KEY_DEV_SESSION_ID } from '../shared/domain/user';


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
		const sessionId = localStorage.getItem(this.config.storagePrefix + STORAGE_KEY_DEV_SESSION_ID);
		if (sessionId) {
			const cloned = req.clone({
				headers: req.headers.set('X-SESSIONID', sessionId)
			});
			return next.handle(cloned);

		} else {
			return next.handle(req);
		}
	}
}
