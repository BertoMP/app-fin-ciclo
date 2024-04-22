import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
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
    return this.http.post(`${this.apiUrl}/usuario/registro`, newUser)
      .pipe(catchError(this.handleError));
  }

  login(email: string, passsword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/login`, {
      email: email,
      password: passsword
    }
    ).pipe(
      catchError(this.handleError),
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      }));
  }

  getAuthToken(): string {
    return localStorage.getItem('token')??'';
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/refresh-token`, {
      refreshToken: localStorage.getItem('refreshToken')
    }).pipe(
      catchError(this.handleError),
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      }));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = errorRes.error.errors??'Ha ocurrido un error durante el proceso';


    return throwError(() => new Error(errorMessage));
  }
}
