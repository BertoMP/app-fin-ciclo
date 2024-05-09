import {Component, OnDestroy, OnInit} from "@angular/core";
import {NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {AuthService} from "../../../../core/services/auth.service";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterModule,
    NgIf
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})

export class AdminPanelComponent implements OnInit, OnDestroy {
  optionSelected: boolean = false;
  userName: string = '';
  routerSub: Subscription;

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.userName = this.auth.getUserName();

    const options = [
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
      this.optionSelected = event.url !== '/testeo';
    });

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.optionSelected = event.url !== '/testeo';
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  onOptionSelected(): void {
    this.optionSelected = true;
  }

  onLogout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/'])
          .then(() => {})
          .catch(() => {});
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}

