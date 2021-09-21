import { createAction, props } from '@ngrx/store';
import { ChecklisteDaten } from '../../shared/domain/checkliste';


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

export const resetModule = createAction(
	'[ListenFacade] reset'
);