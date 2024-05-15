import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ContactoModel} from "../interfaces/contacto.model";
import {catchError, Observable, throwError} from "rxjs";
import { RefreshPasswordModel } from '../interfaces/refresh-password.model';

@Injectable({
  providedIn: 'root'
})
export class RefreshPasswordService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  renovarContrasena(passwordRefresh: RefreshPasswordModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/contrasena-reset`, passwordRefresh)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = errorRes.error.errors??'Ha ocurrido un error durante el proceso';
    return throwError(() => new Error(errorMessage));
  }
}




