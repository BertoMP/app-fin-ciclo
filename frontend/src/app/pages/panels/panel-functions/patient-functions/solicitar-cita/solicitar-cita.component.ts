import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../../../../core/services/citas.service';
import { Observable, Subject, debounceTime } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-solicitar-cita',
  standalone: true,
  imports: [],
  templateUrl: './solicitar-cita.component.html',
  styleUrl: './solicitar-cita.component.scss'
})
export class SolicitarCitaComponent implements OnInit {
  citas: Object;
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

  initialLoad: boolean = false;
  dataLoaded: boolean = false;
  private getMedicionesSubject: Subject<void> = new Subject<void>();

  constructor(private citasService: CitasService) { }

  ngOnInit(): void {
    this.actualPage = 1;
    this.citas = [];
    this.errores = [];


    this.getMedicionesSubject
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
    this.getMedicionesSubject.next();
  }

  #showResults(data) {
    console.log(data);
  }

  getCitas() {

    let request: Observable<Object>;

    request = this.citasService.getCitaEspecialista(6);
    // type,
    // this.authService.getUserId(),
    // this.fechaInicio,
    // this.fechaFin,
    // parseInt(this.perPage),
    // this.actualPage

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
      }
    });

  }
}
