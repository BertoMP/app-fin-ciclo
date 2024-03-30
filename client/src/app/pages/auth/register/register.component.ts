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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LowerCasePipe,
    NgClass
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;

  genders: string[] = [
    'Hombre',
    'Mujer',
    'Otro'
  ]

  places: string[] = [
    'Calle',
    'Avenida',
    'Plaza',
    'Paseo',
  ]

  provinces: string[];

  constructor(private provinceService: ProvinceService,
              private router: Router) {
    this.provinces = this.provinceService.getProvinces();
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
      'gender': new FormControl(
        null,
        [
          Validators.required
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
        null,
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
        null,
        [
          Validators.required
        ]
      ),
      'city': new FormControl(
        null,
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
  }

  onRegisterAttempt(): void {
    this.sendedAttempt = true;
    console.log(this.registerForm);
  }

  onCancel(): void {
    this.router.navigate(['/auth/login'])
      .then(() => console.log('Navigated to login'))
      .catch((error) => console.error('Error navigating to login', error));
  }
}
