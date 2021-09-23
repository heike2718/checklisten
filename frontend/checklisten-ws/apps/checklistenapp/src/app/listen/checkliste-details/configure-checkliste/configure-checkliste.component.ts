import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { Subscription } from 'rxjs';
import { LogService } from '../../../infrastructure/logging/log.service';
import { ChecklistenItemClickedPayload } from '../../../shared/domain/checkliste';
import { ListenFacade } from '../../listen.facade';

@Component({
  selector: 'chl-configure',
  templateUrl: './configure-checkliste.component.html',
  styleUrls: ['./configure-checkliste.component.css']
})
export class ConfigureChecklisteComponent implements OnInit, OnDestroy {


  checklisteName: string = '';

  showFilename = !environment.production;

  itemName: string = '';
  itemKommentar: string = '';
  itemOptional: boolean = false;

  private checklisteSubscription: Subscription = new Subscription();

  constructor(public listenFacade: ListenFacade,
    private logger: LogService) { }

  ngOnInit(): void {

    this.checklisteSubscription = this.listenFacade.selectedCheckliste$.subscribe(
      liste => {
        if (liste) {
          this.checklisteName = liste.checkisteDaten.name;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.checklisteSubscription) {
      this.checklisteSubscription.unsubscribe();
    }
  }

  onItemClicked($event: any): void {
    
    const payload: ChecklistenItemClickedPayload = $event;
    this.logger.debug(JSON.stringify(payload));

    this.listenFacade.handleChecklisteItemClicked(this.checklisteName, 'CONFIGURATION', payload);
  }
}
