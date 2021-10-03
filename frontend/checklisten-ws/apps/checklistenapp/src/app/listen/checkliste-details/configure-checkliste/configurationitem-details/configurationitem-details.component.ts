import { Component, EmbeddedViewRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ItemPosition } from 'apps/checklistenapp/src/app/shared/domain/constants';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { ChecklisteItem, ChecklisteItemClickedPayload, initialChecklisteItem } from '../../../listen.model';

@Component({
  selector: 'chl-configurationitem-details',
  templateUrl: './configurationitem-details.component.html',
  styleUrls: ['./configurationitem-details.component.css']
})
export class ConfigurationitemDetailsComponent implements OnInit {

  @Input()
  checklisteItem: ChecklisteItem = initialChecklisteItem;

  @Input()
  position: ItemPosition = 'VORSCHLAG';

  @Input()
  backgroundColor: string = 'red';

  @Output()
  itemClicked: EventEmitter<ChecklisteItemClickedPayload> = new EventEmitter<ChecklisteItemClickedPayload>();  

  showFilename = environment.envName === 'DEV';

  constructor() { }

  ngOnInit(): void {
  }

  togglePosition(): void {
    this.itemClicked.emit({eventType: 'CHECKLISTEITEM_CLICKED', checklisteItem: this.checklisteItem, position: this.position, action: 'TOGGLE', modus: 'CONFIGURATION'});
  }

  editItem(): void {
    this.itemClicked.emit({eventType: 'CHECKLISTEITEM_CLICKED', checklisteItem: this.checklisteItem, position: this.position, action: 'EDIT', modus: 'CONFIGURATION'});
  }

  getStyles() {
    return {
      'backgroundColor': this.backgroundColor
    };
  }
}
