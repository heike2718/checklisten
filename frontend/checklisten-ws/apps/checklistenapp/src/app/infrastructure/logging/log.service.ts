import { Injectable } from '@angular/core';
import { LogLevel, LogEntry } from './logging.model';
import { LogPublisher } from './log-publishers';

@Injectable({
	providedIn: 'root'
})
export class LogService {

	private level: LogLevel;
	private publishers: LogPublisher[];

	constructor() {
		this.level = LogLevel.Error;
		this.publishers = [];
	}

	debug(msg: string) {
		this.writeToLog(msg, LogLevel.Debug);
	}

	info(msg: string) {
		this.writeToLog(msg, LogLevel.Info);
	}

	warn(msg: string) {
		this.writeToLog(msg, LogLevel.Warn);
	}

	error(msg: string) {
		this.writeToLog(msg, LogLevel.Error);
	}

	fatal(msg: string) {
		this.writeToLog(msg, LogLevel.Fatal);
	}

	public registerPublishers(publishers: LogPublisher[]) {
		this.publishers = publishers;
	}

	public initLevel(level: number): void {
		switch (level) {
			case 0: this.level = LogLevel.All; break;
			case 1: this.level = LogLevel.Debug; break;
			case 2: this.level = LogLevel.Info; break;
			case 3: this.level = LogLevel.Warn; break;
			case 4: this.level = LogLevel.Error; break;
			case 5: this.level = LogLevel.Fatal; break;
			case 6: this.level = LogLevel.Off; break;
			default: this.level = LogLevel.Error;
		}
	}

	private writeToLog(msg: string, level: LogLevel) {

		if (this.shouldLog(level)) {

			const entry = new LogEntry(msg, level);

			for (const publisher of this.publishers) {

				publisher.log(entry)
					.subscribe(_response => 'console.log(_response)');
			}
		}
	}

	private shouldLog(level: LogLevel): boolean {
		let ret = false;
		if ((level >= this.level &&
			level !== LogLevel.Off) ||
			this.level === LogLevel.All) {
			ret = true;
		}
		return ret;
	}
}

