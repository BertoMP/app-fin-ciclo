import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../../core/classes/CustomValidators';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../../../../core/services/file-uploader.service';
import Swal from 'sweetalert2';
import { SpecialityListedModel } from '../../../../../core/interfaces/speciality-listed.model';
import { CommonModule, LowerCasePipe, NgClass } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { Select2Module } from 'ng-select2-component';
import { PasswordInputComponent } from '../../../../../shared/components/password-input/password-input.component';
import { Subscription } from 'rxjs';
import { EspecialidadService } from '../../../../../core/services/especialidad.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crear-editar-especialidades',
  standalone: true,
  imports: [ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent],
  templateUrl: './crear-editar-especialidades.component.html',
  styleUrl: './crear-editar-especialidades.component.scss'
})
export class CrearEditarEspecialidadesComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];
  imageBase64: string;

  suscripcionRuta: Subscription;
  especialidad: SpecialityListedModel;

  id: number;
  nombre: string = '';
  descripcion: string = '';
  imageToShow: string;

  constructor(
    private router: Router,
    private fileUploadService: FileUploadService,
    private activatedRoute: ActivatedRoute,
    private especialidadService: EspecialidadService) {
  }

  ngOnInit(): void {

    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;
      if (this.id != null) {
        this.especialidadService.getEspecialidadId(this.id).subscribe({
          next: (res: SpecialityListedModel) => {
            this.especialidad = res;
            this.nombre = this.especialidad.datos_especialidad.nombre;
            this.descripcion = this.especialidad.datos_especialidad.descripcion;
            this.imageBase64 = this.especialidad.datos_especialidad.imagen;
            this.imageToShow = this.imageBase64 ? this.imageBase64 : null;

            this.patchForm();
          },
          error: (error: HttpErrorResponse): void => {
            this.errores = error.message.split(',');
          }
        });
      }
    });

    this.registerForm = new FormGroup<any>({
      'nombre': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validName
        ]
      ),
      'imagen': new FormControl(),
      'descripcion': new FormControl(
        null,
        [
          Validators.required
        ]
      )
    });


  }
  patchForm(): void {
    let descripcionWithLineBreaks = this.descripcion.replace(/<br>/g, '\n');

    this.registerForm.patchValue({
      'nombre': this.nombre,
      'descripcion': descripcionWithLineBreaks
    });

    this.registerForm.updateValueAndValidity();
  }


  onRegisterEspeciality(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newEspeciality: SpecialityListedModel = this.generateEspeciality();
    console.log(newEspeciality);

    if (this.id != null) {
      this.especialidadService.updateEspecialidad(newEspeciality)
        .subscribe({
          next: (response) => {
            this.onSubmitted('actualizar');
          },
          error: (error: string[]): void => {
            this.onSubmitError(error);
          }
        });
    } else {
      this.especialidadService.registerEspecialidad(newEspeciality)
        .subscribe({
          next: (response) => {
            this.onSubmitted('registrar');
          },
          error: (error: string[]): void => {
            this.onSubmitError(error);
          }
        });
    }
  }

  onSubmitted(message: string): void {
    this.isLoading = false;
    this.router.navigate(['/testeo/listadoEspecialidades'])
      .then(() => { })
      .catch((error) => console.error('Error navigating to login', error));
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido ${message} una especialidad correctamente`,
      icon: 'success',
      width: '50%'
    })
      .then(() => {
        Swal.close();
      })
      .catch(() => {
        console.log('Se produjo un error.')
      });
  }

  onSubmitError(error: string[]): void {
    this.isLoading = false;
    this.errores = error;

    const formCopy = { ...this.registerForm.value };
    delete formCopy.imagen;

    this.registerForm.reset(formCopy);
  }

  onCancel(): void {
    this.router.navigate(['/testeo/listadoEspecialidades'])
      .then(() => { })
      .catch((error) => console.error('Error navigating to login', error));
  }

  onFileSelect(event: { target: { files: File[]; }; }) {
    if (event.target.files && event.target.files[0]) {
      this.fileUploadService.toBase64(event.target.files[0]).then(base64 => {
        this.imageBase64 = base64;
        this.imageToShow = base64;
      });
    } else {
      this.imageBase64 = null;
      this.imageToShow = null;
    }
  }

  private generateEspeciality(): SpecialityListedModel {
    return {
      id: this.id ?? null,
      datos_especialidad: {
        nombre: this.registerForm.get('nombre').value,
        imagen: this.imageBase64,
        descripcion: this.registerForm.get('descripcion').value,
      }
    }
  }
}
