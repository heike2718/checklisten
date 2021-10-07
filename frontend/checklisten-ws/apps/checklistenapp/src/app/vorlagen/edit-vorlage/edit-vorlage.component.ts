import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { Subscription } from 'rxjs';
import { modalOptions } from '../../shared/domain/constants';
import { MessageService } from '../../shared/messages/message.service';
import { VorlagenFacade } from '../vorlagen.facade';
import { ChecklistenVorlage, ChecklistenvorlageItem, initialChecklistenVorlage, VorlageItemClickedPayload } from '../vorlagen.model';

@Component({
  selector: 'chl-edit-vorlage',
  templateUrl: './edit-vorlage.component.html',
  styleUrls: ['./edit-vorlage.component.css']
})
export class EditVorlageComponent implements OnInit, OnDestroy {

  showFilename = environment.envName === 'DEV';

  dialogNeuesItemVisible = false;
  
  neuesItemName: string = '';

  // das ! verhindert, dass eine sofortige Initialisierung verlangt wird, denn die ist hier nicht sinnvoll.
  @ViewChild('dialogNeuesItem')
	dialogNeuesItem!: TemplateRef<HTMLElement>;

  // das ! verhindert, dass eine sofortige Initialisierung verlangt wird, denn die ist hier nicht sinnvoll.
  @ViewChild('dialogUnsavedChanges')
	dialogUnsavedChanges!: TemplateRef<HTMLElement>;

  private cancelClicked = false;

  private saveClicked = false;

  private vorlage: ChecklistenVorlage = initialChecklistenVorlage;

  private unsavedChanges = false;

  private selectedVorlageSubscription: Subscription = new Subscription();
  private unsavedChangesSubscription: Subscription = new Subscription();


  constructor( public vorlagenFacade: VorlagenFacade
    , private router: Router
    , private modalService: NgbModal
    , private messageService: MessageService) { }

  ngOnInit(): void {

    this.cancelClicked = false;
    this.saveClicked = false;

    this.selectedVorlageSubscription = this.vorlagenFacade.selectedVorlage$.subscribe(
      vorlage => {

        if (vorlage) {
          this.vorlage = vorlage;
        } else {
          this.cancelClicked = true;
          this.router.navigateByUrl('/vorlagen');
        }
      }
    );

    this.unsavedChangesSubscription = this.vorlagenFacade.unsavedChanges$.subscribe(changes => this.unsavedChanges = changes);
  }

  ngOnDestroy(): void {
    this.selectedVorlageSubscription.unsubscribe();
    this.unsavedChangesSubscription.unsubscribe();
  }

  addItemDisabled(): boolean {
		return !this.neuesItemName || this.neuesItemName.trim().length === 0;    
	}

  saveDisabled(): boolean {

    return this.saveClicked || !this.unsavedChanges;
  }

  undoDisabled(): boolean {
    return !this.unsavedChanges;
  }

  gotoVorlagen(): void {
    this.router.navigateByUrl('/vorlagen');
  }

  submit(): void {    
    this.saveClicked = true;
    this.vorlagenFacade.saveVorlage(this.vorlage);
    this.saveClicked = false;
  }

  undo(): void {
    this.cancelClicked = true;
    this.vorlagenFacade.discardChanges();
    this.cancelClicked = false;
  }

  showDialogNeuesItem(): void {
    this.messageService.clear();
    this.dialogNeuesItemVisible = true;

    this.neuesItemName = '';  

    this.modalService.open(this.dialogNeuesItem, modalOptions).result.then((result) => {

      this.dialogNeuesItemVisible = false;

      if (result === 'OK') {
         const neuesItem: ChecklistenvorlageItem = {typ: this.vorlage.vorlageDaten.typ, name: this.neuesItemName.trim()};
         this.vorlagenFacade.addVorlageItem(neuesItem);
      }
		});
  }

  onItemDeleted($event: any): void {

    if ($event && $event.eventType === 'VORLAGEITEM_REMOVED' ) {

      const payload: VorlageItemClickedPayload = $event;
      this.vorlagenFacade.deleteVorlageItem(payload.item);

    }
  }

  async canDeactivate(): Promise<boolean> {

    if (this.cancelClicked || this.saveClicked) {
      return true;
    }

    if (!this.unsavedChanges) {
      return true;
    }

    const modalRef = this.modalService.open(this.dialogUnsavedChanges, modalOptions);
    const response = await modalRef.result;

    if (response === 'DISCARD') {
      this.vorlagenFacade.discardChanges();
    }

    return response === 'DISCARD';
  }
}
