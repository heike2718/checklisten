import { Component, OnInit,ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { Subscription } from 'rxjs';
import { ChecklisteItemClickedPayload } from '../../listen.model';
import { modalOptions } from '../../../shared/domain/constants';
import { ListenFacade } from '../../listen.facade';
import { Checkliste, SaveChecklisteContext } from '../../listen.model';

@Component({
  selector: 'chl-execute-checkliste',
  templateUrl: './execute-checkliste.component.html',
  styleUrls: ['./execute-checkliste.component.css']
})
export class ExecuteChecklisteComponent implements OnInit, OnDestroy {

  public unsavedChanges!: boolean;
  showFilename = !environment.production;

  private cancelClicked = false;
  private saveClicked = false;

  private checkliste?: Checkliste;
  private selectedChecklisteSubscription: Subscription = new Subscription();
  private unsavedChangesSubsciption: Subscription = new Subscription();


  // das ! verhindert, dass eine sofortige Initialisierung verlangt wird, denn die ist hier nicht sinnvoll.
  @ViewChild('dialogUnsavedChanges')
	dialogUnsavedChanges!: TemplateRef<HTMLElement>;

  constructor(public listenFacade: ListenFacade
    , private router: Router
    , private modalService: NgbModal) { }

  ngOnInit(): void {

    this.selectedChecklisteSubscription = this.listenFacade.selectedCheckliste$.subscribe(

      liste => {
        if (liste) {
          this.checkliste = {...liste};
        } else {
          this.checkliste = undefined;
        }
      }
    );

    this.unsavedChangesSubsciption = this.listenFacade.unsavedChanges$.subscribe ( changes => this.unsavedChanges = changes);
  }

  ngOnDestroy(): void {
    this.selectedChecklisteSubscription.unsubscribe();
    this.unsavedChangesSubsciption.unsubscribe();
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
      this.listenFacade.discardChanges();
    }

    return response === 'DISCARD';
  } 

  onItemClicked($event: any): void {

    if (this.checkliste) {

      const payload: ChecklisteItemClickedPayload = $event;

      if (payload.modus === 'EXECUTION') {
        this.listenFacade.handleChecklisteItemClicked(this.checkliste?.checkisteDaten.name, payload)      
      }
    }   
  }

  saveDisabled(): boolean {

    return this.saveClicked || !this.unsavedChanges;
  }

  submit(): void {
    if (this.checkliste) {

      this.saveClicked = true;    
    
      const context: SaveChecklisteContext = {
        checkliste: {...this.checkliste},
        modus: 'EXECUTION',
        neueCheckliste: false
      }

      this.listenFacade.saveCheckliste(context);
      this.saveClicked = false;
    }
  }

  undoDisabled(): boolean {
    return !this.unsavedChanges;
  }

  undo(): void {
    this.cancelClicked = true;
    this.listenFacade.discardChanges();
    this.cancelClicked = false;
  }

  gotoListen(): void {
    this.router.navigateByUrl('/listen');
  }
}
