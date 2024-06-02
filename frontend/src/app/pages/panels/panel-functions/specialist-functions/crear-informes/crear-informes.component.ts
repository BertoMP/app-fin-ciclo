import { CommonModule, Location, LowerCasePipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { QuillEditorComponent } from 'ngx-quill';
import Swal from 'sweetalert2';
import { CustomValidators } from '../../../../../core/classes/CustomValidators';
import { PatologiasService } from '../../../../../core/services/patologias.service';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { PasswordInputComponent } from '../../../../../shared/components/password-input/password-input.component';
import { PatologiasInformeModel } from '../../../../../core/interfaces/patologia-informe.model';
import { InformeFormModel } from '../../../../../core/interfaces/informe-form.model';
import { Subscription } from 'rxjs';
import { InformeService } from '../../../../../core/services/informe.service';

@Component({
  selector: 'app-crear-informes',
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
  templateUrl: './crear-informes.component.html',
  styleUrl: './crear-informes.component.scss'
})
export class CrearInformesComponent {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  isLoading: boolean = false;
  errores: string[] = [];
  maxLength: number = 2500;

  patologias: Select2Data;

  suscripcionRuta: Subscription;
  cita_id: number;
  motivo: string = '';
  contenido: string = '';


  public quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],

      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      ['link']
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private patologiasService: PatologiasService,
    private informeService: InformeService,
    private router: Router,
    private location: Location) {
  }

  ngOnInit(): void {
    this.suscripcionRuta = this.activatedRoute.params.subscribe(params => {
      this.cita_id = params['cita_id'] || null;
      console.log(this.cita_id);
    });

    this.registerForm = new FormGroup<any>({
      'motivo': new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
      'contenido': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.maxLengthHtml(this.maxLength)
        ]
      ),
      'patologias': new FormControl(
        null,
        [
          Validators.required,
        ]
      )
    });

    this.patologiasService.getInformePatologias()
      .subscribe({
        next: (patologias: PatologiasInformeModel[]) => {
          this.patologias = patologias.map((patologia: PatologiasInformeModel) => {
            return {
              value: patologia.id,
              label: patologia.nombre
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al cargar las patologías disponibles',
            icon: 'error'
          });
        }
      });

  }

  get contentLength(): number {
    const description = this.registerForm.get('contenido');
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

  confirmarCancelar() {
    Swal.fire({
      titleText: '¿Estás seguro que quieres crear esta informe?',
      html: '<p style="font-weight: bold; font-size: 1.2em; color:red">Una vez creado no podrá volver a ser modificado</p>',
      icon: 'question',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      width: '50%'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onRegisterInform();
      }
    })
  }

  onRegisterInform(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const newInform: InformeFormModel = this.generateInform();


    this.informeService.crearInforme(newInform)
      .subscribe({
        next: (response) => {
          this.onSubmitted('registrar');
        },
        error: (error: string[]): void => {
          this.onSubmitError(error);
        }
      });

  }

  onSubmitted(message: string): void {
    this.isLoading = false;
    this.router.navigate(['/mediapp/listado-pacientes'])
      .then(() => { });
    Swal.fire({
      title: 'Enhorabuena',
      text: `Has conseguido ${message} un informe correctamente`,
      icon: 'success',
      width: '50%'
    })
      .then(() => {
        Swal.close();
      })
      .catch(() => { });
  }

  onSubmitError(error: string[]): void {
    this.isLoading = false;
    this.errores = error;

    Swal.fire({
      title: 'Error',
      text: 'Se ha producido un error al registrar el informe',
      icon: 'error',
      width: '50%'
    });

    const formCopy = { ...this.registerForm.value };
    this.registerForm.reset(formCopy);
  }

  onCancel(): void {
    this.location.back();
  }

  private generateInform(): InformeFormModel {
    return {
      cita_id: this.cita_id,
      motivo: this.registerForm.get('motivo').value,
      contenido: this.registerForm.get('contenido').value,
      patologias: this.registerForm.get('patologias').value
    }
  }
}
