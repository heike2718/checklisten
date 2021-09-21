import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: 'landing', component: LandingComponent },
	{ path: 'about', component: AboutComponent },
	{ path: 'signup', component: SignUpComponent },
	{ path: '', pathMatch: 'full', component: LandingComponent },
	{ path: '**', component: LandingComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(
		routes,
		{ enableTracing: false, useHash: true, relativeLinkResolution: 'legacy' })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
