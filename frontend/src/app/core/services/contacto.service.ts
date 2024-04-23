import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ContactoModel} from "../interfaces/contacto.model";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  mandarCorreo(newCorreo: ContactoModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacto`, newCorreo)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = errorRes.error.errors??'Ha ocurrido un error durante el proceso';
    return throwError(() => new Error(errorMessage));
  }
}




