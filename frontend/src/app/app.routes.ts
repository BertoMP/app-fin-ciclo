import { Routes } from '@angular/router';
import { LoginComponent } from "./pages/auth/login/login.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ClinicaComponent } from './pages/clinica/clinica.component';
import {
  MedicalSpecialtyListComponent
} from "./pages/medical-specialty-list/medical-specialty-list.component";
import {
  ProfessionalsListComponent
} from "./pages/professionals-list/professionals-list.component";
import {
  MedicalServicesComponent
} from "./pages/medical-services/medical-services.component";
import {
  TesteoBackendComponent
} from "./testComponent/testeo-backend/testeo-backend.component";
import { ForgottenPasswordComponent } from './pages/auth/forgotten-password/forgotten-password.component';
import { RefreshPasswordComponent } from './pages/auth/refresh-password/refresh-password.component';
import { EspecialistDataComponent } from './pages/especialist-data/especialist-data.component';
import { PanelComponent } from './pages/panel-functions/panel/panel.component';
import { loginGuard } from './shared/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  {
    path: 'testeo',
    // component: TesteoBackendComponent
    component:PanelComponent,
    canActivate:[loginGuard]
  },

  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path:'sobre-nosotros',
    component:ClinicaComponent
  },
  {
    path: 'contacto',
    component:ContactUsComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },
  {
    path:'auth/forgotten-password',
    component:ForgottenPasswordComponent
  },
  {
    path:'auth/reset-password/:token',
    component:RefreshPasswordComponent
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
    path: 'listado-de-especialistas/:id',
    component: EspecialistDataComponent
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
