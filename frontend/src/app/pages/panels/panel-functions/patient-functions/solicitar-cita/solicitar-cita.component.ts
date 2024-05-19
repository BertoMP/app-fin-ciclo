import { Component, OnInit } from '@angular/core';
import { EspecialidadService } from '../../../../../core/services/especialidad.service';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { EspecialidadModel } from '../../../../../core/interfaces/especialidad.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MedicalSpecialistListService } from '../../../../../core/services/medical-specialist-list.service';
import { EspecialistaCitaModel } from '../../../../../core/interfaces/especialista-cita.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-solicitar-cita',
  standalone: true,
  imports: [Select2Module,NgIf],
  templateUrl: './solicitar-cita.component.html',
  styleUrl: './solicitar-cita.component.scss'
})
export class SolicitarCitaComponent implements OnInit {
  especialidades: Select2Data;
  especialistas: Select2Data;

  especialidad_id: number;
  especialista_id: number;
  fecha:string;

  constructor(private especialidadService: EspecialidadService, private medicalEspecialistService:MedicalSpecialistListService) {}

  buscarEspecialidades() {
    this.especialidadService.getEspecialidad()
      .subscribe({
        next: (especialidad: EspecialidadModel[]) => {
          this.especialidades = especialidad.map((especialidad: EspecialidadModel) => {
            return {
              value: especialidad.id,
              label: especialidad.nombre
            }
          });

          console.log(this.especialidades);

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching especialidades', error.error);
        }
      })
  }

  buscarEspecialistas() {
    if(this.especialidad_id!=undefined){
      this.medicalEspecialistService.getSpecialist(this.especialidad_id)
      .subscribe({
        next: (especialistas: EspecialistaCitaModel[]) => {
          console.log(especialistas);
  
          this.especialistas = especialistas.map((especialista: EspecialistaCitaModel) => {
            return {
              value: especialista.id,
              label: especialista.usuario_nombre
            }
          });

          console.log(this.especialistas);
        },
        error: (error: HttpErrorResponse) => {
          this.especialistas=null;
          console.error('Error fetching especialistas', error.error);
        }
      })
    }
    
  }
  buscarCitas(){
    
  }
  ngOnInit(): void {
    this.buscarEspecialidades();
  }
}
