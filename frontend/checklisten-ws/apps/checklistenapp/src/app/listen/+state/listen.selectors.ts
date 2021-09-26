import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Checkliste, ChecklistenMap } from '../listen.model';
import { ChecklisteItem, itemsEquals } from '../../shared/domain/checkliste';
import * as fromListen from './listen.reducer';

const listenState = createFeatureSelector<fromListen.ListenState>(fromListen.listenFeatureKey);

export const checklistenLoaded = createSelector(listenState, s => s.checklistenLoaded);
export const checklistenMap = createSelector(listenState, s => new ChecklistenMap(s.checklistenMap));
export const checklisten = createSelector(checklistenMap, m => m.toArray());

export const selectedCheckliste = createSelector(listenState, s => s.selectedCheckliste);
const checklisteCache = createSelector(listenState, s => s.checklisteCache);

export const unsavedChanges = createSelector(selectedCheckliste, checklisteCache, (selected, cached) => hasUnsavedChanges(selected, cached));
export const cachedChecklistenname = createSelector(checklisteCache, c => c?.checkisteDaten && c?.checkisteDaten.name);


function hasUnsavedChanges(selectedCheckliste?: Checkliste, checklisteCache?: Checkliste): boolean {

    if (!selectedCheckliste || !checklisteCache) {
        return false;
    }

    if (selectedCheckliste.checkisteDaten.name !== checklisteCache.checkisteDaten.name) {
        return true;
    }

    for (const item of selectedCheckliste.checkisteDaten.items) {

       const cachedItems: ChecklisteItem[] = checklisteCache.checkisteDaten.items.filter( i => i.name === item.name);

       if (cachedItems.length === 0) {
           // dann hat die aktuelle ein Item mehr als die vorherige
           return true;
       }

       const cachedItem: ChecklisteItem = cachedItems[0];
       if (!itemsEquals(item, cachedItem)) {
           return true;
       }
    }

    for (const cachedItem of checklisteCache.checkisteDaten.items) {

        const items: ChecklisteItem[] = selectedCheckliste.checkisteDaten.items.filter( i => i.name === cachedItem.name);
 
        if (items.length === 0) {
            // dann hat die vorherige ein Item mehr als die aktuelle (geht eigentlich nicht, da einmal drin drin bleibt)
            return true;
        }
 
        const item: ChecklisteItem = items[0];
        if (!itemsEquals(item, cachedItem)) {
            return true;
        }
     }

    return false;
};

