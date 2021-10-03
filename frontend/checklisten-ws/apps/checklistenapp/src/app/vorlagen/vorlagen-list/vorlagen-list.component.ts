import { Component, OnInit } from '@angular/core';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { MessageService } from '../../shared/messages/message.service';
import { VorlagenFacade } from '../vorlagen.facade';

@Component({
  selector: 'chl-vorlagen-list',
  templateUrl: './vorlagen-list.component.html',
  styleUrls: ['./vorlagen-list.component.css']
})
export class VorlagenListComponent implements OnInit {

  showFilename = environment.envName === 'DEV';

  constructor( public vorlagenFacade: VorlagenFacade
    , private messageService: MessageService) { }

  ngOnInit(): void {

    this.messageService.clear();
    this.vorlagenFacade.loadVorlagen();
  
  }

}
