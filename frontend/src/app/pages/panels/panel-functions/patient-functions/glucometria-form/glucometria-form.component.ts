import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule, Location, LowerCasePipe, NgClass } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { Select2Module } from 'ng-select2-component';
import { PasswordInputComponent } from '../../../../../shared/components/password-input/password-input.component';
import { Subscription } from 'rxjs';

import { MedicionesService } from '../../../../../core/services/mediciones.service';
import { CustomValidators } from '../../../../../core/classes/CustomValidators';
import { AuthService } from '../../../../../core/services/auth.service';
import { GlucometriaDataModel } from '../../../../../core/interfaces/glucometria-data.model';
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-glucometria-form',
  standalone: true,
  imports: [ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent],
  templateUrl: './glucometria-form.component.html',
  styleUrl: './glucometria-form.component.scss'
})

export class GlucometriaFormComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];

  suscripcionRuta: Subscription;
  glucometria: GlucometriaDataModel;
  id: number;
  fecha: string;
  hora: string;

  loggedInSubscription: Subscription;
  isUserLoggedIn: boolean = false;

  constructor(private authService:AuthService,
              private medicionesService: MedicionesService,
              private location: Location,
              private router: Router,
              private title: Title) {
  }

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Registrar Glucometría');

    this.loggedInSubscription = this.authService.isLoggedInUser.subscribe(
      loggedIn => {
        this.isUserLoggedIn = loggedIn;
        if (this.isUserLoggedIn) {
          this.id = this.authService.getUserId();
        }
      }
    );

    this.registerForm = new FormGroup<any>({
      'medicion': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validMedicion
        ]
      )
    });
  }

  onRegisterGlucometria(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newGlucometria: GlucometriaDataModel = this.generateGlucometria();

    this.medicionesService.uploadGlucometria(this.id, newGlucometria)
      .subscribe({
        next: (response) => {
          this.onSubmitted();
        },
        error: (error: string[]): void => {
          this.onSubmitError(error);
        }
      });
  }

  onSubmitted(): void {
    this.isLoading = false;
    this.router.navigate(['/mediapp/listado-glucometria'])
      .then(() => {});
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido registrar una toma de glucosa correctamente`,
      icon: 'success',
      width: '50%'
    })
      .then(() => {
        Swal.close();
      })
      .catch(() => {});
  }

  onSubmitError(error: string[]): void {
    this.isLoading = false;
    this.errores = error;
    Swal.fire({
      title: 'Error',
      text: `Ha ocurrido un error al intentar registrar la toma de glucosa`,
      icon: 'error',
      width: '50%'
    });
  }

  onCancel(): void {
    this.location.back();
  }


  private generateGlucometria(): GlucometriaDataModel {
    return {
        medicion: this.registerForm.get('medicion').value
    }
  }
}
