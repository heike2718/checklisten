import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { ListenFacade } from '../listen.facade';
import { Checklistentyp } from '../../shared/domain/constants';
import { MessageService } from '../../shared/messages/message.service';
import { modalOptions } from '../../shared/domain/constants';

@Component({
  selector: 'chl-checklisten-list',
  templateUrl: './checklisten-list.component.html',
  styleUrls: ['./checklisten-list.component.css']
})
export class ChecklistenListComponent implements OnInit {

  showFilename = !environment.production;
  dialogNeueChecklisteVisible = false;

  nameListe: string = '';

  // das ! verhindert, dass eine sofortige Initialisierung verlangt wird, denn die ist hier nicht sinnvoll.
  @ViewChild('dialogNeueCheckliste')
	dialogNeueCheckliste!: TemplateRef<HTMLElement>;

  constructor(public listenFacade: ListenFacade
    , private messageService: MessageService
    , private modalService: NgbModal) { }

  ngOnInit(): void {

    this.messageService.clear();
    this.listenFacade.loadChecklisten();
        
  }

  showDialogNeueCheckliste(): void {
    this.dialogNeueChecklisteVisible = !this.dialogNeueChecklisteVisible;
    this.openDialogNeueCheckliste();
  }

  addListeDisabled(): boolean {
		return !this.nameListe || this.nameListe.trim().length <= 2;    
	}

  private openDialogNeueCheckliste(): void {

    this.nameListe = '';  

    this.modalService.open(this.dialogNeueCheckliste, modalOptions).result.then((result) => {

      this.dialogNeueChecklisteVisible = !this.dialogNeueChecklisteVisible;

      let typ: Checklistentyp | undefined;

      if (result === 'EINKAUFSLISTE') {
        typ = 'EINKAUFSLISTE';
      }
      if (result === 'PACKLISTE') {
        typ = 'PACKLISTE';
      }
      if (result === 'TODOS') {
        typ = 'TODOS';
      }
      
      if (typ) {
        this.checklisteAnlegen(typ);
      }      
		});
  }

  private checklisteAnlegen(typ: Checklistentyp): void {
    this.listenFacade.addCheckliste(this.nameListe, typ);
  }
}
