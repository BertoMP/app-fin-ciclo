import { Component, Input, OnInit } from '@angular/core';
import { AdminPanelService } from '../../../core/services/admin-panel.service';
import { UserListResponseModel } from '../../../core/interfaces/user-list-response.model';
import { NgxPaginationModule } from "ngx-pagination";
import { LowerCasePipe, NgForOf, NgIf } from '@angular/common';
import { VerticalCardComponent } from '../../../shared/components/vertical-card/vertical-card.component';
import { RemoveAccentsPipe } from '../../../shared/pipes/remove-accents.pipe';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import {ListedUserModel} from "../../../core/interfaces/listed-user.model";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RouterLink, RouterOutlet } from '@angular/router';
import {Select2Data, Select2Module} from "ng-select2-component";

@Component({
  selector: 'app-admin-panel',
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
    RouterOutlet, ReactiveFormsModule, Select2Module],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})

export class AdminPanelComponent implements OnInit {
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
  users: ListedUserModel[];
  nextPageUrl: string;
  previousPageUrl: string;
  actualPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  errores: string[];
  @Input("userRole") userRole: number;
  role: string = "1";
  search: string = "";

  constructor(private adminPanelService: AdminPanelService) { }

  ngOnInit(): void {
    this.actualPage = 1;
    this.getUsers(this.actualPage);
    console.log("Rol usuario " + this.userRole);
  }

  getUsers(pageOrUrl: number | string) {
    let request: Observable<UserListResponseModel> = (typeof pageOrUrl === 'number') ? this.adminPanelService.getUserList(pageOrUrl) : this.adminPanelService.getSpecificPage(pageOrUrl);

    request.subscribe({
      next: (response: UserListResponseModel) => {
        console.log(response);
        this.users = response.resultados;
        this.nextPageUrl = response.next;
        this.previousPageUrl = response.prev;
        this.totalPages = response.paginas_totales;
        this.totalItems = response.cantidad_usuarios;
        this.itemsPerPage = response.items_pagina;
        this.actualPage = response.pagina_actual;
      }
    });
  }

  filterByRole() {
    this.adminPanelService.getUsersByRole(parseInt(this.role)).subscribe({
      next: (response: UserListResponseModel) => {
        this.users = response.resultados;
        this.nextPageUrl = response.next;
        this.previousPageUrl = response.prev;
        this.totalPages = response.paginas_totales;
        this.totalItems = response.cantidad_usuarios;
        this.itemsPerPage = response.items_pagina;
        this.actualPage = response.pagina_actual;
      }
    });
  }

  filterBySearch() {
    this.adminPanelService.getUsersBySearch(this.search).subscribe({
      next: (response: UserListResponseModel) => {
        this.users = response.resultados;
        this.nextPageUrl = response.next;
        this.previousPageUrl = response.prev;
        this.totalPages = response.paginas_totales;
        this.totalItems = response.cantidad_usuarios;
        this.itemsPerPage = response.items_pagina;
        this.actualPage = response.pagina_actual;
      }
    });
  }

  confirmarCancelacion(id: number) {
    Swal.fire({
      text: 'Estás seguro que quieres eliminar a este usuario?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminPanelService.eliminateUser(id).subscribe({
          next: (response) => {
            this.users.length <= 1 && this.previousPageUrl != null ? this.getUsers(this.previousPageUrl) : this.getUsers(this.actualPage);
            Swal.fire({
              title: 'Enhorabuena',
              text: 'Has conseguido eliminar al usuario correctamente',
              icon: 'success',
              width: '50%'
            })
          },
          error: (error: string[]): void => {
            this.errores = error;
            console.log(this.errores);
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Usuario canceló la eliminación");
      }
    })
  }
}

