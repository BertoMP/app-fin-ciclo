import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PacientPanelComponent } from '../../user-panels/pacient-panel/pacient-panel.component';
import { EspecialistPanelComponent } from '../../user-panels/especialist-panel/especialist-panel.component';
import { AdminPanelComponent } from '../../user-panels/admin-panel/admin-panel.component';
import { UserRole } from '../../../../core/enum/user-role.enum';
import { AuthService } from '../../../../core/services/auth.service';
import {LoginComponent} from "../../../auth/login/login.component";

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [PacientPanelComponent, EspecialistPanelComponent, AdminPanelComponent, LoginComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnInit, OnDestroy {
  userRole: UserRole;
  loggedInSubscription: Subscription;
  isUserLoggedIn: boolean = false;
  userId: number = 0;

  constructor(private authService: AuthService, private router: Router) { }

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

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout()
      .subscribe({
        next: (response) => {
          this.router.navigate(['/auth/login']).then(r => { });
        },
        error: (error: HttpErrorResponse) => {}
      });
  }

  protected readonly UserRole = UserRole;
}
