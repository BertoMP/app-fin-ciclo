import {Injectable} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {
  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    this.previousUrl = this.currentUrl;
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
    ).subscribe((event: NavigationStart) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
    });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }
}
