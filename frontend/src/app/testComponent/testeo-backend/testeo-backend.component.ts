import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {TesteoBackendService} from "../testeo-backend.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-testeo-backend',
  standalone: true,
  imports: [],
  templateUrl: './testeo-backend.component.html',
  styleUrl: './testeo-backend.component.scss'
})
export class TesteoBackendComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;
  userRole: number = 0;
  userId: number = 0;
  loggedInSubscription: Subscription;

  constructor(private authService: AuthService,
              private testeoBack: TesteoBackendService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loggedInSubscription = this.authService.isLoggedInUser.subscribe(
      loggedIn => {
        this.isUserLoggedIn = loggedIn;
        if (this.isUserLoggedIn) {
          this.userRole = this.authService.getUserRole();
          this.userId = this.authService.getUserId();
        }
      }
    );
  }

  ngOnDestroy() {
    this.loggedInSubscription.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout()
      .subscribe({
        next: (response) => {
          this.router.navigate(['/auth/login']).then(r => {});
        },
        error: (error: HttpErrorResponse) => {
          console.error(error.error);
        }

      });
  }

  onListCitas(): void {
    this.testeoBack.listCitas()
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error.error);
        }
      });
  }

  onListPacientes(): void {
    this.testeoBack.listPacientes()
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error.error);
        }
      });
  }

  onListMedicamentos(): void {
    this.testeoBack.listMedicamentos()
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('No se pudo obtener la lista de medicamentos.');
        }
      });
  }

  onGetReceta(): void {
    this.testeoBack.generaReceta()
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          console.error('No se pudo generar la receta.', error);
        }
      });
  }
}
