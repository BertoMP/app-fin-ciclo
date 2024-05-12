import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { EspecialistModel } from '../interfaces/especialist.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalDataService {


  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  recogerInfoEspecialista(usuario_id: number): Observable<EspecialistModel> {
    return this.http.get<EspecialistModel>(`${this.apiUrl}/especialista/${usuario_id}`);
  }

  specificEspecialista(usuario_id: number): Observable<EspecialistModel> {
    return this.http.get<EspecialistModel>(`${this.apiUrl}/usuario/${usuario_id}`);
  }
}
