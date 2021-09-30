import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { VorlagenListComponent } from './vorlagen-list/vorlagen-list.component';
import { VorlageComponent } from './vorlage/vorlage.component';
import { EditVorlageComponent } from './edit-vorlage/edit-vorlage.component';
import { VorlageitemDetailsComponent } from './vorlageitem-details/vorlageitem-details.component';
import { FormsModule } from '@angular/forms';
import { VorlagenRoutingModule } from './vorlagen-routing.module';
import * as VorlagenReducer from './+state/vorlagen.reducer';



@NgModule({
  declarations: [  
    VorlagenListComponent,
    VorlageComponent,
    EditVorlageComponent,
    VorlageitemDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    VorlagenRoutingModule,
    StoreModule.forFeature(VorlagenReducer.vorlagenFeatureKey, VorlagenReducer.reducer)
  ]
})
export class VorlagenModule { }
