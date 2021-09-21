import { Component, OnInit } from '@angular/core';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { ListenFacade } from '../listen.facade';

@Component({
  selector: 'chl-checklisten-liste',
  templateUrl: './checklisten-liste.component.html',
  styleUrls: ['./checklisten-liste.component.css']
})
export class ChecklistenListeComponent implements OnInit {

  showFilename = !environment.production;

  constructor(public listenFacade: ListenFacade) { }

  ngOnInit(): void {

    this.listenFacade.loadChecklisten();
  }

}
