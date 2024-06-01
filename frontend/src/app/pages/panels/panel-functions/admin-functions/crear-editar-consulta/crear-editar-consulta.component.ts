import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../../../../shared/components/loading-spinner/loading-spinner.component";
import {Location, NgClass, NgForOf, NgIf} from "@angular/common";
import {QuillEditorComponent} from "ngx-quill";
import {Subscription} from "rxjs";
import {GlucometriaDataModel} from "../../../../../core/interfaces/glucometria-data.model";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomValidators} from "../../../../../core/classes/CustomValidators";
import Swal from "sweetalert2";
import {ConsultaModel} from "../../../../../core/interfaces/consulta.model";
import {ConsultaService} from "../../../../../core/services/consulta.service";
import {SpecialityListedModel} from "../../../../../core/interfaces/speciality-listed.model";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-crear-editar-consulta',
  standalone: true,
  imports: [
    FormsModule,
    LoadingSpinnerComponent,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    QuillEditorComponent,
    NgClass
  ],
  templateUrl: './crear-editar-consulta.component.html',
  styleUrl: './crear-editar-consulta.component.scss'
})
export class CrearEditarConsultaComponent {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];

  id: number;
  nombre: string = '';

  isEditing: boolean = false;

  suscripcionRuta: Subscription;

  constructor(
    private consultaService: ConsultaService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router) {
  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'] || null;

      if (this.id !== null) {
        this.isEditing = true;
      }

      if (this.isEditing) {
        this.consultaService.getConsultaById(this.id).subscribe({
          next: (res: ConsultaModel) => {
            this.id = res.id;
            this.nombre = res.nombre;

            this.patchForm();
          },
          error: (error: HttpErrorResponse): void => {
            this.errores = error.message.split(',');
          }
        });
      }
    });

    this.registerForm = new FormGroup<any>({
      'name': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validConsulta
        ]
      ),
    });
  }

  patchForm(): void {
    this.registerForm.patchValue({
      'name': this.nombre,
    });

    this.registerForm.updateValueAndValidity();
  }

  onRegisterConsulta(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newConsulta: ConsultaModel = this.generateConsulta();

    if (this.id != null) {
      this.consultaService.actualizarConsulta(newConsulta)
        .subscribe({
          next: (response) => {
            this.onSubmitted('actualizar');
          },
          error: (error: HttpErrorResponse): void => {
            this.onSubmitError(error);
          }
        });
    } else {
      this.consultaService.registrarConsulta(newConsulta)
        .subscribe({
          next: (response) => {
            this.onSubmitted('registrar');
          },
          error: (error: HttpErrorResponse): void => {
            this.onSubmitError(error);
          }
        });
    }
  }

  onSubmitted(message: string): void {
    this.isLoading = false;
    this.router.navigate(['/mediapp/consultas'])
      .then(() => {});
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido ${message} una consulta correctamente`,
      icon: 'success',
      width: '50%'
    })
      .then(() => {
        Swal.close();
      })
      .catch(() => {});
  }

  onSubmitError(error: HttpErrorResponse): void {
    this.isLoading = false;
    this.errores = error.error.errors as string[];

    const formCopy = { ...this.registerForm.value };
    this.registerForm.reset(formCopy);

    if (error.status === 409) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Existe un conflicto con la consulta que intenta crear/editar.',
      });
      return;
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo crear/editar la consulta. Por favor, intente nuevamente más tarde.',
    });
  }

  onCancel(): void {
    this.location.back();
  }


  private generateConsulta(): ConsultaModel {
    return {
      id: this.id,
      nombre: this.registerForm.get('name').value
    }
  }
}
