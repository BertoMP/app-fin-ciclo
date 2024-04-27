import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core/classes/CustomValidators';
import Swal from 'sweetalert2';
import { RefreshPasswordModel } from '../../../core/interfaces/refresh-password.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RefreshPasswordService } from '../../../core/services/refresh-password.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-refresh-password',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule],
  templateUrl: './refresh-password.component.html',
  styleUrl: './refresh-password.component.scss'
})
export class RefreshPasswordComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  sendedAttempt: boolean = false;
  contrasenasIguales: boolean = false;
  errores: string[] = [];
  suscripcionRuta: Subscription;
  token: string;

  constructor(
    private router: Router,
    private refreshPasswordService: RefreshPasswordService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.token = params['token'] || null;
    });

    this.contactForm = new FormGroup<any>({
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

    if (this.contactForm.invalid || !this.contrasenasIguales) {
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
          Swal.fire({
            title: 'Enhorabuena',
            text: 'Has conseguido actualizar la contraseña correctamente',
            icon: 'success',
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
        error: (error: HttpErrorResponse): void => {
          this.errores = error.message.split(',');
        }
      });

  }

  checkPasswordRecover(): void {
    const password = this.contactForm.get('password').value;
    const check_password = this.contactForm.get('checkPassword').value;
    this.contrasenasIguales = (password === check_password && password != null && check_password != null) ? true : false;
  }

  private generatePassword(): RefreshPasswordModel {
    return {
      password: this.contactForm.get('password').value,
      confirm_password: this.contactForm.get('checkPassword').value,
      token:this.token
    }
  }
}