


import { inject } from "@angular/core"
import { Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";

export const adminGuard = () => {
    const authService: AuthService = inject(AuthService);
    let loggedInSubscription: Subscription;
    let isUserLoggedIn: boolean = false;
  
    loggedInSubscription = authService.isLoggedInUser.subscribe(
        loggedIn => {
          isUserLoggedIn = loggedIn;
          if (isUserLoggedIn) {
           return (authService.getUserRole()==1);
          }
        }
    )

}