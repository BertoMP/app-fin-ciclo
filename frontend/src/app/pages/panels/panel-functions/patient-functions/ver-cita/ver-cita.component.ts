import { Component } from '@angular/core';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { CitasService } from '../../../../../core/services/citas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CitaSpecificDataModel } from '../../../../../core/interfaces/cita-specific-data.model';
import { DatosPacienteModel } from '../../../../../core/interfaces/datos-paciente.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ver-cita',
  standalone: true,
  imports: [LoadingSpinnerComponent, RouterLink],
  templateUrl: './ver-cita.component.html',
  styleUrl: './ver-cita.component.scss'
})
export class VerCitaComponent {
  cita: CitaSpecificDataModel;
  persona: DatosPacienteModel;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;
  suscripcionRuta: Subscription;
  id: number;
  private getMedsSubject: Subject<void> = new Subject<void>();

  constructor(private citasService: CitasService, private activatedRoute: ActivatedRoute,) { }


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

  getCita(id: number) {
    console.log(id);
    let request: Observable<CitaSpecificDataModel> = this.citasService.getCita(id);

    request.subscribe({
      next: (response: CitaSpecificDataModel) => {
        this.cita=response;
        console.log(this.cita);
        this.dataLoaded=true;
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }

}