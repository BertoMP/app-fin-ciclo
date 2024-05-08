import { Component, OnInit } from '@angular/core';
import { MedicionesService } from '../../../../../core/services/mediciones.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { MedicionListModel } from '../../../../../core/interfaces/Medicion-list.model';

@Component({
  selector: 'app-listado-mediciones',
  standalone: true,
  imports: [NgxPaginationModule,
    NgForOf,
    NgIf,
    FormsModule],
  templateUrl: './listado-mediciones.component.html',
  styleUrl: './listado-mediciones.component.scss'
})
export class ListadoMedicionesComponent implements OnInit{
  isUserLoggedIn: boolean = false;
  userId: number;
  loggedInSubscription: Subscription;
  mediciones:MedicionListModel;

  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[]

  constructor(private medicionesService: MedicionesService,private router: Router) { }

  obtenerRutaActual() {
    const rutaActual = this.router.url;
    console.log('Ruta actual:', rutaActual);
  }

  ngOnInit(): void {
    this.actualPage = 1;
    this.getMediciones(this.actualPage);
  }

  getMediciones(pageOrUrl: number | string) {
    this.obtenerRutaActual();
    let request: Observable<MedicionListModel> = (typeof pageOrUrl === 'number') ? this.medicionesService.getGlucometria(pageOrUrl) : this.medicionesService.getSpecificPageGlucometria(pageOrUrl);

    request.subscribe({
      next: (response) => {
        this.#showResults(response);
      }
    });
  }


  #showResults(data) {
    console.log(data);
    this.mediciones = data.glucometrias;
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.totalItems = data.cantidad_glucometrias;
    this.itemsPerPage = data.glucometrias.length;
    this.actualPage = data.pagina_actual;
  }

}