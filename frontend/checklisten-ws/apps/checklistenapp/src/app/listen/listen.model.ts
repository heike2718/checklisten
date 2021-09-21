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
	kuerzel?: string;
	name?: string;
	typ: string;
	gruppe?: string;
	items: ChecklistenItem[];
	version: number;
	modus?: string;
};
