import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
	selector: '[chlAutoFokus]'
})
export class AutoFokusDirective implements AfterViewInit {

	constructor(private el: ElementRef) { }

	ngAfterViewInit() {

		this.el.nativeElement.focus();

	}

}
