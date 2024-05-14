import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitasListModel } from '../interfaces/citas-list.model';
import { CitaSpecificDataModel } from '../interfaces/cita-specific-data.model';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCitas(): Observable<CitasListModel> {
    return this.http.get<CitasListModel>(`${this.baseUrl}/cita`);
  }

  cancelarCita(cita_id: number): Observable<CitasListModel> {
    return this.http.delete<CitasListModel>(`${this.baseUrl}/cita/${cita_id}`);
  }

  getCita(cita_id: number): Observable<CitaSpecificDataModel> {
    return this.http.get<CitaSpecificDataModel>(`${this.baseUrl}/cita/${cita_id}`)
  }

}
