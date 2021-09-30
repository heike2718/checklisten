import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VorlagenMap } from '../vorlagen.model';
import * as fromVorlagen from './vorlagen.reducer';

const vorlagenState = createFeatureSelector<fromVorlagen.VorlagenState>(fromVorlagen.vorlagenFeatureKey);

export const vorlagenLoaded = createSelector(vorlagenState, s => s.vorlagenLoaded);
export const vorlagenMap = createSelector(vorlagenState, s => new VorlagenMap(s.vorlagenMap));
export const vorlagen = createSelector(vorlagenMap, m => m.toArray());
