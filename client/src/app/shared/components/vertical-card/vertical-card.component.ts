import {Component, Input} from '@angular/core';
import {
  MedicalSpecialtyModel
} from "../../../core/interfaces/medical-specialty.model";
import {RouterLink} from "@angular/router";
import {LowerCasePipe} from "@angular/common";

@Component({
  selector: 'app-vertical-card',
  standalone: true,
  imports: [
    RouterLink,
    LowerCasePipe
  ],
  templateUrl: './vertical-card.component.html',
  styleUrl: './vertical-card.component.css'
})
export class VerticalCardComponent {
  @Input() info!: MedicalSpecialtyModel;
  @Input() routerLink!: string;
  @Input() fragment!: string;
}
