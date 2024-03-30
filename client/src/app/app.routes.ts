import { Routes } from '@angular/router';
import { LoginComponent } from "./pages/auth/login/login.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import {
  MedicalSpecialtyListComponent
} from "./pages/medical-services/medical-specialty-list/medical-specialty-list.component";
import {
  ProfessionalsListComponent
} from "./pages/medical-services/professionals-list/professionals-list.component";
import {
  MedicalSpecialtiesComponent
} from "./pages/medical-services/medical-specialties.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'nuestros-servicios',
    component: MedicalSpecialtiesComponent,
  },
  {
    path: 'nuestros-servicios/listado-de-especialidades',
    component: MedicalSpecialtyListComponent
  },
  {
    path: 'nuestros-servicios/listado-de-especialistas',
    component: ProfessionalsListComponent
  }
];
