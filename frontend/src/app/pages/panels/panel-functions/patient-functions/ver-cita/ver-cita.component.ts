import { Component } from '@angular/core';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { CitasService } from '../../../../../core/services/citas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CitaSpecificDataModel } from '../../../../../core/interfaces/cita-specific-data.model';
import { DatosPacienteModel } from '../../../../../core/interfaces/datos-paciente.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import {Location} from "@angular/common";
import {saveAs} from "file-saver";
import {AuthService} from "../../../../../core/services/auth.service";
import {Title} from "@angular/platform-browser";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ver-cita',
  standalone: true,
  imports: [LoadingSpinnerComponent, RouterLink],
  templateUrl: './ver-cita.component.html',
  styleUrl: './ver-cita.component.scss'
})
export class VerCitaComponent {
  username: string;
  cita: CitaSpecificDataModel;
  persona: DatosPacienteModel;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;
  suscripcionRuta: Subscription;
  id: number;
  private getMedsSubject: Subject<void> = new Subject<void>();

  constructor(private citasService: CitasService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private authService: AuthService,
              private title: Title) { }

  errores: string[];

  ngOnInit(): void {
    this.username = this.authService.getUserName();

    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;

      this.title.setTitle('MediAPP - Ver cita');

      this.getMedsSubject
        .pipe(
          debounceTime(500)
        )
        .subscribe({
          next: () => {
            this.getCita(this.id);
          },
          error: (error: string[]) => {
            this.errores = error;
          }
        });
      this.initialLoad = true;
      this.getMedsSubject.next();
    });
  }

  getCita(id: number) {
    let request: Observable<CitaSpecificDataModel> = this.citasService.getCita(id);

    request.subscribe({
      next: (response: CitaSpecificDataModel) => {
        this.cita=response;
        this.dataLoaded=true;
      },
      error: (error: string[]) => {
        this.errores = error;
        this.dataLoaded = true;

        scrollTo(0, 0);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al obtener la cita',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  downloadCita(): void {
    this.dataLoaded = false;
    this.citasService
      .downloadCita(this.id)
      .subscribe({
        next: (response: any): void => {
          this.dataLoaded = true;
          const blob: Blob = new Blob([response])
          saveAs(
            blob,
            `comprobante_cita.pdf`);
        },
        error: (error: string[]): void => {
          this.errores = error;
          this.dataLoaded = true;

          scrollTo(0, 0);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al descargar la cita',
            confirmButtonText: 'Aceptar',
          });
        },
      });
  }

  goBack() {
    this.location.back();
  }
}
