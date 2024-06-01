import { Component } from '@angular/core';
import { Observable, Subject, debounceTime } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CitasService } from '../../../../../core/services/citas.service';
import { Select2Data } from 'ng-select2-component';
import { DatosPacienteModel } from '../../../../../core/interfaces/datos-paciente.model';
import { CitasDataModel } from '../../../../../core/interfaces/citas-data.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { CitasEspecialistaListModel } from '../../../../../core/interfaces/citas-especialista-list.model';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-listado-agenda',
  standalone: true,
  imports: [LoadingSpinnerComponent,NgFor,NgIf,RouterLink],
  templateUrl: './listado-agenda.component.html',
  styleUrl: './listado-agenda.component.scss'
})
export class ListadoAgendaComponent {
  citas: CitasEspecialistaListModel[];
  paciente: DatosPacienteModel;
  nombre_especialista:string;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;

  fechaFin: string;
  fechaInicio: string;
  errores: string[];

  // rutaActual: string;
  // nextPageUrl: string;
  // previousPageUrl: string;
  // actualPage: number;
  // totalPages: number;
  // totalItems: number;
  // itemsPerPage: number;
  //
  // datos: string[];
  // rango: number;
  // resultMin:number;
  // resultMax:number;

  // perPage: string = "10";

  // perPageOptions: Select2Data = [
  //   {
  //     value: 5,
  //     label: '5'
  //   },
  //   {
  //     value: 10,
  //     label: '10'
  //   },
  //   {
  //     value: 15,
  //     label: '15'
  //   },
  //   {
  //     value: 20,
  //     label: '20'
  //   }
  // ];

  private getCitasSubject: Subject<void> = new Subject<void>();

  constructor(private citasService: CitasService,private authService:AuthService) { }

  ngOnInit(): void {
    // this.actualPage = 1;
    this.nombre_especialista=this.authService.getUserName();

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

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error durante el proceso',
          });
        }
      });
    this.initialLoad = true;
    this.getCitasSubject.next();
  }

  getCitas() {
    this.citas = [];
    this.errores = [];

    let request: Observable<CitasEspecialistaListModel[]> = this.citasService.getCitaEspecialista(
    );

    request.subscribe({
      next: (response: CitasEspecialistaListModel[]) => {
        this.#showResults(response);
        this.dataLoaded = true;
      },
      error: (error: HttpErrorResponse) => {
        this.dataLoaded = true;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error durante el proceso',
        });

        if (error.error.errors) {
          this.errores = error.error.errors;
        } else {
          this.errores = ['Ha ocurrido un error durante el proceso'];
        }
      }
    });
  }

  #showResults(data) {
    this.citas=data;
  }


}
