import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { CustomValidators } from "../../../core/classes/CustomValidators";
import {CommonModule, Location, LowerCasePipe, NgClass} from "@angular/common";
import { ProvinceService } from "../../../core/services/province.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import {
  LoadingSpinnerComponent
} from "../../../shared/components/loading-spinner/loading-spinner.component";
import { ProvinceModel } from "../../../core/interfaces/province.model";
import { MunicipioModel } from "../../../core/interfaces/municipio.model";
import { TipoViaModel } from "../../../core/interfaces/tipo-via.model";
import { MunicipioService } from "../../../core/services/municipio.service";
import { TipoViaService } from "../../../core/services/tipo-via.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Select2Module, Select2Data } from 'ng-select2-component';
import {
  CodigoPostalService
} from "../../../core/services/codigo-postal.service";
import { CodigoPostalModel } from "../../../core/interfaces/codigo-postal.model";
import Swal from 'sweetalert2';
import {
  PasswordInputComponent
} from "../../../shared/components/password-input/password-input.component";
import { Subscription } from 'rxjs';
import { PatientModel } from '../../../core/interfaces/patient.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];

  places: Select2Data;
  provinces: Select2Data;
  municipios: Select2Data;
  codigosPostales: Select2Data;

  suscripcionRuta: Subscription;
  id: number = null;

  paciente: PatientModel;

  isEditing: boolean = false;

  constructor(private provinceService: ProvinceService,
              private municipioService: MunicipioService,
              private tipoViaService: TipoViaService,
              private codigoPostalService: CodigoPostalService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private location: Location) {
  }
  formatearFecha(fechaString: string) {
    const partesFecha = fechaString.split("-");
    return partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];
  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;

      if (this.id) {
        this.isEditing = true;
      }

      if (this.isEditing) {
        this.authService.getPatient(this.id).subscribe({
          next: (res: PatientModel) => {
            this.paciente = res;

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
      'fecha_nacimiento': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validDateOfBirth
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
      'clinic-historial': new FormControl({
        value: null,
        disabled: true
      }),
      'tipo_via': new FormControl(
        null,
        [
          Validators.required
        ]
      ),
      'nombre_via': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validAddress
        ]
      ),
      'numero': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validNumber
        ]
      ),
      'piso': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validNumber
        ]
      ),
      'puerta': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validDoor
        ]
      ),
      'province': new FormControl(
        null,
        [
          Validators.required
        ]
      ),
      'municipio': new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'codigo_postal': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validPostalCode
        ]
      ),
      'tel_fijo': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validPhone
        ]
      ),
      'tel_movil': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validMobile
        ]
      ),
    });

    this.tipoViaService.getTipoVia()
      .subscribe({
        next: (places: TipoViaModel[]) => {
          this.places = places.map((place: TipoViaModel) => {
            return {
              value: place.id,
              label: place.nombre
            }
          });

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching places', error.error);
        }
      });

    this.provinceService.getProvinces()
      .subscribe({
        next: (provinces: ProvinceModel[]) => {
          this.provinces = provinces.map((province: ProvinceModel) => {
            return {
              value: province.id,
              label: province.nombre
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching provinces', error.error);
        }
      });

    this.registerForm.get('province').valueChanges
      .subscribe({
        next: (province: string) => {
          this.municipioService.getMunicipios(province)
            .subscribe({
              next: (municipios: MunicipioModel[]) => {
                this.municipios = municipios.map((municipio: MunicipioModel) => {
                  return {
                    value: municipio.id,
                    label: municipio.nombre
                  }
                });
              },
              error: (error: HttpErrorResponse) => {
                console.error('Error fetching municipios', error.error);
              }
            });
        }
      });

    this.registerForm.get('municipio').valueChanges
      .subscribe({
        next: (municipio: string) => {
          this.codigoPostalService.getCodigosPostales(municipio)
            .subscribe({
              next: (codigosPostales: CodigoPostalModel[]) => {
                this.codigosPostales = codigosPostales.map((codigoPostal: CodigoPostalModel) => {
                  return {
                    value: codigoPostal.codigo_postal_id,
                    label: codigoPostal.codigo_postal_id
                  }
                });
              },
              error: (error: HttpErrorResponse) => {
                console.error('Error fetching codigos_postales', error.error);
              }
            })
        }
      });
  }

  patchForm(): void {
    this.registerForm.patchValue({
      'nombre': this.paciente.datos_personales.nombre,
      'primer_apellido': this.paciente.datos_personales.primer_apellido,
      'segundo_apellido': this.paciente.datos_personales.segundo_apellido,
      'dni': this.paciente.datos_personales.dni,
      'email': this.paciente.datos_personales.email,
      'fecha_nacimiento': this.formatearFecha(this.paciente.datos_paciente.fecha_nacimiento),
      'clinic-historial': this.paciente.datos_paciente.num_historia_clinica,
      'tel_fijo': this.paciente.datos_paciente.datos_contacto.tel_fijo,
      'tel_movil': this.paciente.datos_paciente.datos_contacto.tel_movil,
      'numero': this.paciente.datos_paciente.datos_vivienda.numero,
      'puerta': this.paciente.datos_paciente.datos_vivienda.puerta,
      'piso': this.paciente.datos_paciente.datos_vivienda.piso,
      'nombre_via': this.paciente.datos_paciente.datos_vivienda.nombre_via,
      'tipo_via': this.paciente.datos_paciente.datos_vivienda.tipo_via.id,
      'province': this.paciente.datos_paciente.datos_vivienda.provincia.id,
      'municipio': this.paciente.datos_paciente.datos_vivienda.municipio.id,
      'codigo_postal': this.paciente.datos_paciente.datos_vivienda.municipio.codigo_postal
    });

    Object.keys(this.registerForm.controls).forEach(field => {
      const control = this.registerForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    this.registerForm.updateValueAndValidity();
  }


  onRegisterAttempt(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newUser: PatientModel = this.generateUser();

    if (this.id != null) {
      this.authService.updateUser(newUser)
        .subscribe({
          next: (response) => {
            this.onSubmitted("editar")
          },
          error: (error: string[]): void => {
            this.onSubmitError(error);
          }
        });
    } else {
      this.authService.registerUser(newUser)
        .subscribe({
          next: (response) => {
            this.onSubmitted("registrar")
          },
          error: (error: string[]): void => {
            this.onSubmitError(error);
          }
        });
    }
  }

  onSubmitted(message: string): void {
    this.isLoading = false;
    this.location.back()
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido ${message} un usuario correctamente`,
      icon: 'success',
      width: '50%'
    }).then(() => {
      Swal.close();
    }).catch(() => {
        console.log('Se produjo un error.')
    });
  }

  onSubmitError(error: string[]): void {
    this.isLoading = false;
    this.errores = error;
  }


  onCancel(): void {
    this.location.back();
  }

  private generateUser(): PatientModel {
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
      datos_paciente: {
        fecha_nacimiento: this.registerForm.get('fecha_nacimiento').value,
        num_historia_clinica: (this.isEditing) ? this.paciente.datos_paciente.num_historia_clinica : null,
        datos_contacto: {
          tel_fijo: this.registerForm.get('tel_fijo').value,
          tel_movil: this.registerForm.get('tel_movil').value,
        },
        datos_vivienda: {
          municipio: {
            id: this.registerForm.get('municipio').value,
            codigo_postal: this.registerForm.get('codigo_postal').value
          },
          nombre_via: this.registerForm.get('nombre_via').value,
          numero: this.registerForm.get('numero').value,
          piso: this.registerForm.get('piso').value,
          puerta: this.registerForm.get('puerta').value,
          tipo_via: {
            id: this.registerForm.get('tipo_via').value
          },
        },
      }
    }
  }
}
