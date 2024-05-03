import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EspecialidadModel } from '../interfaces/especialidad-Model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getEspecialidad(): Observable<EspecialidadModel[]> {
    return this.http.get<EspecialidadModel[]>(`${this.baseUrl}/especialidad/especialista`);
  }
}
