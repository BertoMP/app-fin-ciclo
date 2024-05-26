import { Component } from '@angular/core';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { CitasService } from '../../../../../core/services/citas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatosPacienteModel } from '../../../../../core/interfaces/datos-paciente.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { InformeSpecificData } from '../../../../../core/interfaces/informe-specific-data.model';
import { Location, NgFor } from '@angular/common';
import { InformeService } from '../../../../../core/services/informe.service';
import { saveAs } from 'file-saver';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AuthService} from "../../../../../core/services/auth.service";

@Component({
  selector: 'app-ver-informe',
  standalone: true,
  imports: [LoadingSpinnerComponent, RouterLink, NgFor],
  templateUrl: './ver-informe.component.html',
  styleUrl: './ver-informe.component.scss'
})
export class VerInformeComponent {
  informe: InformeSpecificData;
  persona: DatosPacienteModel;
  username: string;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;
  suscripcionRuta: Subscription;
  id: number;
  private getMedsSubject: Subject<void> = new Subject<void>();

  constructor(private informeService: InformeService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private sanitizer: DomSanitizer,
              private authService: AuthService) { }


  errores: string[];

  ngOnInit(): void {
    this.username = this.authService.getUserName();

    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;

      this.getMedsSubject
        .pipe(
          debounceTime(500)
        )
        .subscribe({
          next: () => {
            this.getInforme(this.id);
          },
          error: (error: string[]) => {
            this.errores = error;
          }
        });
      this.initialLoad = true;
      this.getMedsSubject.next();
    });
  }

  volver() {
    this.location.back();
  }

  sanitizeHtml(inputHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(inputHtml);
  }

  getInforme(id: number) {
    let request: Observable<InformeSpecificData> = this.informeService.getInforme(id);

    request.subscribe({
      next: (response: InformeSpecificData) => {
        this.dataLoaded = true;
        this.informe = response;
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }

  descargarInforme() {
    this.informeService.getDownloadInforme(this.informe.datos_informe.id).subscribe((response: any) => {
      const blob = new Blob([response]);
      saveAs(blob, `informe_${this.informe.datos_paciente.datos_personales.nombre}_${this.informe.datos_paciente.datos_personales.primer_apellido}_${this.informe.datos_paciente.datos_personales.segundo_apellido}.pdf`);
    });
  }
}
