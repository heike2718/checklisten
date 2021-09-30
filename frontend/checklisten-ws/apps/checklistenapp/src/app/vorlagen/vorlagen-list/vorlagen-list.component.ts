import { Component, OnInit } from '@angular/core';
import { environment } from 'apps/checklistenapp/src/environments/environment';

@Component({
  selector: 'chl-vorlagen-list',
  templateUrl: './vorlagen-list.component.html',
  styleUrls: ['./vorlagen-list.component.css']
})
export class VorlagenListComponent implements OnInit {

  showFilename = !environment.production;

  constructor() { }

  ngOnInit(): void {
  }

}
