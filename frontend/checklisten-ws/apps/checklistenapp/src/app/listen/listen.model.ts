export const EINKAUFSLISTE = 'EINKAUFSLISTE';
export const PACKLISTE = 'PACKLISTE';
export const TODOS = 'TODOS';

export const MODUS_SCHROEDINGER = 'schroedinger';
export const MODUS_CONFIG = 'configuration';
export const MODUS_EXEC = 'execution';

export type Modus = 'schroedinger' | 'configuration' | 'execution';
export type Checklistentyp = 'EINKAUFSLISTE' | 'PACKLISTE' | 'TODOS';

export const LISTE_VORSCHLAEGE = 'vorschlagsliste';

export const LISTE_AUSGEWAEHLT = 'ausgewaehlt';


export interface ChecklistenItem {
	name: string;
	markiert: boolean;
	optional: boolean;
	erledigt: boolean;
	kommentar?: string;
};

export interface ChecklisteDaten {
	kuerzel: string;
	name: string;
	typ: string;
	gruppe?: string;
	items: ChecklistenItem[];
	version: number;
	modus: string;
};

export interface ChecklisteWithID {
    readonly kuerzel: string;
    readonly checkliste: ChecklisteDaten;
};

export class ChecklistenMap {

    private checklisten: Map<string, ChecklisteDaten> = new Map();

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

    public get(kuerzel: string): ChecklisteDaten | undefined {

        return this.checklisten.get(kuerzel);
    }

    public toArray(): ChecklisteDaten[] {

        return [...this.checklisten.values()];
    }

    public merge(checkliste: ChecklisteDaten): ChecklisteWithID[]  {

        const result: ChecklisteWithID[] = [];

        if (!this.has(checkliste.kuerzel)) {
            result.push({kuerzel: checkliste.kuerzel, checkliste: checkliste});
        }

        for (const item of this.items) {

            if (item.kuerzel !== checkliste.kuerzel) {
                result.push(item);
            } else {
                result.push({kuerzel: checkliste.kuerzel, checkliste: checkliste});
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
        return checkliste1.checkliste.name.localeCompare(checkliste2.checkliste.name);
    }

};

