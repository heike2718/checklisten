import { createReducer, Action, on } from '@ngrx/store';
import { ChecklistenVorlage, ChecklistenvorlageWithID } from '../vorlagen.model';
import * as VorlagenActions from './vorlagen.actions';

export const vorlagenFeatureKey = 'checklistenapp-vorlagen';

export interface VorlagenState {
    readonly loading: boolean;
    readonly vorlagenLoaded: boolean;
    readonly changesDiscarded: boolean;
    readonly vorlagenMap: ChecklistenvorlageWithID[];
    readonly selectedVorlage?: ChecklistenVorlage;
    readonly vorlageCache?: ChecklistenVorlage;
};

const initialVorlagenState: VorlagenState = {
    loading: false,
    vorlagenLoaded: false,
    changesDiscarded: false,
    vorlagenMap: [],
    selectedVorlage: undefined,
    vorlageCache: undefined
};

const vorlagenReducer = createReducer(initialVorlagenState, 
    
    on(VorlagenActions.startLoading, (state, _action) => {
        return {...state, loading: true};
    }),

    on (VorlagenActions.resetModule, (_state, _action) => {
        return initialVorlagenState;
    })
);

export function reducer(state: VorlagenState | undefined, action: Action) {
    return vorlagenReducer(state, action);
};