import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {PasswordInputComponent} from "../../../shared/components/password-input/password-input.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select2Module} from "ng-select2-component";
import {AuthService} from "../../../core/services/auth.service";
import {CustomValidators} from "../../../core/classes/CustomValidators";
import Swal from "sweetalert2";
import {UpdatePasswordModel} from "../../../core/interfaces/update-password.model";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-update-password',
  standalone: true,
    imports: [
        NgForOf,
        PasswordInputComponent,
        ReactiveFormsModule,
        Select2Module
    ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent implements OnInit {
  updatePassForm: FormGroup;
  sendedAttempt: boolean = false;
  contrasenasIguales: boolean = true;
  errores: string[] = [];

  constructor(private authService: AuthService,
              private router: Router,
              private title: Title) {}

  ngOnInit() {
    this.title.setTitle('MediAPP - Actualizar contraseña');

    this.updatePassForm = new FormGroup<any>({
      'oldPassword': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validPassword
        ]
      ),
      'password': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validPassword
        ]
      ),
      'checkPassword': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validPassword,
        ]
      )
    });

    this.updatePassForm.get('password').valueChanges.subscribe(() => {
      this.checkPasswords();
    });

    this.updatePassForm.get('checkPassword').valueChanges.subscribe(() => {
      this.checkPasswords();
    });
  }

  onUpdatePassword() {
    this.sendedAttempt = true;
    this.checkPasswords();

    if (this.updatePassForm.invalid || !this.contrasenasIguales) {
      Swal.fire({
        title: 'Error',
        text: 'No se cumple con los requisitos especificados',
        icon: 'error',
        width: '50%'
      });
      return;
    }

    const newPassword: UpdatePasswordModel = this.generatePasswordModel();
    this.authService.updatePassword(newPassword).subscribe({
      next: () => {
        Swal.fire({
          title: 'Contraseña actualizada',
          text: 'La contraseña ha sido actualizada correctamente',
          icon: 'success',
          width: '50%'
        });
        this.router.navigate(['/mediapp'])
          .then(() => {});
      },
      error: (err) => {
        this.errores = err;
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al actualizar la contraseña',
          icon: 'error',
          width: '50%'
        });
      }
    });
  }

  checkPasswords() {
    this.contrasenasIguales = this.updatePassForm.get('password').value === this.updatePassForm.get('checkPassword').value;
  }

  generatePasswordModel(): UpdatePasswordModel {
    return {
      oldPassword: this.updatePassForm.get('oldPassword').value,
      password: this.updatePassForm.get('password').value,
      checkPassword: this.updatePassForm.get('checkPassword').value
    };
  }
}
