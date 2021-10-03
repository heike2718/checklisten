import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from '../infrastructure/auth-guard.service';
import { ChecklistenListComponent } from './checklisten-list/checklisten-list.component';
import { ConfigureChecklisteComponent } from './checkliste-details/configure-checkliste/configure-checkliste.component';
import { DeactivateConfigurationNavigationGuard } from './checkliste-details/configure-checkliste/deactivate-configuration-navigation.guard';
import { ExecuteChecklisteComponent } from './checkliste-details/execute-checkliste/execute-checkliste.component';
import { DeactivateExecutionNavigationGuard } from './checkliste-details/execute-checkliste/deactivate-execution-navigation.guard';


const listenRoutes: Routes = [

	{
		path: 'listen',
		canActivate: [AuthGuardService],
		component: ChecklistenListComponent
	},
	{
		path: 'checkliste/configuration/:kuerzel',
		component: ConfigureChecklisteComponent,
		canDeactivate: [DeactivateConfigurationNavigationGuard],
		canActivate: [AuthGuardService]

	},
	{
		path: 'checkliste/execution/:kuerzel',
		component: ExecuteChecklisteComponent,
		canDeactivate: [DeactivateExecutionNavigationGuard],
		canActivate: [AuthGuardService]

	}];

@NgModule({
	imports: [
		RouterModule.forChild(listenRoutes)
	],
	exports: [
		RouterModule
	]
})
export class ListenRoutingModule { }