import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { Subscription } from 'rxjs';
import { ChecklisteItem, ChecklisteItemClickedPayload } from '../../listen.model';
import { ListenFacade } from '../../listen.facade';
import { modalOptions } from '../../../shared/domain/constants';
import { Checkliste, SaveChecklisteContext } from '../../listen.model';

@Component({
  selector: 'chl-configure',
  templateUrl: './configure-checkliste.component.html',
  styleUrls: ['./configure-checkliste.component.css']
})
export class ConfigureChecklisteComponent implements OnInit, OnDestroy {

  private unsavedChanges = false;
  private cancelClicked = false;
  private saveClicked = false;

  // das ! verhindert, dass eine sofortige Initialisierung verlangt wird, denn die ist hier nicht sinnvoll.
  @ViewChild('dialogEditItem')
	dialogEditItem!: TemplateRef<HTMLElement>;

  // das ! verhindert, dass eine sofortige Initialisierung verlangt wird, denn die ist hier nicht sinnvoll.
  @ViewChild('dialogUnsavedChanges')
	dialogUnsavedChanges!: TemplateRef<HTMLElement>;

  checklisteName: string = '';

  showFilename = !environment.production;

  dialogNewItemVisible = false;
  dialogTitle: string = '';

  itemName: string = '';
  itemKommentar: string = '';
  itemOptional: boolean = false;

  private checkliste!: Checkliste;
  private cachedName?: string;

  private checklisteSubscription: Subscription = new Subscription();
  private unsavedChangesSubsrciption: Subscription = new Subscription();
  private cachedNameSubscription: Subscription = new Subscription();

  constructor(public listenFacade: ListenFacade
    , private router: Router
    , private modalService: NgbModal) { }

  ngOnInit(): void {

    this.cancelClicked = false;
    this.saveClicked = false;

    this.checklisteSubscription = this.listenFacade.selectedCheckliste$.subscribe(
      liste => {
        if (liste) {
          this.checklisteName = liste.checkisteDaten.name;
          this.checkliste = {...liste};
        }
      }
    );

    this.unsavedChangesSubsrciption = this.listenFacade.unsavedChanges$.subscribe ( changes => this.unsavedChanges = changes);
    this.cachedNameSubscription = this.listenFacade.cachedChecklistenname$.subscribe( name => this.cachedName = name);
  }

  ngOnDestroy(): void {
    this.checklisteSubscription.unsubscribe();
    this.unsavedChangesSubsrciption.unsubscribe();
    this.cachedNameSubscription.unsubscribe();
  }

  formDisabled(): boolean {
    return this.itemName.trim().length === 0;
  }

  onItemClicked($event: any): void {

    if ($event && $event.eventType === 'CHECKLISTEITEM_CLICKED') {
    
      const payload: ChecklisteItemClickedPayload = $event;

      if (payload.modus === 'CONFIGURATION') {
        switch(payload.action) {
          case 'TOGGLE': this.listenFacade.handleChecklisteItemClicked(this.checklisteName.trim(), payload); break;
          case 'EDIT': this.openDialogEditItem({...payload.checklisteItem}); break;
        }   
      } 
    }
  }

  toggleDialogNewItemVisible(): void {
    
    this.dialogNewItemVisible = !this.dialogNewItemVisible;
    this.openDialogNewItem();
  }

  async canDeactivate(): Promise<boolean> {

    if (this.cancelClicked || this.saveClicked) {
      return true;
    }

    if (!this.unsavedChanges && this.cachedName === this.checklisteName) {
      return true;
    }

    const modalRef = this.modalService.open(this.dialogUnsavedChanges, modalOptions);
    const response = await modalRef.result;

    if (response === 'DISCARD') {
      this.listenFacade.discardChanges();
    }

    return response === 'DISCARD';
  }  

  openDialogNewItem(): void {

    this.dialogTitle = 'Neues Teil';

    this.modalService.open(this.dialogEditItem, modalOptions).result.then((result) => {

      this.dialogNewItemVisible = !this.dialogNewItemVisible;
      this.dialogTitle = '';

			if (result === 'OK') {
        this.saveItem(true);
			}

      if (result === 'NO') {
        this.resetDialogModel();
      }
		});
  }  

  submit(): void {
    this.saveClicked = true;    
    const context: SaveChecklisteContext = {
      checkliste: {...this.checkliste, checkisteDaten: {...this.checkliste.checkisteDaten, name: this.checklisteName}},
      modus: 'CONFIGURATION',
      neueCheckliste: this.checkliste.checkisteDaten.kuerzel === 'neu'
    }    
    this.listenFacade.saveCheckliste(context);
    this.saveClicked = false;
  }

  undo(): void {
    this.cancelClicked = true;
    this.listenFacade.discardChanges();
    this.cancelClicked = false;
  }

  gotoListen(): void {
    this.router.navigateByUrl('/listen');
  }

  saveDisabled(): boolean {

    if (this.saveClicked) {
      return true;
    }

    if (this.checklisteName.trim().length === 0) {
      return true;
    }

    return false;
  }

  undoDisabled(): boolean {
    return !this.unsavedChanges;
  }

// ///////////////////////////////////////////////////////////////////////////////////////
// private members

  private openDialogEditItem(checklisteItem: ChecklisteItem): void {

    this.dialogTitle = 'Teil ändern';

    this.itemName = checklisteItem.name;
    this.itemOptional = checklisteItem.optional;
    this.itemKommentar = checklisteItem.kommentar ? checklisteItem.kommentar : '';

    this.modalService.open(this.dialogEditItem, modalOptions).result.then((result) => {

      this.dialogTitle = '';
			if (result === 'OK') {
        this.saveItem(false);
			} 

      if (result === 'NO') {
				this.resetDialogModel();
			}
		});
  }

  private saveItem(neuesItem: boolean): void {

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
