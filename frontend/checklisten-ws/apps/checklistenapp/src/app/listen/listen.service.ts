import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppState } from '../reducers';
import { ChecklisteDaten } from '../shared/domain/checkliste';
import { ResponsePayload } from '../shared/messages/messages.model';


@Injectable({ providedIn: 'root' })
export class ListenService {

    constructor(private http: HttpClient){ }

    public loadChecklisten(): Observable<ChecklisteDaten[]> {

        const url = environment.apiUrl + '/checklisten';

        return this.http.get(url).pipe(
            map(body => body as ResponsePayload),
            map(rp => rp.data)
        );
    }
}