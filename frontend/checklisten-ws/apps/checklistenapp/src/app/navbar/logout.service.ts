import { STORAGE_KEY_INVALID_SESSION } from '../shared/domain/user';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../shared/messages/message.service';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../auth/session.service';


@Injectable({
	providedIn: 'root'
})
export class LogoutService {

	constructor(private router: Router
		, private sessionService: SessionService
		, private messageService: MessageService
		, private authService: AuthService
	) { }


	logout(): void {
		this.sessionService.clearSession();
		this.messageService.clear();
		localStorage.removeItem(STORAGE_KEY_INVALID_SESSION);
		this.authService.logOut();
		this.router.navigateByUrl('/');
	}
}
