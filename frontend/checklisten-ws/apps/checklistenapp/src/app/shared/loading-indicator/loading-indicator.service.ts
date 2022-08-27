import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
}) // Singleton, weil sonst in AuthProvider eine andere Instanz hängt, als in der LoadingIndicatorComponent.
export class LoadingIndicatorService {

    #loadingSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);
	loading$: Observable<boolean> = this.#loadingSubject.asObservable();

     showLOaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return obs$;
    }


    loadingOn(): void {
        this.#loadingSubject.next(true);
    }

    loadingOff(): void {
        this.#loadingSubject.next(false);
    }
}
