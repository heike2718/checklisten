import { RouterReducerState,RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';
import { ChecklistenItem, Checklistentyp, Filterkriterium, ListeSemantik } from './domain/checkliste';


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

export function filterChecklisteItems(items: ChecklistenItem[], filterkriterium: Filterkriterium): ChecklistenItem[] {

	switch (filterkriterium.modus) {
		case 'CONFIGURATION':
			return getListeConfiguration(items, filterkriterium.semantik);
		case 'EXECUTION':
			return getListeExecution(items, filterkriterium.semantik);
		default: return [];
	}
}

// === private functions ==/
function getListeConfiguration(items: ChecklistenItem[], semantik: ListeSemantik): ChecklistenItem[] {

	if (!semantik) {
		return [];
	}

	switch (semantik) {
		case 'VORSCHLAGSLISTE':
			return items.filter(it => !it.markiert);
		case 'AUSGEWAEHLT':
			return items.filter(it => it.markiert);
		default: return [];
	}
}

function getListeExecution(items: ChecklistenItem[], semantik: ListeSemantik): ChecklistenItem[] {
	if (!semantik) {
		return [];
	}
	switch (semantik) {
		case 'VORSCHLAGSLISTE':
			return items.filter(it => it.markiert && !it.erledigt);
		case 'AUSGEWAEHLT':
			return items.filter(it => it.markiert && it.erledigt);
		default: return [];
	}
}


