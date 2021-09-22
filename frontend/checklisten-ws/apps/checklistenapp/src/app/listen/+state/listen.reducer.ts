import { createReducer, Action, on } from '@ngrx/store';
import { throwError } from 'rxjs';
import { Filterkriterium } from '../../shared/domain/checkliste';
import { filterChecklisteItems } from '../../shared/utils';
import { Checkliste, ChecklisteAppearence, ChecklisteWithID } from '../listen.model';
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
                semantik: 'VORSCHLAGSLISTE'
            };
    
            const anzahlItems = filterChecklisteItems(item.items, kriterium).length;

            const checklisteAppearence: ChecklisteAppearence = {
                anzahlItems: anzahlItems,
                color: color
            };

            const thCheckliste: Checkliste = {
                checkisteDaten: item,
                appearence: checklisteAppearence
            };

            map.push({kuerzel: item.kuerzel, checkliste: thCheckliste})


        });
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
