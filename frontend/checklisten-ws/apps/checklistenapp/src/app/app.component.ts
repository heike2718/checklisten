import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
import { LogService } from './infrastructure/logging/log.service';
import { ListenFacade } from './listen/listen.facade';
import { MessageService } from './shared/messages/message.service';
import { VersionService } from './shared/version.service';

@Component({
  selector: 'chl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'checklistenapp';
  version = '';// environment.version;
	envName = environment.envName;
	showFilename = environment.envName === 'DEV';
	api = environment.apiUrl;
	logo = environment.assetsUrl + '/favicon-32x32.png'; 

  private versionSubscription: Subscription = new Subscription();

  constructor(public authService: AuthService
    , private logger: LogService
    , private versionService: VersionService) {
  }

  ngOnInit() {

    this.versionSubscription = this.versionService.getServerVersion().subscribe(
      message => this.version = message.message
    );

    this.authService.clearOrRestoreSession();

    const hash = window.location.hash;
    this.logger.debug('hash=' + hash);

    if (hash && hash.indexOf('idToken') > 0) {
			const authResult = this.authService.parseHash(hash);
			this.authService.createSession(authResult);
		}
  }

  ngOnDestroy(): void {
    this.versionSubscription.unsubscribe();
  }
}
