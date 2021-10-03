import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from '../infrastructure/auth-guard.service';
import { VorlagenListComponent } from './vorlagen-list/vorlagen-list.component';
import { EditVorlageComponent } from './edit-vorlage/edit-vorlage.component';
import { DeactivateEditVorlageNavigationGuard } from './edit-vorlage/deactivate-edit-vorlage-navigation.guard';

const vorlagenRoutes: Routes = [
    {
		path: 'vorlagen',
		canActivate: [AuthGuardService],
		component: VorlagenListComponent
	},
    {
		path: 'vorlage/:typ',
		canActivate: [AuthGuardService],
		canDeactivate: [DeactivateEditVorlageNavigationGuard],
		component: EditVorlageComponent
	}
];


@NgModule({
	imports: [
		RouterModule.forChild(vorlagenRoutes)
	],
	exports: [
		RouterModule
	]
})
export class VorlagenRoutingModule { };
