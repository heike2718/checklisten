import { Checklistentyp } from "../shared/domain/checkliste";

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
