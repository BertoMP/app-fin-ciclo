import {Component, OnInit} from '@angular/core';
import { Observable, Subject, debounceTime } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CitasService } from '../../../../../core/services/citas.service';
import { DatosPacienteModel } from '../../../../../core/interfaces/datos-paciente.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { CitasEspecialistaListModel } from '../../../../../core/interfaces/citas-especialista-list.model';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from "sweetalert2";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-listado-agenda',
  standalone: true,
  imports: [LoadingSpinnerComponent,NgFor,NgIf,RouterLink],
  templateUrl: './listado-agenda.component.html',
  styleUrl: './listado-agenda.component.scss'
})
export class ListadoAgendaComponent implements OnInit {
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

  private getCitasSubject: Subject<void> = new Subject<void>();

  constructor(private citasService: CitasService,
              private authService:AuthService,
              private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Agenda diaria');
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
