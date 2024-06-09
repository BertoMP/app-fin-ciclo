import {Component, OnInit} from '@angular/core';
import {Select2Data, Select2Module} from "ng-select2-component";
import {Subscription} from "rxjs";
import {PacienteService} from "../../../../../core/services/paciente.service";
import {PacienteListModel} from "../../../../../core/interfaces/paciente-list.model";
import {MenuOptionComponent} from "../../../../../shared/components/menu-option/menu-option.component";
import {NgForOf, NgIf} from "@angular/common";
import {MenuOptionModel} from "../../../../../core/interfaces/menu-option.model";
import Swal from "sweetalert2";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    Select2Module,
    MenuOptionComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent implements OnInit {
  pacientes: Select2Data;
  id: number = 0;
  isSearch: boolean = false;
  num_historia_clinica: string;

  subscripcionPacientes: Subscription;
  options: MenuOptionModel[] = [];

  constructor(private pacienteService: PacienteService,
              private activatedRoute: ActivatedRoute,
              private title: Title) {
  }

  ngOnInit() {
    this.title.setTitle('MediAPP - Buscador de pacientes');

    const idSearch = this.activatedRoute.snapshot.params.id;

    if (idSearch) {
      this.isSearch = true;
      this.id = parseInt(idSearch);
      this.options = this.loadOptions();
    }

    this.subscripcionPacientes = this.pacienteService.getPacienteList()
      .subscribe({
        next: (pacientes: PacienteListModel[]) => {
          if (!this.isSearch) {
            this.pacientes = pacientes.map((paciente: PacienteListModel) => {
              return {
                value: paciente.paciente_id,
                label: `${paciente.primer_apellido} ${paciente.segundo_apellido}, ${paciente.nombre}`,
                num_historia_clinica: paciente.num_historia_clinica
              };
            });
          } else {
            this.num_historia_clinica = pacientes.filter((paciente: PacienteListModel) => paciente.paciente_id === this.id)[0].num_historia_clinica;
          }
        },
        error: (error) => {
          scrollTo(0, 0);
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al cargar los pacientes',
            icon: 'error'
          });
        }
      }
    );


  }

  onPatientSelected(event: any) {
    this.id = event.value;
    this.num_historia_clinica = event.options[0].num_historia_clinica;
    this.options = this.loadOptions();
  }

  loadOptions(): MenuOptionModel[] {
    return [
      {
        title: 'GLUCOMETRÍAS',
        icon: 'glucometria',
        description: 'Registra los valores de glucosa en sangre de tus pacientes',
        route: `/mediapp/listado-glucometrias/${this.id}`,
        routeName: 'Ver Glucometrías',
        class: 'glucometria'
      },
      {
        title: 'TENSIOMETRÍAS',
        icon: 'tensiometria',
        description: 'Registra los valores de tensión arterial de tus pacientes',
        route: `/mediapp/listado-tensiometrias/${this.id}`,
        routeName: 'Ver Tensiometrías',
        class: 'tensiometria'
      },
      {
        title: 'MEDICACIÓN',
        icon: 'medicacion',
        description: 'Registra la medicación de tus pacientes',
        route: `/mediapp/listado-medicacion/${this.id}`,
        routeName: 'Ver Medicación',
        class: 'medicacion'
      },
      {
        title: 'INFORMES',
        icon: 'informes',
        description: 'Registra los informes de tus pacientes',
        route: `/mediapp/listado-informes/${this.id}`,
        routeName: 'Ver Informes',
        class: 'informes'
      }
    ]
  }
}
