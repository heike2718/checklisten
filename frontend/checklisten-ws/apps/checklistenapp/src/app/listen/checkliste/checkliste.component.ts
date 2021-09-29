import { Component, Input, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { ListenFacade } from '../listen.facade';
import { Checkliste, initialCheckliste } from '../listen.model';

@Component({
  selector: 'chl-checkliste',
  templateUrl: './checkliste.component.html',
  styleUrls: ['./checkliste.component.css']
})
export class ChecklisteComponent implements OnInit {

  @Input()
  checkliste: Checkliste = initialCheckliste;

  showFilename: boolean = !environment.production;

    // das ! verhindert, dass eine sofortige Initialisierung verlangt wird, denn die ist hier nicht sinnvoll.
  @ViewChild('dialogWirklichLoeschen')
  dialogWirklichLoeschen!: TemplateRef<HTMLElement>;
  
  private modalOptions: NgbModalOptions = {
    backdrop:'static',
    centered:true,
    ariaLabelledBy: 'modal-basic-title'
  };

  constructor(private router: Router
    , private modalService: NgbModal
    , private listenFacade: ListenFacade) { }

  ngOnInit(): void { }

	configure() {
		this.listenFacade.startConfigureCheckliste(this.checkliste);
	}
	execute() {
		this.listenFacade.startExecuteCheckliste(this.checkliste);
	}

	delete() {
    
    this.modalService.open(this.dialogWirklichLoeschen, this.modalOptions).result.then((result) => {
      if (result === 'OK') {
       this.doDelete();
      }
		});
	}

  getStyles() {
    return {
      'backgroundColor': this.checkliste.appearence.color
    };
  }

  private doDelete(): void {
    this.listenFacade.deleteCheckliste(this.checkliste.checkisteDaten);
  }
}
