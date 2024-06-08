import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { NgForOf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { LogsListModel } from '../../../../../core/interfaces/logs-list.model';
import { debounceTime, Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LogDataModel } from '../../../../../core/interfaces/log-data.model';
import { LogService } from '../../../../../core/services/log.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [
    FormsModule,
    LoadingSpinnerComponent,
    NgForOf,
    NgxPaginationModule,
    RouterLink,
    Select2Module,
  ],
  templateUrl: './log-list.component.html',
  styleUrl: './log-list.component.scss',
})
export class LogListComponent implements OnInit, OnDestroy {
  logs: LogDataModel[];

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
  resultMin: number;
  resultMax: number;

  perPage: string = '10';

  perPageOptions: Select2Data = [
    {
      value: 5,
      label: '5',
    },
    {
      value: 10,
      label: '10',
    },
    {
      value: 15,
      label: '15',
    },
    {
      value: 20,
      label: '20',
    },
  ];

  private getLogsSubject: Subject<void> = new Subject<void>();

  constructor(private logsService: LogService, private title: Title) {}

  ngOnInit(): void {
    this.actualPage = 1;

    this.title.setTitle('MediAPP - Listado de logs');

    this.getLogsSubject.pipe(debounceTime(500)).subscribe({
      next: () => {
        this.getLogs();
      },
      error: (error) => {},
    });
    this.initialLoad = true;
    this.getLogsSubject.next();
  }

  getLogs() {
    this.logs = [];
    this.errores = [];

    let request: Observable<LogsListModel> = this.logsService.getLogs(
      this.fechaInicio,
      this.fechaFin,
      parseInt(this.perPage),
      this.actualPage
    );

    request.subscribe({
      next: (response: LogsListModel) => {
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

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error durante el proceso',
        });
      },
    });
  }

  updateFilters(): void {
    this.dataLoaded = false;

    if (this.initialLoad) {
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      let startDate = new Date(this.fechaInicio);
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date(this.fechaFin);
      endDate.setHours(0, 0, 0, 0);

      if (startDate > currentDate) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La fecha de inicio no puede ser posterior a hoy',
        });
        return;
      }

      if (endDate < startDate) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La fecha de fin no puede ser anterior a la fecha de inicio',
        });
        return;
      }

      if (endDate > currentDate) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La fecha de fin no puede ser posterior a hoy',
        });
        return;
      }

      this.actualPage = 1;
      this.getLogsSubject.next();
    }
  }

  changePage(page: number) {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getLogsSubject.next();
    }
  }

  #showResults(response: LogsListModel) {
    this.logs = response.resultados;
    this.nextPageUrl = response.next;
    this.previousPageUrl = response.prev;
    this.totalPages = response.paginas_totales;
    this.totalItems = response.cantidad_logs;
    this.itemsPerPage = response.items_pagina;
    this.resultMin = response.result_min;
    this.resultMax = response.result_max;
  }

  ngOnDestroy(): void {
    this.getLogsSubject.unsubscribe();
  }
}
