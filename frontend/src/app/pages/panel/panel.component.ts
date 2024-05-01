import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnInit, OnDestroy {
  userRole: number = 0;
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
          this.router.navigate(['/auth/login']).then(r => {});
        },
        error: (error: HttpErrorResponse) => {
          console.error(error.error);
        }

      });
  }

}