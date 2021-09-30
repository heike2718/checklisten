import { createReducer, Action, on } from '@ngrx/store';
import { ChecklisteItem, ChecklisteItemClickedPayload, initialChecklisteItem } from '../../shared/domain/checkliste';
import { getItemsOben, getItemsUnten } from '../../shared/utils';
import { Checkliste, ChecklisteMerger, ChecklistenMap, ChecklisteWithID } from '../listen.model';
import * as ListenActions from './listen.actions';

export const listenFeatureKey = 'checklistenapp-listen';

export interface ListenState {
    readonly loading: boolean;
    readonly checklistenLoaded: boolean;
    readonly changesDiscarded: boolean;
    readonly checklistenMap: ChecklisteWithID[];
    readonly selectedCheckliste: Checkliste | undefined;
    readonly checklisteCache: Checkliste | undefined;  
};

const initialListenState: ListenState = {
    loading: false,
    checklistenLoaded: false,
    changesDiscarded: false,
    checklistenMap: [],
    selectedCheckliste: undefined,
    checklisteCache: undefined
};

const listenReducer = createReducer(initialListenState, 

    on(ListenActions.startLoading, (state, _action) => {
        return {...state, loading: true};
    }),

    on(ListenActions.checklistenLoaded, (state, action) => {

        const map: ChecklisteWithID[] = [];
        action.checklisten.forEach(item => {

            const thCheckliste = new ChecklisteMerger().mapToCheckliste(item);
            map.push({kuerzel: item.kuerzel, checkliste: thCheckliste});
        
        });
        
        return {...state, loading: false, checklistenMap: map, checklistenLoaded: true};
    }),

    on(ListenActions.selectCheckliste, (state, action) => {

        const modus = action.modus;

        let liste: Checkliste = {...action.checkliste};
        const itemsOben = [...getItemsOben(liste.checkisteDaten.items, modus)];
        const itemsUnten = [...getItemsUnten(liste.checkisteDaten.items, modus)];

        liste = {...action.checkliste, appearance: {...action.checkliste.appearance, modus: action.modus, itemsOben: itemsOben, itemsUnten: itemsUnten}};
        const checklistenMap: ChecklisteWithID[] = new ChecklistenMap(state.checklistenMap).merge(liste);
        return {...state, selectedCheckliste: liste, checklisteCache: {...liste}, checklistenMap: checklistenMap, changesDiscarded: false};
    }),

    on(ListenActions.deselectCheckliste, (state, _action) => {

        if (state.changesDiscarded) {
            return new ChecklisteMerger().undoChanges(state);
        }

       return {...state, selectedCheckliste: undefined, checklisteCache: undefined, changesDiscarded: false};
    }),

    on(ListenActions.checklisteItemClickedOnConfiguration, (state, action) => {

        if (state.selectedCheckliste) {
           
           const payload: ChecklisteItemClickedPayload = action.clickPayload;           
           let changedItem: ChecklisteItem = initialChecklisteItem;

           switch(payload.position) {
               case 'VORSCHLAG': changedItem = {...payload.checklisteItem, markiert: true}; break;
               case 'AUSGEWAEHLT': changedItem = {...payload.checklisteItem, markiert: false}; break;
           }

           return new ChecklisteMerger().mergeChecklisteItems(state, changedItem, action.checklisteName, false);
        } 
        
        return {...state};
    }),

    on(ListenActions.checklisteItemClickedOnExecution, (state, action) => {

        if (state.selectedCheckliste) {
           
           const payload: ChecklisteItemClickedPayload = action.clickPayload;           
           let changedItem: ChecklisteItem = initialChecklisteItem;

           switch(payload.position) {
               case 'VORSCHLAG': changedItem = {...payload.checklisteItem, erledigt: true}; break;
               case 'AUSGEWAEHLT': changedItem = {...payload.checklisteItem, erledigt: false}; break;
           }

           return new ChecklisteMerger().mergeChecklisteItems(state, changedItem, action.checklisteName, false);
        } 
        
        return {...state};
    }),

    on(ListenActions.checklisteSaved, (state, action) => {

        let checkliste = new ChecklisteMerger().mapToCheckliste(action.saveChecklisteContext.checkliste.checkisteDaten);
        
        const modus = action.saveChecklisteContext.modus;

        if (modus !== 'SCHROEDINGER') {
            const itemsOben = [...getItemsOben(checkliste.checkisteDaten.items, modus)];
            const itemsUnten = [...getItemsUnten(checkliste.checkisteDaten.items, modus)];
            checkliste = {...checkliste, appearance: {...checkliste.appearance, modus: modus, itemsOben: itemsOben, itemsUnten: itemsUnten}}; 
        } 

        const neueMap: ChecklisteWithID[] = new ChecklistenMap(state.checklistenMap).merge(checkliste);
        return {...state, checklisteCache: {...checkliste}, loading: false, checklistenMap: neueMap, selectedCheckliste: checkliste};

    }),

    on(ListenActions.checklisteDeleted, (state, action) => {

        const neueMap: ChecklisteWithID[] = new ChecklistenMap(state.checklistenMap).remove(action.checkliste.kuerzel);
        return {...state, loading: false, checklistenMap: neueMap };

    }),

    on(ListenActions.errorOnSaveCheckliste, (state, _action) => {
        return {...state, loading: false};
    }),

    on(ListenActions.errorOnDeleteCheckliste, (state, _action) => {
        return {...state, loading: false};
    }),

    on(ListenActions.changesDiscarded, (state, _action) => { 
        return new ChecklisteMerger().undoChanges(state);
    }),

    on(ListenActions.checklisteItemAdded, (state, action) => {
        return new ChecklisteMerger().mergeChecklisteItems(state, action.checklisteItem, action.checklisteName, true);
    }),

    on(ListenActions.checklisteItemChanged, (state, action) => {
        return new ChecklisteMerger().mergeChecklisteItems(state, action.checklisteItem, action.checklisteName, false);
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
