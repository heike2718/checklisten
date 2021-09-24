import { createReducer, Action, on } from '@ngrx/store';
import { ChecklisteItem, ChecklisteItemClickedPayload, Filterkriterium, initialChecklisteItem, Modus } from '../../shared/domain/checkliste';
import { SignUpPayload } from '../../shared/domain/signup-payload';
import { filterChecklisteItems, getItemsOben, getItemsUnten } from '../../shared/utils';
import { Checkliste, ChecklisteAppearence, ChecklisteItemMerger, ChecklistenMap, ChecklisteWithID, initialCheckliste, initialChecklisteAppearence } from '../listen.model';
import * as ListenActions from './listen.actions';

export const listenFeatureKey = 'checklistenapp-listen';

export interface ListenState {
    readonly loading: boolean;
    readonly checklistenLoaded: boolean;
    readonly checklistenMap: ChecklisteWithID[];
    readonly selectedCheckliste: Checkliste | undefined;    
};

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
        action.checklisten.forEach(item => {

            let color = '';
            switch(item.typ) {
                case 'EINKAUFSLISTE': color = 'bisque'; break;
                case 'PACKLISTE': color = 'lavender'; break;
                default: color = '#c6ffb3';
            }

            const kriterium: Filterkriterium = {
                modus: 'EXECUTION',
                position: 'VORSCHLAG'
            };
    
            const anzahlItems = filterChecklisteItems(item.items, kriterium).length;
            const checklisteAppearence: ChecklisteAppearence = {...initialChecklisteAppearence, modus: 'SCHROEDINGER', anzahlItems: anzahlItems};

            const thCheckliste: Checkliste = {
                checkisteDaten: item,
                appearence: checklisteAppearence
            };

            map.push({kuerzel: item.kuerzel, checkliste: thCheckliste})


        });
        return {...state, loading: false, checklistenMap: map, checklistenLoaded: true};
    }),

    on(ListenActions.selectCheckliste, (state, action) => {

        const modus = action.modus;

        let liste: Checkliste = {...action.checkliste};
        const itemsOben = [...getItemsOben(liste.checkisteDaten.items, modus)];
        const itemsUnten = [...getItemsUnten(liste.checkisteDaten.items, modus)];

        liste = {...action.checkliste, appearence: {...action.checkliste.appearence, modus: action.modus, itemsOben: itemsOben, itemsUnten: itemsUnten}};
        const checklistenMap: ChecklisteWithID[] = new ChecklistenMap(state.checklistenMap).merge(liste);
        return {...state, selectedCheckliste: liste, checklistenMap: checklistenMap};
    }),

    on(ListenActions.checklisteItemClickedOnConfiguration, (state, action) => {

        if (state.selectedCheckliste) {
           
           const payload: ChecklisteItemClickedPayload = action.clickPayload;           
           let changedItem: ChecklisteItem = initialChecklisteItem;

           switch(payload.position) {
               case 'VORSCHLAG': changedItem = {...payload.checklisteItem, markiert: true}; break;
               case 'AUSGEWAEHLT': changedItem = {...payload.checklisteItem, markiert: false}; break;
           }

           return new ChecklisteItemMerger().mergeChecklisteItems(state, changedItem, action.checklisteName, false);
        } 
        
        return {...state};
    }),

    on(ListenActions.checklisteItemAdded, (state, action) => {
        return new ChecklisteItemMerger().mergeChecklisteItems(state, action.checklisteItem, action.checklisteName, true);
    }),

    on(ListenActions.checklisteItemChanged, (state, action) => {
        return new ChecklisteItemMerger().mergeChecklisteItems(state, action.checklisteItem, action.checklisteName, false);
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
