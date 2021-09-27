import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule, RouterState} from "@ngrx/router-store";

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { JokeComponent } from './joke/joke.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevModules } from './store-config/store-devtools';
import { AuthModule } from './auth/auth.module';
import { environment } from '../environments/environment';
import { GlobalErrorHandlerService } from './infrastructure/global-error-handler.service';
import { CustomRouterStateSerializer } from './shared/utils';
import { LandingComponent } from './landing/landing.component';
import { ListenModule } from './listen/listen.module';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { MessagesComponent } from './shared/messages/message.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    JokeComponent,
    NavbarComponent,
    LandingComponent,
    NotAuthorizedComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
	AuthModule.forRoot({
		baseUrl: environment.apiUrl + '/auth/login',
		production: environment.production,
		loginSuccessUrl: '/checklisten'
	}),
	ListenModule,	
	StoreModule.forRoot(reducers, {
			metaReducers,
			runtimeChecks: {
				strictStateImmutability: true,
				strictActionImmutability: true,
				strictActionSerializability: true,
				strictStateSerializability: true,
				strictActionWithinNgZone: true
			}
		}),
	EffectsModule.forRoot([]),
	StoreRouterConnectingModule.forRoot({
			stateKey:'router',
			routerState: RouterState.Minimal
		}),
	StoreDevModules,		
    AppRoutingModule
	],
  providers: [
	GlobalErrorHandlerService,
	{ provide: ErrorHandler, useClass: GlobalErrorHandlerService },
	{ provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
	{ provide: LOCALE_ID, useValue: "de-DE" },
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
