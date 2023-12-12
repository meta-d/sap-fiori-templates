import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[zngAd]',
  standalone: true
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
