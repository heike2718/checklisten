import { createAction, props } from '@ngrx/store';
import { ChecklisteItem, ChecklisteItemClickedPayload, Modus } from '../../shared/domain/checkliste';
import { Checkliste, ChecklisteDaten, SaveChecklisteContext } from '../listen.model';


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

export const deselectCheckliste = createAction(
    '[ListenFacade] deselectCheckliste'
);

export const checklisteItemClickedOnConfiguration = createAction(
    '[ListenFacade] handleChecklisteItemClicked modus CONFIGURATION',
    props<{checklisteName: string, clickPayload: ChecklisteItemClickedPayload}>()
);

export const checklisteItemClickedOnExecution = createAction(
    '[ListenFacade] handleChecklisteItemClicked modus EXECUTION',
    props<{checklisteName: string, clickPayload: ChecklisteItemClickedPayload}>()
);

export const checklisteItemAdded = createAction(
    '[ListenFacade] addItem',
    props<{checklisteName: string, checklisteItem: ChecklisteItem}>()
);

export const checklisteItemChanged = createAction(
    '[ListenFacade] changeItem',
    props<{checklisteName: string, checklisteItem: ChecklisteItem}>()
);

export const checklisteSaved = createAction(
    '[ListenFacade] saveCheckliste success',
    props<{saveChecklisteContext: SaveChecklisteContext}>()
);

export const errorOnSaveCheckliste = createAction(
    '[ListenFacade] saveCheckliste error'
);

export const checklisteDeleted = createAction(
    '[ListenFacade] deleteCheckliste success',
    props<{checkliste: ChecklisteDaten}>()
);

export const errorOnDeleteCheckliste = createAction(
    '[ListenFacade] deleteCheckliste error'
);

export const changesDiscarded = createAction(
    '[ListenFacade] discardChanges'
);

export const resetModule = createAction(
	'[ListenFacade] reset'
);
