import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { CustomValidators } from "../../../core/classes/CustomValidators";
import { CommonModule, LowerCasePipe, NgClass } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import {
  LoadingSpinnerComponent
} from "../../../shared/components/loading-spinner/loading-spinner.component";
import { HttpErrorResponse } from "@angular/common/http";
import { Select2Module, Select2Data } from 'ng-select2-component';
import Swal from 'sweetalert2';
import {
  PasswordInputComponent
} from "../../../shared/components/password-input/password-input.component";
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { EspecialidadModel } from '../../../core/interfaces/especialidad-Model';
import { TurnoService } from '../../../core/services/turno.service';
import { ConsultaService } from '../../../core/services/consulta.service';
import { FileUploadService } from '../../../core/services/file-uploader.service';
import { Subscription } from 'rxjs';
import { EspecialistModel } from '../../../core/interfaces/especialist.model';
import { ProfessionalDataService } from '../../../core/services/professional-data.service';

@Component({
  selector: 'app-specialist-form',
  standalone: true,
  imports: [ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent,],
  templateUrl: './specialist-form.component.html',
  styleUrl: './specialist-form.component.scss'
})
export class SpecialistFormComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];
  imageBase64: string;

  especialidad: Select2Data;
  turno: Select2Data;
  consulta: Select2Data;
  suscripcionRuta: Subscription;
  especialista: EspecialistModel;

  id: number;
  nombre: string = '';
  primer_apellido: string = '';
  segundo_apellido: string = '';
  dni: string = '';
  descripcion: string = '';
  num_colegiado: string = '';
  consulta_id: number = null;
  especialidad_id: number = null;
  nombre_turno: string = '';
  email: string = '';

  imageToShow: string;

  constructor(private turnoService: TurnoService,
    private especialidadService: EspecialidadService,
    private consultaService: ConsultaService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private activatedRoute: ActivatedRoute,
    private professionalDataService: ProfessionalDataService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;
      if (this.id != null) {
        this.professionalDataService.specificEspecialista(this.id).subscribe({
          next: (res: EspecialistModel) => {
            this.especialista = res;
            this.nombre = this.especialista.datos_personales.nombre;
            this.primer_apellido = this.especialista.datos_personales.primer_apellido;
            this.segundo_apellido = this.especialista.datos_personales.segundo_apellido;
            this.dni = this.especialista.datos_personales.dni;
            this.descripcion = this.especialista.datos_especialista.descripcion;
            this.num_colegiado = this.especialista.datos_especialista.num_colegiado;
            this.consulta_id = this.especialista.datos_especialista.consulta.consulta_id;
            this.especialidad_id = this.especialista.datos_especialista.especialidad.especialidad_id;
            this.nombre_turno = this.especialista.datos_especialista.turno;
            this.email = this.especialista.datos_personales.email;
            this.imageBase64 = this.especialista.datos_especialista.imagen;
            this.imageToShow = this.imageBase64 ? this.imageBase64 : null;

            this.patchForm();
          },
          error: (error: HttpErrorResponse): void => {
            this.errores = error.message.split(',');
          }
        });
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
      'password': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validPassword
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
          console.error('Error fetching places', error.error);
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
          console.error('Error fetching places', error.error);
        }
      });

    this.turno = this.turnoService.getTurno().map((turno: string) => {
      return {
        value: turno,
        label: turno
      }
    })
  }

  patchForm(): void {
    let descripcionWithLineBreaks = this.descripcion.replace(/<br>/g, '\n');

    this.registerForm.patchValue({
      'nombre': this.nombre,
      'primer_apellido': this.primer_apellido,
      'segundo_apellido': this.segundo_apellido,
      'dni': this.dni,
      'email': this.email,
      'consulta': this.consulta_id,
      'especialidad': this.especialidad_id,
      'numero_colegiado': this.num_colegiado,
      'turno': this.nombre_turno,
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
    this.router.navigate(['auth/login'])
      .then(() => { })
      .catch((error) => console.error('Error navigating to login', error));
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido ${message} un especialista correctamente`,
      icon: 'success',
      width: '50%'
    })
      .then(() => {
        Swal.close();
      })
      .catch(() => {
        console.log('Se produjo un error.')
      });
  }

  onSubmitError(error: string[]): void {
    this.isLoading = false;
    this.errores = error;

    const formCopy = { ...this.registerForm.value };
    delete formCopy.imagen;

    this.registerForm.reset(formCopy);
  }

  onCancel(): void {
    this.router.navigate(['/auth/login'])
      .then(() => { })
      .catch((error) => console.error('Error navigating to login', error));
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
        password: this.registerForm.get('password').value,
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
