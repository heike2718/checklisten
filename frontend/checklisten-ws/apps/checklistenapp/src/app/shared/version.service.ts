import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Message, ResponsePayload } from "./messages/messages.model";


@Injectable({providedIn: 'root'})
export class VersionService {

    constructor(private http: HttpClient) { }

    public getServerVersion(): Observable<Message> {

        const url = environment.apiUrl + '/version';

        return this.http.get(url).pipe(
            map(body => body as ResponsePayload),
            map(rp => rp.message)
        );
    }

}