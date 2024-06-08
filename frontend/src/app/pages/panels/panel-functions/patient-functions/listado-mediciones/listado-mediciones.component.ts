import { Component, OnInit } from '@angular/core';
import { MedicionesService } from '../../../../../core/services/mediciones.service';
import { debounceTime, Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { MedicionListModel } from '../../../../../core/interfaces/medicion-list.model';
import { MedicionListedModel } from '../../../../../core/interfaces/medicion-listed.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { AuthService } from '../../../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserRole } from '../../../../../core/enum/user-role.enum';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-listado-mediciones',
  standalone: true,
  imports: [
    NgxPaginationModule,
    NgFor,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    LoadingSpinnerComponent,
    Select2Module,
    NgClass,
  ],
  templateUrl: './listado-mediciones.component.html',
  styleUrl: './listado-mediciones.component.scss',
})
export class ListadoMedicionesComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  isGlucometria: boolean = false;
  isPatient: boolean = false;

  fields: string[] = ['SYS', 'DIA', 'Pulso'];

  userId: number;
  mediciones: MedicionListedModel[];

  rutaActual: string;
  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[];
  campos: string[];
  datos: string[];
  resultMin: number;
  resultMax: number;

  fechaInicio: string;
  fechaFin: string;
  perPage: string = '10';

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

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

  private getMedicionesSubject: Subject<void> = new Subject<void>();

  constructor(
    private medicionesService: MedicionesService,
    private router: Router,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.actualPage = 1;
    this.mediciones = [];
    this.errores = [];
    this.rutaActual = this.router.url;
    this.isPatient = UserRole.PACIENT === this.authService.getUserRole();

    if (this.rutaActual.includes('listado-glucometria')) {
      this.isGlucometria = true;
      this.title.setTitle('MediAPP - Listado de mediciones de glucosa');

      this.fields = ['Medición'];
    } else {
      this.title.setTitle(
        'MediAPP - Listado de mediciones de tensión arterial'
      );
    }

    this.getMedicionesSubject.pipe(debounceTime(500)).subscribe({
      next: () => {
        this.getMediciones();
      },
      error: (error) => {
        this.errores = error;
      },
    });

    this.initialLoad = true;
    this.getMedicionesSubject.next();
  }

  getDangerClass(value: number, field: string): string {
    switch (field) {
      case 'sistolica':
        if (value > 140) {
          return 'hypertension';
        } else if (value < 90) {
          return 'hypotension';
        }
        break;
      case 'diastolica':
        if (value > 90) {
          return 'hypertension';
        } else if (value < 60) {
          return 'hypotension';
        }
        break;
      case 'pulsaciones_minuto':
        if (value > 100) {
          return 'hyperpulse';
        } else if (value < 60) {
          return 'hypopulse';
        }
        break;
      case 'medicion':
        if (value > 140) {
          return 'hyperglycemia';
        } else if (value < 70) {
          return 'hypoglycemia';
        }
        break;
      default:
        return '';
    }
  }

  getMediciones() {
    this.mediciones = [];
    this.errores = [];

    let request: Observable<MedicionListModel>;
    let id: number;
    const type: string = this.isGlucometria ? 'glucometria' : 'tension';
    let isSpecialist: boolean = false;

    if (this.isPatient) {
      id = this.authService.getUserId();
    } else {
      id = this.activeRoute.snapshot.params.id;
      isSpecialist = true;
    }

    request = this.medicionesService.getMedicion(
      type,
      id,
      this.fechaInicio,
      this.fechaFin,
      parseInt(this.perPage),
      this.actualPage,
      isSpecialist
    );

    request.subscribe({
      next: (response) => {
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
          text: 'Ha ocurrido un error durante el proceso de obtención de mediciones',
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

      if (endDate > currentDate) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La fecha de fin no puede ser posterior a hoy',
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

      this.actualPage = 1;
      this.getMedicionesSubject.next();
    }
  }

  changePage(page: number) {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getMedicionesSubject.next();
    }
  }

  #showResults(data) {
    this.mediciones = data.mediciones;
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
    this.totalItems = data.cantidad_mediciones;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
    if (data.mediciones[0] != null) {
      this.campos = Object.keys(data.mediciones[0].datos_toma);
    }
  }
}
