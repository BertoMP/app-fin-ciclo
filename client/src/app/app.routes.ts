import { Routes } from '@angular/router';
import { LoginComponent } from "./pages/auth/login/login.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import {
  MedicalSpecialtyListComponent
} from "./pages/medical-specialty-list/medical-specialty-list.component";
import {
  ProfessionalsListComponent
} from "./pages/professionals-list/professionals-list.component";
import {
  MedicalServicesComponent
} from "./pages/medical-services/medical-services.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },
  {
    path: 'nuestros-servicios',
    component: MedicalServicesComponent,
  },
  {
    path: 'listado-de-especialidades',
    component: MedicalSpecialtyListComponent
  },
  {
    path: 'listado-de-especialistas',
    component: ProfessionalsListComponent
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
