import {
  Component,
  ElementRef,
  HostListener, OnDestroy, OnInit,
} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {AuthService} from "../../../core/services/auth.service";
import {UserRole} from "../../../core/enum/user-role.enum";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, NgClass, RouterLinkActive, NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit, OnDestroy {
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  routerSubscription: Subscription;
  loggedInSubscription: Subscription;
  userRoleSubscription: Subscription;

  isMenuOpen: boolean = false;
  isUserLoggedIn: boolean = false;
  isPatient: boolean = false;

  userName: string = '';

  constructor(private elementRef: ElementRef,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(() => {
      this.isMenuOpen = false;
    });

    this.userRoleSubscription = this.authService.userRole.subscribe((role: UserRole) => {
      this.isPatient = role === UserRole.PACIENT;
    });

    this.loggedInSubscription = this.authService.isLoggedInUser.subscribe(
      loggedIn => {
        this.userName = this.authService.getUserName();

        if (this.userName) {
          this.userName = this.userName.split(' ')[0];
        }

        this.isUserLoggedIn = loggedIn;
      }
    );
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.loggedInSubscription.unsubscribe();
    this.userRoleSubscription.unsubscribe();
  }

  onToggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: (): void => {
        this.router.navigate(['/'])
          .then((): void => {})
          .catch((): void => {});
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
