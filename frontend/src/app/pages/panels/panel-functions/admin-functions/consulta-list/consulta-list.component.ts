import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../../../../shared/components/loading-spinner/loading-spinner.component";
import {NgForOf} from "@angular/common";
import {NgxPaginationModule} from "ngx-pagination";
import {Select2Data, Select2Module} from "ng-select2-component";
import {RouterLink} from "@angular/router";
import {debounceTime, Observable, Subject} from "rxjs";
import {ConsultaService} from "../../../../../core/services/consulta.service";
import {ConsultaModel} from "../../../../../core/interfaces/consulta.model";
import Swal from "sweetalert2";
import {ConsultaListModel} from "../../../../../core/interfaces/consulta-list.model";
import {HttpErrorResponse} from "@angular/common/http";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-consulta-list',
  standalone: true,
  imports: [
    FormsModule,
    LoadingSpinnerComponent,
    NgForOf,
    NgxPaginationModule,
    Select2Module,
    RouterLink
  ],
  templateUrl: './consulta-list.component.html',
  styleUrl: './consulta-list.component.scss'
})
export class ConsultaListComponent implements OnInit, OnDestroy {
  consultas: ConsultaModel[];
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

  private getConsultasSubject: Subject<void> = new Subject<void>();

  constructor(private consultaService: ConsultaService,
              private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Listado de consultas');

    this.consultas = [];
    this.actualPage = 1;
    this.getConsultasSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe({
        next: () => {
          this.getConsultas();
        },
        error: (error) => {
          this.errores = error;
        }
      });
    this.initialLoad = true;
    this.getConsultasSubject.next();
  }

  ngOnDestroy(): void {
    this.getConsultasSubject.unsubscribe();
  }

  changePage(page: number) {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getConsultasSubject.next();
    }
  }

  updateFilters(): void {
    if (this.initialLoad) {
      this.actualPage = 1;
      this.getConsultasSubject.next();
    }
  }

  getConsultas(): void {
    this.consultas = [];
    let request: Observable<ConsultaListModel>;

    request = this.consultaService.getConsultasPage(this.actualPage, this.search, parseInt(this.perPage));

    request.subscribe({
      next: (response: ConsultaListModel) => {
        this.#showConsultas(response);
        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.dataLoaded = true;
        scrollTo(0, 0);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener las consultas. Por favor, intente nuevamente más tarde.',
        });
      }
    });
  }

  #showConsultas(data): void {
    this.consultas = data.resultados;
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.totalItems = data.cantidad_consultas;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
  }

  confirmarEliminacion(id: number) {
    scrollTo(0, 0);
    Swal.fire({
      text: '¿Estás seguro que quieres eliminar a esta consulta?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultaService
          .eliminarConsulta(id)
          .subscribe({
            next: (response) => {
              if (this.actualPage > 1 && this.consultas.length === 1) {
                this.actualPage--;
              }

              this.getConsultas();
              scrollTo(0, 0);
              Swal.fire({
                title: 'Enhorabuena',
                text: 'Has conseguido eliminar la consulta correctamente',
                icon: 'success',
                width: '50%'
              })
            },
            error: (error: HttpErrorResponse): void => {
              this.errores = error.error.errores;

              if (error.status === 409) {
                scrollTo(0, 0);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo eliminar la consulta porque tiene especialistas asociados.',
                });
                return;
              }

              scrollTo(0, 0);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la consulta. Por favor, intente nuevamente más tarde.',
              });
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        scrollTo(0, 0);
        Swal.fire({
          title: 'Cancelado',
          text: 'No se ha eliminado la consulta',
          icon: 'info',
          width: '50%'
        });
      }
    });
  }
}
