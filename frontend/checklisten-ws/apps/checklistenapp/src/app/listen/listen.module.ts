import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistenListComponent } from './checklisten-list/checklisten-list.component';
import { ChecklisteComponent } from './checkliste/checkliste.component';
import { ListenRoutingModule } from './listen-routing.module';
import { StoreModule } from '@ngrx/store';
import * as ListenReducer from './+state/listen.reducer';
import { ConfigureChecklisteComponent } from './checkliste-details/configure-checkliste/configure-checkliste.component';
import { FormsModule } from '@angular/forms';
import { ConfigurationitemDetailsComponent } from './checkliste-details/configure-checkliste/configurationitem-details/configurationitem-details.component';
import { ExecutionitemDetailsComponent } from './checkliste-details/execute-checkliste/executionitem-details/executionitem-details.component';
import { DeactivateConfigurationNavigationGuard } from './checkliste-details/configure-checkliste/deactivate-configuration-navigation.guard';
import { ExecuteChecklisteComponent } from './checkliste-details/execute-checkliste/execute-checkliste.component';
import { DeactivateExecutionNavigationGuard } from './checkliste-details/execute-checkliste/deactivate-execution-navigation.guard';



@NgModule({
  declarations: [
    ChecklistenListComponent,
    ChecklisteComponent,
    ConfigureChecklisteComponent,
    ConfigurationitemDetailsComponent,
    ExecutionitemDetailsComponent,
    ExecuteChecklisteComponent
  ],
  imports: [
    CommonModule,
    ListenRoutingModule,
    FormsModule,
    StoreModule.forFeature(ListenReducer.listenFeatureKey, ListenReducer.reducer)
  ],
  exports: [
  ],
  providers: [
    DeactivateConfigurationNavigationGuard,
    DeactivateExecutionNavigationGuard
  ]
})
export class ListenModule { }
