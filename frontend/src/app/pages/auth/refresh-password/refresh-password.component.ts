import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {CustomValidators} from '../../../core/classes/CustomValidators';
import Swal from 'sweetalert2';
import {
  RefreshPasswordModel
} from '../../../core/interfaces/refresh-password.model';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {
  RefreshPasswordService
} from '../../../core/services/refresh-password.service';
import {Subscription} from 'rxjs';
import {
  PasswordInputComponent
} from "../../../shared/components/password-input/password-input.component";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-refresh-password',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule, PasswordInputComponent],
  templateUrl: './refresh-password.component.html',
  styleUrl: './refresh-password.component.scss'
})
export class RefreshPasswordComponent implements OnInit, OnDestroy {
  refreshPassForm: FormGroup;
  sendedAttempt: boolean = false;
  contrasenasIguales: boolean = false;
  errores: string[] = [];
  suscripcionRuta: Subscription;
  token: string;

  constructor(
    private router: Router,
    private refreshPasswordService: RefreshPasswordService,
    private activatedRoute: ActivatedRoute,
    private title: Title) {
  }

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Recuperar contraseña');

    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.token = params['token'] || null;
    });

    this.refreshPassForm = new FormGroup<any>({
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
  }

  ngOnDestroy(): void {
    this.suscripcionRuta.unsubscribe();
  }

  onRegisterAttempt(): void {
    this.sendedAttempt = true;
    this.checkPasswordRecover();

    if (this.refreshPassForm.invalid || !this.contrasenasIguales) {
      scrollTo(0, 0);
      Swal.fire({
        title: 'Error',
        text: 'No se cumple con los requisitos especificados',
        icon: 'error',
        width: '50%'
      });
      return;
    }


    const newPassword: RefreshPasswordModel = this.generatePassword();
    this.refreshPasswordService.renovarContrasena(newPassword)
      .subscribe({
        next: (response) => {
          scrollTo(0,0);
          Swal.fire({
            title: 'Enhorabuena',
            text: 'Has conseguido actualizar la contraseña correctamente',
            icon: 'success',
            width: '50%'
          })
            .then(() => {
              this.router.navigate(['auth/login'])
                .then(() => {
                })
                .catch((error) => {});
            })
            .catch(() => {});
        },
        error: (error: HttpErrorResponse): void => {
          this.errores = error.message.split(',');
          scrollTo(0, 0);
          Swal.fire({
            title: 'Error',
            text: 'No se ha podido actualizar la contraseña',
            icon: 'error',
            width: '50%'
          });
        }
      });
  }

  checkPasswordRecover(): void {
    const password = this.refreshPassForm.get('password').value;
    const check_password = this.refreshPassForm.get('checkPassword').value;
    this.contrasenasIguales = (password === check_password && password != null && check_password != null) ? true : false;
  }

  private generatePassword(): RefreshPasswordModel {
    return {
      password: this.refreshPassForm.get('password').value,
      checkPassword: this.refreshPassForm.get('checkPassword').value,
      token: this.token
    }
  }
}
