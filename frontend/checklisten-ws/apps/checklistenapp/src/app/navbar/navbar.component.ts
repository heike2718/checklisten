import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { LogoutService } from './logout.service';

@Component({
  selector: 'chl-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;
	logo = environment.assetsUrl + '/favicon-32x32.png';

  private loginSubscription: Subscription;

  private userLoggedIn = false;  

  constructor(public authService: AuthService
    , private logoutService: LogoutService
    ) { 

      this.loginSubscription = this.authService.isLoggedIn$.subscribe(li => {
        this.userLoggedIn = li;
      });
    }

  ngOnInit(): void {   
  }

  ngOnDestoy(): void {

    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  collapseNav() {
		this.isCollapsed = true;
	}

	logIn(): void {
		this.authService.logIn();
	}

	logOut(): void {
		this.logoutService.logout();
	}

	profile(): void {
		if (this.userLoggedIn) {
			this.logoutService.logout();
		}
		window.location.href = environment.profileUrl;
	}
}
