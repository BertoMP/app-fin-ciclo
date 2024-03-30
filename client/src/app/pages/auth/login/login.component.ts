import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {CustomValidators} from "../../../core/classes/CustomValidators";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

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
    console.log(this.loginForm.value);
    this.loginForm.reset();
  }
}
