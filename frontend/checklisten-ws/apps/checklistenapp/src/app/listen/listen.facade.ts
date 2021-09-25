import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { ListenService } from './listen.service';
import * as ListenActions from './+state/listen.actions';
import * as ListenSelectors from './+state/listen.selectors';
import { Checkliste, ChecklisteDaten } from './listen.model';
import { GlobalErrorHandlerService } from '../infrastructure/global-error-handler.service';
import { ChecklisteItem, ChecklisteItemClickedPayload, Modus } from '../shared/domain/checkliste';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ListenFacade {

    public checklisten$ = this.store.select(ListenSelectors.checklisten);
    public selectedCheckliste$ = this.store.select(ListenSelectors.selectedCheckliste);
    public unsavedChanges$ = this.store.select(ListenSelectors.unsavedChanges);

    private checklistenLoaded: boolean = false;

    constructor(private listenService: ListenService
        , private store: Store<AppState>
        , private router: Router
        , private errorHandler: GlobalErrorHandlerService) {


            this.store.select(ListenSelectors.checklistenLoaded).subscribe(
                loaded => this.checklistenLoaded = loaded
            );
        }

    
    public loadChecklisten(): void {

        if (!this.checklistenLoaded) {
            this.store.dispatch(ListenActions.startLoading());

            this.listenService.loadChecklisten().subscribe(

                listen => {
                    this.store.dispatch(ListenActions.checklistenLoaded({checklisten: listen}));
                },
				(error => {
						this.store.dispatch(ListenActions.loadChecklistenFailed());
						this.errorHandler.handleError(error);
				})
            );
        }
    }

    public startConfigureCheckliste(checkliste: Checkliste): void {

        this.store.dispatch(ListenActions.selectCheckliste({checkliste: checkliste, modus: 'CONFIGURATION'}));
        this.router.navigateByUrl('/checkliste/configuration/' + checkliste.checkisteDaten.kuerzel);

    }

    public startExecuteCheckliste(checkliste: Checkliste): void {

        this.store.dispatch(ListenActions.selectCheckliste({checkliste: checkliste, modus: 'EXECUTION'}));
        this.router.navigateByUrl('/checkliste/execution/' + checkliste.checkisteDaten.kuerzel);

    }

    public handleChecklisteItemClicked(checklisteName: string, modus: Modus, payload: ChecklisteItemClickedPayload): void {

        switch(modus) {
            case 'CONFIGURATION': this.store.dispatch(ListenActions.checklisteItemClickedOnConfiguration({checklisteName: checklisteName, clickPayload: payload})); break;
            case 'EXECUTION': this.store.dispatch(ListenActions.checklisteItemClickedOnExecution({checklisteName: checklisteName, clickPayload: payload})); break;
        }
    }

    public addItem(checklisteName: string, checklisteItem: ChecklisteItem): void {
        this.store.dispatch(ListenActions.checklisteItemAdded({checklisteName: checklisteName, checklisteItem: checklisteItem}));
    }

    public changeItem(checklisteName: string, checklisteItem: ChecklisteItem): void {
        this.store.dispatch(ListenActions.checklisteItemChanged({checklisteName: checklisteName, checklisteItem: checklisteItem}));
    }

    public saveCheckliste(checkliste:Checkliste): void {
        // TODO
        
    }

    public discardChanges(): void {
       this.store.dispatch(ListenActions.changesDiscarded());
    }

    public deleteCheckliste(checkliste: ChecklisteDaten): void {

        // TODO

    }


}