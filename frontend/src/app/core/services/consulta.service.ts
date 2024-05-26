import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsultaModel } from '../interfaces/consulta.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getConsultas(): Observable<ConsultaModel[]> {
    return this.http.get<ConsultaModel[]>(`${this.baseUrl}/consulta/listado`);
  }
}
