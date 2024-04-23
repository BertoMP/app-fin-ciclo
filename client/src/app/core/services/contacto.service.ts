import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {UserModel} from "../interfaces/user.model";
import { ContactoModel } from "../interfaces/contacto.model";


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