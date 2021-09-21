import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistenListeComponent } from './checklisten-liste/checklisten-liste.component';
import { ChecklisteComponent } from './checkliste/checkliste.component';
import { ChecklisteDetailsComponent } from './checkliste-details/checkliste-details.component';
import { ListenRoutingModule } from './listen-routing.module';



@NgModule({
  declarations: [
    ChecklistenListeComponent,
    ChecklisteComponent,
    ChecklisteDetailsComponent
  ],
  imports: [
    CommonModule,
    ListenRoutingModule
  ],
  exports: [
    ChecklistenListeComponent
  ]
})
export class ListenModule { }
