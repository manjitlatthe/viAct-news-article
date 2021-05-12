import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "input[numbersToFixed]"
})
export class ToFixedDirective {
  constructor(private _el: ElementRef) {}

  @HostListener("blur", ["$event"]) onBlurExe(event) {
    const initalValue = Number(this._el.nativeElement.value);
    this._el.nativeElement.value = initalValue.toFixed(2);
    return this._el.nativeElement.value;
  }
}
