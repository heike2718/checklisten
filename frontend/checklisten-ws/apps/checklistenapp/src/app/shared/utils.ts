import { Checklistentyp } from './domain/constants';

export function getBackgroundColorByChecklistentyp(typ: Checklistentyp) {
	switch (typ) {
		case 'EINKAUFSLISTE':
			return 'bisque';
		case 'PACKLISTE':
			return 'lavender';
		case 'TODOS':
			return '#c6ffb3';
	}
};


export function stringsEqual(str1?: string, str2?: string): boolean {

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



