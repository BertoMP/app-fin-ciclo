import { CommonModule, Location, LowerCasePipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CustomValidators } from '../../../../../../core/classes/CustomValidators';
import { PatologiasDataModel } from '../../../../../../core/interfaces/patologias-data.model';
import { PatologiasService } from '../../../../../../core/services/patologias.service';
import { Select2Module } from 'ng-select2-component';
import { QuillEditorComponent } from 'ngx-quill';
import { LoadingSpinnerComponent } from '../../../../../../shared/components/loading-spinner/loading-spinner.component';
import { PasswordInputComponent } from '../../../../../../shared/components/password-input/password-input.component';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-crear-editar-patologias',
  standalone: true,
  imports: [ReactiveFormsModule,
    LowerCasePipe,
    NgClass,
    LoadingSpinnerComponent,
    Select2Module,
    CommonModule,
    PasswordInputComponent,
    QuillEditorComponent],
  templateUrl: './crear-editar-patologias.component.html',
  styleUrl: './crear-editar-patologias.component.scss'
})
export class CrearEditarPatologiasComponent {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];
  maxLength: number = 500;

  suscripcionRuta: Subscription;
  patologias: PatologiasDataModel;

  id: number;
  nombre: string = '';
  descripcion: string = '';

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

  constructor(private activatedRoute: ActivatedRoute,
              private patologiasService: PatologiasService,
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
        this.title.setTitle('MediAPP - Editar patología');
        this.patologiasService.getPatologiaId(this.id).subscribe({
          next: (res: PatologiasDataModel) => {
            this.patologias = res;
            this.nombre = this.patologias.datos_patologia.nombre;
            this.descripcion = this.patologias.datos_patologia.descripcion;
            this.patchForm();
          },
          error: (error: HttpErrorResponse): void => {
            this.errores = error.message.split(',');

            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al cargar la patología',
              icon: 'error'
            });
          }
        });
      } else {
        this.title.setTitle('MediAPP - Crear patología');
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

  onRegisterPatology(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newPatology: PatologiasDataModel = this.generatePatology();

    if (this.id != null) {
      this.patologiasService.updatePatologia(newPatology)
        .subscribe({
          next: (response) => {
            this.onSubmitted('actualizar');
          },
          error: (error: string[]): void => {
            this.onSubmitError(error);
          }
        });
    } else {
      this.patologiasService.registrarPatologia(newPatology)
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
    this.router.navigate(['/mediapp/listado-patologias'])
      .then(() => {});
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido ${message} una patología correctamente`,
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
      text: 'Se ha producido un error al registrar/editar la patología',
      icon: 'error',
      width: '50%'
    });

    const formCopy = { ...this.registerForm.value };
    this.registerForm.reset(formCopy);
  }

  onCancel(): void {
    this.location.back();
  }

  private generatePatology(): PatologiasDataModel {
    return {
      id: this.id ?? null,
      datos_patologia: {
        nombre: this.registerForm.get('nombre').value,
        descripcion: this.registerForm.get('descripcion').value,
      }
    }
  }
}
