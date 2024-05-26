import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIf } from "@angular/common";
import { SidebarComponent } from "../../../../shared/components/sidebar/sidebar.component";
import { Subscription } from "rxjs";
import { PanelOptionModel } from "../../../../core/interfaces/panel-option.model";
import { AuthService } from "../../../../core/services/auth.service";
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-especialist-panel',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NgIf, SidebarComponent],
  templateUrl: './especialist-panel.component.html',
  styleUrl: './especialist-panel.component.scss'
})
export class EspecialistPanelComponent {
  optionSelected: boolean = false;
  userName: string = '';
  routerSub: Subscription;

  sidebarOpen: boolean = false;

  sidebarOptionsTop: PanelOptionModel[] = [
    {
      name: 'Agenda',
      options: [
        {
          name: 'Mi agenda',
          icon: 'bi bi-calendar-date',
          path: '/mediapp/listado-agenda',
          method: 'onOptionSelected',
        },
      ],
    },
    {
      name: 'Pacientes',
      options: [
        {
          name: 'Listado pacientes',
          icon: 'bi bi-people',
          path: '/mediapp/listado-pacientes',
          method: 'onOptionSelected',
        },
      ]
    },
    {
      name: 'Medicamentos',
      options: [
        {
          name: 'Listar medicamentos',
          icon: 'bi bi-capsule-pill',
          path: '/mediapp/listado-medicamentos',
          method: 'onOptionSelected',
        },
        {
          name: 'Crear medicamentos',
          icon: 'bi bi-capsule',
          path: '/mediapp/crear-medicamento',
          method: 'onOptionSelected',
        }
      ]
    },
    {
      name: 'Patologias',
      options: [
        {
          name: 'Listar patologias',
          icon: 'bi bi-virus',
          path: '/mediapp/listado-patologias',
          method: 'onOptionSelected',
        },
        {
          name: 'Crear patologias',
          icon: 'bi bi-clipboard-heart',
          path: '/mediapp/crear-patologia',
          method: 'onOptionSelected',
        }
      ]
    }
  ];

  sidebarOptionsBottom: PanelOptionModel[] = [
    {
      name: 'Actualizar Contraseña',
      icon: 'bi bi-key-fill',
      path: '/mediapp/actualizar-password',
    },
    {
      name: 'Cerrar Sesión',
      icon: 'bi bi-box-arrow-right',
      method: 'onLogout'
    }
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const sidebarElement = this.elementRef.nativeElement.querySelector('.sidebar');
    const buttonElement = this.elementRef.nativeElement.querySelector('.menu-button');

    if (!sidebarElement.contains(event.target) && event.target !== buttonElement) {
      this.sidebarOpen = false;
    }
  }

  constructor(private auth: AuthService,
    private router: Router,
    private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.userName = this.auth.getUserName();

    const options: string[] = [
      '/mediapp/listado-agenda',
      '/mediapp/listado-pacientes',
      '/mediapp/actualizar-password'
    ];
    if (options.includes(this.router.url)) {
      this.optionSelected = true;
    }

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.optionSelected = event.url !== '/mediapp';
    });
  }

  toggleSidebar(event: MouseEvent) {
    event.stopPropagation();
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}
