import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistenListComponent } from './checklisten-list/checklisten-list.component';
import { ChecklisteComponent } from './checkliste/checkliste.component';
import { ListenRoutingModule } from './listen-routing.module';
import { StoreModule } from '@ngrx/store';
import * as ListenReducer from './+state/listen.reducer';
import { ConfigureChecklisteComponent } from './checkliste-details/configure-checkliste/configure-checkliste.component';



@NgModule({
  declarations: [
    ChecklistenListComponent,
    ChecklisteComponent,
    ConfigureChecklisteComponent
  ],
  imports: [
    CommonModule,
    ListenRoutingModule,
    StoreModule.forFeature(ListenReducer.listenFeatureKey, ListenReducer.reducer)
  ],
  exports: [
  ]
})
export class ListenModule { }
