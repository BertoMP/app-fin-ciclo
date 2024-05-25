import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { ContactoModel } from '../../core/interfaces/contacto.model';
import { CustomValidators } from '../../core/classes/CustomValidators';
import { ContactoService } from '../../core/services/contacto.service';
import Swal from 'sweetalert2';
import {
  LoadingSpinnerComponent
} from "../../shared/components/loading-spinner/loading-spinner.component";
import {QuillEditorComponent} from "ngx-quill";

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoadingSpinnerComponent,
    QuillEditorComponent
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})

export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  sendedAttempt: boolean = false;
  isSendingEmail: boolean = false;
  errores: string[] = [];

  staticEmail: string = 'clinicamedicacoslada@gmail.com';
  staticUbication: string = 'Calle Coslada 4º 1ºB';
  staticTelef: string = '642 111 111';


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

  constructor(private contactoService: ContactoService) {
  }

  ngOnInit(): void {
    this.contactForm = new FormGroup<any>({
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
        ]
      ),
      'email': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validEmail
        ]
      ),
      'telefono': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validMobile
        ]
      ),
      'mensaje': new FormControl(
        null,
        [
          Validators.required,
        ]
      ),
    });
  }

  onClick(elemento:HTMLElement) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  onSubmitEmail(): void {
    this.sendedAttempt = true;
    this.isSendingEmail = true;

    if (this.contactForm.invalid) {
      this.isSendingEmail = false;
      return;
    }

    const newCorreo: ContactoModel = this.generateContacto();
    this.contactoService.mandarCorreo(newCorreo)
      .subscribe({
        next: (response) => {
          this.isSendingEmail = false;
          Swal.fire({
            title:'Enhorabuena',
            text:'Correo enviado correctamente',
            icon:'success',
            width: '50%'
          })
            .then(() => {
              this.sendedAttempt = false;
              this.contactForm.reset();
            })
            .catch(() => {
              console.log('Se produjo un error.') });
        },
        error: (error: string[]): void => {
          this.errores = error;
          this.isSendingEmail = false;
        }
      });

  }

  private generateContacto(): ContactoModel {
    return {
      nombre: this.contactForm.get('nombre').value,
      descripcion:this.contactForm.get('descripcion').value,
      email: this.contactForm.get('email').value,
      telefono: this.contactForm.get('telefono').value,
      mensaje: this.contactForm.get('mensaje').value
    }
  }
}
