import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';
import { LoadingIndicatorService } from "./loading-indicator.service";



@Component({
    selector: 'chl-loading-indicator',
    templateUrl: './loading-indicator.component.html',
    styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent implements OnInit, OnDestroy {

    loading = false;

    #loadingSubscription = new Subscription();

    constructor(public loadingService: LoadingIndicatorService) { }

    ngOnInit(): void {

        console.log('LoadingIndicatorComponent initialized');

        this.#loadingSubscription = this.loadingService.loading$.pipe(
            tap((loading) => this.loading = loading)
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.#loadingSubscription.unsubscribe();
    }

}