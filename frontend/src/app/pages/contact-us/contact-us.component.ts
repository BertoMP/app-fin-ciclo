import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { ContactoModel } from '../../core/interfaces/contacto.model';
import { CustomValidators } from '../../core/classes/CustomValidators';
import { ContactoService } from '../../core/services/contacto.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})

export class ContactUsComponent implements OnInit {
  registerForm: FormGroup;
  sendedAttempt: boolean = false;
  errores: string[] = [];


  staticEmail: string = 'clinicamedicacoslada@gmail.com';
  staticUbication: string = 'Calle Coslada 4º 1ºB';
  staticTelef: string = '642 111 111';

  onClick(elemento:HTMLElement) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  ngOnInit(): void {
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
  constructor(private contactoService: ContactoService) {
    this.contactoService=contactoService;
  }

  onSubmitEmail(): void {
    this.sendedAttempt = true;

    if (this.registerForm.invalid) {
      return;
    }else{
      this.sendedAttempt=false;
    }


    const newCorreo: ContactoModel = this.generateContacto();
    this.contactoService.mandarCorreo(newCorreo)
      .subscribe({
        next: (response) => {
          alert('Correo enviado correctamente');
        },
        error: (error: HttpErrorResponse): void => {
          this.errores=error.message.split(',');
           }
      });

  }

  private generateContacto(): ContactoModel {
    return {
      nombre: this.registerForm.get('nombre').value,
      descripcion:this.registerForm.get('descripcion').value,
      email: this.registerForm.get('email').value,
      telefono: this.registerForm.get('telefono').value,
      mensaje: this.registerForm.get('mensaje').value
    }
  }

}
