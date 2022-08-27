import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Message, ResponsePayload } from "./messages/messages.model";


@Injectable({providedIn: 'root'})
export class VersionService {

    #expectedVersionSubject: Subject<string> = new BehaviorSubject<string>('x.x.x');

    public expectedVersion$: Observable<string> = this.#expectedVersionSubject.asObservable();

    constructor(private http: HttpClient) { }

    public getServerVersion(): Observable<Message> {

        const url = environment.apiUrl + '/version';

        return this.http.get(url).pipe(
            map(body => body as ResponsePayload),
            map(rp => rp.message)
        );
    }


    public ladeExpectedGuiVersion(): void {

        const url = environment.apiUrl + '/guiversion';

        this.http.get(url, { observe: 'body' }).pipe(
            map(body => body as ResponsePayload),
            map(rp => rp.message),
            map(message => this.getVersion(message))
        ).subscribe(
            version => this.#expectedVersionSubject.next(version)
        );
    }

    private getVersion(message: Message): string {

        let result = 'X.X.X';

        if (message.level === 'INFO') {
            result = message.message;
        }

        return result;
    }

}