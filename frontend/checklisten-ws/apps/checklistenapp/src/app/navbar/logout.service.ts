import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../shared/messages/message.service';
import { AuthService } from '../auth/auth.service';
import { STORAGE_KEY_USER_SESSION } from '../shared/domain/user';
import { ListenFacade } from '../listen/listen.facade';
import { VorlagenFacade } from '../vorlagen/vorlagen.facade';
import { Observable } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class LogoutService {

	constructor(private router: Router
		, private messageService: MessageService
		, private authService: AuthService
		, private listenFacade: ListenFacade
		, private vorlagenFacade: VorlagenFacade
	) { }


	logout(): void {
		this.messageService.clear();
		this.listenFacade.reset();
		this.vorlagenFacade.reset();
		this.authService.logOut(false);		
		this.router.navigateByUrl('/');
	}

	logoutAndRedirectToProfile(): void {
		this.messageService.clear();
		this.listenFacade.reset();
		this.vorlagenFacade.reset();
		this.authService.logOut(true);	
	}
}
