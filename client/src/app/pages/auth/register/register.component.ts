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
              private router: Router,
              private authService: AuthService) {
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
        '',
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
        '',
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
        '',
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
