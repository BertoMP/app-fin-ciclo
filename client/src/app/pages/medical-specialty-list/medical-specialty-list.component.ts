import {Component, OnInit} from '@angular/core';
import {
  MedicalSpecialtyModel
} from "../../core/interfaces/medical-specialty.model";
import {
  MedicalSpecialtiesService
} from "../../core/services/medical-specialties.service";
import {
  VerticalCardComponent
} from "../../shared/components/vertical-card/vertical-card.component";
import {LowerCasePipe} from "@angular/common";
import {RemoveAccentsPipe} from "../../shared/pipes/remove-accents.pipe";

@Component({
  selector: 'app-medical-specialty-list',
  standalone: true,
  imports: [
    VerticalCardComponent,
    LowerCasePipe,
    RemoveAccentsPipe
  ],
  templateUrl: './medical-specialty-list.component.html',
  styleUrl: './medical-specialty-list.component.css'
})
export class MedicalSpecialtyListComponent implements OnInit {
  specialties: MedicalSpecialtyModel[];

  constructor(private medicalSpecialtiesService: MedicalSpecialtiesService) {
  }

  ngOnInit(): void {
    this.specialties = this.medicalSpecialtiesService.getSpecialties();
  }
}
