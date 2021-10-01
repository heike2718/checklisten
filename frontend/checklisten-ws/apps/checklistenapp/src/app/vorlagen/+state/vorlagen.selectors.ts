import { createFeatureSelector, createSelector } from '@ngrx/store';
import { itemsEquals, sortItems } from '../vorlagen.model';
import { ChecklistenVorlage, ChecklistenvorlageItem, VorlagenMap } from '../vorlagen.model';
import * as fromVorlagen from './vorlagen.reducer';

const vorlagenState = createFeatureSelector<fromVorlagen.VorlagenState>(fromVorlagen.vorlagenFeatureKey);

const vorlageCache = createSelector(vorlagenState, s => s.vorlageCache);

export const vorlagenLoaded = createSelector(vorlagenState, s => s.vorlagenLoaded);
export const vorlagenMap = createSelector(vorlagenState, s => new VorlagenMap(s.vorlagenMap));
export const vorlagen = createSelector(vorlagenMap, m => m.toArray());
export const selectedVorlage = createSelector(vorlagenState, s => s.selectedVorlage);

export const unsavedChanges = createSelector(selectedVorlage, vorlageCache, (selected, cached) => hasUnsavedChanges(selected, cached));

function hasUnsavedChanges(selectedVorlage?: ChecklistenVorlage, cachedVorlage?: ChecklistenVorlage): boolean {

    if (!selectedVorlage || !cachedVorlage) {

        return false;
    }

    const selectedVorlageItemsSorted: ChecklistenvorlageItem[] = sortItems([...selectedVorlage.vorlageDaten.items]);
    const cachedVorlageItemsSorted: ChecklistenvorlageItem[] = sortItems([...cachedVorlage.vorlageDaten.items]);

    if (selectedVorlageItemsSorted.length !== cachedVorlageItemsSorted.length) {
        return true;
    }

    for (let i = 0; i<selectedVorlageItemsSorted.length; i++) {
        if (selectedVorlageItemsSorted[i].name !== cachedVorlageItemsSorted[i].name){
            return true;
        }
    }
    
    return false;
}
