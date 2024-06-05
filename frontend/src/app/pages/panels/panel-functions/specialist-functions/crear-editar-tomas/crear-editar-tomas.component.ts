import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { MedicacionListModel } from '../../../../../core/interfaces/medicacion-list.model';
import { MedicamentoDataModel } from '../../../../../core/interfaces/medicamento-data.model';
import { MedicacionesService } from '../../../../../core/services/medicaciones.service';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { MedicamentoTomasModel } from '../../../../../core/interfaces/medicamento-tomas.model';
import { TomaInforme } from '../../../../../core/interfaces/tomaInforme.model';

@Component({
  selector: 'app-crear-editar-tomas',
  standalone: true,
  imports: [ModalComponent, NgFor,
    NgIf,
    LoadingSpinnerComponent,
    FormsModule,
    RouterLink,
    NgClass],
  templateUrl: './crear-editar-tomas.component.html',
  styleUrl: './crear-editar-tomas.component.scss'
})
export class CrearEditarTomasComponent {
  meds: MedicamentoDataModel[];
  initialLoad: boolean = false;
  dataLoaded: boolean = false;
  private getMedsSubject: Subject<void> = new Subject<void>();
  suscripcionRuta: Subscription;
  userId: number;
  errores: string[];

  constructor(private modalService: NgbModal,
              private medicacionesService: MedicacionesService,
              private sanitizer: DomSanitizer,
              private activeRoute: ActivatedRoute,
              private router:Router) { }

  open(toma?: MedicamentoTomasModel, medicamento_id?: number) {
    const modalRef = this.modalService.open(ModalComponent);
    let hora=(toma!=null)?toma.hora:null;

    if (toma != null && medicamento_id != null) {
      modalRef.componentInstance.tomaMedicamento = this.generateToma(toma, medicamento_id); // Pasar datos al modal
    }else{
      modalRef.componentInstance.tomaMedicamento = null;
    }

    modalRef.result.then((result) => {
      // Recibimos los datos del modal y los asignamos a la variable datos
      if(medicamento_id!=null && medicamento_id!=result.id){
       this.eliminateToma(toma,medicamento_id);
      }
      let prescripcion = this.meds.find(p => p.medicamento.id === result.id);
      if(prescripcion){
        let tomaIndex = prescripcion.medicamento.tomas.findIndex(t => t.hora === hora);

        // Modificamos la toma manteniendo su posición
        if (tomaIndex !== -1) {
          prescripcion.medicamento.tomas[tomaIndex] = result.toma; // Nueva dosis
        }else{
          prescripcion.medicamento.tomas.push(result.toma);
        }
      }else{
        this.meds.push({
          medicamento:{
            id:result.id,
            nombre:result.nombre,
            tomas:[result.toma]
          }
        })
      }
      // Identificamos la toma que queremos modificar, por ejemplo, la primera toma


      console.log(this.meds);

    }, (reason) => {
      // Manejo de cierre del modal si es necesario
    });
  }


  private generateToma(toma: MedicamentoTomasModel, medicamento_id: number): TomaInforme {
    return {
      id: medicamento_id,
      toma: {
        dosis: toma.dosis,
        fecha_fin: toma.fecha_fin,
        fecha_inicio: toma.fecha_inicio,
        hora: toma.hora,
        id: toma.id,
        observaciones: toma.observaciones,
      }
    }
  }

  eliminateToma(toma?: MedicamentoTomasModel, medicamento_id?: number){
    let prescripcionOriginal = this.meds.find(p => p.medicamento.id === medicamento_id);
    let hora=toma.hora;
    if (prescripcionOriginal) {
      prescripcionOriginal.medicamento.tomas = prescripcionOriginal.medicamento.tomas.filter(t => t.hora !== hora);
    }
  }

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

  sanitizeHtml(inputHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(inputHtml);
  }

  getMedicaciones() {
    let request: Observable<MedicacionListModel>;
    this.userId = this.activeRoute.snapshot.params.id;
    if (this.userId) {
      request = this.medicacionesService.getMedicacionesByPacienteId(this.userId);

      request.subscribe({
        next: (response: MedicacionListModel) => {
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
    } else {
      this.dataLoaded = true;
    }
  }
  onRegisterTomas(){
    console.log(this.meds);
    this.medicacionesService.subirMedicamentosPaciente(this.meds)
          .subscribe({
            next: (response) => {
              this.onSubmitted("editar")
            },
            error: (error: string[]): void => {
              this.onSubmitError(error);
            }
          });
  }

  onSubmitted(message: string): void {
    Swal.fire({
      title: 'Enhorabuena',
      text:  `Has conseguido ${message} las tomas correctamente`,
      icon: 'success',
      width: '50%'
    }).then(() => {
        this.router.navigate(['/mediapp/listado-pacientes']).then(r => { });
      Swal.close();
    }).catch(() => {});
  }

  onSubmitError(error: string[]): void {
    this.errores = error;
    Swal.fire({
      title: 'Error',
      text: 'Ha ocurrido un error durante el proceso.',
      icon: 'error',
      width: '50%'
    });
  }
}

