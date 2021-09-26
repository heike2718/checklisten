import { Component, OnInit } from '@angular/core';
import { environment } from 'apps/checklistenapp/src/environments/environment';
import { ListenFacade } from '../listen.facade';

@Component({
  selector: 'chl-checklisten-list',
  templateUrl: './checklisten-list.component.html',
  styleUrls: ['./checklisten-list.component.css']
})
export class ChecklistenListComponent implements OnInit {

  showFilename = !environment.production;

  constructor(public listenFacade: ListenFacade) { }

  ngOnInit(): void {

    this.listenFacade.loadChecklisten();    
  }
}
