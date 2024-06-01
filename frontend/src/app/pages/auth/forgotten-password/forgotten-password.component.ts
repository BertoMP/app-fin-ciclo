import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgottenPassswordModel } from '../../../core/interfaces/forgotten-password.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from '../../../core/classes/CustomValidators';
import { ForgottenPasswordService } from '../../../core/services/forgotten-password.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import {LoadingSpinnerComponent} from "../../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-forgotten-password',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule, LoadingSpinnerComponent],
  templateUrl: './forgotten-password.component.html',
  styleUrl: './forgotten-password.component.scss'
})
export class ForgottenPasswordComponent {
  emailForm: FormGroup;
  sendedAttempt: boolean = false;
  errores: string[] = [];
  botonDesactivado: boolean = false;
  isDataLoaded: boolean = true;

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
    this.botonDesactivado = true;
    this.errores=[];
    this.isDataLoaded = false;

    if (this.emailForm.invalid) {
      this.botonDesactivado=false;
      this.isDataLoaded = true;
      return;
    }

    const newCorreo: ForgottenPassswordModel = this.generateCorreo();
    this.refreshPasswordService.enviarCorreoRenovacion(newCorreo)
      .subscribe({
        next: (response) => {
          this.botonDesactivado = false;
          this.isDataLoaded = true;
          Swal.fire({
            title: 'Enhorabuena',
            text: 'Se ha enviado un enlace a su email, por favor siga las instrucciones para renovar su contraseña',
            icon: 'success',
            width: '50%'
          })
            .then(() => {
              this.router.navigate(['auth/login'])
                .then(() => { })
                .catch((error) => {});
            })
            .catch(() => {});
        },
        error: (error: HttpErrorResponse): void => {
          this.errores = error.message.split(',');
          this.botonDesactivado = false;
          this.isDataLoaded = true;
          Swal.fire({
            title: 'Error',
            text: `Ha ocurrido un error durante la solicitud de renovación de contraseña.`,
            icon: 'error',
            width: '50%'
          });
        }
      });

  }

  private generateCorreo(): ForgottenPassswordModel {
    return {
      email: this.emailForm.get('email').value,
    }
  }
}
