import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {CustomValidators} from "../../../core/classes/CustomValidators";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {
  LoadingSpinnerComponent
} from "../../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    RouterLink,
    LoadingSpinnerComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
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
        next: (response) => {
          this.isLoading = false;
          this.loginForm.reset();
        },
        error: (error: string): void => {
          this.error = error;
          this.isLoading = false;
        }
      });
  }
}
