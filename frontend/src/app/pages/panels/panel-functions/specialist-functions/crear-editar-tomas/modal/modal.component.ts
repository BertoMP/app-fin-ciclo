import { CommonModule, Location, LowerCasePipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { QuillEditorComponent } from 'ngx-quill';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CustomValidators } from '../../../../../../core/classes/CustomValidators';
import { LoadingSpinnerComponent } from '../../../../../../shared/components/loading-spinner/loading-spinner.component';
import { PasswordInputComponent } from '../../../../../../shared/components/password-input/password-input.component';
import { MedicacionesService } from '../../../../../../core/services/medicaciones.service';
import { MedicacionToma } from '../../../../../../core/interfaces/medicacion-toma.model';
import { TomaInforme } from '../../../../../../core/interfaces/tomaInforme.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent,
    QuillEditorComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];
  maxLength: number = 1000;
  @Input() tomaMedicamento: TomaInforme;


  suscripcionRuta: Subscription;
  medicamentos: Select2Data;

  id: number;
  id_medicamento: number;
  hora: string;
  dosis: number;
  fecha_inicio: string;
  fecha_fin: string;
  observaciones: string = '';

  isEditing: boolean = false;

  public quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],

      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      ['link']
    ]
  };

  constructor(
    public activeModal: NgbActiveModal,
    private medicacionesService: MedicacionesService,) {
  }

  ngOnInit(): void {
    console.log('Datos recibidos en el modal:', this.tomaMedicamento);

    this.registerForm = new FormGroup<any>({
      'medicamento': new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'hora': new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'dosis': new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'fechaInicio': new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'fechaFin': new FormControl(
        null
      ),
      'observacion': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.maxLengthHtml(this.maxLength)
        ]
      ),
    });

    if (this.tomaMedicamento != null) {
      this.id_medicamento = this.tomaMedicamento.id;
      this.hora = this.tomaMedicamento.toma.hora;
      this.dosis = this.tomaMedicamento.toma.dosis;
      this.fecha_inicio = this.transformarFecha(this.tomaMedicamento.toma.fecha_inicio);
      this.fecha_fin = this.transformarFecha(this.tomaMedicamento.toma.fecha_fin);
      this.observaciones = this.tomaMedicamento.toma.observaciones;
      this.isEditing=true;
      this.patchForm();
    }

    console.log(this.fecha_inicio);

    this.getMedicaciones();
  }

  transformarFecha(fecha: string) {
    console.log(fecha);
    if (fecha != null) {
      let [day, month, year] = fecha.split('-');

      return `${year}-${month}-${day}`;
    }
    return null;
  }

  enviarFecha(fecha: string) {
    console.log(fecha);
    if (fecha != null) {
      let [year, month, day] = fecha.split('-');

      return `${day}-${month}-${year}`;
    }
    return null;
  }
  getMedicaciones() {
    this.medicacionesService.getMedicamentosPreescripcion()
      .subscribe({
        next: (medicinas: MedicacionToma[]) => {
          this.medicamentos = medicinas.map((medicina: MedicacionToma) => {
            return {
              value: medicina.id,
              label: medicina.nombre
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al cargar las patologías disponibles',
            icon: 'error'
          });
        }
      });
  }


  get observationLength(): number {
    const observation = this.registerForm.get('observacion');
    return observation && observation.value ? this.countCharacters(observation.value) : 0;
  }

  stripHtml(html: string) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  countCharacters(input: string) {
    const strippedInput = this.stripHtml(input);
    return strippedInput.length;
  }

  patchForm(): void {
    let observationWithLineBreaks = this.observaciones.replace(/<br>/g, '\n');

    this.registerForm.patchValue({
      'medicamento': this.id_medicamento,
      'hora': this.hora,
      'dosis': this.dosis,
      'fechaInicio': this.fecha_inicio,
      'fechaFin': this.fecha_fin,
      'observacion': observationWithLineBreaks
    });

    this.registerForm.updateValueAndValidity();

    console.log("Actualizados");
  }

  onRegisterToma(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newToma: TomaInforme = this.generateToma();

    console.log(newToma);
    this.activeModal.close(newToma);

    if (this.id != null) {
      this.onSubmitted('actualizar');
    } else {
      this.onSubmitted('registrar');

    }
  }

  onSubmitted(message: string): void {
    this.isLoading = false;
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido ${message} una toma correctamente`,
      icon: 'success',
      width: '50%'
    })
      .then(() => {
        Swal.close();
      })
      .catch(() => { });
  }

  onCancel(): void {
    this.activeModal.close();
  }

  private generateToma(): TomaInforme {
    return {
      id: this.registerForm.get('medicamento').value,
      nombre: null,
      toma: {
        dosis: this.registerForm.get('dosis').value,
        fecha_fin: this.enviarFecha(this.registerForm.get('fechaFin').value),
        fecha_inicio: this.enviarFecha(this.registerForm.get('fechaInicio').value),
        hora: this.registerForm.get('hora').value,
        id: this.id ?? null,
        observaciones: this.registerForm.get('observacion').value,
      }
    }
  }
}