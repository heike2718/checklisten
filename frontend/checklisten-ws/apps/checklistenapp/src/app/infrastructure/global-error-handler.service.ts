import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { LogService } from './logging/log.service';
import { ErrorMappingService } from '../shared/messages/error-mapping.service';
import { MessageService } from '../shared/messages/message.service';
import { Message } from '../shared/messages/messages.model';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { STORAGE_KEY_ID_REFERENCE, STORAGE_KEY_INVALID_SESSION } from '../shared/domain/user';
import { LogPublishersService } from './logging/log-publishers.service';

@Injectable(
	{
		providedIn: 'root'
	}
)
export class GlobalErrorHandlerService implements ErrorHandler {

	private errorMapper: ErrorMappingService;
	private logger: LogService;
	private messageService: MessageService;
	private router: Router;

	constructor(private injector: Injector) {

		// ErrorHandler wird vor allen anderen Injectables instanziiert,
		// so dass man benötigte Services nicht im Konstruktor injekten kann !!!

		this.errorMapper = this.injector.get(ErrorMappingService);

		const logPublishersService = this.injector.get(LogPublishersService);
		this.logger = this.injector.get(LogService);

		this.logger.initLevel(environment.loglevel);
		this.logger.registerPublishers(logPublishersService.publishers);
		this.logger.info('logging initialized: loglevel=' + environment.loglevel);

		this.messageService = this.injector.get(MessageService);

		this.router = this.injector.get(Router);


	}


	handleError(error: HttpErrorResponse | Error): void {

		if (error instanceof HttpErrorResponse) {
			const httpError = error as HttpErrorResponse;
			console.log('HttpErrorResponse: ' + httpError.status);
			this.handleHttpError(httpError, 'mkv-app');
		} else {
			console.log('ErrorEvent: ' + error);
			if (error.stack) {
				console.log(error.stack);
			}
			let msg = 'mkv-app: Unerwarteter Fehler: ' + error.message;

			const idReference = localStorage.getItem(environment.storageKeyPrefix + STORAGE_KEY_ID_REFERENCE);

			if (idReference) {
				msg += ' user=' + idReference;
			}


			if (error.stack) {
				msg += ' - ' + error.stack;
			}
			this.logger.error(msg);
			this.messageService.showMessage({ level: 'ERROR', message: 'Unerwarteter GUI-Error: ' + error.message });
		}
	}

	public handleHttpError(httpError: HttpErrorResponse, context: string) {
		if (httpError.status === 0) {
			this.messageService.error('Der Server ist nicht erreichbar.');
		} else {
			switch (httpError.status) {
				case 403:
					localStorage.setItem(STORAGE_KEY_INVALID_SESSION, JSON.stringify({ level: 'ERROR', message: 'Sie haben keine Berechtigung, diese Resource aufzurufen.' }));
					this.router.navigateByUrl('/timeout');
					break;
				case 401:
				case 908:
					localStorage.setItem(STORAGE_KEY_INVALID_SESSION, JSON.stringify({ level: 'WARN', message: 'Ihre Session ist abgelaufen. Bitte loggen Sie sich erneut ein.' }));
					this.router.navigateByUrl('/timeout');
					break;
				case 503:
					this.messageService.error('Der Service steht momentan nicht zur Verfügung. Bitte schreiben Sie eine Mail an info@egladil.de oder signalen Sie mich an.');
					break;
				default: {
					const message: Message = this.errorMapper.extractMessageObject(httpError);
					this.messageService.showMessage(message);
				}
			}
		}
	}
}

