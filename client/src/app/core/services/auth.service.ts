import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {UserModel} from "../interfaces/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {

  }

  register(newUser: UserModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, newUser)
      .pipe(catchError(this.handleError));
  }

  login(email: string, passsword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      email: email,
      password: passsword
    }
    ).pipe(catchError(this.handleError));
  }


  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = 'Ha ocurrido un error durante el proceso';
    if(!errorRes.error) {
      return throwError(() => new Error(errorMessage));
    }

    switch (errorRes.error) {
      case 'EMAIL_EXISTS':
        errorMessage = 'El email ya se encuentra en uso.';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Email y/o contraseña incorrectos.'
        break;
    }

    return throwError(() => new Error(errorMessage));
  }
}
