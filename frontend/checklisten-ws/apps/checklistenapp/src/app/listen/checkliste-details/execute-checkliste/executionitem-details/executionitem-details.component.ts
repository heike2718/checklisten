import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ChecklisteItem, ChecklisteItemClickedPayload, ItemPosition } from 'apps/checklistenapp/src/app/shared/domain/checkliste';

@Component({
  selector: 'chl-executionitem-details',
  templateUrl: './executionitem-details.component.html',
  styleUrls: ['./executionitem-details.component.css']
})
export class ExecutionitemDetailsComponent implements OnInit {

  @Input()
  checklisteItem!: ChecklisteItem;

  @Input()
  position: ItemPosition = 'VORSCHLAG';

  @Input()
  backgroundColor: string = 'red';

  @Output()
  itemClicked: EventEmitter<ChecklisteItemClickedPayload> = new EventEmitter<ChecklisteItemClickedPayload>();  

  constructor() { }

  ngOnInit(): void {
  }

  togglePosition(): void {
    this.itemClicked.emit({checklisteItem: this.checklisteItem, position: this.position, action: 'TOGGLE', modus: 'EXECUTION'});
  }

  getStyles() {
    return {
      'background-color': this.backgroundColor
    };
  }
}
