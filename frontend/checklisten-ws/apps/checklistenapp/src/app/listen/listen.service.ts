import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ResponsePayload } from '../shared/messages/messages.model';
import { ChecklisteDaten } from './listen.model';


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