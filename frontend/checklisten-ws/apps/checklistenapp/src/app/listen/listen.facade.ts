import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../reducers';
import { ListenService } from './listen.service';
import * as ListenActions from './+state/listen.actions';
import * as ListenSelectors from './+state/listen.selectors';
import { Checkliste, ChecklisteDaten, ChecklistenMap } from './listen.model';
import { GlobalErrorHandlerService } from '../infrastructure/global-error-handler.service';
import { Modus } from '../shared/domain/checkliste';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ListenFacade {

    public checklisten$ = this.store.select(ListenSelectors.checklisten);

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

    public deleteCheckliste(checkliste: ChecklisteDaten): void {

    }
}