import { Routes } from '@angular/router';
import { LoginComponent } from "./pages/auth/login/login.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
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
import { loginGuard } from './core/guards/login.guard';
import {
  PageNotFoundComponent
} from "./pages/page-not-found/page-not-found.component";
import { PanelComponent } from './pages/panels/panel-functions/panel/panel.component';
import { UserListComponent } from './pages/panels/panel-functions/admin-functions/user-list/user-list.component';
import { EspecialidadesListComponent } from './pages/panels/panel-functions/admin-functions/especialidades-list/especialidades-list.component';
import { SpecialistFormComponent } from './pages/panels/panel-functions/specialist-functions/specialist-form/specialist-form.component';
import { CrearEditarEspecialidadesComponent } from './pages/panels/panel-functions/admin-functions/crear-editar-especialidades/crear-editar-especialidades.component';
import { adminGuard } from './core/guards/admin.guard';
import { ListadoMedicionesComponent } from './pages/panels/panel-functions/patient-functions/listado-mediciones/listado-mediciones.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/sobre-nosotros',
    pathMatch: 'full'
  },

  {
    path: 'testeo',
    component: PanelComponent,
    canActivate: [loginGuard],
    children: [
      {
        path: 'listadoUsers',
        component: UserListComponent,
      },
      {
        path: 'listadoEspecialidades',
        component: EspecialidadesListComponent,
      },
    ]
  },

  {
    path: 'testeo-backend',
    component: TesteoBackendComponent
  },

  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'sobre-nosotros',
    component: ClinicaComponent
  },
  {
    path: 'contacto',
    component: ContactUsComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },
  {
    path: 'crearEditarUsuario',
    component: RegisterComponent
  },
  {
    path: 'crearEditarUsuario/:id',
    component: RegisterComponent
  },
  {
    path: 'crearEditarEspecialista',
    component: SpecialistFormComponent
  },
  {
    path: 'crearEditarEspecialista/:id',
    component: SpecialistFormComponent
  },
  {
    path: 'crearEditarEspecialidad/:id',
    component: CrearEditarEspecialidadesComponent,
  },
  {
    path: 'crearEditarEspecialidad',
    component: CrearEditarEspecialidadesComponent,
  },{
    path:'listadoGlucometria',
    component: ListadoMedicionesComponent,

  },
  {
    path:'listadoTension',
    component: ListadoMedicionesComponent,

  },
  {
    path: 'auth/forgotten-password',
    component: ForgottenPasswordComponent
  },
  {
    path: 'auth/reset-password/:token',
    component: RefreshPasswordComponent
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
