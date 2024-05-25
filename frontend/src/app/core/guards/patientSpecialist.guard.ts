import { inject } from "@angular/core"
import { Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

export const patientSpecialistGuard = () => {
  const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);
    let loggedInSubscription: Subscription;
    let isUserLoggedIn: boolean = false;
    let comprobarPatientSpecialist: boolean = false;

    loggedInSubscription = authService.isLoggedInUser.subscribe(
        (loggedIn: boolean): void => {
          isUserLoggedIn = loggedIn;
          if (isUserLoggedIn) {
           if (authService.getUserRole() === 2 || authService.getUserRole() === 3 ){
            comprobarPatientSpecialist = true;
           }else{
            router.navigate(['/auth/login']).then(r => { });
           }
          }
        }
    )

    return comprobarPatientSpecialist;
}
