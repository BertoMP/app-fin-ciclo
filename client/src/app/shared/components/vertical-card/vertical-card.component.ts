import {Component, Input} from '@angular/core';
import {
  MedicalSpecialtyModel
} from "../../../core/interfaces/medical-specialty.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-vertical-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './vertical-card.component.html',
  styleUrl: './vertical-card.component.css'
})
export class VerticalCardComponent {
  @Input() info!: MedicalSpecialtyModel;
  @Input() links!: string[];
}
