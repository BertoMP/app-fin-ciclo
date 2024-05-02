import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { CustomValidators } from "../../../core/classes/CustomValidators";
import { CommonModule, LowerCasePipe, NgClass } from "@angular/common";
import { ProvinceService } from "../../../core/services/province.service";
import { Router } from "@angular/router";
import { UserModel } from "../../../core/interfaces/user.model";
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
import {CodigoPostalModel} from "../../../core/interfaces/codigo-postal.model";
import Swal from 'sweetalert2';
import {
  PasswordInputComponent
} from "../../../shared/components/password-input/password-input.component";

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

  constructor(private provinceService: ProvinceService,
    private municipioService: MunicipioService,
    private tipoViaService: TipoViaService,
    private codigoPostalService: CodigoPostalService,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit(): void {
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

  onRegisterAttempt(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newUser: UserModel = this.generateUser();
    this.authService.register(newUser)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          Swal.fire({
            title:'Enhorabuena',
            text:'Has conseguido registrarte correctamente',
            icon:'success',
            width: '50%'
          })
            .then(() => {
              this.router.navigate(['auth/login'])
                .then(() => { })
                .catch((error) => console.error('Error navigating to login', error));
            })
            .catch(() => {
              console.log('Se produjo un error.')
            });
        },
        error: (error: string[]): void => {
          this.isLoading = false;
          this.errores = error;
        }
      });

  }

  onCancel(): void {
    this.router.navigate(['/auth/login'])
      .then(() => { })
      .catch((error) => console.error('Error navigating to login', error));
  }

  private generateUser(): UserModel {
    return {
      nombre: this.registerForm.get('nombre').value,
      primer_apellido: this.registerForm.get('primer_apellido').value,
      segundo_apellido: this.registerForm.get('segundo_apellido').value,
      dni: this.registerForm.get('dni').value,
      fecha_nacimiento: this.registerForm.get('fecha_nacimiento').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value,
      tipo_via: this.registerForm.get('tipo_via').value,
      nombre_via: this.registerForm.get('nombre_via').value,
      numero: this.registerForm.get('numero').value,
      piso: this.registerForm.get('piso').value,
      puerta: this.registerForm.get('puerta').value,
      province: this.registerForm.get('province').value,
      municipio: this.registerForm.get('municipio').value,
      tel_fijo: this.registerForm.get('tel_fijo').value,
      tel_movil: this.registerForm.get('tel_movil').value,
      codigo_postal: this.registerForm.get('codigo_postal').value
    }
  }
}
