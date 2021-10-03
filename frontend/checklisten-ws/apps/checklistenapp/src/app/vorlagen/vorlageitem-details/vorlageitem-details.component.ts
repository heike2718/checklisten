import { Component, Input, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { Subscription } from 'rxjs';
import { VorlagenFacade } from '../vorlagen.facade';
import { VorlageItemClickedPayload, ChecklistenvorlageItem, initialChecklistenvorlageItem } from '../vorlagen.model';

@Component({
  selector: 'chl-vorlageitem-details',
  templateUrl: './vorlageitem-details.component.html',
  styleUrls: ['./vorlageitem-details.component.css']
})
export class VorlageitemDetailsComponent implements OnInit, OnDestroy {

  showFilename = !environment.production;

  @Input()
  item: ChecklistenvorlageItem = initialChecklistenvorlageItem;

  @Output()
  vorlageItemDeleted: EventEmitter<VorlageItemClickedPayload> = new EventEmitter<VorlageItemClickedPayload>();

  private color: string = 'white';

  private selectedVorlageSubscription: Subscription = new Subscription();

  constructor(private vorlagenFacade: VorlagenFacade) { }

  ngOnInit(): void {

    this.selectedVorlageSubscription = this.vorlagenFacade.selectedVorlage$.subscribe(

      vorlage => {
        if (vorlage) {
          this.color = vorlage.appearance.color;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.selectedVorlageSubscription.unsubscribe();
  }

  deleteItem(): void {
    this.vorlageItemDeleted.emit({eventType: 'VORLAGEITEM_REMOVED', item: this.item});
  }

  getStyles() {

    return {
      'background-color': this.color
    }
  };
}
