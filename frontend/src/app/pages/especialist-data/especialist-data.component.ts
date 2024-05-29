import { Component, OnDestroy, OnInit, } from '@angular/core';

import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfessionalDataService } from '../../core/services/professional-data.service';
import { EspecialistModel } from '../../core/interfaces/especialist.model';
import { HttpErrorResponse } from '@angular/common/http';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import { NgIf,Location } from '@angular/common';
import {ChatBotComponent} from "../../shared/components/chat-bot/chat-bot.component";
import {LoadingSpinnerComponent} from "../../shared/components/loading-spinner/loading-spinner.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-especialist-data',
  standalone: true,
  imports: [RouterLink, NgIf, ChatBotComponent, LoadingSpinnerComponent],
  templateUrl: './especialist-data.component.html',
  styleUrl: './especialist-data.component.scss'
})
export class EspecialistDataComponent implements OnDestroy, OnInit {
  suscripcionRuta: Subscription;
  id: number;
  datosEspecialista: EspecialistModel;
  errores: string[] = [];
  safeDescription: SafeHtml;
  isLoading = false;

  constructor(private professionalDataService: ProfessionalDataService,
              private activatedRoute: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private location: Location,
              private router: Router) {

  }
  ngOnDestroy(): void {
    this.suscripcionRuta.unsubscribe();
  }

  volver(){
    this.location.back();
  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;
      this.isLoading = true;
      if (this.id != null) {
        this.professionalDataService.recogerInfoEspecialista(this.id).subscribe({
          next: (res: EspecialistModel) => {
            this.isLoading = false;
            this.datosEspecialista = res;
            this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.datosEspecialista.datos_especialista.descripcion);
          },
          error: (error: HttpErrorResponse): void => {
            this.errores = error.message.split(',');

            if (error.status === 404) {
              this.router.navigate(['/404'])
                .then(() => console.log('Navegación a 404'));
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al cargar la información del especialista',
                icon: 'error',
              });
            }
          }
        });
      }
    });
  }
}
