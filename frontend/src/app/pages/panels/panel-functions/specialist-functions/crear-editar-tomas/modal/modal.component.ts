import { CommonModule, Location, LowerCasePipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { QuillEditorComponent } from 'ngx-quill';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CustomValidators } from '../../../../../../core/classes/CustomValidators';
import { PatologiasDataModel } from '../../../../../../core/interfaces/patologias-data.model';
import { PatologiasService } from '../../../../../../core/services/patologias.service';
import { LoadingSpinnerComponent } from '../../../../../../shared/components/loading-spinner/loading-spinner.component';
import { PasswordInputComponent } from '../../../../../../shared/components/password-input/password-input.component';
import { MedicacionesService } from '../../../../../../core/services/medicaciones.service';
import { MedicacionToma } from '../../../../../../core/interfaces/medicacion-toma.model';
import { MedicamentoDataModel } from '../../../../../../core/interfaces/medicamento-data.model';
import { TomaInforme } from '../../../../../../core/interfaces/tomaInforme.model';

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

  suscripcionRuta: Subscription;
  medicamentos: Select2Data;

  id: number;
  nombre: string = '';
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

  constructor(private activatedRoute: ActivatedRoute,
    private patologiasService: PatologiasService,
    private medicacionesService: MedicacionesService,
    private router: Router,
    private location: Location) {
  }

  ngOnInit(): void {
    this.getMedicaciones();
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;

      if (this.id !== null) {
        this.isEditing = true;
      }

      if (this.isEditing) {
        // this.patologiasService.getPatologiaId(this.id).subscribe({
        //   next: (res: PatologiasDataModel) => {
        //     this.patologias = res;
        //     this.nombre = this.patologias.datos_patologia.nombre;
        //     this.descripcion = this.patologias.datos_patologia.descripcion;
        //     this.patchForm();
        //   },
        //   error: (error: HttpErrorResponse): void => {
        //     this.errores = error.message.split(',');

        //     Swal.fire({
        //       title: 'Error',
        //       text: 'Ha ocurrido un error al cargar la patología',
        //       icon: 'error'
        //     });
        //   }
        // });
      }
    });

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
      'dosis':new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'fechaInicio':new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'fechaFin':new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'observacion': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.maxLengthHtml(this.maxLength)
        ]
      ),
    });
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

  // patchForm(): void {
  //   let observationWithLineBreaks = this.observaciones.replace(/<br>/g, '\n');

  //   this.registerForm.patchValue({
  //     'nombre': this.nombre,
  //     'observacion': observationWithLineBreaks
  //   });

  //   this.registerForm.updateValueAndValidity();
  // }

  onRegisterToma(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newToma: TomaInforme = this.generateToma();

    console.log(newToma);

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
    this.location.back();
  }

  private generateToma(): TomaInforme {
    return {
        id:this.registerForm.get('medicamento').value,
        toma:{
          dosis: this.registerForm.get('dosis').value,
          fecha_fin: this.registerForm.get('fechaFin').value,
          fecha_inicio: this.registerForm.get('fechaInicio').value,
          hora: this.registerForm.get('hora').value,
          id: this.id??null,
          observaciones: this.registerForm.get('observacion').value,
        }
      }
    }
}
