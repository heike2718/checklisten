import { Component, OnInit } from '@angular/core';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { LogService } from '../../../infrastructure/logging/log.service';
import { ChecklistenItemClickedPayload } from '../../../shared/domain/checkliste';
import { ListenFacade } from '../../listen.facade';

@Component({
  selector: 'chl-configure',
  templateUrl: './configure-checkliste.component.html',
  styleUrls: ['./configure-checkliste.component.css']
})
export class ConfigureChecklisteComponent implements OnInit {

  showFilename = !environment.production;

  itemName: string = '';
  itemKommentar: string = '';
  itemOptional: boolean = false;

  constructor(public listenFacade: ListenFacade,
    private logger: LogService) { }

  ngOnInit(): void {
  }

  onItemClicked($event: any): void {
    
    const payload: ChecklistenItemClickedPayload = $event;
    this.logger.debug(JSON.stringify(payload));

    this.listenFacade.handleChecklisteItemClicked('CONFIGURATION', payload);
  }
}
