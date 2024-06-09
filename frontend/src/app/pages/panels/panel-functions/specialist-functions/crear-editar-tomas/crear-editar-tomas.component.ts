import {Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import {DomSanitizer, SafeHtml, Title} from '@angular/platform-browser';
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
export class CrearEditarTomasComponent implements OnInit {
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
              private router:Router,
              private title: Title) { }

  open(toma?: MedicamentoTomasModel, medicamento_id?: number) {
    const modalRef = this.modalService.open(ModalComponent,{size:"lg",centered:true});
    let hora=(toma!=null)?toma.hora:null;

    if (toma != null && medicamento_id != null) {
      modalRef.componentInstance.tomaMedicamento = this.generateToma(toma, medicamento_id); // Pasar datos al modal
    }else{
      modalRef.componentInstance.tomaMedicamento = null;
    }

    modalRef.componentInstance.meds = this.meds;

    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
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
          const index = prescripcion.medicamento.tomas.findIndex(t => t.hora > result.toma.hora);

          if (index === -1) {
            prescripcion.medicamento.tomas.push(result.toma);
          } else {
            prescripcion.medicamento.tomas.splice(index, 0, result.toma);
          }
        }
      }else{
        const newMed = {
          medicamento:{
            id:result.id,
            nombre:result.nombre,
            tomas:[result.toma]
          }
        };

        const index = this.meds.findIndex(med => med.medicamento.nombre > newMed.medicamento.nombre);

        if (index === -1) {
          this.meds.push(newMed);
        } else {
          this.meds.splice(index, 0, newMed);
        }
      }
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
        observaciones: toma.observaciones,
      }
    }
  }

  modalDelete(toma: MedicamentoTomasModel, medicamento_id: number) {
    scrollTo(0, 0);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estas a punto de eliminar una toma de medicamento',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminateToma(toma, medicamento_id);
      }
    });
  }

  eliminateToma(toma?: MedicamentoTomasModel, medicamento_id?: number){
    let prescripcionOriginal = this.meds.find(p => p.medicamento.id === medicamento_id);
    let hora=toma.hora;
    if (prescripcionOriginal) {
      prescripcionOriginal.medicamento.tomas = prescripcionOriginal.medicamento.tomas.filter(t => t.hora !== hora);
    }
  }

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Crear/Editar tomas');
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
    this.dataLoaded = false;
    const medsObj = this.generateMeds();
    this.medicacionesService.subirMedicamentosPaciente(medsObj)
          .subscribe({
            next: (response) => {
              this.onSubmitted("editar")
            },
            error: (error: string[]): void => {
              this.onSubmitError(error);
            }
          });
  }

  private generateMeds(){
    return {
      paciente_id: this.userId,
      prescripcion: this.meds,
    }
  }

  onSubmitted(message: string): void {
    this.dataLoaded = true;
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
    this.dataLoaded = true;
    this.errores = error;
    Swal.fire({
      title: 'Error',
      text: 'Ha ocurrido un error durante el proceso.',
      icon: 'error',
      width: '50%'
    });
  }
}

