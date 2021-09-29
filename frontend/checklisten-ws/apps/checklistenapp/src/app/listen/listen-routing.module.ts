import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from '../infrastructure/auth-guard.service';
import { ChecklistenListComponent } from './checklisten-list/checklisten-list.component';
import { ConfigureChecklisteComponent } from './checkliste-details/configure-checkliste/configure-checkliste.component';
import { DeactivateConfigurationNavigationGuard } from './checkliste-details/configure-checkliste/deactivate-configuration-navigation.guard';


const listenRoutes: Routes = [

	{
		path: 'listen',
		canActivate: [AuthGuardService],
		component: ChecklistenListComponent
	},
	{
		path: 'checkliste/configuration/:kuerzel',
		component: ConfigureChecklisteComponent,
		/*
		resolve: {
			detail: ConfigureChecklisteResolver
		},
		*/
		canDeactivate: [DeactivateConfigurationNavigationGuard],
		canActivate: [AuthGuardService]

	},
];

@NgModule({
	imports: [
		RouterModule.forChild(listenRoutes)
	],
	exports: [
		RouterModule
	]
})
export class ListenRoutingModule {

}