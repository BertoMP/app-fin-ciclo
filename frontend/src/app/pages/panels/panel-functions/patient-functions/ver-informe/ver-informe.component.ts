import { Component } from '@angular/core';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { CitasService } from '../../../../../core/services/citas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CitaSpecificDataModel } from '../../../../../core/interfaces/cita-specific-data.model';
import { DatosPacienteModel } from '../../../../../core/interfaces/datos-paciente.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { informeService } from '../../../../../core/services/informe.service';

@Component({
  selector: 'app-ver-informe',
  standalone: true,
  imports: [LoadingSpinnerComponent,RouterLink],
  templateUrl: './ver-informe.component.html',
  styleUrl: './ver-informe.component.scss'
})
export class VerInformeComponent {
  cita: CitaSpecificDataModel;
  persona:DatosPacienteModel;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;
  suscripcionRuta: Subscription;
  id: number;
  private getMedsSubject: Subject<void> = new Subject<void>();

  constructor(private informeService:informeService, private citasService: CitasService, private activatedRoute: ActivatedRoute,) { }


  errores: string[];

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;

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

  getCita(id:number) {
    console.log(id);
    let request: Observable<CitaSpecificDataModel> = this.citasService.getCita(id);

    request.subscribe({
      next: (response: CitaSpecificDataModel) => {
        this.cita=response;
        this.persona=response.datos_paciente;
        // this.getInforme(this.cita.informe_id);
        console.log(this.cita);
        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }

  getInforme(id:number){
    let request: Observable<Object> = this.informeService.getInforme(id);

    request.subscribe({
      next: (response: Object) => {
        console.log(response);
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }
}