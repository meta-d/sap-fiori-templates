import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core'

@Directive({
  standalone: true,
  selector: '[zngPaste]'
})
export class ZngPasteDirective {
  #el = inject(ElementRef)

  @Output() onPaste: EventEmitter<string> = new EventEmitter()

  @HostListener('paste', ['$event']) onPasteEvent(event: ClipboardEvent): void {
    this.extractPastedText(event)
  }

  private extractPastedText(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData
    const pastedText = clipboardData.getData('text')
    this.onPaste.emit(pastedText)
  }
}
