import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfessionalDataService } from '../../core/services/professional-data.service';
import { EspecialistModel } from '../../core/interfaces/especialist.model';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(private professionalDataService: ProfessionalDataService,
    private activatedRoute: ActivatedRoute) {

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
            console.log(this.datosEspecialista);
          },
          error: (error: HttpErrorResponse): void => {
            this.errores = error.message.split(',');
          }
        });
      }
    });

  }
}