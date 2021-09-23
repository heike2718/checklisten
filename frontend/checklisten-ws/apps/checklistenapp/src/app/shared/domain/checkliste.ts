export type Checklistentyp = 'EINKAUFSLISTE' | 'PACKLISTE' | 'TODOS';
export type Modus = 'SCHROEDINGER' | 'CONFIGURATION' | 'EXECUTION';
export type ItemPosition = 'VORSCHLAG' | 'AUSGEWAEHLT';


export interface ChecklistenItem {
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

export interface ChecklistenItemClickedPayload {
	readonly checklistenItem:ChecklistenItem;
	readonly position: ItemPosition;
};


export interface Filterkriterium {
	modus: Modus;
	position: ItemPosition;
};

export const initialChecklistenItem: ChecklistenItem = {
	name: '',
	markiert: false,
	optional: false,
	erledigt: false,
	kommentar: ''
};


