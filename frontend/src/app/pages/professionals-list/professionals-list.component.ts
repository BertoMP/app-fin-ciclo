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
import {ChatBotComponent} from "../../shared/components/chat-bot/chat-bot.component";
import {LoadingSpinnerComponent} from "../../shared/components/loading-spinner/loading-spinner.component";
import Swal from "sweetalert2";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-professionals-list',
  standalone: true,
  imports: [
    LowerCasePipe,
    HorizontalCardComponent,
    RemoveAccentsPipe,
    RouterLink,
    ChatBotComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './professionals-list.component.html',
  styleUrl: './professionals-list.component.scss'
})
export class ProfessionalsListComponent implements OnInit {
  listOfData: MedicalSpecialistListModel[];
  isLoading: boolean = false;

  constructor(private medicalSpecialistListService: MedicalSpecialistListService,
              private title: Title) {
  }

  ngOnInit(): void {
    this.title.setTitle('Listado de profesionales médicos');

    this.isLoading = true;
    document.querySelector('body').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

   this.medicalSpecialistListService.getMedicalSpecialistList()
     .subscribe({
         next: (res: MedicalSpecialistListModel[]) => {
           this.isLoading = false;
           this.listOfData = res;
         },
          error: (err) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo cargar la lista de profesionales médicos. Por favor, intente nuevamente más tarde.',
            });
          }
       });
   }
}

