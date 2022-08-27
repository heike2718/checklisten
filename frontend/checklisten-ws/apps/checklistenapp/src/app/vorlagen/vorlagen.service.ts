import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { finalize, map, shareReplay } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { LoadingIndicatorService } from "../shared/loading-indicator/loading-indicator.service";
import { ResponsePayload } from "../shared/messages/messages.model";
import { ChecklistenvorlageDaten } from "./vorlagen.model";


@Injectable({ providedIn: 'root' })
export class VorlagenService {


    constructor(private http: HttpClient, private loadingIndicatorService: LoadingIndicatorService) { }

    public loadVorlagen(): Observable<ChecklistenvorlageDaten[]> {

        const url = environment.apiUrl + '/vorlagen';

        this.loadingIndicatorService.loadingOn();

        return this.http.get(url).pipe(
            map ( body  => body as ResponsePayload),
            map (rp => rp.data),
            shareReplay(),
            finalize(() => this.loadingIndicatorService.loadingOff())
        );
    }

    public saveVorlage(vorlage: ChecklistenvorlageDaten): Observable<ResponsePayload> {

        const url = environment.apiUrl + '/vorlagen';

        this.loadingIndicatorService.loadingOn();

        return this.http.post(url, vorlage).pipe(
            map( body => body as ResponsePayload),
            shareReplay(),
            finalize(() => this.loadingIndicatorService.loadingOff())
        );
    }
}