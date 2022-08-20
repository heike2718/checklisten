import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
}) 
export class LoadingIndicatorService {

    #loadingSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);

	loading$: Observable<boolean> = this.#loadingSubject.asObservable();

    markLoading(loading: boolean) {
        this.#loadingSubject.next(loading);
    }

}