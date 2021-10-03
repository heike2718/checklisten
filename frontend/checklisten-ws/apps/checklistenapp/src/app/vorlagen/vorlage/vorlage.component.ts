import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { VorlagenFacade } from '../vorlagen.facade';
import { ChecklistenVorlage, initialChecklistenVorlage } from '../vorlagen.model';

@Component({
  selector: 'chl-vorlage',
  templateUrl: './vorlage.component.html',
  styleUrls: ['./vorlage.component.css']
})
export class VorlageComponent implements OnInit {

  showFilename = environment.envName === 'DEV';

  dialogNeuesItemVisible = false;

  neuesItemName = '';

  @Input()
  vorlage: ChecklistenVorlage = initialChecklistenVorlage;


  constructor(private vorlagenFacade: VorlagenFacade) { }

  ngOnInit(): void {
    this.dialogNeuesItemVisible = false;
  }

  getStyles() {
    return {
      'background-color': this.vorlage.appearance.color
    };
  }

  startEdit(): void {
    this.vorlagenFacade.startEditVorlage(this.vorlage);
  }
}
