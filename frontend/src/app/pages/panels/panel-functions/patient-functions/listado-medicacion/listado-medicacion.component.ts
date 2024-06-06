import {NgClass, NgFor, NgIf} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {debounceTime, Observable, Subject, Subscription} from 'rxjs';
import { MedicacionesService } from '../../../../../core/services/medicaciones.service';
import { MedicacionListModel } from '../../../../../core/interfaces/medicacion-list.model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { saveAs } from 'file-saver';
import { MedicamentoDataModel } from "../../../../../core/interfaces/medicamento-data.model";
import { DatosPacienteModel } from "../../../../../core/interfaces/datos-paciente.model";
import {DomSanitizer, SafeHtml, Title} from "@angular/platform-browser";
import {UserRole} from "../../../../../core/enum/user-role.enum";
import {AuthService} from "../../../../../core/services/auth.service";
import Swal from "sweetalert2";

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
  isPatient: boolean = false;

  initialLoad: boolean = false;
  dataLoaded: boolean = false;

  private getMedsSubject: Subject<void> = new Subject<void>();

  suscripcionRuta: Subscription;

  isUserLoggedIn: boolean = false;
  userId: number;

  errores: string[];

  constructor(private medicacionesService: MedicacionesService,
              private sanitizer: DomSanitizer,
              private authService: AuthService,
              private activeRoute: ActivatedRoute,
              private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Listado de medicación');
    this.meds = [];
    this.isPatient = UserRole.PACIENT === this.authService.getUserRole();

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

  sanitizeHtml(inputHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(inputHtml);
  }

  getMedicaciones() {
    let request: Observable<MedicacionListModel>;

    if (UserRole.PACIENT === this.authService.getUserRole()) {
      request = this.medicacionesService.getMedicaciones();
    } else {
      this.userId = this.activeRoute.snapshot.params.id;

      request = this.medicacionesService.getMedicacionesByPacienteId(this.userId);

    }

    request.subscribe({
      next: (response: MedicacionListModel) => {
        this.userData = response.datos_paciente;
        this.meds = response.prescripciones;
        this.dataLoaded = true;
      },
      error: (error: string[]) => {
        this.errores = error;
        this.dataLoaded = true;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al cargar las medicaciones',
          confirmButtonText: 'Aceptar'
        });
      },
    });
  }

  confirmarCancelar(mensaje:string,accion:string,id:number) {
    Swal.fire({
      titleText: mensaje,
      icon: 'question',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      width: '50%'
    }).then((result) => {
      if (result.isConfirmed) {
        if(accion!='' && accion!=null){
          this.eliminarRegistro(id,accion);
        }
      }
    })
  }

  eliminarRegistro(idToma: number,accion:string) {
    let request: Observable<void>;
    let mensaje:string='toma';

    if(accion=='eliminarToma'){
      request=this.medicacionesService.eliminarToma(idToma);

    }else if(accion=='eliminarMedicamento'){
      request=this.medicacionesService.eliminarMedicamento(this.userId,idToma);
      mensaje='medicación';
    }

    this.actualizacionRegistros(request,mensaje);

  }

  actualizacionRegistros(request:Observable<void>,mensaje:string){
    request.subscribe({
      next: (response) => {
        this.dataLoaded = true;
        Swal.fire({
          title: 'Enhorabuena',
          text: `Has conseguido eliminar ${mensaje} correctamente`,
          icon: 'success',
          width: '50%'
        }).then(() => {
          this.getMedicaciones();
        })
      },
      error: (error: string[]) => {
        this.errores = error;
      },
    });
  }
  downloadPrescripcion(): void {
    this.dataLoaded = false;
    let request: Observable<Blob>;

    if (UserRole.PACIENT === this.authService.getUserRole()) {
      request = this.medicacionesService.getDownloadMedicacion();
    } else {
      const id = this.activeRoute.snapshot.params.id;

      request = this.medicacionesService.getDownloadMedicacionByPacienteId(id);
    }

    request.subscribe({
      next: (response: Blob) => {
        this.dataLoaded = true;
        saveAs(
          response,
          `prescripcion_${this.userData.nombre}_${this.userData.primer_apellido}_${this.userData.segundo_apellido}.pdf`);
      },
      error: (error: string[]) => {
        this.errores = error;
        this.dataLoaded = true;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al descargar la prescripción',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

}
