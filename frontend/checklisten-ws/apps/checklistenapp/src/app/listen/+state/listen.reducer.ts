import { createReducer, Action, on } from '@ngrx/store';
import { ChecklisteDaten } from '../../shared/domain/checkliste';
import { ChecklistenMap, ChecklisteWithID } from '../listen.model';
import * as ListenActions from './listen.actions';

export const listenFeatureKey = 'checklistenapp-listen';

export interface ListenState {
    readonly loading: boolean;
    readonly checklistenLoaded: boolean;
    readonly checklistenMap: ChecklisteWithID[];
    readonly selectedCheckliste: ChecklisteDaten | undefined;    
}

const initialListenState: ListenState = {
    loading: false,
    checklistenLoaded: false,
    checklistenMap: [],
    selectedCheckliste: undefined
};

const listenReducer = createReducer(initialListenState, 

    on(ListenActions.startLoading, (state, _action) => {
        return {...state, loading: true};
    }),

    on(ListenActions.checklistenLoaded, (state, action) => {

        const map: ChecklisteWithID[] = [];
        action.checklisten.forEach(item => map.push({kuerzel: item.kuerzel, checkliste: item}));
        return {...state, loading: false, checklistenMap: map, checklistenLoaded: true};
    }),

    on(ListenActions.loadChecklistenFailed, (state, _action) => {
        return {...state, loading: false, checklistenLoaded: true};
    }),

    on(ListenActions.resetModule, (_state, _action) => {
        return initialListenState;
    })
);

export function reducer(state: ListenState | undefined, action: Action) {
    return listenReducer(state, action);
}
