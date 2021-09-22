export type Checklistentyp = 'EINKAUFSLISTE' | 'PACKLISTE' | 'TODOS';
export type Modus = 'SCHROEDINGER' | 'CONFIGURATION' | 'EXECUTION';
export type ListeSemantik = 'VORSCHLAGSLISTE' | 'AUSGEWAEHLT';


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
}

export interface ChecklisteTemplate {
	typ: string;
	items: ChecklisteTemplateItem[];
	readTime: number;
}



export interface Filterkriterium {
	modus: Modus;
	semantik: ListeSemantik;
}


