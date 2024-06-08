import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {NgForOf} from "@angular/common";
import {PanelOptionModel} from "../../../core/interfaces/panel-option.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgForOf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() mainOptions: PanelOptionModel[];
  @Input() secondaryOptions: PanelOptionModel[];
  @Input() title: string;
  @Output() closeSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  optionSelected: boolean = false;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  executeMethod(methodName: string): void {
    switch (methodName) {
      case 'onOptionSelected':
        this.onOptionSelected();
        break;
      case 'onLogout':
        this.onLogout();
        break;
      case 'onDeleteAccount':
        this.onDeleteAccount();
        break;
    }
  }

  onOptionSelected(): void {
    this.optionSelected = true;
    this.closeSidebar.emit();
  }

  onDeleteAccount(): void {
    this.closeSidebar.emit();
    Swal.fire({
      text: '¿Estás seguro que quieres eliminar tu cuenta de usuario?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.deleteAccount().subscribe({
          next: (): void => {
            this.router.navigate(['/'])
              .then((): void => {
                Swal.fire({
                  title: 'Enhorabuena',
                  text: 'Has conseguido eliminar al usuario correctamente',
                  icon: 'success',
                  width: '50%'
                });
              })
              .catch((): void => {});
          },
          error: (error) => {
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: 'info',
          title: 'Cancelado',
          text: 'No se ha eliminado al usuario',
          width: '50%'
        });
      }
    });
  }

  onLogout(): void {
    this.auth.logout().subscribe({
      next: (): void => {
        this.router.navigate(['/'])
          .then((): void => {})
          .catch((): void => {});
      },
      error: (error) => {
      }
    });
  }
}
