import {Component, ElementRef, HostListener, OnDestroy, OnInit} from "@angular/core";
import {NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {AuthService} from "../../../../core/services/auth.service";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";
import {SidebarComponent} from "../../../../shared/components/sidebar/sidebar.component";
import {PanelOptionModel} from "../../../../core/interfaces/panel-option.model.js";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterModule,
    NgIf,
    SidebarComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})

export class AdminPanelComponent implements OnInit, OnDestroy {
  optionSelected: boolean = false;
  userName: string = '';
  routerSub: Subscription;

  sidebarOpen: boolean = false;

  sidebarOptionsTop: PanelOptionModel[] = [
    {
      name: 'Usuarios',
      icon: 'bi bi-people-fill',
      options: [
        {
          name: 'Listado usuarios',
          icon: 'bi bi-people-fill',
          path: '/mediapp/usuarios',
          method: 'onOptionSelected',
        },
        {
          name: 'Crear Paciente',
          icon: 'bi bi-person-fill-add',
          path: '/mediapp/crear-paciente',
          method: 'onOptionSelected',
        },
        {
          name: 'Crear Especialista',
          icon: 'bi bi-hospital-fill',
          path: '/mediapp/crear-especialista',
          method: 'onOptionSelected',
        }
      ],
    },
    {
      name: 'Especialidades',
      icon: 'bi bi-hospital-fill',
      options: [
        {
          name: 'Listado Especialidades',
          icon: 'bi bi-list-task',
          path: '/mediapp/especialidades',
          method: 'onOptionSelected',
        },
        {
          name: 'Crear Especialidad',
          icon: 'bi bi-patch-plus-fill',
          path: '/mediapp/crear-especialidad',
          method: 'onOptionSelected',
        }
      ],
    },
  ];

  sidebarOptionsBottom: PanelOptionModel[] = [
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
      '/mediapp/usuarios',
      '/mediapp/especialidades',
      '/mediapp/crear-paciente',
      '/mediapp/crear-especialista',
      '/mediapp/crear-especialidad'
    ];
    if (options.includes(this.router.url)) {
      this.optionSelected = true;
    }

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.optionSelected = event.url !== '/mediapp';
    });

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

