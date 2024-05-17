import { Component } from '@angular/core';
import { CitasListModel } from '../../../../../core/interfaces/citas-list.model';
import { Observable, Subject, debounceTime } from 'rxjs';
import { CitasService } from '../../../../../core/services/citas.service';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { NgFor, NgIf } from '@angular/common';
import { DatosPacienteModel } from '../../../../../core/interfaces/datos-paciente.model';
import { CitasListedModel } from '../../../../../core/interfaces/citas-listed.model';
import { CitasDataModel } from '../../../../../core/interfaces/citas-data.model';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listado-citas',
  standalone: true,
  imports: [LoadingSpinnerComponent, NgFor, NgIf,RouterLink],
  templateUrl: './listado-citas.component.html',
  styleUrl: './listado-citas.component.scss'
})
export class ListadoCitasComponent {
  citas: CitasDataModel[];
  paciente: DatosPacienteModel;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  isUserLoggedIn: boolean = false;
  userId: number;
  private getMedsSubject: Subject<void> = new Subject<void>();

  constructor(private citasService: CitasService) { }


  errores: string[];

  ngOnInit(): void {

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
    let request: Observable<CitasListModel> = this.citasService.getCitas();

    request.subscribe({
      next: (response: CitasListModel) => {
        this.citas = response.citas[0].citas;
        this.paciente = response.citas[0].datos_paciente;

        console.log(response);


        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }

  cancelarCita(idCita:number) {
    let request: Observable<CitasListModel> = this.citasService.cancelarCita(idCita);

    request.subscribe({
      next: (response: CitasListModel) => {
        this.dataLoaded = true;
        Swal.fire({
          title: 'Enhorabuena',
          text: 'Has conseguido eliminar la especialidad correctamente',
          icon: 'success',
          width: '50%'
        }).then(()=>{
          this.getMedicaciones();
        })
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }

  confirmarCancelar(idCita:number){
    Swal.fire({
      text: '¿Estás seguro que quieres cancelar esta cita?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarCita(idCita);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Usuario canceló la eliminación");
      }
    })
  }

  comprobarFecha(hora: string, fecha: string) {
    let fechaActual = new Date();
    let fechaConsulta=this.convertirFecha(fecha,hora);
    
    if (fechaActual > fechaConsulta)
      return false;
    else
      return true;

  }

  convertirFecha(fecha: string, hora: string) {
    var dateParts = fecha.split("-");
    var day = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10) - 1;
    var year = parseInt(dateParts[2], 10);

    var timeParts = hora.split(":");
    var hour = parseInt(timeParts[0], 10);
    var minute = parseInt(timeParts[1], 10);
    var second = parseInt(timeParts[2], 10);

    return new Date(year, month, day, hour, minute, second);
  }

}
