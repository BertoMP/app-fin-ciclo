import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfessionalDataService } from '../../core/services/professional-data.service';
import { EspecialistModel } from '../../core/interfaces/especialist.model';
import { HttpErrorResponse } from '@angular/common/http';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-especialist-data',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './especialist-data.component.html',
  styleUrl: './especialist-data.component.scss'
})
export class EspecialistDataComponent implements OnDestroy, OnInit {
  suscripcionRuta: Subscription;
  id: number;
  datosEspecialista: EspecialistModel;
  errores: string[] = [];
  safeDescription: SafeHtml;

  constructor(private professionalDataService: ProfessionalDataService,
              private activatedRoute: ActivatedRoute,
              private sanitizer: DomSanitizer) {

  }
  ngOnDestroy(): void {
    this.suscripcionRuta.unsubscribe();
  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;
      if (this.id != null) {
        this.professionalDataService.recogerInfoEspecialista(this.id).subscribe({
          next: (res: EspecialistModel) => {
            this.datosEspecialista = res;
            this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.datosEspecialista.datos_especialista.descripcion);
          },
          error: (error: HttpErrorResponse): void => {
            this.errores = error.message.split(',');
          }
        });
      }
    });
  }
}
