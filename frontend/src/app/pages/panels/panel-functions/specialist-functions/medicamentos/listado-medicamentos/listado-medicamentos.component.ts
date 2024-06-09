import {Component, OnInit} from '@angular/core';
import { NgxPaginationModule } from "ngx-pagination";
import {LowerCasePipe, NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import {debounceTime, Observable, Subject} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RouterLink, RouterOutlet } from '@angular/router';
import {Select2Data, Select2Module} from "ng-select2-component";
import { VerticalCardComponent } from '../../../../../../shared/components/vertical-card/vertical-card.component';
import { RemoveAccentsPipe } from '../../../../../../shared/pipes/remove-accents.pipe';
import { LoadingSpinnerComponent } from '../../../../../../shared/components/loading-spinner/loading-spinner.component';
import {RemoveBrPipe} from "../../../../../../shared/pipes/remove-br.pipe";
import {DomSanitizer, SafeHtml, Title} from "@angular/platform-browser";
import { MedicinasDataModel } from '../../../../../../core/interfaces/medicinas-data.model';
import { MedicinasListModel } from '../../../../../../core/interfaces/medicinas-list.model';
import { MedicacionesService } from '../../../../../../core/services/medicaciones.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-listado-medicamentos',
  standalone: true,
  imports: [VerticalCardComponent,
    LowerCasePipe,
    RemoveAccentsPipe,
    LoadingSpinnerComponent,
    NgxPaginationModule,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    RouterOutlet,
    ReactiveFormsModule,
    Select2Module,
    UpperCasePipe,
    RemoveBrPipe],
  templateUrl: './listado-medicamentos.component.html',
  styleUrl: './listado-medicamentos.component.scss'
})
export class ListadoMedicamentosComponent implements OnInit {
  medicamentos: MedicinasDataModel[];
  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[];
  search: string = "";
  perPage: string = "10";
  resultMin: number;
  resultMax: number;

  dataLoaded: boolean = false;
  initialLoad: boolean = false;

  perPageOptions: Select2Data = [
    {
      value: 5,
      label: '5'
    },
    {
      value: 10,
      label: '10'
    },
    {
      value: 15,
      label: '15'
    },
    {
      value: 20,
      label: '20'
    }
  ];

  private getMedicinesSubject: Subject<void> = new Subject<void>();

  constructor(private medicacionesService: MedicacionesService,
              private sanitizer: DomSanitizer,
              private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Listado de medicamentos');
    this.medicamentos = [];
    this.actualPage = 1;
    this.getMedicinesSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe({
        next: () => {
          this.getMedicamentos()
        },
        error: (error: string[]) => {
          this.errores = error;
        }
      });
    this.initialLoad = true;
    this.getMedicinesSubject.next();
  }

  ngOnDestroy() {
    this.getMedicinesSubject.unsubscribe();
  }

  sanitizeHtml(inputHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(inputHtml);
  }

  changePage(page: number) {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getMedicinesSubject.next();
    }
  }

  updateFilters(): void {
    if (this.initialLoad) {
      this.actualPage = 1;
      this.getMedicinesSubject.next();
    }
  }

  getMedicamentos() {
    let request: Observable<MedicinasListModel>;
    request = this.medicacionesService.getMedicamentos(
      this.search,
      parseInt(this.perPage),
      this.actualPage
    );


    request.subscribe({
      next: (response: MedicinasListModel) => {
        this.#showResults(response);
        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.errores = error;
        this.dataLoaded = true;

        scrollTo(0, 0);
        Swal.fire({
          title: 'Error',
          text: 'Se ha producido un error al cargar los medicamentos',
          icon: 'error',
          width: '50%'
        });
      }
    });
  }

  #showResults(data) {
    this.medicamentos = data.resultados;
    this.itemsPerPage = data.items_pagina;
    this.nextPageUrl = data.next;
    this.actualPage = data.pagina_actual;
    this.totalPages = data.paginas_totales;
    this.previousPageUrl = data.prev;
    this.totalItems = data.cantidad_medicamentos;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
  }
}
