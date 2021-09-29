export type Checklistentyp = 'EINKAUFSLISTE' | 'PACKLISTE' | 'TODOS';
export type Modus = 'SCHROEDINGER' | 'CONFIGURATION' | 'EXECUTION';
export type ItemPosition = 'VORSCHLAG' | 'AUSGEWAEHLT';
export type ItemAction = 'EDIT' | 'TOGGLE';


export interface ChecklisteItem {
	name: string;
	markiert: boolean;
	optional: boolean;
	erledigt: boolean;
	kommentar?: string;
};

export interface ChecklisteTemplateItem {
	typ: string;
	name: string;
};

export interface ChecklisteTemplate {
	typ: string;
	items: ChecklisteTemplateItem[];
	readTime: number;
};

export interface ChecklisteItemClickedPayload {
	readonly checklisteItem: ChecklisteItem;
	readonly position: ItemPosition;
	readonly action: ItemAction;
};


export interface Filterkriterium {
	modus: Modus;
	position: ItemPosition;
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

function stringsEqual(str1?: string, str2?: string): boolean {

	if (str1 === null && str2 === null) {
		return true;
	}

	if (str1 === null && str2 === undefined) {
		return true;
	}

	if (str1 === undefined && str2 === null) {
		return true;
	}

	if (str1 === undefined && str2 === undefined) {
		return true;
	}

	if (str1 === null && str2 !== null) {

		if (str2?.trim().length === 0) {
			return true;
		}

		return false;
	}

	if (str1 !== null && str2 === null) {

		if (str1?.trim().length === 0) {
			return true;
		}

		return false;
	}

	if (str1 === undefined && str2 !== undefined) {
		return false;
	}

	if (str1 !== undefined && str2 === undefined) {
		return false;
	}

	return str1 === str2;
}


