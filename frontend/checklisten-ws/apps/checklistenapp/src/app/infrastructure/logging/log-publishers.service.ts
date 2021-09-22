import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LogConsole, LogPublisher, LogWebApi } from './log-publishers';


@Injectable({
	providedIn: 'root'
})
export class LogPublishersService {

	publishers: LogPublisher[] = [];

	constructor(private http: HttpClient) {

		this.buildPublishers();

	}

	private buildPublishers(): void {

		if (environment.consoleLogActive) {
			this.publishers.push(new LogConsole());
		}

		if (environment.serverLogActive) {
			const url = environment.apiUrl + '/log';
			this.publishers.push(new LogWebApi(this.http, url));
		}
	}
}
