import {Component, Input} from '@angular/core';
import {LowerCasePipe, NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-horizontal-card',
  standalone: true,
  imports: [
    LowerCasePipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './horizontal-card.component.html',
  styleUrl: './horizontal-card.component.scss'
})
export class HorizontalCardComponent {
  @Input() info: {
    title: string,
    description: string,
    image: string,
    buttons: {text: string, link: string}[],
    order: string
  };
}
