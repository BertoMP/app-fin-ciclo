import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { NgxPaginationModule } from "ngx-pagination";
import {LowerCasePipe, NgClass, NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import Swal from 'sweetalert2';
import {debounceTime, Observable, Subject} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RouterLink, RouterOutlet } from '@angular/router';
import {Select2Data, Select2Module} from "ng-select2-component";
import { VerticalCardComponent } from '../../../../../shared/components/vertical-card/vertical-card.component';
import { RemoveAccentsPipe } from '../../../../../shared/pipes/remove-accents.pipe';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ListedUserModel } from '../../../../../core/interfaces/listed-user.model';
import { AdminPanelService } from '../../../../../core/services/admin-panel.service';
import { UserListResponseModel } from '../../../../../core/interfaces/user-list-response.model';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-user-list',
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
    RouterOutlet, ReactiveFormsModule, Select2Module, UpperCasePipe, NgClass],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  @Input("userRole") userRole: number;

  roles: Select2Data = [
    {
      value: 1,
      label: 'Todos'
    },
    {
      value: 2,
      label: 'Pacientes'
    },
    {
      value: 3,
      label: 'Especialistas'
    }
  ];

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

  users: ListedUserModel[];
  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  resultMin: number;
  resultMax: number;
  errores: string[];
  role: string = "1";
  search: string = "";
  perPage: string = "10";

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  private getUsersSubject: Subject<void> = new Subject<void>();

  constructor(private adminPanelService: AdminPanelService,
              private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Listado de usuarios');

    this.users = [];
    this.actualPage = 1;
    this.getUsersSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe({
        next: () => {
          this.getUsers()
        },
        error: (error: string[]) => {
          this.errores = error;
        }
      });
    this.initialLoad = true;
    this.getUsersSubject.next();
  }

  changePage(page: number) {
    if (this.initialLoad) {
      this.dataLoaded = false;
      this.actualPage = page;
      this.getUsersSubject.next();
    }
  }

  updateFilters(): void {
    if (this.initialLoad) {
      this.actualPage = 1;
      this.getUsersSubject.next();
    }
  }

  getUsers() {
    let request: Observable<UserListResponseModel>;
    request = this.adminPanelService
      .getUsersByRoleAndSearch(
        parseInt(this.role),
        this.search,
        parseInt(this.perPage),
        this.actualPage
      );

    request.subscribe({
      next: (response: UserListResponseModel) => {
        this.#showResults(response);
        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.errores = error;
        this.dataLoaded = true;
        scrollTo(0, 0);
        Swal.fire({
          title: 'Error',
          text: `Ha ocurrido un error al intentar obtener los usuarios`,
          icon: 'error',
          width: '50%'
        });
      }
    });
  }

  #showResults(data: UserListResponseModel) {
    this.users = data.resultados;
    this.nextPageUrl = data.next;
    this.previousPageUrl = data.prev;
    this.totalPages = data.paginas_totales;
    this.totalItems = data.cantidad_usuarios;
    this.itemsPerPage = data.items_pagina;
    this.actualPage = data.pagina_actual;
    this.resultMin = data.result_min;
    this.resultMax = data.result_max;
  }

  confirmarCancelacion(id: number) {
    scrollTo(0, 0);
    Swal.fire({
      text: '¿Estás seguro que quieres eliminar a este usuario?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      this.dataLoaded = false;
      if (result.isConfirmed) {
        this.adminPanelService
          .eliminateUser(id)
          .subscribe({
            next: (response) => {
              if (this.actualPage > 1 && this.users.length === 1) {
                this.actualPage--;
              }

              this.getUsers();
              this.dataLoaded = true;
              scrollTo(0, 0);
              Swal.fire({
                title: 'Enhorabuena',
                text: 'Has conseguido eliminar al usuario correctamente',
                icon: 'success',
                width: '50%'
              });
              },
            error: (error: string[]): void => {
              this.errores = error;
              this.dataLoaded = true;
              scrollTo(0, 0);
              Swal.fire({
                title: 'Error',
                text: `Ha ocurrido un error al intentar eliminar al usuario`,
                icon: 'error',
                width: '50%'
              }).then(() => {
                this.getUsers();
              });
              }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.dataLoaded = true;
        scrollTo(0, 0);
        Swal.fire({
          title: 'Cancelado',
          text: 'No se ha eliminado al usuario',
          icon: 'info',
          width: '50%'
        });
      }
    })
  }
}
