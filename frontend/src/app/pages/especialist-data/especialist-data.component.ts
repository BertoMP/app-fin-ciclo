import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfessionalDataService } from '../../core/services/professional-data.service';
import { EspecialistDataModel } from '../../core/interfaces/especialist-data.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-especialist-data',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './especialist-data.component.html',
  styleUrl: './especialist-data.component.scss'
})
export class EspecialistDataComponent {
  suscripcionRuta: Subscription;
  id: number;
  datosEspecialista: EspecialistDataModel;
  errores: string[] = [];

  constructor(private professionalDataService: ProfessionalDataService,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;
      if (this.id != null) {
        this.professionalDataService.recogerInfoEspecialista(this.id).subscribe({
          next: (res: EspecialistDataModel) => {
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