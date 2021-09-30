import { createAction, props } from '@ngrx/store';
import { Checklistentyp } from '../../shared/domain/checkliste';
import { ChecklistenVorlage, ChecklistenvorlageDaten, ChecklistenvorlageItem } from '../vorlagen.model';

export const startLoading = createAction(
    '[VorlagenFacade] before service.doSomething'
);

export const vorlagenLoaded = createAction(
    '[VorlagenFacade] loadVorlagen success',
    props<{checklisten: ChecklistenvorlageDaten[]}>()
);

export const loadVorlagenFailed = createAction(
    '[VorlagenFacade] loadVorlagen error'
);

export const selectVorlage = createAction(
    '[VorlagenFacade] selectVorlage',
    props<{vorlage: ChecklistenVorlage}>()
);

export const deslectVorlage = createAction(
    '[VorlagenFacade] deselectVorlage'
);

export const vorlageItemAdded = createAction(
    '[VorlagenFacade] addItem',
    props<{typ: Checklistentyp, vorlageItem: ChecklistenvorlageItem}>()
);

export const vorlageItemChanged = createAction(
    '[VorlagenFacade] changeItem',
    props<{typ: Checklistentyp, vorlageItem: ChecklistenvorlageItem}>()
);

export const vorlageSaved = createAction(
    '[VorlagenFacade] saveVorlage success',
    props<{vorlage: ChecklistenvorlageDaten}>()
);

export const saveVorlageFailed = createAction(
    '[VorlagenFacade] saveVorlage error'
);

export const changesDiscarded = createAction(
    '[VorlagenFacade] discardChanges'
);

export const resetModule = createAction(
	'[VorlagenFacade] reset'
);



