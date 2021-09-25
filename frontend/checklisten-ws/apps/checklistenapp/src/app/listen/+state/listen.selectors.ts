import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChecklistenMap } from '../listen.model';
import * as fromListen from './listen.reducer';

const listenState = createFeatureSelector<fromListen.ListenState>(fromListen.listenFeatureKey);

export const checklistenLoaded = createSelector(listenState, s => s.checklistenLoaded);
export const checklistenMap = createSelector(listenState, s => new ChecklistenMap(s.checklistenMap));
export const checklisten = createSelector(checklistenMap, m => m.toArray());

export const selectedCheckliste = createSelector(listenState, s => s.selectedCheckliste);
export const unsavedChanges = createSelector(listenState, s => s.unsavedChanges);

