import {Component, OnDestroy, OnInit} from '@angular/core';
import { NgxPaginationModule } from "ngx-pagination";
import {LowerCasePipe, NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import Swal from 'sweetalert2';
import {debounceTime, Observable, Subject} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RouterLink, RouterOutlet } from '@angular/router';
import {Select2Data, Select2Module} from "ng-select2-component";
import { VerticalCardComponent } from '../../../../../shared/components/vertical-card/vertical-card.component';
import { RemoveAccentsPipe } from '../../../../../shared/pipes/remove-accents.pipe';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { AdminPanelService } from '../../../../../core/services/admin-panel.service';
import {SpecialityDataModel} from "../../../../../core/interfaces/speciality-data.model";
import {SpecialityListedModel} from "../../../../../core/interfaces/speciality-listed.model";
import {RemoveBrPipe} from "../../../../../shared/pipes/remove-br.pipe";
import {DomSanitizer, SafeHtml, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-especialidades-list',
  standalone: true,
  imports: [
    VerticalCardComponent,
    LowerCasePipe,
    RemoveAccentsPipe,
    LoadingSpinnerComponent,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    RouterOutlet,
    ReactiveFormsModule,
    Select2Module,
    UpperCasePipe,
    RemoveBrPipe,
  ],
  templateUrl: './especialidades-list.component.html',
  styleUrl: './especialidades-list.component.scss'
})
export class EspecialidadesListComponent implements OnInit, OnDestroy {
  specialties: SpecialityListedModel[];
  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[];
  search: string = "";
  perPage: string = "10";
  resultMin: number;
  resultMax: number;

  dataLoaded: boolean = false;
  initialLoad: boolean = false;

  perPageOptions: Select2Data = [
    {
      value: 5,
      label: '5'
    },
    {
      value: 10,
      label: '10'
    },
    {
      value: 15,
      label: '15'
    },
    {
      value: 20,
      label: '20'
    }
  ];

  private getSpecialtiesSubject: Subject<void> = new Subject<void>();

  constructor(private adminPanelService: AdminPanelService,
              private sanitizer: DomSanitizer,
              private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Listado de especialidades');

    this.specialties = [];
    this.actualPage = 1;
    this.getSpecialtiesSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe({
        next: () => {
          this.getSpecialities()
        },
        error: (error: string[]) => {
          this.errores = error;
        }
      });
    this.initialLoad = true;
    this.getSpecialtiesSubject.next();
  }

  ngOnDestroy() {
    this.getSpecialtiesSubject.unsubscribe();
  }

  sanitizeHtml(inputHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(inputHtml);
  }

  changePage(page: number) {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getSpecialtiesSubject.next();
    }
  }

  updateFilters(): void {
    if (this.initialLoad) {
      this.actualPage = 1;
      this.getSpecialtiesSubject.next();
    }
  }

  getSpecialities() {
    let request: Observable<SpecialityDataModel>;
    request = this.adminPanelService
      .getSpecialitiesList(
        this.search,
        parseInt(this.perPage),
        this.actualPage
    );

    request.subscribe({
      next: (response: SpecialityDataModel) => {
        this.#showResults(response);
        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.errores = error;
        this.dataLoaded = true;
        scrollTo(0, 0);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la lista de especialidades. Por favor, intente nuevamente más tarde.',
        });
      }
    });
  }

  #showResults(data) {
    this.specialties = data.resultados;
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.totalItems = data.cantidad_especialidades;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
  }

  confirmarCancelacion(id: number) {
    scrollTo(0, 0);
    Swal.fire({
      text: '¿Estás seguro que quieres eliminar a esta especialidad?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminPanelService
          .eliminateSpeciality(id)
          .subscribe({
            next: (response) => {
              if (this.actualPage > 1 && this.specialties.length === 1) {
                this.actualPage--;
              }

              this.getSpecialities();
              scrollTo(0, 0);
              Swal.fire({
                title: 'Enhorabuena',
                text: 'Has conseguido eliminar la especialidad correctamente',
                icon: 'success',
                width: '50%'
              });
            },
            error: (error: string[]): void => {
              this.errores = error;
              scrollTo(0, 0);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la especialidad. Por favor, intente nuevamente más tarde.',
              });
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        scrollTo(0, 0);
        Swal.fire({
          title: 'Cancelado',
          text: 'No se ha eliminado la especialidad',
          icon: 'info',
          width: '50%'
        });
      }
    })
  }
}
