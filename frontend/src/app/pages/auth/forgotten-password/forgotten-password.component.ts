import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgottenPassswordModel } from '../../../core/interfaces/forgotten-password.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from '../../../core/classes/CustomValidators';
import { ForgottenPasswordService } from '../../../core/services/forgotten-password.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgotten-password',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule],
  templateUrl: './forgotten-password.component.html',
  styleUrl: './forgotten-password.component.scss'
})
export class ForgottenPasswordComponent {
  emailForm: FormGroup;
  sendedAttempt: boolean = false;
  errores: string[] = [];
  botonDesactivado: boolean = false;

  constructor(
    private router: Router,
    private refreshPasswordService: ForgottenPasswordService) {
  }

  ngOnInit(): void {
    this.emailForm = new FormGroup<any>({
      'email': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validEmail
        ]
      )
    });
  }

  onRegisterAttempt(): void {
    this.sendedAttempt = true;
    this.botonDesactivado=true;

    if (this.emailForm.invalid) {
      this.botonDesactivado=false;
      return;
    }

    const newCorreo: ForgottenPassswordModel = this.generateCorreo();
    this.refreshPasswordService.enviarCorreoRenovacion(newCorreo)
      .subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Enhorabuena',
            text: 'Se ha enviado un enlace a su email, por favor siga las instrucciones para renovar su contraseña',
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
          this.errores=error.message.split(',');
          this.botonDesactivado=false;
           }
      });

  }

  private generateCorreo(): ForgottenPassswordModel {
    return {
      email: this.emailForm.get('email').value,
    }
  }
}
