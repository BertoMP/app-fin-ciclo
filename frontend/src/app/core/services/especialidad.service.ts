import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EspecialidadModel } from '../interfaces/especialidad-Model';
import { Observable, catchError, throwError } from 'rxjs';
import { SpecialityListedModel } from '../interfaces/speciality-listed.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  baseUrl: string = 'http://localhost:3000/api';


  constructor(private http: HttpClient) { }

  getEspecialidad(): Observable<EspecialidadModel[]> {
    return this.http.get<EspecialidadModel[]>(`${this.baseUrl}/especialidad/listado`);
  }
  getEspecialidadId(id: number): Observable<SpecialityListedModel> {
    return this.http.get<SpecialityListedModel>(`${this.baseUrl}/especialidad/${id}`);
  }
  registerEspecialidad(especialidad: SpecialityListedModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/especialidad`, especialidad)
      .pipe(catchError(this.handleError));
  }
  updateEspecialidad(especialidad: SpecialityListedModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/especialidad/${especialidad.id}`, especialidad)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors ?? ['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
