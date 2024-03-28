import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  @ViewChild('sideBar') sideBar: ElementRef;

  onOpenSideBar(): void {
    this.sideBar.nativeElement.style.display = 'flex';
  }

  onCloseSideBar(): void {
    this.sideBar.nativeElement.style.display = 'none';
  }
}
