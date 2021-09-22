import { createAction, props } from '@ngrx/store';
import { Modus } from '../../shared/domain/checkliste';
import { Checkliste, ChecklisteDaten } from '../listen.model';


export const startLoading = createAction(
    '[ListenFacade] before service.loadChecklisten'
);

export const checklistenLoaded = createAction(
    '[ListenFacade] loadChecklisten success',
    props<{checklisten: ChecklisteDaten[]}>()
);

export const loadChecklistenFailed = createAction(
    '[ListenFacade] loadChecklisten error'
);

export const selectCheckliste = createAction(
    '[ListenFacade] executeCheckliste | configureCheckliste',
    props<{checkliste: Checkliste, modus: Modus}>()
);

export const resetModule = createAction(
	'[ListenFacade] reset'
);