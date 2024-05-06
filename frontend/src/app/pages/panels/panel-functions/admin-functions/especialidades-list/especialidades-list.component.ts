import { Component, Input, OnInit } from '@angular/core';
import { NgxPaginationModule } from "ngx-pagination";
import { LowerCasePipe, NgForOf, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RouterLink, RouterOutlet } from '@angular/router';
import {Select2Data, Select2Module} from "ng-select2-component";
import { VerticalCardComponent } from '../../../../../shared/components/vertical-card/vertical-card.component';
import { RemoveAccentsPipe } from '../../../../../shared/pipes/remove-accents.pipe';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ListedSpecialityModel } from '../../../../../core/interfaces/speciality-list.model';
import { AdminPanelService } from '../../../../../core/services/admin-panel.service';
import { UserListResponseModel } from '../../../../../core/interfaces/user-list-response.model';

@Component({
  selector: 'app-especialidades-list',
  standalone: true,
  imports: [VerticalCardComponent,
    LowerCasePipe,
    RemoveAccentsPipe,
    LoadingSpinnerComponent,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    RouterOutlet, ReactiveFormsModule, Select2Module],
  templateUrl: './especialidades-list.component.html',
  styleUrl: './especialidades-list.component.scss'
})
export class EspecialidadesListComponent {
  especialities: ListedSpecialityModel[];
  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[];
  role: string = "1";
  search: string = "";

  constructor(private adminPanelService: AdminPanelService) { }

  ngOnInit(): void {
    this.actualPage = 1;
    this.getSpecialities(this.actualPage);
  }

  getSpecialities(pageOrUrl: number | string) {
    let request: Observable<ListedSpecialityModel> = (typeof pageOrUrl === 'number') ? this.adminPanelService.getSpecialitiesList(pageOrUrl) : this.adminPanelService.getSpecificPageSpeciality(pageOrUrl);

    request.subscribe({
      next: (response: ListedSpecialityModel) => {
        this.#showResults(response);
      }
    });
  }

  filterByRoleAndSearch() {
    this.adminPanelService.getUsersByRoleAndSearch(parseInt(this.role), this.search).subscribe({
      next: (response: UserListResponseModel) => {
        this.#showResults(response);
      }
    });
  }

  #showResults(data) {
    console.log(data);
    this.especialities = data.resultados;
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.totalItems = data.cantidad_especialidades;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
  }

  confirmarCancelacion(id: number) {
    Swal.fire({
      text: 'Estás seguro que quieres eliminar a esta especialidad?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminPanelService.eliminateSpeciality(id).subscribe({
          next: (response) => {
            this.especialities.length <= 1 && this.previousPageUrl != null ? this.getSpecialities(this.previousPageUrl) : this.getSpecialities(this.actualPage);
            Swal.fire({
              title: 'Enhorabuena',
              text: 'Has conseguido eliminar la especialidad correctamente',
              icon: 'success',
              width: '50%'
            })
          },
          error: (error: string[]): void => {
            this.errores = error;
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Usuario canceló la eliminación");
      }
    })
  }
}
