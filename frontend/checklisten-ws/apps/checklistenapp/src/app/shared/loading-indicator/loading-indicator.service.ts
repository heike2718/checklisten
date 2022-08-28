import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
}) // Singleton, weil sonst in AuthProvider eine andere Instanz hängt, als in der LoadingIndicatorComponent.
export class LoadingIndicatorService {

    #loadingSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);
	loading$: Observable<boolean> = this.#loadingSubject.asObservable();

     showLOaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        // of(.) immediately emmits ist value
        // concatMap triggers the obs$ to emmit its values

        return of(null).pipe(
            tap(() => this.loadingOn()),
            concatMap(() => obs$),
            finalize(() => this.loadingOff())
        );
    }


    loadingOn(): void {
        this.#loadingSubject.next(true);
    }

    loadingOff(): void {
        this.#loadingSubject.next(false);
    }
}
