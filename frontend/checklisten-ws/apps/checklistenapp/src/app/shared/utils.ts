import { RouterReducerState,RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';
import { ChecklistenItem, Checklistentyp, Filterkriterium, ItemPosition, Modus } from './domain/checkliste';


export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export interface State {
  router: RouterReducerState<RouterStateUrl>;
}

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
			// return 'aqua';
			return '#c6ffb3';
	}

	return 'aqua';
};

export function getItemsOben(items: ChecklistenItem[], modus: Modus): ChecklistenItem[] {

	switch(modus) {
		case 'CONFIGURATION':
			return getItemsObenFuerKonfiguration(items);
	    case 'EXECUTION':
			return getItemsObenFuerAbarbeitung(items);
	}
	return [];
}

export function getItemsUnten(items: ChecklistenItem[], modus: Modus): ChecklistenItem[] {

	switch(modus) {
		case 'CONFIGURATION':
			return getItemsUntenFuerKonfiguration(items);
	    case 'EXECUTION':
			return getItemsUntenFuerAbarbeitung(items);
	}
	return [];
}

export function filterChecklisteItems(items: ChecklistenItem[], filterkriterium: Filterkriterium): ChecklistenItem[] {

	switch (filterkriterium.modus) {
		case 'CONFIGURATION':
			return getListeConfiguration(items, filterkriterium.position);
		case 'EXECUTION':
			return getListeExecution(items, filterkriterium.position);
		default: return [];
	}
}

// === private functions ==/
function getItemsObenFuerKonfiguration(items: ChecklistenItem[]): ChecklistenItem[] {
	return items.filter(it => !it.markiert);
}

function getItemsObenFuerAbarbeitung(items: ChecklistenItem[]): ChecklistenItem[] {
	return items.filter(it => it.markiert);
}

function getItemsUntenFuerKonfiguration(items: ChecklistenItem[]): ChecklistenItem[] {
	return items.filter(it => it.markiert && !it.erledigt);
}

function getItemsUntenFuerAbarbeitung(items: ChecklistenItem[]): ChecklistenItem[] {
	return items.filter(it => it.markiert && it.erledigt);
}



function getListeConfiguration(items: ChecklistenItem[], position: ItemPosition): ChecklistenItem[] {

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

function getListeExecution(items: ChecklistenItem[], position: ItemPosition): ChecklistenItem[] {
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


