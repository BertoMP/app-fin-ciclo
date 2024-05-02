import { inject } from "@angular/core"
import { Router } from "@angular/router"

export const loginGuard = () => {
    const router: Router = inject(Router);
    if ((localStorage.getItem("access_token"))){
        return true;
    }else{
        router.navigate([""])
          .then(() => {})
          .catch((err) => {
            console.error(err)
          });
        return false;
    }
}
