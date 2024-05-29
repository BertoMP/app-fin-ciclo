import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsultaModel } from '../interfaces/consulta.model';
import {environment} from "../../environments/environment";
import {ConsultaListModel} from "../interfaces/consulta-list.model";

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getConsultas(): Observable<ConsultaModel[]> {
    return this.http.get<ConsultaModel[]>(`${this.baseUrl}/consulta/listado`);
  }

  getConsultaById(id: number): Observable<ConsultaModel> {
    return this.http.get<ConsultaModel>(`${this.baseUrl}/consulta/${id}`);
  }

  registrarConsulta(consulta: ConsultaModel): Observable<ConsultaModel> {
    return this.http.post<ConsultaModel>(`${this.baseUrl}/consulta`, consulta);
  }

  actualizarConsulta(consulta: ConsultaModel): Observable<ConsultaModel> {
    return this.http.put<ConsultaModel>(`${this.baseUrl}/consulta/${consulta.id}`, consulta);
  }

  getConsultasPage(page: number, perPage: number): Observable<ConsultaListModel> {
    return this.http.get<ConsultaListModel>(`${this.baseUrl}/consulta?page=${page}&limit=${perPage}`);
  }

  eliminarConsulta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/consulta/${id}`);
  }
}
