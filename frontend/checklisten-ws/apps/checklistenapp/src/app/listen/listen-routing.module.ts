import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from '../infrastructure/auth-guard.service';
import { ChecklistenListComponent } from './checklisten-list/checklisten-list.component';


const listenRoutes: Routes = [

	{
		path: 'listen',
		canActivate: [AuthGuardService],
		component: ChecklistenListComponent
	}
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