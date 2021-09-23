import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChecklistenItem, ChecklistenItemClickedPayload, initialChecklistenItem, ItemPosition } from 'apps/checklistenapp/src/app/shared/domain/checkliste';
import { environment } from 'apps/checklistenapp/src/environments/environment';

@Component({
  selector: 'chl-configurationitem-details',
  templateUrl: './configurationitem-details.component.html',
  styleUrls: ['./configurationitem-details.component.css']
})
export class ConfigurationitemDetailsComponent implements OnInit {

  @Input()
  checklistenItem: ChecklistenItem = initialChecklistenItem;

  @Input()
  position: ItemPosition = 'VORSCHLAG';

  @Input()
  backgroundColor: string = 'red';

  @Output()
  itemClicked: EventEmitter<ChecklistenItemClickedPayload> = new EventEmitter<ChecklistenItemClickedPayload>();

  showFilename = !environment.production;

  constructor() { }

  ngOnInit(): void {
  }

  onClickEvent(): void {
    this.itemClicked.emit({checklistenItem: this.checklistenItem, position: this.position});
  }

  getStyles() {
    return {
      'backgroundColor': this.backgroundColor
    };
  }
}
