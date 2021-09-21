import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistenListeComponent } from './checklisten-liste/checklisten-liste.component';
import { ChecklisteComponent } from './checkliste/checkliste.component';
import { ChecklisteDetailsComponent } from './checkliste-details/checkliste-details.component';
import { ListenRoutingModule } from './listen-routing.module';
import { StoreModule } from '@ngrx/store';
import * as ListenReducer from './+state/listen.reducer';



@NgModule({
  declarations: [
    ChecklistenListeComponent,
    ChecklisteComponent,
    ChecklisteDetailsComponent
  ],
  imports: [
    CommonModule,
    ListenRoutingModule,
    StoreModule.forFeature(ListenReducer.listenFeatureKey, ListenReducer.reducer)
  ],
  exports: [
    ChecklistenListeComponent
  ]
})
export class ListenModule { }
