import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


const listenRoutes: Routes = [

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