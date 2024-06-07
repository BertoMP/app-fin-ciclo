import { CommonModule, Location, LowerCasePipe, NgClass, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
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
import {MedicamentoDataModel} from "../../../../../../core/interfaces/medicamento-data.model";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    NgIf,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent,
    QuillEditorComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];
  maxLength: number = 120;
  @Input() tomaMedicamento: TomaInforme;
  @Input() meds: MedicamentoDataModel[];

  suscripcionRuta: Subscription;
  medicamentos: Select2Data;
  medsArray: MedicacionToma[];

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
          CustomValidators.validTime
        ]
      ),
      'dosis': new FormControl(
        null,
        [
          Validators.required,
          Validators.min(1),
        ]
      ),
      'fechaInicio': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validDate
        ]
      ),
      'fechaFin': new FormControl(
        null,
        CustomValidators.validDate
      ),
      'observacion': new FormControl(
        null,
        [
          CustomValidators.maxLengthHtml(this.maxLength)
        ]
      ),
    }, { validators: CustomValidators.dateValidator });

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
    this.getMedicaciones();
  }

  transformarFecha(fecha: string) {
    if (fecha != null) {
      let [day, month, year] = fecha.split('-');

      return `${year}-${month}-${day}`;
    }
    return null;
  }

  enviarFecha(fecha: string) {
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
          this.medsArray = medicinas;
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
    let observationWithLineBreaks = this.observaciones;

    this.registerForm.patchValue({
      'medicamento': this.id_medicamento,
      'hora': this.hora,
      'dosis': this.dosis,
      'fechaInicio': this.fecha_inicio,
      'fechaFin': this.fecha_fin,
      'observacion': observationWithLineBreaks
    });

    this.registerForm.updateValueAndValidity();
  }

  onRegisterToma(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newToma: TomaInforme = this.generateToma();

    if (!this.isEditing) {
      let prescription = this.meds.find(p => p.medicamento.id === newToma.id);

      if (prescription) {
        const existingToma = prescription.medicamento.tomas.find(t => t.hora === newToma.toma.hora);

        if (existingToma) {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: 'Ya existe una toma de este medicamento a esa hora hora',
            icon: 'error',
            width: '50%'
          });
          return;
        }
      }
    }
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
    const medicamentoId = this.registerForm.get('medicamento').value;
    const medicamentoSeleccionado = this.medsArray.find(medicina => medicina.id === medicamentoId);
    let hora = this.registerForm.get('hora').value;
    const horaString = hora.toString();

    if (horaString.length === 5) {
      hora = horaString + ':00';
    }

    return {
      id: this.registerForm.get('medicamento').value,
      nombre:medicamentoSeleccionado.nombre,
      toma: {
        dosis: this.registerForm.get('dosis').value,
        fecha_fin: this.enviarFecha(this.registerForm.get('fechaFin').value),
        fecha_inicio: this.enviarFecha(this.registerForm.get('fechaInicio').value),
        hora: hora,
        id: this.id ?? null,
        observaciones: this.registerForm.get('observacion').value,
      }
    }
  }
}
