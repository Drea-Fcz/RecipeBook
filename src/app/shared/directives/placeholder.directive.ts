import {Directive, ViewContainerRef} from '@angular/core';
import {AlertComponent} from "../components/alert/alert.component";

@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {

  constructor(public viewContainerRef: ViewContainerRef ) { }
}
