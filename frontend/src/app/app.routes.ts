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
import { loginGuard } from './core/guards/login.guard';
import {
  PageNotFoundComponent
} from "./pages/page-not-found/page-not-found.component";
import { SpecialistFormComponent } from './pages/panel-functions/specialist-form/specialist-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/sobre-nosotros',
    pathMatch: 'full'
  },

  {
    path: 'testeo',
    component:PanelComponent,
    canActivate:[loginGuard]
  },

  {
    path: 'testeo-backend',
    component:TesteoBackendComponent
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
    path: 'crearUsuario',
    component: RegisterComponent
  },
  {
    path: 'crearEspecialista',
    component: SpecialistFormComponent
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
    component: PageNotFoundComponent
  }
];
