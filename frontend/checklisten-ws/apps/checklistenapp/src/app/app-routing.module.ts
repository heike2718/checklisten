import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
	{ path: 'landing', component: LandingComponent },
	{ path: 'about', component: AboutComponent },
	{ path: 'listen', loadChildren: () => import('./listen/listen.module').then(m => m.ListenModule)},
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
