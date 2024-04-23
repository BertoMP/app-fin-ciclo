import {
  Component,
  ElementRef,
  HostListener, OnDestroy, OnInit,
} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass} from "@angular/common";
import {Subscription} from "rxjs";
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, NgClass, RouterLinkActive],
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

  isMenuOpen: boolean = false;
  isUserLoggedIn: boolean = false;

  constructor(private elementRef: ElementRef,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(() => {
      this.isMenuOpen = false;
    });

    this.loggedInSubscription = this.authService.isLoggedInUser.subscribe(
      loggedIn => this.isUserLoggedIn = loggedIn
    );
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.loggedInSubscription.unsubscribe();
  }

  onToggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }
}
