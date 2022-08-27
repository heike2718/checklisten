import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoadingIndicatorService } from '../shared/loading-indicator/loading-indicator.service';
import { ResponsePayload, Message } from '../shared/messages/messages.model';
import { ChecklisteDaten } from './listen.model';


@Injectable({ providedIn: 'root' })
export class ListenService {

    constructor(private http: HttpClient, private loadingIndicatorService: LoadingIndicatorService){ }

    public loadChecklisten(): Observable<ChecklisteDaten[]> {

        const url = environment.apiUrl + '/checklisten';

        this.loadingIndicatorService.loadingOn();

        return this.http.get(url).pipe(
            map(body => body as ResponsePayload),
            map(rp => rp.data),
            shareReplay(),
            finalize(() => this.loadingIndicatorService.loadingOff())
        );
    }

    public saveCheckliste(checkliste: ChecklisteDaten): Observable<ResponsePayload> {

        const url = environment.apiUrl + '/checklisten/checkliste/' + checkliste.kuerzel;

        this.loadingIndicatorService.loadingOn();

        return this.http.put(url, checkliste).pipe(
            map(res => res as ResponsePayload),
            shareReplay(),
            finalize(() => this.loadingIndicatorService.loadingOff())
        );
    }

    public createNewCheckliste(checkliste: ChecklisteDaten): Observable<ResponsePayload> {

        const url = environment.apiUrl + '/checklisten';

        this.loadingIndicatorService.loadingOn();

        return this.http.post(url, checkliste).pipe(
			map(res => res as ResponsePayload),
            shareReplay(),
            finalize(() => this.loadingIndicatorService.loadingOff())
		);
    }

    public deleteCheckliste(checkliste: ChecklisteDaten): Observable<Message> {

        const url = environment.apiUrl + '/checklisten/checkliste/' + checkliste.kuerzel;

        this.loadingIndicatorService.loadingOn();

        return this.http.delete(url).pipe(
			map(res => res as ResponsePayload),
            map(rp => rp.message),
            shareReplay(),
            finalize(() => this.loadingIndicatorService.loadingOff())
        );

    }
}