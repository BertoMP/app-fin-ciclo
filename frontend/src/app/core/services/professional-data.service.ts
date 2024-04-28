import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { EspecialistDataModel } from '../interfaces/especialist-data.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalDataService {


  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  recogerInfoEspecialista(usuario_id: number): Observable<EspecialistDataModel> {
    return this.http.get<EspecialistDataModel>(`${this.apiUrl}/especialista/${usuario_id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = errorRes.error.errors??'Ha ocurrido un error durante el proceso';
    return throwError(() => new Error(errorMessage));
  }
}
