import { RouterReducerState,RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';
import { ChecklisteItem, Checklistentyp, Filterkriterium, ItemPosition, Modus } from './domain/checkliste';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export interface State {
  router: RouterReducerState<RouterStateUrl>;
}

export const modalOptions: NgbModalOptions = {
    backdrop:'static',
    centered:true,
    ariaLabelledBy: 'modal-basic-title'
};

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {

	let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const { url, root: { queryParams } } = routerState;
	const { params } = route;

    return { url, params, queryParams };
  }
};

export function getBackgroundColorByChecklistentyp(typ: Checklistentyp) {
	switch (typ) {
		case 'EINKAUFSLISTE':
			return 'bisque';
		case 'PACKLISTE':
			return 'lavender';
		case 'TODOS':
			return '#c6ffb3';
	}
};

export function getItemsOben(items: ChecklisteItem[], modus: Modus): ChecklisteItem[] {

	switch(modus) {
		case 'CONFIGURATION':
			return getItemsObenFuerKonfiguration(items);
	    case 'EXECUTION':
			return getItemsObenFuerAbarbeitung(items);
	}
	return [];
}

export function getItemsUnten(items: ChecklisteItem[], modus: Modus): ChecklisteItem[] {

	switch(modus) {
		case 'CONFIGURATION':
			return getItemsUntenFuerKonfiguration(items);
	    case 'EXECUTION':
			return getItemsUntenFuerAbarbeitung(items);
	}
	return [];
}

export function filterChecklisteItems(items: ChecklisteItem[], filterkriterium: Filterkriterium): ChecklisteItem[] {

	switch (filterkriterium.modus) {
		case 'CONFIGURATION':
			return getListeConfiguration(items, filterkriterium.position);
		case 'EXECUTION':
			return getListeExecution(items, filterkriterium.position);
		default: return [];
	}
}

// === private functions ==/
function getItemsObenFuerKonfiguration(items: ChecklisteItem[]): ChecklisteItem[] {
	return items.filter(it => !it.markiert);
}

function getItemsObenFuerAbarbeitung(items: ChecklisteItem[]): ChecklisteItem[] {
	return items.filter(it => it.markiert && !it.erledigt);
}

function getItemsUntenFuerKonfiguration(items: ChecklisteItem[]): ChecklisteItem[] {
	return items.filter(it => it.markiert && !it.erledigt);
}

function getItemsUntenFuerAbarbeitung(items: ChecklisteItem[]): ChecklisteItem[] {
	return items.filter(it => it.markiert && it.erledigt);
}

function getListeConfiguration(items: ChecklisteItem[], position: ItemPosition): ChecklisteItem[] {

	if (!position) {
		return [];
	}

	switch (position) {
		case 'VORSCHLAG':
			return items.filter(it => !it.markiert);
		case 'AUSGEWAEHLT':
			return items.filter(it => it.markiert);
		default: return [];
	}
}

function getListeExecution(items: ChecklisteItem[], position: ItemPosition): ChecklisteItem[] {
	if (!position) {
		return [];
	}
	switch (position) {
		case 'VORSCHLAG':
			return items.filter(it => it.markiert && !it.erledigt);
		case 'AUSGEWAEHLT':
			return items.filter(it => it.markiert && it.erledigt);
		default: return [];
	}
}


