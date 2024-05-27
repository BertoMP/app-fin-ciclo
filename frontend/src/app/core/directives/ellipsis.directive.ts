import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appEllipsis]'
})
export class EllipsisDirective implements OnInit {
  @Input('appEllipsis') maxLength: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const currentText = this.el.nativeElement.innerHTML;
    const strippedText = currentText.replace(/<[^>]+>/g, ''); // Remove HTML tags
    if (strippedText.length > this.maxLength) {
      const truncatedText = `${strippedText.slice(0, this.maxLength)}...`;
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', truncatedText);
    }
  }
}
