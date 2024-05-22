import { Component } from '@angular/core';
import { CitasListModel } from '../../../../../core/interfaces/citas-list.model';
import { Observable, Subject, debounceTime } from 'rxjs';
import { CitasService } from '../../../../../core/services/citas.service';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { DatosPacienteModel } from '../../../../../core/interfaces/datos-paciente.model';
import { CitasDataModel } from '../../../../../core/interfaces/citas-data.model';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Select2Data, Select2Module } from 'ng-select2-component';

@Component({
  selector: 'app-listado-citas',
  standalone: true,
  imports: [
    NgxPaginationModule,
    NgFor,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    LoadingSpinnerComponent,
    Select2Module],
  templateUrl: './listado-citas.component.html',
  styleUrl: './listado-citas.component.scss'
})
export class ListadoCitasComponent {
  citas: CitasDataModel[];
  paciente: DatosPacienteModel;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;

  fechaFin: string;
  fechaInicio: string;

  rutaActual: string;
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

  private getCitasSubject: Subject<void> = new Subject<void>();

  constructor(private citasService: CitasService) { }

  ngOnInit(): void {
    this.actualPage = 1;

    this.getCitasSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe({
        next: () => {
          this.getCitas();
        },
        error: (error) => {
          this.errores = error;
        }
      });
    this.initialLoad = true;
    this.getCitasSubject.next();
  }

  getCitas() {
    this.citas = [];
    this.errores = [];

    let request: Observable<CitasListModel> = this.citasService.getCitas(
      this.fechaInicio,
      this.fechaFin,
      parseInt(this.perPage),
      this.actualPage,
    );

    request.subscribe({
      next: (response: CitasListModel) => {
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

  cancelarCita(idCita: number) {
    let request: Observable<CitasListModel> = this.citasService.cancelarCita(idCita);

    request.subscribe({
      next: (response: CitasListModel) => {
        this.dataLoaded = true;
        Swal.fire({
          title: 'Enhorabuena',
          text: 'Has conseguido eliminar la cita correctamente',
          icon: 'success',
          width: '50%'
        }).then(() => {
          this.getCitas();
        })
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }

  confirmarCancelar(idCita: number) {
    Swal.fire({
      text: '¿Estás seguro que quieres cancelar esta cita?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarCita(idCita);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Usuario canceló la eliminación");
      }
    })
  }

  comprobarFecha(hora: string, fecha: string) {
    let fechaActual = new Date();
    let fechaConsulta = this.convertirFecha(fecha, hora);

    if (fechaActual > fechaConsulta)
      return false;
    else
      return true;

  }

  convertirFecha(fecha: string, hora: string) {
    const dateParts = fecha.split("-");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    const timeParts = hora.split(":");
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const second = parseInt(timeParts[2], 10);

    return new Date(year, month, day, hour, minute, second);
  }

  updateFilters():void {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = 1;
      this.getCitasSubject.next();
    }
  }

  changePage(page: number) {
    console.log(page);
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getCitasSubject.next();
    }
  }

  #showResults(data) {
    console.log(data);
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
    this.totalItems = data.cantidad_citas;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
    this.citas = data.citas[0].citas;
    this.paciente = data.citas[0].datos_paciente;
  }


}
