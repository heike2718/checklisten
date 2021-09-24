import { ChecklisteItem, Checklistentyp, Modus } from "../shared/domain/checkliste";
import { getItemsOben, getItemsUnten } from "../shared/utils";
import { ListenState } from "./+state/listen.reducer";


export interface ChecklisteDaten {
	kuerzel: string;
	name: string;
	typ: Checklistentyp;
	gruppe?: string;
	items: ChecklisteItem[];
	version: number;	
};

export interface ChecklisteAppearence {
    readonly anzahlItems: number;
    readonly color: string;
    readonly modus: Modus;
    readonly itemsOben: ChecklisteItem[];
    readonly itemsUnten: ChecklisteItem[];
};

export interface Checkliste {
    checkisteDaten: ChecklisteDaten;
    appearence: ChecklisteAppearence;
};

export interface ChecklisteWithID {
    readonly kuerzel: string;
    readonly checkliste: Checkliste;
};


export const initialChecklisteAppearence: ChecklisteAppearence = {
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
    appearence: initialChecklisteAppearence
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

        return [...this.checklisten.values()];
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

    private compareChecklistenWithID(checkliste1: ChecklisteWithID, checkliste2: ChecklisteWithID) : number {
        return checkliste1.checkliste.checkisteDaten.name.localeCompare(checkliste2.checkliste.checkisteDaten.name);
    }

};

export class ChecklisteItemMerger {

    public mergeChecklisteItems(state: ListenState, checklisteItem: ChecklisteItem, checklisteName: string, add: boolean): ListenState {

        if (state.selectedCheckliste) {

            const modus: Modus = 'CONFIGURATION';

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
            const appearence: ChecklisteAppearence = {...state.selectedCheckliste.appearence, itemsOben: itemsOben, itemsUnten:itemsUnten, anzahlItems: itemsUnten.length};
            const neueCheckliste: Checkliste = {checkisteDaten: changedChecklisteDaten, appearence: appearence};
            const checklistenMap: ChecklisteWithID[] = new ChecklistenMap(state.checklistenMap).merge(neueCheckliste);
            return {...state, selectedCheckliste: neueCheckliste, checklistenMap: checklistenMap};
 
        }

        return {...state};
    }

}
