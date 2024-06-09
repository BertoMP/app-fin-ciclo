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
import { TensionArterialDataModel } from '../../../../../core/interfaces/tension-arterial-data.model';
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-tension-form',
  standalone: true,
  imports: [ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent],
  templateUrl: './tension-form.component.html',
  styleUrl: './tension-form.component.scss'
})
export class TensionFormComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];

  suscripcionRuta: Subscription;
  tension: TensionArterialDataModel;
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
    this.title.setTitle('MediAPP - Registrar Tensión Arterial');

    this.loggedInSubscription = this.authService.isLoggedInUser.subscribe(
      loggedIn => {
        this.isUserLoggedIn = loggedIn;
        if (this.isUserLoggedIn) {
          this.id = this.authService.getUserId();
        }
      }
    );

    this.registerForm = new FormGroup<any>({
      'sistolica': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validMedicion
        ]
      ),
      'diastolica': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validMedicion
        ]
      ),
      'pulsaciones': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validMedicion
        ]
      ),
    });
  }

  onRegisterTension(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newTension: TensionArterialDataModel = this.generateTension();

    this.medicionesService.uploadTension(this.id, newTension)
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
    this.router.navigate(['/mediapp/listado-tension'])
      .then(() => {});
    scrollTo(0, 0);
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido registrar una toma de tensión correctamente`,
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

    scrollTo(0, 0);
    Swal.fire({
      title: 'Error',
      text: `Ha ocurrido un error al intentar registrar la toma de tensión`,
      icon: 'error',
      width: '50%'
    });
  }

  onCancel(): void {
    this.location.back();
  }


  private generateTension(): TensionArterialDataModel {
    return {
        sistolica: this.registerForm.get('sistolica').value,
        diastolica: this.registerForm.get('diastolica').value,
        pulsaciones_minuto:this.registerForm.get('pulsaciones').value
    }
  }
}
