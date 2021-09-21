import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';


@Injectable({ providedIn: 'root' })
export class ListenService {

    constructor(private appStore: Store<AppState>){
        
    }

}