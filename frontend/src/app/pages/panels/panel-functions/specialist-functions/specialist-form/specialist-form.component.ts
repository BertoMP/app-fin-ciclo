import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {CommonModule, Location, LowerCasePipe, NgClass} from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

import { HttpErrorResponse } from "@angular/common/http";
import { Select2Module, Select2Data } from 'ng-select2-component';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { PasswordInputComponent } from '../../../../../shared/components/password-input/password-input.component';
import { EspecialistModel } from '../../../../../core/interfaces/especialist.model';
import { TurnoService } from '../../../../../core/services/turno.service';
import { EspecialidadService } from '../../../../../core/services/especialidad.service';
import { ConsultaService } from '../../../../../core/services/consulta.service';
import { FileUploadService } from '../../../../../core/services/file-uploader.service';
import { ProfessionalDataService } from '../../../../../core/services/professional-data.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { CustomValidators } from '../../../../../core/classes/CustomValidators';
import { EspecialidadModel } from '../../../../../core/interfaces/especialidad.model';
import {QuillEditorComponent} from "ngx-quill";
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-specialist-form',
  standalone: true,
  imports: [ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent,
    QuillEditorComponent,
  ],
  templateUrl: './specialist-form.component.html',
  styleUrl: './specialist-form.component.scss'
})
export class SpecialistFormComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];
  imageBase64: string;
  imageToShow: string;
  isEditing: boolean = false;
  maxLength: number = 300;

  especialidad: Select2Data;
  turno: Select2Data;
  consulta: Select2Data;
  suscripcionRuta: Subscription;
  especialista: EspecialistModel;

  id: number;


  public quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],

      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      ['link']
    ]
  };

  constructor(private turnoService: TurnoService,
              private especialidadService: EspecialidadService,
              private consultaService: ConsultaService,
              private fileUploadService: FileUploadService,
              private activatedRoute: ActivatedRoute,
              private professionalDataService: ProfessionalDataService,
              private authService: AuthService,
              private router: Router,
              private location: Location,
              private title: Title) {
  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;

      if (this.id !== null) {
        this.isEditing = true;
      }

      if (this.isEditing) {
        this.title.setTitle('MediAPP - Editar especialista');
        this.professionalDataService.specificEspecialista(this.id).subscribe({
          next: (res: EspecialistModel) => {
            this.especialista = res;

            this.patchForm();
          },
          error: (error: HttpErrorResponse): void => {
            this.errores = error.message.split(',');

            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al cargar los datos del especialista',
              icon: 'error'
            });
          }
        });
      } else {
        this.title.setTitle('MediAPP - Crear especialista');
      }
    });

    this.registerForm = new FormGroup<any>({
      'nombre': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validName
        ]
      ),
      'primer_apellido': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validSurname
        ]
      ),
      'segundo_apellido': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validSurname
        ]
      ),
      'dni': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validDni
        ]
      ),
      'email': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validEmail
        ]
      ),
      'consulta': new FormControl(
        null,
        [
          Validators.required
        ]
      ),
      'especialidad': new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'numero_colegiado': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validCollegiateNumber
        ]
      ),
      'turno': new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'imagen': new FormControl(),
      'descripcion': new FormControl(
        null,
        [
          Validators.required
        ]
      )
    });

    this.especialidadService.getEspecialidad()
      .subscribe({
        next: (especialidad: EspecialidadModel[]) => {
          this.especialidad = especialidad.map((especialidad: EspecialidadModel) => {
            return {
              value: especialidad.id,
              label: especialidad.nombre
            }
          });

        },
        error: (error: HttpErrorResponse) => {
        }
      });

    this.consultaService.getConsultas()
      .subscribe({
        next: (consulta: EspecialidadModel[]) => {
          this.consulta = consulta.map((consulta: EspecialidadModel) => {
            return {
              value: consulta.id,
              label: consulta.nombre
            }
          });

        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al cargar las consultas',
            icon: 'error'
          });
        }
      });

    this.turno = this.turnoService.getTurno();
  }

  get descriptionLength(): number {
    const description = this.registerForm.get('descripcion');
    return description && description.value ? this.countCharacters(description.value) : 0;
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
    let descripcionWithLineBreaks: string = this.especialista.datos_especialista.descripcion.replace(/<br>/g, '\n');

    this.imageBase64 = this.especialista.datos_especialista.imagen;
    this.imageToShow = this.imageBase64 ? this.imageBase64 : null;

    this.registerForm.patchValue({
      'nombre': this.especialista.datos_personales.nombre,
      'primer_apellido': this.especialista.datos_personales.primer_apellido,
      'segundo_apellido': this.especialista.datos_personales.segundo_apellido,
      'dni': this.especialista.datos_personales.dni,
      'email': this.especialista.datos_personales.email,
      'consulta': this.especialista.datos_especialista.consulta.consulta_id,
      'especialidad': this.especialista.datos_especialista.especialidad.especialidad_id,
      'numero_colegiado': this.especialista.datos_especialista.num_colegiado,
      'turno': this.especialista.datos_especialista.turno,
      'descripcion': descripcionWithLineBreaks
    });

    this.registerForm.updateValueAndValidity();
  }

  onRegisterSpecialist(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newEspecialist: EspecialistModel = this.generateEspecialist();
    this.registerForm.get('imagen').setValue('');

    if (this.id != null) {
      this.authService.updateSpecialist(newEspecialist)
        .subscribe({
          next: (response) => {
            this.onSubmitted('actualizar');
          },
          error: (error: string[]): void => {
            this.onSubmitError(error);
          }
        });
    } else {
      this.authService.registerSpecialist(newEspecialist)
        .subscribe({
          next: (response) => {
            this.onSubmitted('registrar');
          },
          error: (error: string[]): void => {
            this.onSubmitError(error);
          }
        });
    }
  }

  onSubmitted(message: string): void {
    this.isLoading = false;
    this.router.navigate(['/mediapp/usuarios']);
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido ${message} un especialista correctamente`,
      icon: 'success',
      width: '50%'
    })
      .then(() => {
        Swal.close();
      })
      .catch(() => {});
  }

  onSubmitError(error: string[]): void {
    this.isLoading = false;
    this.errores = error;

    Swal.fire({
      title: 'Error',
      text: 'Ha ocurrido un error durante el proceso.',
      icon: 'error'
    });

    const formCopy = { ...this.registerForm.value };
    delete formCopy.imagen;

    this.registerForm.reset(formCopy);
  }

  onCancel(): void {
    this.router.navigate(['/mediapp/usuarios']);
  }

  onFileSelect(event: { target: { files: File[]; }; }) {
    if (event.target.files && event.target.files[0]) {
      this.fileUploadService.toBase64(event.target.files[0]).then(base64 => {
        this.imageBase64 = base64;
        this.imageToShow = base64;
      });
    } else {
      this.imageBase64 = null;
      this.imageToShow = null;
    }
  }

  private generateEspecialist(): EspecialistModel {
    return {
      usuario_id: this.id ?? null,
      datos_personales: {
        nombre: this.registerForm.get('nombre').value,
        primer_apellido: this.registerForm.get('primer_apellido').value,
        segundo_apellido: this.registerForm.get('segundo_apellido').value,
        dni: this.registerForm.get('dni').value,
        email: this.registerForm.get('email').value,
      },
      datos_especialista: {
        consulta: {
          consulta_id: this.registerForm.get('consulta').value,
        },
        especialidad: {
          especialidad_id: this.registerForm.get('especialidad').value,
        },
        num_colegiado: this.registerForm.get('numero_colegiado').value,
        imagen: this.imageBase64,
        descripcion: this.registerForm.get('descripcion').value,
        turno: this.registerForm.get('turno').value,
      }
    }
  }
}
