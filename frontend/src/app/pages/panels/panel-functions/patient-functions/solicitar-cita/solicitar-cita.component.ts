import { Component, OnInit } from '@angular/core';
import { EspecialidadService } from '../../../../../core/services/especialidad.service';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { EspecialidadModel } from '../../../../../core/interfaces/especialidad.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MedicalSpecialistListService } from '../../../../../core/services/medical-specialist-list.service';
import { EspecialistaCitaModel } from '../../../../../core/interfaces/especialista-cita.model';
import {DatePipe, NgFor, NgForOf, NgIf} from '@angular/common';
import { CitasService } from '../../../../../core/services/citas.service';
import { CitasDisponiblesModel } from '../../../../../core/interfaces/citas-disponibles.model';
import { Subject } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { AgendaDataModel } from '../../../../../core/interfaces/agenda-data.model';
import { EspecialistModel } from '../../../../../core/interfaces/especialist.model';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format.pipe';
import Swal from 'sweetalert2';
import { CitaUploadModel } from '../../../../../core/interfaces/cita-upload.model';

@Component({
  selector: 'app-solicitar-cita',
  standalone: true,
  imports: [NgxPaginationModule,
    NgFor,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    LoadingSpinnerComponent,
    Select2Module, DateFormatPipe, DatePipe],
  templateUrl: './solicitar-cita.component.html',
  styleUrl: './solicitar-cita.component.scss'
})
export class SolicitarCitaComponent implements OnInit {
  especialidades: Select2Data;
  especialistas: Select2Data;

  especialidad_id: number;
  especialista_id: number;
  especialista: EspecialistModel;
  paciente_nombre: string;
  paciente_id:number;
  fecha: string;
  fechaSpan: string;

  citaBuscada = false;

  cantidad_citas: number;
  citas_disponibles: string[];
  citas: AgendaDataModel;
  fecha_cita: string;
  itemsPerPage: number;
  nextPageUrl: string;
  actualPage: number;
  totalPages: number;
  previousPageUrl: string;
  resultMax: number;
  resultMin: number;
  totalItems: number;

  errores: string[];

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  private getCitasSubject: Subject<void> = new Subject<void>();

  constructor(private router: Router,
              private authService: AuthService,
              private especialidadService: EspecialidadService,
              private medicalEspecialistService: MedicalSpecialistListService,
              private citasService: CitasService) { }

  buscarEspecialidades() {
    this.especialidadService.getEspecialidad()
      .subscribe({
        next: (especialidad: EspecialidadModel[]) => {
          this.especialidades = especialidad.map((especialidad: EspecialidadModel) => {
            return {
              value: especialidad.id,
              label: especialidad.nombre
            }
          });

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching especialidades', error.error);

          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al intentar buscar las especialidades',
            icon: 'error',
            width: '50%'
          })
        }
      })
  }

  getPacienteNombreId() {
    this.paciente_nombre = this.authService.getUserName();
    this.paciente_id=this.authService.getUserId();
  }

  buscarEspecialistas() {
    this.especialista_id = null;
    this.citas_disponibles = [];
    if (this.especialidad_id) {
      this.medicalEspecialistService.getSpecialist(this.especialidad_id)
        .subscribe({
          next: (especialistas: EspecialistaCitaModel[]) => {
            if (especialistas.length === 0) {
              Swal.fire({
                title: 'No hay especialistas',
                text: `No hay especialistas disponibles para la especialidad seleccionada`,
                icon: 'error',
                width: '50%'
              })
                .then(() => {
                  Swal.close();
                  this.especialistas = null;
                  this.especialista_id = null;
                })
            } else {
              this.especialistas = especialistas.map((especialista: EspecialistaCitaModel) => {
                return {
                  value: especialista.id,
                  label: `${especialista.usuario_nombre} ${especialista.primer_apellido} ${especialista.segundo_apellido}`
                }
              });
            }
          },
          error: (error: HttpErrorResponse) => {
            this.citas_disponibles=[];
            this.especialistas = null;
            this.especialista_id=null;
            console.error('Error fetching especialistas', error.error);

            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al intentar buscar los especialistas',
              icon: 'error',
              width: '50%'
            })
          }
        })
    }
  }

  checkFecha() {
    this.citas_disponibles = [];
    if (this.fecha) {
      this.fecha = this.fecha.split('T')[0];

      let fechaIngresada = new Date(this.fecha);

      if (this.fecha < new Date().toISOString().split('T')[0]) {
        Swal.fire({
          title: 'Fecha incorrecta',
          text: `La fecha no puede ser anterior a la fecha actual`,
          icon: 'error',
          width: '50%'
        })
          .then(() => {
            Swal.close();
            this.fecha = null;
          })
      } else if (fechaIngresada.getDay() === 0 || fechaIngresada.getDay() === 6) {
        Swal.fire({
          title: 'Fecha incorrecta',
          text: `La fecha no puede ser un fin de semana`,
          icon: 'error',
          width: '50%'
        })
          .then(() => {
            Swal.close();
            this.fecha = null;
          })
      } else if (this.especialista_id) {
        this.fechaSpan = this.fecha;
        this.buscarCitas();
      }
    }
  }

  checkEspecialista() {
    if (this.especialista_id) {
      if (this.fecha) {
        this.buscarCitas();
      }
    }
  }

  buscarCitas() {
    if (this.especialista_id && this.fecha) {
      this.citasService.getCitaDisponible(this.especialista_id, this.fecha).subscribe({
        next: (citas: CitasDisponiblesModel) => {
          this.#showResults(citas);
          this.buscarEspecialista();
          this.citaBuscada = true;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching citas', error.error);

          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al intentar buscar las citas disponibles',
            icon: 'error',
            width: '50%'
          })
        }
      });
    }
  }

  buscarEspecialista() {
    this.authService.getEspecialista(this.especialista_id).subscribe({
      next: (especialista: EspecialistModel) => {
        this.especialista = especialista;
        this.dataLoaded = true;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching Especialista', error.error);

        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al intentar buscar el especialista',
          icon: 'error',
          width: '50%'
        })
      }
    })
  }


  updateFilters(): void {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = 1;
      this.getCitasSubject.next();
    }
  }

  changePage(page: number) {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getCitasSubject.next();
    }
  }

  #showResults(data) {
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
    this.totalItems = data.cantidad_citas;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
    this.citas = data.datos_agenda;
    this.citas_disponibles = this.citas.citas_disponibles;

  }

  pedirCita(hora:string) {
    this.dataLoaded = false;
    let citaSolicitada:CitaUploadModel={
      paciente_id:this.paciente_id,
      especialista_id:this.especialista_id,
      fecha:this.fecha,
      hora:hora
    }

    let request = this.citasService.confirmarCita(citaSolicitada);

    request.subscribe({

      next: (response: CitaUploadModel) => {
        this.dataLoaded = true;
        this.router.navigate(['/mediapp/listado-citas'])
        Swal.fire({
          title: 'Enhorabuena',
          text: 'Has conseguido solicitar la cita correctamente',
          icon: 'success',
          width: '50%'
        }).then(() => {
          Swal.close();
        })
      },
      error: (error: string[]) => {
        this.errores = error;

        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al intentar solicitar la cita',
          icon: 'error',
          width: '50%'
        }).then(() => {
          Swal.close();
        })
      },
    });
  }

  confirmarCita(hora:string) {
    Swal.fire({
      text: '¿Estás seguro que quieres acudir a esta cita?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      icon: 'question',

      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedirCita(hora);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Usuario canceló la solicitud");
      }
      Swal.close();
    })
  }

  ngOnInit(): void {
    this.actualPage = 1;
    this.citas_disponibles = [];
    this.errores = [];

    this.getPacienteNombreId();
    this.buscarEspecialidades();

    this.initialLoad = true;
    this.getCitasSubject.next();
  }
}
