import { Checklistentyp, EventType } from "../shared/domain/constants";
import { VorlagenState } from "./+state/vorlagen.reducer";

export interface ChecklistenvorlageItem {
    readonly typ: Checklistentyp;
    readonly name: string;
};

export interface ChecklistenvorlageDaten {
    readonly typ: Checklistentyp;
    readonly items: ChecklistenvorlageItem[];
};

export interface VorlageAppearance {
    readonly color: string;
};

export interface ChecklistenVorlage {
    readonly vorlageDaten: ChecklistenvorlageDaten;
    readonly appearance: VorlageAppearance;
};

export interface ChecklistenvorlageWithID {
    readonly typ: Checklistentyp;
    readonly vorlage: ChecklistenVorlage;
};

export interface VorlageItemClickedPayload {
    readonly eventType: EventType;
    readonly item: ChecklistenvorlageItem;
};

export const initialChecklistenvorlageItem: ChecklistenvorlageItem = {
    typ: 'EINKAUFSLISTE',
    name: ''
};

export const initialChecklistenVorlage: ChecklistenVorlage = {
    vorlageDaten: {typ: 'EINKAUFSLISTE', items: []},
    appearance: {color: 'red'}
};


export class VorlagenMap {

    private vorlagen: Map<Checklistentyp, ChecklistenVorlage> = new Map();

    constructor(readonly items: ChecklistenvorlageWithID[]) {

        if (items !== undefined) {

            items.forEach( item => {
                this.vorlagen.set(item.typ, item.vorlage);
            })
        }
    }

    public has(typ: Checklistentyp): boolean {

        return this.vorlagen.has(typ);
    }

    public get(typ: Checklistentyp): ChecklistenVorlage | undefined {

        if (!this.has(typ)) {
            return undefined;
        }

        return this.vorlagen.get(typ);
    }

    public toArray(): ChecklistenVorlage[] {

        return [...this.vorlagen.values()];

    }

    public merge(vorlage: ChecklistenVorlage): ChecklistenvorlageWithID[] {

        const result: ChecklistenvorlageWithID[] = [];

        const changedItem: ChecklistenvorlageWithID = {typ: vorlage.vorlageDaten.typ, vorlage: vorlage};

        if (!this.has(vorlage.vorlageDaten.typ)) {
            result.push(changedItem);
        }

        for (const item of this.items) {

            if (item.typ !== vorlage.vorlageDaten.typ) {
                result.push(item);
            } else {
                result.push(changedItem); 
            }

        }

        return result;
    }
}

export class VorlagenMerger {


    public mapToVorlage(vorlageDaten: ChecklistenvorlageDaten): ChecklistenvorlageWithID {

        let color = '';
        
        switch(vorlageDaten.typ) {
            case 'EINKAUFSLISTE': color = 'bisque'; break;
            case 'PACKLISTE': color = 'lavender'; break;
            default: color = '#c6ffb3';
        }

        const vorlage: ChecklistenVorlage = {vorlageDaten: vorlageDaten, appearance: {color: color}}
        return {typ: vorlageDaten.typ, vorlage};
    }

    public addVorlageItem(state: VorlagenState, neuesItem: ChecklistenvorlageItem): VorlagenState {

        if (state.selectedVorlage) {

            const neueItems: ChecklistenvorlageItem[] = [...state.selectedVorlage.vorlageDaten.items];
            neueItems.push(neuesItem);

            const neueItemsSorted = sortItems(neueItems);
            
            const neueVorlage: ChecklistenVorlage = {...state.selectedVorlage, vorlageDaten: {...state.selectedVorlage.vorlageDaten, items: neueItemsSorted}};
            const neueMap: ChecklistenvorlageWithID[] = new VorlagenMap(state.vorlagenMap).merge(neueVorlage);

            return {...state, vorlagenMap: neueMap, selectedVorlage: neueVorlage};

        }
        return {...state};
    }

    public removeVorlageItem(state: VorlagenState, removedItem: ChecklistenvorlageItem): VorlagenState {

        if (state.selectedVorlage) {

            const neueItems: ChecklistenvorlageItem[] = state.selectedVorlage.vorlageDaten.items.filter(item => item.name !== removedItem.name);
            const neueVorlage: ChecklistenVorlage = {...state.selectedVorlage, vorlageDaten: {...state.selectedVorlage.vorlageDaten, items: neueItems}};
            const neueMap: ChecklistenvorlageWithID[] = new VorlagenMap(state.vorlagenMap).merge(neueVorlage);

            return {...state, vorlagenMap: neueMap, selectedVorlage: neueVorlage};
        }       

        return {...state};
    }
}

export function itemsEquals(item1: ChecklistenvorlageItem, item2: ChecklistenvorlageItem): boolean {

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

	return true;

}

export function sortItems(items: ChecklistenvorlageItem[]): ChecklistenvorlageItem[] {
    return items.sort((left, right) => sort(left, right));
}

function sort(item1: ChecklistenvorlageItem, item2: ChecklistenvorlageItem): number {
    return item1.name.localeCompare(item2.name);
}
