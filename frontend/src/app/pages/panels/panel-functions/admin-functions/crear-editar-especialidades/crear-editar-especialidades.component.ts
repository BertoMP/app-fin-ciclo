import { Component, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../../core/classes/CustomValidators';
import {ActivatedRoute, Router} from '@angular/router';
import { FileUploadService } from '../../../../../core/services/file-uploader.service';
import Swal from 'sweetalert2';
import { SpecialityListedModel } from '../../../../../core/interfaces/speciality-listed.model';
import {CommonModule, Location, LowerCasePipe, NgClass} from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { Select2Module } from 'ng-select2-component';
import { PasswordInputComponent } from '../../../../../shared/components/password-input/password-input.component';
import { Subscription } from 'rxjs';
import { EspecialidadService } from '../../../../../core/services/especialidad.service';
import { HttpErrorResponse } from '@angular/common/http';
import {QuillEditorComponent} from 'ngx-quill';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-crear-editar-especialidades',
  standalone: true,
  imports: [ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent,
    QuillEditorComponent,
  ],
  templateUrl: './crear-editar-especialidades.component.html',
  styleUrl: './crear-editar-especialidades.component.scss'
})
export class CrearEditarEspecialidadesComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];
  imageBase64: string;
  maxLength: number = 120;

  suscripcionRuta: Subscription;
  especialidad: SpecialityListedModel;

  id: number;
  nombre: string = '';
  descripcion: string = '';
  imageToShow: string;

  isEditing: boolean = false;

  public quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],

      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      ['link']
    ]
  };

  constructor(private fileUploadService: FileUploadService,
              private activatedRoute: ActivatedRoute,
              private especialidadService: EspecialidadService,
              private router: Router,
              private location: Location,
              private title: Title) {
  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;

      if (this.id !== null) {
        this.isEditing = true;
      }

      if (this.isEditing) {
        this.title.setTitle('MediAPP - Editar especialidad');
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
      } else {
        this.title.setTitle('MediAPP - Crear especialidad');
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
          Validators.required,
          CustomValidators.maxLengthHtml(this.maxLength)
        ]
      )
    });
  }

  get descriptionLength(): number {
    const description = this.registerForm.get('descripcion');
    return description && description.value ? this.countCharacters(description.value) : 0;
  }

  stripHtml(html: string) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  countCharacters(input: string) {
    const strippedInput = this.stripHtml(input);
    return strippedInput.length;
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
    this.registerForm.get('imagen').setValue('');

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
    this.router.navigate(['/mediapp/especialidades'])
      .then(() => {});
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido ${message} una especialidad correctamente`,
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

    const formCopy = { ...this.registerForm.value };
    delete formCopy.imagen;

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo crear/editar la especialidad. Por favor, intente nuevamente más tarde.',
    });

    this.registerForm.reset(formCopy);
  }

  onCancel(): void {
    this.location.back();
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
