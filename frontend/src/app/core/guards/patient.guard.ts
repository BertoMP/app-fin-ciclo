import { inject } from "@angular/core"
import { Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

export const patientGuard = () => {
  const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);
    let loggedInSubscription: Subscription;
    let isUserLoggedIn: boolean = false;
    let comprobarAdmin=false;
  
    loggedInSubscription = authService.isLoggedInUser.subscribe(
        loggedIn => {
          isUserLoggedIn = loggedIn;
          if (isUserLoggedIn) {
           if (authService.getUserRole()==2){
            comprobarAdmin=true;
           }else{
            router.navigate(['/auth/login']).then(r => { });
           }
          }
        }
    )

    return comprobarAdmin;
}