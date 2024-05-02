import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  constructor(private router: Router,
              private location: Location) {
  }

  goBack() {
    this.location.back();
  }
}
