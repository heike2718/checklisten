import { ListenState } from "./+state/listen.reducer";
import { stringsEqual } from "../shared/utils";
import { Checklistentyp, EventType, ItemAction, ItemPosition, Modus } from "../shared/domain/constants";




export interface ChecklisteDaten {
	kuerzel: string;
	name: string;
	typ: Checklistentyp;
	gruppe?: string;
	items: ChecklisteItem[];
	version: number;	
};

export interface ChecklisteAppearance {
    readonly anzahlItems: number;
    readonly color: string;
    readonly modus: Modus;
    readonly itemsOben: ChecklisteItem[];
    readonly itemsUnten: ChecklisteItem[];
};

export interface Checkliste {
    checkisteDaten: ChecklisteDaten;
    appearance: ChecklisteAppearance;
};

export interface ChecklisteWithID {
    readonly kuerzel: string;
    readonly checkliste: Checkliste;
};

export interface SaveChecklisteContext {
    readonly checkliste: Checkliste,
    readonly modus: Modus,
    readonly neueCheckliste: boolean
};


export const initialChecklisteAppearance: ChecklisteAppearance = {
    anzahlItems: 0,
    color: 'bisque',
    modus: 'SCHROEDINGER',
    itemsOben: [],
    itemsUnten: []
};

const initialChecklisteDaten: ChecklisteDaten = {
    kuerzel: '',
    name: '',
    typ: 'EINKAUFSLISTE',
    gruppe: undefined,
    items: [],
    version: 0
};


export const initialCheckliste: Checkliste = {
    checkisteDaten: initialChecklisteDaten,
    appearance: initialChecklisteAppearance
};


export class ChecklistenMap {

    private checklisten: Map<string, Checkliste> = new Map();

    constructor(readonly items: ChecklisteWithID[]) {

        if (items !== undefined) {
            for (const item of items) {
                this.checklisten.set(item.kuerzel, item.checkliste);
            }
        }
    }

    public has(kuerzel: string): boolean {

		return this.checklisten.has(kuerzel);
	}

    public get(kuerzel: string): Checkliste | undefined {

        return this.checklisten.get(kuerzel);
    }

    public toArray(): Checkliste[] {

        const result: Checkliste[] = [...this.checklisten.values()];

        result.sort((c1,c2) => this.compareChecklisten(c1, c2));
        return result;
    }

    public merge(checkliste: Checkliste): ChecklisteWithID[]  {

        const result: ChecklisteWithID[] = [];

        if (!this.has(checkliste.checkisteDaten.kuerzel)) {
            result.push({kuerzel: checkliste.checkisteDaten.kuerzel, checkliste: checkliste});
        }

        for (const item of this.items) {

            if (item.kuerzel !== checkliste.checkisteDaten.kuerzel) {
                result.push(item);
            } else {
                result.push({kuerzel: checkliste.checkisteDaten.kuerzel, checkliste: checkliste});
            }
        }

        result.sort((c1,c2) => this.compareChecklistenWithID(c1, c2));
        return result;
    }

    public remove(kuerzel: string): ChecklisteWithID[] {

        const result: ChecklisteWithID[] = [];

        for (const item of this.items) {

            if (kuerzel !== item.kuerzel) {
                result.push(item);
            }

        }

        result.sort((c1,c2) => this.compareChecklistenWithID(c1, c2));
        return result;

    }

    private compareChecklisten(checkliste1: Checkliste, checkliste2: Checkliste) : number {
        return checkliste1.checkisteDaten.name.localeCompare(checkliste2.checkisteDaten.name);
    }

    private compareChecklistenWithID(checkliste1: ChecklisteWithID, checkliste2: ChecklisteWithID) : number {
        return checkliste1.checkliste.checkisteDaten.name.localeCompare(checkliste2.checkliste.checkisteDaten.name);
    }

};

export class ChecklisteMerger {

    public mergeChecklisteItems(state: ListenState, checklisteItem: ChecklisteItem, checklisteName: string, add: boolean): ListenState {

        if (state.selectedCheckliste) {

            const modus: Modus = state.selectedCheckliste.appearance.modus;

            let neueItems: ChecklisteItem[] = [];

            if (add) {

                const vorhandene: ChecklisteItem[] = state.selectedCheckliste.checkisteDaten.items.filter(item => item.name.toLocaleLowerCase() === checklisteItem.name.toLocaleLowerCase());

                if (vorhandene.length === 0) {
                    neueItems.push(checklisteItem);
                }            
    
            }

            for (const item of state.selectedCheckliste.checkisteDaten.items) {
                if (item.name.toLocaleLowerCase() === checklisteItem.name.toLocaleLowerCase()) {
                    neueItems.push(checklisteItem);
                } else {
                    neueItems.push({...item});
                }
            }

            const changedChecklisteDaten = {...state.selectedCheckliste.checkisteDaten, items: neueItems, name: checklisteName};
            const itemsOben = [...getItemsOben(changedChecklisteDaten.items, modus)];
            const itemsUnten = [...getItemsUnten(changedChecklisteDaten.items, modus)];           
            const appearance: ChecklisteAppearance = {...state.selectedCheckliste.appearance, itemsOben: itemsOben, itemsUnten:itemsUnten, anzahlItems: itemsUnten.length};
            const neueCheckliste: Checkliste = {checkisteDaten: changedChecklisteDaten, appearance: appearance};
            const checklistenMap: ChecklisteWithID[] = new ChecklistenMap(state.checklistenMap).merge(neueCheckliste);
            return {...state, selectedCheckliste: neueCheckliste, checklistenMap: checklistenMap}; 
        }

        return {...state};
    }

    public mapToCheckliste(checklisteDaten: ChecklisteDaten): Checkliste {

        let color = '';
        
        switch(checklisteDaten.typ) {
            case 'EINKAUFSLISTE': color = 'bisque'; break;
            case 'PACKLISTE': color = 'lavender'; break;
            default: color = '#c6ffb3';
        }

        const kriterium: Filterkriterium = {
            modus: 'EXECUTION',
            position: 'VORSCHLAG'
        };
    
        const anzahlItems = filterChecklisteItems(checklisteDaten.items, kriterium).length;
        const checklisteAppearance: ChecklisteAppearance = {...initialChecklisteAppearance, modus: 'SCHROEDINGER', anzahlItems: anzahlItems, color: color};

        return {
            checkisteDaten: checklisteDaten,
            appearance: checklisteAppearance
        };
    }

    public undoChanges(state: ListenState): ListenState {

        if (state.selectedCheckliste && state.checklisteCache) {
            
            const neueMap = new ChecklistenMap(state.checklistenMap).merge(state.checklisteCache);
            return {...state, checklistenMap: neueMap, changesDiscarded: false, selectedCheckliste: {...state.checklisteCache}};            
        }

        return {...state, changesDiscarded: false};

    }
}


export interface ChecklisteItem {
	name: string;
	markiert: boolean;
	optional: boolean;
	erledigt: boolean;
	kommentar?: string;
};

export interface ChecklisteItemClickedPayload {
	readonly eventType: EventType,
	readonly checklisteItem: ChecklisteItem;
	readonly position: ItemPosition;
	readonly action: ItemAction;
	readonly modus: Modus;
};

export const initialChecklisteItem: ChecklisteItem = {
	name: '',
	markiert: false,
	optional: false,
	erledigt: false,
	kommentar: ''
};

export function itemsEquals(item1: ChecklisteItem, item2: ChecklisteItem): boolean {

	if (!item1 && !item2) {
		return true;
	}

	if (!item1 && item2) {
		return false;
	}

	if (item1 && !item2) {
		return false;
	}

	if (item1.name !== item2.name) {
		return false;	
	}

	if (!stringsEqual(item1.kommentar, item2.kommentar)) {
		return false;
	}

	if (item1.erledigt !== item2.erledigt) {
		return false;
	}

	if (item1.markiert !== item2.markiert) {
		return false;
	}

	if (item1.optional !== item2.optional) {
		return false;
	}
	return true;

}

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
interface Filterkriterium {
	modus: Modus;
	position: ItemPosition;
};


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

    let unsortedResult: ChecklisteItem[] = [];

	switch (position) {
		case 'VORSCHLAG':
			unsortedResult = items.filter(it => !it.markiert);
            break;
		case 'AUSGEWAEHLT':
			unsortedResult = items.filter(it => it.markiert);
            break;
		default: return [];
	}

    return unsortedResult.sort((left, right) => sortChecklisteItems(left, right));

}

function getListeExecution(items: ChecklisteItem[], position: ItemPosition): ChecklisteItem[] {
	
    if (!position) {
		return [];
	}

    let unsortedResult: ChecklisteItem[] = [];

	switch (position) {
		case 'VORSCHLAG':
			unsortedResult = items.filter(it => it.markiert && !it.erledigt);
            break;
		case 'AUSGEWAEHLT':
			unsortedResult = items.filter(it => it.markiert && it.erledigt);
            break;
		default: return [];
	}

    return unsortedResult.sort((left, right) => sortChecklisteItems(left, right));
}

function sortChecklisteItems(item1: ChecklisteItem, item2: ChecklisteItem): number {

    return item1.name.localeCompare(item2.name);


}



