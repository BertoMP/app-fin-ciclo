import {NgClass, NgFor, NgIf} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {debounceTime, Observable, Subject, Subscription} from 'rxjs';
import { MedicacionesService } from '../../../../../core/services/medicaciones.service';
import { MedicacionListModel } from '../../../../../core/interfaces/medicacion-list.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { saveAs } from 'file-saver';
import { MedicamentoDataModel } from "../../../../../core/interfaces/medicamento-data.model";
import { DatosPacienteModel } from "../../../../../core/interfaces/datos-paciente.model";

@Component({
  selector: 'app-listado-medicacion',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    LoadingSpinnerComponent,
    FormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './listado-medicacion.component.html',
  styleUrl: './listado-medicacion.component.scss'
})
export class ListadoMedicacionComponent implements OnInit {
  meds: MedicamentoDataModel[];
  userData: DatosPacienteModel;


  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  private getMedsSubject: Subject<void> = new Subject<void>();

  isUserLoggedIn: boolean = false;
  userId: number;

  errores: string[];

  constructor(private medicacionesService: MedicacionesService) { }

  ngOnInit(): void {
    this.meds = [];

    this.getMedsSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe({
        next: () => {
          this.getMedicaciones();
        },
        error: (error: string[]) => {
          this.errores = error;
        }
      });
    this.initialLoad = true;
    this.getMedsSubject.next();
  }

  getMedicaciones() {
    let request: Observable<MedicacionListModel> = this.medicacionesService.getMedicaciones();

    request.subscribe({
      next: (response: MedicacionListModel) => {
        this.userData = response.datos_paciente;
        this.meds = response.prescripciones;

        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }

  downloadPrescripcion() {

    this.medicacionesService.getDownloadMedicacion().subscribe((response: any) => {
      const blob = new Blob([response]);
     saveAs(blob,`prescripcion_${this.userData.nombre}_${this.userData.primer_apellido}_${this.userData.segundo_apellido}.pdf`);
    });
  }

}
