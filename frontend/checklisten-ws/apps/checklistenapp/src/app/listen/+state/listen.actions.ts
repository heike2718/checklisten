import { createAction, props } from '@ngrx/store';
import { ChecklistenItemClickedPayload, Modus } from '../../shared/domain/checkliste';
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

export const checklisteItemClickedOnConfiguration = createAction(
    '[ListenFacade] handleChecklisteItemClicked modus CONFIGURATION',
    props<{checklisteName: string, clickPayload: ChecklistenItemClickedPayload}>()
);

export const checklisteItemClickedOnExecution = createAction(
    '[ListenFacade] handleChecklisteItemClicked modus EXECUTION',
    props<{checklisteName: string, clickPayload: ChecklistenItemClickedPayload}>()
);

export const resetModule = createAction(
	'[ListenFacade] reset'
);