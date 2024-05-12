import { Component, OnInit } from '@angular/core';
import { MedicionesService } from '../../../../../core/services/mediciones.service';
import { Observable, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { MedicionListModel } from '../../../../../core/interfaces/medicion-list.model';

@Component({
  selector: 'app-listado-mediciones',
  standalone: true,
  imports: [NgxPaginationModule, NgFor,
    NgForOf,
    NgIf,
    FormsModule,RouterLink],
  templateUrl: './listado-mediciones.component.html',
  styleUrl: './listado-mediciones.component.scss'
})
export class ListadoMedicionesComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  userId: number;
  loggedInSubscription: Subscription;
  mediciones: MedicionListModel;

  rutaActual: string;
  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[];
  campos: string[];
  datos: string[];

  constructor(private medicionesService: MedicionesService, private router: Router) { }


  ngOnInit(): void {
    this.actualPage = 1;
    this.getMediciones(this.actualPage);
  }

  getMediciones(pageOrUrl: number | string) {
    this.rutaActual = this.router.url;
    let request: Observable<MedicionListModel>;
    if (this.rutaActual.includes('listadoGlucometria'))
      request = (typeof pageOrUrl === 'number') ? this.medicionesService.getGlucometria(pageOrUrl) : this.medicionesService.getSpecificPage(pageOrUrl);
    else
      request = (typeof pageOrUrl === 'number') ? this.medicionesService.getTensionArterial(pageOrUrl) : this.medicionesService.getSpecificPage(pageOrUrl);

    request.subscribe({
      next: (response) => {
        this.#showResults(response);
      }
    });
  }

  #showResults(data) {
    console.log(data);
    this.mediciones = data.mediciones;
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.totalItems = data.cantidad_mediciones;
    this.itemsPerPage =this.totalItems/this.totalPages;
    this.actualPage = data.pagina_actual;
    if (data.mediciones[0] != null)
      this.campos = Object.keys(data.mediciones[0].datos_toma);
  }

}