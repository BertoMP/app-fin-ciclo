import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {LowerCasePipe} from "@angular/common";
import {RemoveAccentsPipe} from "../../pipes/remove-accents.pipe";

@Component({
  selector: 'app-menu-option',
  standalone: true,
  imports: [
    RouterLink,
    LowerCasePipe,
    RemoveAccentsPipe
  ],
  templateUrl: './menu-option.component.html',
  styleUrl: './menu-option.component.scss'
})
export class MenuOptionComponent {
  @Input() title: string;
  @Input() icon: string;
  @Input() description: string;
  @Input() route: string;
  @Input() routeName: string;
  @Input() class: string;
}
