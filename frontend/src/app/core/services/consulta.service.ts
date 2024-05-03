import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsultaModel } from '../interfaces/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getConsultas(): Observable<ConsultaModel[]> {
    return this.http.get<ConsultaModel[]>(`${this.baseUrl}/consulta/listado`);
  }
}
