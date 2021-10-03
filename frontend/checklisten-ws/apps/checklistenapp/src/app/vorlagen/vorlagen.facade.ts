import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GlobalErrorHandlerService } from '../infrastructure/global-error-handler.service';
import { AppState } from '../reducers';
import { MessageService } from '../shared/messages/message.service';
import * as VorlagenActions from './+state/vorlagen.actions';
import * as VorlagenSelectors from './+state/vorlagen.selectors';
import { ChecklistenVorlage, ChecklistenvorlageItem } from './vorlagen.model';
import { VorlagenService } from './vorlagen.service';

@Injectable({ providedIn: 'root' })
export class VorlagenFacade {

    public vorlagen$ = this.store.select(VorlagenSelectors.vorlagen);
    public selectedVorlage$ = this.store.select(VorlagenSelectors.selectedVorlage);
    public unsavedChanges$ = this.store.select(VorlagenSelectors.unsavedChanges);

    private vorlagenGeladen = false;

    constructor(private store: Store<AppState>
        , private vorlagenService: VorlagenService
        , private messageService: MessageService
        , private errorHandler: GlobalErrorHandlerService
        , private router: Router){

        this.store.select(VorlagenSelectors.vorlagenLoaded).subscribe(
            loaded => this.vorlagenGeladen = loaded
        );

    }

    public loadVorlagen(): void {

        if (!this.vorlagenGeladen) {

            this.store.dispatch(VorlagenActions.startLoading());

            this.vorlagenService.loadVorlagen().subscribe(

                vorlagen => {

                    this.store.dispatch(VorlagenActions.vorlagenLoaded({vorlagen: vorlagen}));
                },
				(error => {
					this.store.dispatch(VorlagenActions.loadVorlagenFailed());
					this.errorHandler.handleError(error);
				})
            );
        }

        this.deselectVorlage();
    }

    
    public addVorlageItem(item: ChecklistenvorlageItem): void {
        this.store.dispatch(VorlagenActions.vorlageItemAdded({vorlageItem: item}));
    }

    public deleteVorlageItem(item: ChecklistenvorlageItem): void {
        this.store.dispatch(VorlagenActions.vorlageItemRemoved({vorlageItem: item}));
    }

    public startEditVorlage(vorlage: ChecklistenVorlage): void {
        this.store.dispatch(VorlagenActions.selectVorlage({vorlage: vorlage}));
        this.router.navigateByUrl('vorlage/' + vorlage.vorlageDaten.typ);
    }

    public discardChanges(): void {
        this.store.dispatch(VorlagenActions.changesDiscarded());
    }

    public saveVorlage(vorlage: ChecklistenVorlage): void {

        this.store.dispatch(VorlagenActions.startLoading());
        this.vorlagenService.saveVorlage(vorlage.vorlageDaten).subscribe(

            responsePayload => {
                this.messageService.showMessage(responsePayload.message);
                this.store.dispatch(VorlagenActions.vorlageSaved({vorlage: responsePayload.data}));
            },
            (error => {
                this.store.dispatch(VorlagenActions.saveVorlageFailed());
                this.errorHandler.handleError(error);
            })
        )

    }

    public reset(): void {
        this.store.dispatch(VorlagenActions.resetModule());
    }

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PRIVATE MEMBERS

private deselectVorlage(): void {
    this.store.dispatch(VorlagenActions.deslectVorlage());
}

}
