import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { NgIf } from '@angular/common';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { PanelOptionModel } from '../../../../core/interfaces/panel-option.model';
import { AuthService } from '../../../../core/services/auth.service';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pacient-panel',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NgIf, SidebarComponent],
  templateUrl: './pacient-panel.component.html',
  styleUrl: './pacient-panel.component.scss',
})
export class PacientPanelComponent implements OnInit, OnDestroy {
  optionSelected: boolean = false;
  userName: string = '';
  routerSub: Subscription;

  sidebarOpen: boolean = false;

  sidebarOptionsTop: PanelOptionModel[] = [
    {
      name: 'Medicaciones',
      options: [
        {
          name: 'Listado medicaciones',
          icon: 'bi bi-capsule',
          path: '/mediapp/listado-medicacion',
          method: 'onOptionSelected',
        },
      ],
    },
    {
      name: 'Mediciones',
      options: [
        {
          name: 'Listado glucometrias',
          icon: 'bi bi-card-list',
          path: '/mediapp/listado-glucometria',
          method: 'onOptionSelected',
        },
        {
          name: 'Tomar glucometria',
          icon: 'bi bi-file-medical-fill',
          path: '/mediapp/tomar-glucometria',
          method: 'onOptionSelected',
        },
        {
          name: 'Listado tensiones',
          icon: 'bi bi-card-list',
          path: '/mediapp/listado-tension',
          method: 'onOptionSelected',
        },
        {
          name: 'Tomar tensión',
          icon: 'bi bi-heart-pulse-fill',
          path: '/mediapp/tomar-tension',
          method: 'onOptionSelected',
        },
      ],
    },
    {
      name: 'Citas',
      options: [
        {
          name: 'Listado citas',
          icon: 'bi bi-calendar-event',
          path: '/mediapp/listado-citas',
          method: 'onOptionSelected',
        },
        {
          name: 'Solicitar citas',
          icon: 'bi bi-calendar-plus',
          path: '/mediapp/solicitar-cita',
          method: 'onOptionSelected',
        },
      ],
    },
    {
      name: 'Informes',
      options: [
        {
          name: 'Listado informes',
          icon: 'bi bi-file-earmark-text',
          path: '/mediapp/listado-informes',
          method: 'onOptionSelected',
        },
      ],
    },
  ];

  sidebarOptionsBottom: PanelOptionModel[] = [
    {
      name: 'Editar perfil',
      icon: 'bi bi-pencil-fill',
      path: '/mediapp/editar-perfil',
      method: 'onOptionSelected',
    },
    {
      name: 'Actualizar Contraseña',
      icon: 'bi bi-key-fill',
      path: '/mediapp/actualizar-password',
    },
    {
      name: 'Borrar cuenta',
      icon: 'bi bi-person-dash',
      path: '/mediapp',
      method: 'onDeleteAccount',
    },
    {
      name: 'Cerrar Sesión',
      icon: 'bi bi-box-arrow-right',
      method: 'onLogout',
    },
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const sidebarElement =
      this.elementRef.nativeElement.querySelector('.sidebar');
    const buttonElement =
      this.elementRef.nativeElement.querySelector('.menu-button');

    if (
      !sidebarElement.contains(event.target) &&
      event.target !== buttonElement
    ) {
      this.sidebarOpen = false;
    }
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private elementRef: ElementRef,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Panel de paciente');

    this.userName = this.auth.getUserName();

    const options: string[] = [
      '/mediapp/listado-medicacion',
      '/mediapp/listado-glucometria',
      '/mediapp/listado-tension',
      '/mediapp/tomar-glucometria',
      '/mediapp/tomar-tension',
      '/mediapp/listado-citas',
      '/mediapp/listado-informes',
      '/mediapp/editar-perfil',
      '/mediapp/solicitar-cita',
      '/mediapp/actualizar-password',
    ];
    if (options.includes(this.router.url)) {
      this.optionSelected = true;
    }

    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.optionSelected = event.url !== '/mediapp';
      });

    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.optionSelected = event.url !== '/mediapp';
      });
  }

  toggleSidebar(event: MouseEvent) {
    event.stopPropagation();
    this.sidebarOpen = !this.sidebarOpen;

    if (this.sidebarOpen) {
      scrollTo(0, 0);
    }
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}
