import { createReducer, Action, on } from '@ngrx/store';
import { ChecklistenVorlage, ChecklistenvorlageDaten, ChecklistenvorlageWithID, VorlagenMap, VorlagenMerger } from '../vorlagen.model';
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

    on(VorlagenActions.vorlagenLoaded, (state, action) => {

        const map: ChecklistenvorlageWithID[] = [];
        action.vorlagen.forEach( v => {

            const item: ChecklistenvorlageWithID = new VorlagenMerger().mapToVorlage(v);
            map.push(item);
        });       

        return {...state, loading: false, vorlagenLoaded: true, vorlagenMap: map};
    }),

    on(VorlagenActions.loadVorlagenFailed, (state, _action) => {

        return {...state, loading: false};
    }),

    on(VorlagenActions.selectVorlage, (state, action) => {

        return {...state, selectedVorlage: action.vorlage, vorlageCache: {...action.vorlage}};
    }),

    on(VorlagenActions.deslectVorlage, (state, _action) => {

        return {...state, selectedVorlage: undefined, vorlageCache: undefined};
    }),

    on(VorlagenActions.vorlageItemAdded, (state, action) => {

        return new VorlagenMerger().addVorlageItem(state, action.vorlageItem);
    }),

    on(VorlagenActions.vorlageItemRemoved, (state, action) => {

        return new VorlagenMerger().removeVorlageItem(state, action.vorlageItem);
    }),

    on(VorlagenActions.vorlageSaved, (state, action) => {

        const vorlage: ChecklistenvorlageWithID = new VorlagenMerger().mapToVorlage(action.vorlage);
        const neueMap: ChecklistenvorlageWithID[] = new VorlagenMap(state.vorlagenMap).merge(vorlage.vorlage);
        const neueSelectedVorlage: ChecklistenVorlage = vorlage.vorlage;

        return {...state, loading: false, vorlagenMap: neueMap, vorlageCache: {...neueSelectedVorlage}, selectedVorlage: neueSelectedVorlage};
    }),

    on(VorlagenActions.saveVorlageFailed, (state, _action) => {

        return {...state, loading: false};
    }),

    on(VorlagenActions.changesDiscarded, (state, _action) => {

        if (state.vorlageCache && state.vorlageCache.vorlageDaten) {
            const neueSelectedVorlage = {...state.vorlageCache};
            const neueVorlage: ChecklistenvorlageWithID = new VorlagenMerger().mapToVorlage(neueSelectedVorlage.vorlageDaten);
            const neueMap: ChecklistenvorlageWithID[] = new VorlagenMap(state.vorlagenMap).merge(neueVorlage.vorlage);

            return {...state, vorlagenMap: neueMap, selectedVorlage: neueVorlage.vorlage, vorlageCache: {...neueVorlage.vorlage}};
        }

        return {...state};
    }),

    on (VorlagenActions.resetModule, (_state, _action) => {
        return initialVorlagenState;
    })
);

export function reducer(state: VorlagenState | undefined, action: Action) {
    return vorlagenReducer(state, action);
};
