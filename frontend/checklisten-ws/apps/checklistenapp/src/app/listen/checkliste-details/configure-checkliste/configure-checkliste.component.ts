import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { Subscription } from 'rxjs';
import { LogService } from '../../../infrastructure/logging/log.service';
import { ChecklisteItem, ChecklisteItemClickedPayload } from '../../../shared/domain/checkliste';
import { ListenFacade } from '../../listen.facade';

@Component({
  selector: 'chl-configure',
  templateUrl: './configure-checkliste.component.html',
  styleUrls: ['./configure-checkliste.component.css']
})
export class ConfigureChecklisteComponent implements OnInit, OnDestroy {

  // das ! verhindert, dass eine sofortige Initialisierung verlangt wird, denn die ist hier nicht sinnvoll.
  @ViewChild('dialogEditItem')
	dialogEditItem!: TemplateRef<HTMLElement>;

  checklisteName: string = '';

  showFilename = !environment.production;

  dialogNewItemVisible = false;
  dialogTitle: string = '';

  itemName: string = '';
  itemKommentar: string = '';
  itemOptional: boolean = false;

  private checklisteSubscription: Subscription = new Subscription();

  constructor(public listenFacade: ListenFacade
    , private modalService: NgbModal
    , private logger: LogService) { }

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

  formDisabled(): boolean {
    return this.itemName.trim().length === 0;
  }

  onItemClicked($event: any): void {
    
    const payload: ChecklisteItemClickedPayload = $event;
    this.logger.debug(JSON.stringify(payload));

    switch(payload.action) {
      case 'TOGGLE': this.listenFacade.handleChecklisteItemClicked(this.checklisteName.trim(), 'CONFIGURATION', payload); break;
      case 'EDIT': this.openDialogEditItem({...payload.checklisteItem}); break;
    }    
  }

  toggleDialogNewItemVisible(): void {
    
    this.dialogNewItemVisible = !this.dialogNewItemVisible;
    this.openDialogNewItem();
  }

  openDialogNewItem(): void {

    this.dialogTitle = 'Neues Teil';

    this.modalService.open(this.dialogEditItem, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      this.dialogNewItemVisible = !this.dialogNewItemVisible;
      this.dialogTitle = '';

			if (result === 'OK') {
				this.saveChanges(true);
			}

      if (result === 'NO') {
        this.resetDialogModel();
      }
		});
  }

  private openDialogEditItem(checklisteItem: ChecklisteItem): void {

    this.dialogTitle = 'Teil ändern';

    this.itemName = checklisteItem.name;
    this.itemOptional = checklisteItem.optional;
    this.itemKommentar = checklisteItem.kommentar ? checklisteItem.kommentar : '';

    this.modalService.open(this.dialogEditItem, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      this.dialogTitle = '';
			if (result === 'OK') {
				this.saveChanges(false);
			} 

      if (result === 'NO') {
				this.resetDialogModel();
			}
		});
  }

  private saveChanges(neuesItem: boolean): void {

    // TODO: hier trim() nicht vergessen!
    const neues: ChecklisteItem = {
      name: this.itemName.trim(),
      erledigt: false,
      markiert: true,
      optional: this.itemOptional,
      kommentar: this.itemKommentar.trim()
    };

    if (neuesItem) {
      this.listenFacade.addItem(this.checklisteName.trim(), neues);
    } else {
      this.listenFacade.changeItem(this.checklisteName.trim(), neues);
    }
  }

  private resetDialogModel(): void {
    this.itemKommentar = '';
    this.itemName = '';
    this.itemOptional = false;
  }
}
