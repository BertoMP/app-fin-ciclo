import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {CustomValidators} from "../../../core/classes/CustomValidators";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {
  LoadingSpinnerComponent
} from "../../../shared/components/loading-spinner/loading-spinner.component";
import {HttpErrorResponse} from "@angular/common/http";
import {
  PasswordInputComponent
} from "../../../shared/components/password-input/password-input.component";
import {ChatbotService} from "../../../core/services/chatbot.service";
import Swal from "sweetalert2";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    RouterLink,
    LoadingSpinnerComponent,
    PasswordInputComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService,
              private router: Router,
              private chatbotService: ChatbotService,
              private title: Title) {
  }
  passwordId: string = 'password';

  ngOnInit(): void {
    this.title.setTitle('MediAPP - Iniciar sesión');

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/mediapp']).then(r => {});
    }

    this.initForm();
  }

  initForm(): void {
    this.loginForm = new FormGroup<any>({
      'email': new FormControl(
        null,
        [
          Validators.required,
          CustomValidators.validEmail
        ]
      ),
      'password': new FormControl(
        null,
        [
          Validators.required,
        ]
      )
    });
  }

  onLoginAttempt(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    const email = this.loginForm.get('email').value;
    const pass = this.loginForm.get('password').value;

    this.authService.login(email, pass)
      .subscribe({
        next: (response): void => {
          this.isLoading = false;
          this.loginForm.reset();
          this.authService.userRoleSubject.next(this.authService.getUserRole());
          this.router.navigate(['/mediapp'])
            .then((r: boolean): void => {
              if (r) {
                this.chatbotService.removeChatbotIfOnMediappPage();
              }
            });
        },
        error: (error: HttpErrorResponse): void => {
          this.isLoading = false;

          if (error.status === 0 || error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Algo salió mal, por favor intenta de nuevo.',
              width: '50%'
            });
            this.isLoading = false;
          } else {
            this.error = error.error.errors[0]
              .toString()
              .replace(/Error: /g, '');
          }
        }
      });
  }
}
