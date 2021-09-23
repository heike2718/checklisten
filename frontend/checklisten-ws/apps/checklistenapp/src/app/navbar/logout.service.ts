import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../shared/messages/message.service';
import { AuthService } from '../auth/auth.service';
import { STORAGE_KEY_USER_SESSION } from '../shared/domain/user';


@Injectable({
	providedIn: 'root'
})
export class LogoutService {

	constructor(private router: Router
		, private messageService: MessageService
		, private authService: AuthService
	) { }


	logout(): void {
		this.messageService.clear();
		this.authService.logOut();
		this.router.navigateByUrl('/');
	}
}
