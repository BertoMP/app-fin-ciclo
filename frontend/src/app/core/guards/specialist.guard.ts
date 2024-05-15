import { inject } from "@angular/core"
import { Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

export const specialistGuard = () => {
  const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);
    let loggedInSubscription: Subscription;
    let isUserLoggedIn: boolean = false;
    let comprobarSpecialist: boolean = false;

    loggedInSubscription = authService.isLoggedInUser.subscribe(
      (loggedIn: boolean): void => {
          isUserLoggedIn = loggedIn;
          if (isUserLoggedIn) {
           if (authService.getUserRole() === 3){
             comprobarSpecialist = true;
           }else{
            router.navigate(['/auth/login']).then(r => { });
           }
          }
        }
    )

    return comprobarSpecialist;
}
