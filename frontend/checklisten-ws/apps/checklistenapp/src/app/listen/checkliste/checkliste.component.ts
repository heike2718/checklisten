import { Component, Input, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { Filterkriterium } from '../../shared/domain/checkliste';
import { filterChecklisteItems } from '../../shared/utils';
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

  constructor(private router: Router
    , private listenFacade: ListenFacade) { }

  ngOnInit(): void { }

	configure() {
		this.router.navigateByUrl('/checkliste/configuration/' + this.checkliste.checkisteDaten.kuerzel);
	}
	execute() {
		this.router.navigateByUrl('/checkliste/execution/' + this.checkliste.checkisteDaten.kuerzel);
	}

	delete() {
		this.listenFacade.deleteCheckliste(this.checkliste.checkisteDaten);
	}

  getStyles() {
    return {
      'backgroundColor': this.checkliste.appearence.color
    };
  }
}
