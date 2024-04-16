import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {CustomValidators} from "../../../core/classes/CustomValidators";
import {LowerCasePipe, NgClass} from "@angular/common";
import {ProvinceService} from "../../../core/services/province.service";
import {Router} from "@angular/router";
import {UserModel} from "../../../core/interfaces/user.model";
import {AuthService} from "../../../core/services/auth.service";
import {
  LoadingSpinnerComponent
} from "../../../shared/components/loading-spinner/loading-spinner.component";
import {ProvinceModel} from "../../../core/interfaces/province.model";
import {MunicipioModel} from "../../../core/interfaces/municipio.model";
import {TipoViaModel} from "../../../core/interfaces/tipo-via.model";
import {MunicipioService} from "../../../core/services/municipio.service";
import {TipoViaService} from "../../../core/services/tipo-via.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  error: string = null;

  places: TipoViaModel[];
  provinces: ProvinceModel[];
  municipios: MunicipioModel[];

  // SELECT2DATA
  // Tienes que descomentar estas líneas para que funcione
  // el código de abajo porque no se ha definido la interfaz
  // select2Data en el proyecto, una vez instales el npm
  // package de select2Data, podrás usarlo en el proyecto
  // o al menos eso he entendido, en ese momento descomenta estas
  // líneas y sigue con el código de abajo.

  // places2Data: select2Data[] = [];
  // provinces2Data: select2Data[] = [];
  // municipios2Data: select2Data[] = [];

  constructor(private provinceService: ProvinceService,
              private municipioService: MunicipioService,
              private tipoViaService: TipoViaService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup<any>({
      'name': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validName
        ]
      ),
      'first-surname': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validSurname
        ]
      ),
      'second-surname': new FormControl(
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
      'date-of-birth': new FormControl(
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
      'place': new FormControl(
        '0',
        [
          Validators.required
        ]
      ),
      'address': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validAddress
        ]
      ),
      'number': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validNumber
        ]
      ),
      'floor': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validNumber
        ]
      ),
      'door': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validDoor
        ]
      ),
      'province': new FormControl(
        '0',
        [
          Validators.required
        ]
      ),
      'city': new FormControl(
        '0',
        [
          Validators.required,
          CustomValidators.validCity
        ]
      ),
      'postal-code': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validPostalCode
        ]
      ),
      'phone': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validPhone
        ]
      ),
      'mobile': new FormControl(
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
          this.places = places;

          // SELECT2DATA
          // Una vez que tengas el npm package de select2Data
          // puedes descomentar este código para que funcione
          // el select2Data en el proyecto.
          // Si funciona correctamente, se puede rehacer el código
          // para evitar el paso previo de guardarlo en el array
          // places y hacerlo directamente en el array places2Data.
          // Lo mismo para el resto de subscripciones a servicios
          // que se han hecho en este componente.

          // this.places2Data = places.map((place: TipoViaModel) => {
          //   return {
          //     value: place.id,
          //     label: place.nombre
          //   }
          // });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching places', error.error);
        }
      });

    this.provinceService.getProvinces()
      .subscribe({
        next: (provinces: ProvinceModel[]) => {
          this.provinces = provinces;

          // this.provinces2Data = provinces.map((province: ProvinceModel) => {
          //   return {
          //     value: province.id,
          //     label: province.nombre
          //   }
          // });
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
                this.municipios = municipios;

                // this.municipios2Data = municipios.map((municipio: MunicipioModel) => {
                //   return {
                //     value: municipio.id,
                //     label: municipio.nombre
                //   }
                // });
              },
              error: (error: HttpErrorResponse) => {
                console.error('Error fetching municipios', error.error);
              }
            });
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
          this.registerForm.reset();
        },
        error: (error: string): void => {
          this.error = error;
          this.isLoading = false;
        }
      });

  }

  onCancel(): void {
    this.router.navigate(['/auth/login'])
      .then(() => {})
      .catch((error) => console.error('Error navigating to login', error));
  }

  private generateUser(): UserModel {
    return {
      name: this.registerForm.get('name').value,
      firstSurname: this.registerForm.get('first-surname').value,
      secondSurname: this.registerForm.get('second-surname').value,
      dni: this.registerForm.get('dni').value,
      dateOfBirth: this.registerForm.get('date-of-birth').value,
      gender: this.registerForm.get('gender').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value,
      place: this.registerForm.get('place').value,
      address: this.registerForm.get('address').value,
      number: this.registerForm.get('number').value,
      floor: this.registerForm.get('floor').value,
      door: this.registerForm.get('door').value,
      province: this.registerForm.get('province').value,
      city: this.registerForm.get('city').value,
      phone: this.registerForm.get('phone').value,
      mobile: this.registerForm.get('mobile').value
    }
  }
}
