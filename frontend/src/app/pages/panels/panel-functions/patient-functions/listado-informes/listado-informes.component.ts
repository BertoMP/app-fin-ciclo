import { Component } from '@angular/core';
import {LoadingSpinnerComponent} from "../../../../../shared/components/loading-spinner/loading-spinner.component";
import {NgForOf} from "@angular/common";
import {NgxPaginationModule} from "ngx-pagination";
import {RouterLink} from "@angular/router";
import {Select2Data, Select2Module} from "ng-select2-component";
import {debounceTime, Observable, Subject} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {InformesDataModel} from "../../../../../core/interfaces/informes-data.model";
import {InformesListModel} from "../../../../../core/interfaces/informes-list.model";
import {InformeService} from "../../../../../core/services/informe.service";
import {AuthService} from "../../../../../core/services/auth.service";

@Component({
  selector: 'app-listado-informes',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    NgForOf,
    NgxPaginationModule,
    RouterLink,
    Select2Module
  ],
  templateUrl: './listado-informes.component.html',
  styleUrl: './listado-informes.component.scss'
})
export class ListadoInformesComponent {
  informes: InformesDataModel[];
  paciente: string;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;

  fechaFin: string;
  fechaInicio: string;

  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[];
  datos: string[];
  rango: number;
  resultMin:number;
  resultMax:number;

  perPage: string = "10";

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

  private getInformesSubject: Subject<void> = new Subject<void>();

  constructor(private informeService: InformeService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.actualPage = 1;
    this.informes = [];
    this.errores = [];

    this.paciente = this.authService.getUserName();

    this.getInformesSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe({
        next: () => {
          this.getInformes();
        },
        error: (error) => {
          this.errores = error;
        }
      });
    this.initialLoad = true;
    this.getInformesSubject.next();
  }

  getInformes() {
    this.informes = [];
    this.errores = [];

    let request: Observable<InformesListModel> = this.informeService.getInformes(
      this.fechaInicio,
      this.fechaFin,
      parseInt(this.perPage),
      this.actualPage,
    );

    request.subscribe({
      next: (response: InformesListModel) => {
        this.#showResults(response);
        this.dataLoaded = true;
      },
      error: (error: HttpErrorResponse) => {
        this.dataLoaded = true;

        if (error.error.errors) {
          this.errores = error.error.errors;
        } else {
          this.errores = ['Ha ocurrido un error durante el proceso'];
        }
      }
    });
  }

  updateFilters():void {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = 1;
      this.getInformesSubject.next();
    }
  }

  changePage(page: number) {
    console.log(page);
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getInformesSubject.next();
    }
  }

  #showResults(data) {
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
    this.totalItems = data.cantidad_informes;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
    this.informes = data.resultados;

    console.log(this.informes);
  }
}
