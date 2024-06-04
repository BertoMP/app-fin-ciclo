import { Routes } from '@angular/router';
import { LoginComponent } from "./pages/auth/login/login.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ClinicaComponent } from './pages/clinica/clinica.component';
import { MedicalSpecialtyListComponent } from "./pages/medical-specialty-list/medical-specialty-list.component";
import { ProfessionalsListComponent } from "./pages/professionals-list/professionals-list.component";
import { MedicalServicesComponent } from "./pages/medical-services/medical-services.component";
import { ForgottenPasswordComponent } from './pages/auth/forgotten-password/forgotten-password.component';
import { RefreshPasswordComponent } from './pages/auth/refresh-password/refresh-password.component';
import { EspecialistDataComponent } from './pages/especialist-data/especialist-data.component';
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { PanelComponent } from './pages/panels/panel-functions/panel/panel.component';
import { UserListComponent } from './pages/panels/panel-functions/admin-functions/user-list/user-list.component';
import { EspecialidadesListComponent } from './pages/panels/panel-functions/admin-functions/especialidades-list/especialidades-list.component';
import { SpecialistFormComponent } from './pages/panels/panel-functions/specialist-functions/specialist-form/specialist-form.component';
import { CrearEditarEspecialidadesComponent } from './pages/panels/panel-functions/admin-functions/crear-editar-especialidades/crear-editar-especialidades.component';
import { ListadoMedicionesComponent } from './pages/panels/panel-functions/patient-functions/listado-mediciones/listado-mediciones.component';
import { GlucometriaFormComponent } from './pages/panels/panel-functions/patient-functions/glucometria-form/glucometria-form.component';
import { TensionFormComponent } from './pages/panels/panel-functions/patient-functions/tension-form/tension-form.component';
import { loginGuard } from './core/guards/login.guard';
import { adminGuard } from './core/guards/admin.guard';
import { ListadoMedicacionComponent } from './pages/panels/panel-functions/patient-functions/listado-medicacion/listado-medicacion.component';
import { patientGuard } from './core/guards/patient.guard';
import { ListadoCitasComponent } from './pages/panels/panel-functions/patient-functions/listado-citas/listado-citas.component';
import { VerInformeComponent } from './pages/panels/panel-functions/patient-functions/ver-informe/ver-informe.component';
import { VerCitaComponent } from './pages/panels/panel-functions/patient-functions/ver-cita/ver-cita.component';
import { SolicitarCitaComponent } from './pages/panels/panel-functions/patient-functions/solicitar-cita/solicitar-cita.component';
import { ListadoInformesComponent } from "./pages/panels/panel-functions/patient-functions/listado-informes/listado-informes.component";
import { ListadoAgendaComponent } from './pages/panels/panel-functions/specialist-functions/listado-agenda/listado-agenda.component';
import { specialistGuard } from './core/guards/specialist.guard';
import { patientSpecialistGuard } from './core/guards/patientSpecialist.guard';
import { PatientListComponent } from "./pages/panels/panel-functions/specialist-functions/patient-list/patient-list.component";
import {UpdatePasswordComponent} from "./pages/auth/update-password/update-password.component";
import { ListadoMedicamentosComponent } from './pages/panels/panel-functions/specialist-functions/medicamentos/listado-medicamentos/listado-medicamentos.component';
import { ListadoPatologiasComponent } from './pages/panels/panel-functions/specialist-functions/patologias/listado-patologias/listado-patologias.component';
import { CrearEditarMedicamentosComponent } from './pages/panels/panel-functions/specialist-functions/medicamentos/crear-editar-medicamentos/crear-editar-medicamentos.component';
import { CrearEditarPatologiasComponent } from './pages/panels/panel-functions/specialist-functions/patologias/crear-editar-patologias/crear-editar-patologias.component';
import {LogListComponent} from "./pages/panels/panel-functions/admin-functions/log-list/log-list.component";
import {
  ConsultaListComponent
} from "./pages/panels/panel-functions/admin-functions/consulta-list/consulta-list.component";
import {
  CrearEditarConsultaComponent
} from "./pages/panels/panel-functions/admin-functions/crear-editar-consulta/crear-editar-consulta.component";
import { CrearInformesComponent } from './pages/panels/panel-functions/specialist-functions/crear-informes/crear-informes.component';
import { ModalComponent } from './pages/panels/panel-functions/specialist-functions/crear-editar-tomas/modal/modal.component';
import { CrearEditarTomasComponent } from './pages/panels/panel-functions/specialist-functions/crear-editar-tomas/crear-editar-tomas.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/sobre-nosotros',
    pathMatch: 'full'
  },

  {
    path: 'mediapp',
    component: PanelComponent,
    canActivate: [loginGuard],
    children: [
      {
        path: 'actualizar-password',
        component: UpdatePasswordComponent,
        canActivate: [loginGuard]
      },
      {
        path: 'usuarios',
        component: UserListComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'crear-paciente',
        component: RegisterComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'crear-especialista',
        component: SpecialistFormComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'editar-paciente/:id',
        component: RegisterComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'editar-especialista/:id',
        component: SpecialistFormComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'especialidades',
        component: EspecialidadesListComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'crear-especialidad',
        component: CrearEditarEspecialidadesComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'editar-especialidad/:id',
        component: CrearEditarEspecialidadesComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'consultas',
        component: ConsultaListComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'crear-consulta',
        component: CrearEditarConsultaComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'editar-consulta/:id',
        component: CrearEditarConsultaComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'logs-error-db',
        component: LogListComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'listado-medicacion',
        component: ListadoMedicacionComponent,
        canActivate: [patientGuard]
      },
      {
        path: 'listado-medicacion/:id',
        component: ListadoMedicacionComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'listado-glucometria',
        component: ListadoMedicionesComponent,
        canActivate: [patientGuard]
      },
      {
        path: 'listado-glucometrias/:id',
        component: ListadoMedicionesComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'listado-tension',
        component: ListadoMedicionesComponent,
        canActivate: [patientGuard]
      },
      {
        path: 'listado-tensiometrias/:id',
        component: ListadoMedicionesComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'tomar-glucometria',
        component: GlucometriaFormComponent,
        canActivate: [patientGuard]
      },
      {
        path: 'tomar-tension',
        component: TensionFormComponent,
        canActivate: [patientGuard]
      },
      {
        path: 'listado-citas',
        component: ListadoCitasComponent,
        canActivate: [patientGuard]
      },
      {
        path: 'listado-informes',
        component: ListadoInformesComponent,
        canActivate: [patientGuard]
      },
      {
        path: 'listado-informes/:id',
        component: ListadoInformesComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'ver-informe/:id',
        component: VerInformeComponent,
        canActivate: [patientSpecialistGuard]
      },
      {
        path: 'ver-cita/:id',
        component: VerCitaComponent,
        canActivate: [patientSpecialistGuard]
      },
      {
        path: 'solicitar-cita',
        component: SolicitarCitaComponent,
        canActivate: [patientGuard]
      },
      {
        path: 'editar-perfil',
        component: RegisterComponent,
        canActivate: [patientGuard]
      },
      {
        path: 'listado-agenda',
        component: ListadoAgendaComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'listado-pacientes',
        component: PatientListComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'listado-pacientes/:id',
        component: PatientListComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'listado-medicamentos',
        component: ListadoMedicamentosComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'listado-patologias',
        component: ListadoPatologiasComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'crear-medicamento',
        component: CrearEditarMedicamentosComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'editar-medicamento/:id',
        component: CrearEditarMedicamentosComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'crear-patologia',
        component: CrearEditarPatologiasComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'editar-patologia/:id',
        component: CrearEditarPatologiasComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'crear-informe/:cita_id',
        component: CrearInformesComponent,
        canActivate: [specialistGuard]
      },
      {
        path: 'modificar-tomas/:id',
        component: CrearEditarTomasComponent,
        canActivate: [specialistGuard]
      },
    ]
  },
  // Rutas comunes a todos los usuarios, tanto logados como no
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
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
