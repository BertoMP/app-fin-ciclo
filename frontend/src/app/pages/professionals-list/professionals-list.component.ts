import {Component, OnInit} from '@angular/core';
import {
  MedicalSpecialistListModel
} from "../../core/interfaces/medical-specialist-list.model";
import {
  MedicalSpecialistListService
} from "../../core/services/medical-specialist-list.service";
import {LowerCasePipe} from "@angular/common";
import {
  HorizontalCardComponent
} from "../../shared/components/horizontal-card/horizontal-card.component";
import {RemoveAccentsPipe} from "../../shared/pipes/remove-accents.pipe";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-professionals-list',
  standalone: true,
  imports: [
    LowerCasePipe,
    HorizontalCardComponent,
    RemoveAccentsPipe,
    RouterLink
  ],
  templateUrl: './professionals-list.component.html',
  styleUrl: './professionals-list.component.scss'
})
export class ProfessionalsListComponent implements OnInit {
  listOfData: MedicalSpecialistListModel[];

  constructor(private medicalSpecialistListService: MedicalSpecialistListService) {
  }

  ngOnInit(): void {
   this.medicalSpecialistListService.getMedicalSpecialistList().subscribe(
    (res: MedicalSpecialistListModel[]) => {
      this.listOfData=res;
    }
  );
}
}
