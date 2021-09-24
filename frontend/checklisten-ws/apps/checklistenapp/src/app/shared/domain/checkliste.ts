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


