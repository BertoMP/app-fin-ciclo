import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {TesteoBackendService} from "../testeo-backend.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {saveAs} from 'file-saver';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {FileUploadService} from "../../core/services/file-uploader.service";
import {
  MedicalSpecialtyModel
} from "../../core/interfaces/medical-specialty.model";
import {
  VerticalCardComponent
} from "../../shared/components/vertical-card/vertical-card.component";
import {
  LoadingSpinnerComponent
} from "../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-testeo-backend',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    VerticalCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './testeo-backend.component.html',
  styleUrl: './testeo-backend.component.scss'
})
export class TesteoBackendComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;
  userRole: number = 0;
  userId: number = 0;
  loggedInSubscription: Subscription;

  especialidades: MedicalSpecialtyModel;

  imageForm: FormGroup;

  constructor(private authService: AuthService,
              private testeoBack: TesteoBackendService,
              private fileUploadService: FileUploadService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loggedInSubscription = this.authService.isLoggedInUser.subscribe(
      loggedIn => {
        this.isUserLoggedIn = loggedIn;
        if (this.isUserLoggedIn) {
          this.userRole = this.authService.getUserRole();
          this.userId = this.authService.getUserId();
        }
      }
    );

    this.imageForm = new FormGroup({
      image: new FormControl(
        null,
        [Validators.required]
      ),
    });

    this.testeoBack.getEspecialidad()
      .subscribe({
        next: (response: MedicalSpecialtyModel) => {
          this.especialidades = response;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error.error);
        }
      });
  }

  ngOnDestroy() {
    this.loggedInSubscription.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout()
      .subscribe({
        next: (response) => {
          this.router.navigate(['/auth/login']).then(r => {});
        },
        error: (error: HttpErrorResponse) => {
          console.error(error.error);
        }

      });
  }

  onListCitas(): void {
    this.testeoBack.listCitas()
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error.error);
        }
      });
  }

  onListPacientes(): void {
    this.testeoBack.listPacientes()
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error.error);
        }
      });
  }

  onListMedicamentos(): void {
    this.testeoBack.listMedicamentos()
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('No se pudo obtener la lista de medicamentos.');
        }
      });
  }

  onGetReceta(): void {
    this.testeoBack.generaReceta()
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          console.error('No se pudo generar la receta.', error);
        }
      });
  }

  onFileSelect(event: { target: { files: File[]; }; }) {
    if (event.target.files && event.target.files[0]) {
      this.fileUploadService.toBase64(event.target.files[0]).then(base64 => {
        this.imageForm.get('image').setValue(base64);
      });
    }
  }

  onGetInforme(): void {
    this.testeoBack.generaInforme()
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          console.error('No se pudo generar el informe.', error);
        }
      });
  }

  onSubmit() {
    const especialidad: MedicalSpecialtyModel = {
      id: "1",
      nombre: 'Cardiología',
      descripcion: 'Especialidad médica que se encarga del diagnóstico y tratamiento de las enfermedades del corazón y del aparato circulatorio.',
      imagen: this.imageForm.get('image').value
    }

    this.testeoBack.submitForm(especialidad)
      .subscribe({
        next: (response: MedicalSpecialtyModel) => {
          this.testeoBack.getEspecialidad().subscribe({
            next: (response: MedicalSpecialtyModel) => {
              this.especialidades = response;
            },
            error: (error: HttpErrorResponse) => {
              console.error(error.error);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('No se pudo subir la imagen.', error);
        }
      });
  }
}
