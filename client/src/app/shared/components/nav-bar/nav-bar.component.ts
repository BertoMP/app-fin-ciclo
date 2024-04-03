import {
  Component,
  ElementRef,
  HostListener, OnDestroy, OnInit,
} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, NgClass, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  isMenuOpen: boolean = false;
  routerSubscription: Subscription;

  constructor(private elementRef: ElementRef,
              private router: Router) {
  }

  onToggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(() => {
      this.isMenuOpen = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
