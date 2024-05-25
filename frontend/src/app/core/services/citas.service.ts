import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CitasListModel } from '../interfaces/citas-list.model';
import { CitaSpecificDataModel } from '../interfaces/cita-specific-data.model';
import { CitaUploadModel } from '../interfaces/cita-upload.model';
import { CitasDisponiblesModel } from '../interfaces/citas-disponibles.model';
import { CitasEspecialistaListModel } from '../interfaces/citas-especialista-list.model';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCitas(fechaInicioCita: string, fechaFinCita: string, perPage: number, page: number) {
    let query: string = `?page=${page}`;

    if (fechaInicioCita) {
      query += `&fechaInicioCita=${fechaInicioCita}`;
    }

    if (fechaFinCita) {
      query += `&fechaFinCita=${fechaFinCita}`;
    }

    if (perPage) {
      query += `&limit=${perPage}`;
    }

    return this.http.get<CitasListModel>(`${this.baseUrl}/cita${query}`);
  }

  cancelarCita(cita_id: number): Observable<CitasListModel> {
    return this.http.delete<CitasListModel>(`${this.baseUrl}/cita/${cita_id}`);
  }

  confirmarCita(cita:CitaUploadModel){
    return this.http.post(`${this.baseUrl}/cita`,cita);
  }

  getCita(cita_id: number): Observable<CitaSpecificDataModel> {
    return this.http.get<CitaSpecificDataModel>(`${this.baseUrl}/cita/${cita_id}`)
  }

  getCitaEspecialista(): Observable<CitasEspecialistaListModel[]> {
    return this.http.get<CitasEspecialistaListModel[]>(`${this.baseUrl}/cita/agenda`);
  }

  getCitaDisponible(especialista_id: number,fecha:string): Observable<CitasDisponiblesModel> {
    return this.http.get<CitasDisponiblesModel>(`${this.baseUrl}/cita/citas-disponibles?fechaCita=${fecha}&especialistaId=${especialista_id}`);
  }

  downloadCita(cita_id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/cita/pdf/${cita_id}`, { responseType: 'blob' });
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors ?? ['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
