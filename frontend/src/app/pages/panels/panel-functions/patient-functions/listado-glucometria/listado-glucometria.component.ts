import { Component, Input, OnInit } from '@angular/core';
import { MedicionesService } from '../../../../../core/services/mediciones.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { GlucometriaListModel } from '../../../../../core/interfaces/glucometria-list.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-listado-glucometria',
  standalone: true,
  imports: [NgxPaginationModule,
    NgForOf,
    NgIf,
    FormsModule ],
  templateUrl: './listado-glucometria.component.html',
  styleUrl: './listado-glucometria.component.scss'
})
export class ListadoGlucometriaComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  userId: number;
  loggedInSubscription: Subscription;
  mediciones:GlucometriaListModel;

  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[]

  constructor(private medicionesService: MedicionesService) { }


  ngOnInit(): void {
    this.actualPage = 1;
    this.getMediciones(this.actualPage);
  }

  getMediciones(pageOrUrl: number | string) {
    let request: Observable<GlucometriaListModel> = (typeof pageOrUrl === 'number') ? this.medicionesService.getGlucometria(pageOrUrl) : this.medicionesService.getSpecificPageGlucometria(pageOrUrl);

    request.subscribe({
      next: (response:GlucometriaListModel) => {
        this.#showResults(response);
      }
    });
  }


  #showResults(data) {
    console.log(data);
    console.log(Object.keys(data.resultados[0].datos_toma));
    this.mediciones = data.resultados;
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.totalItems = data.cantidad_glucometrias;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
  }
}
