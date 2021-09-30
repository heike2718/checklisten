import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LandingComponent } from './landing/landing.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

const routes: Routes = [
	{ path: 'landing', component: LandingComponent },
	{ path: 'forbidden', component: NotAuthorizedComponent },
	{ path: 'about', component: AboutComponent },
	{ path: 'listen', loadChildren: () => import('./listen/listen.module').then(m => m.ListenModule)},
	{ path: 'vorlagen', loadChildren: () => import('./vorlagen/vorlagen.module').then(m => m.VorlagenModule)},
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
