import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ResponsePayload, Message } from '../shared/messages/messages.model';
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

    public saveCheckliste(checkliste: ChecklisteDaten): Observable<ResponsePayload> {

        const url = environment.apiUrl + '/checklisten/checkliste/' + checkliste.kuerzel;
        return this.http.put(url, checkliste).pipe(
            map(res => res as ResponsePayload)
        );
    }

    public createNewCheckliste(checkliste: ChecklisteDaten): Observable<ResponsePayload> {

        const url = environment.apiUrl + '/checklisten';

        return this.http.post(url, checkliste).pipe(
			map(res => res as ResponsePayload)
		);
    }

    public deleteCheckliste(checkliste: ChecklisteDaten): Observable<Message> {

        const url = environment.apiUrl + '/checklisten/checkliste/' + checkliste.kuerzel;

        return this.http.delete(url).pipe(
			map(res => res as ResponsePayload),
            map(rp => rp.message)
        );

    }
}