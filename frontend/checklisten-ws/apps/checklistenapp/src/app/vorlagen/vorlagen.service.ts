import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ResponsePayload } from "../shared/messages/messages.model";
import { ChecklistenvorlageDaten } from "./vorlagen.model";


@Injectable({ providedIn: 'root' })
export class VorlagenService {


    constructor(private http: HttpClient) { }

    public loadVorlagen(): Observable<ChecklistenvorlageDaten[]> {

        const url = environment.apiUrl + '/vorlagen';

        return this.http.get(url).pipe(
            map ( body  => body as ResponsePayload),
            map (rp => rp.data)
        );
    }

    public saveVorlage(vorlage: ChecklistenvorlageDaten): Observable<ResponsePayload> {

        const url = environment.apiUrl + '/vorlagen';

        return this.http.post(url, vorlage).pipe(
            map( body => body as ResponsePayload)
        );
    }
}