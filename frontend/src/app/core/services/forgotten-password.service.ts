import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {ForgottenPassswordModel } from '../interfaces/forgotten-password.model';

@Injectable({
  providedIn: 'root'
})
export class ForgottenPasswordService {


  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  enviarCorreoRenovacion(email: ForgottenPassswordModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/contrasena-olvidada`, email)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = errorRes.error.errors??'Ha ocurrido un error durante el proceso';
    return throwError(() => new Error(errorMessage));
  }}
