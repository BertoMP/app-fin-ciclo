import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MedicionListModel } from '../interfaces/medicion-list.model';
import { GlucometriaDataModel } from '../interfaces/glucometria-data.model';
import { TensionArterialDataModel } from '../interfaces/tension-arterial-data.model';

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMedicion(type: string, userId: number, fechaInicio: string, fechaFin: string, perPage: number, page: number) {
    let typeUrl: string = type === 'glucometria' ? 'glucometria' : 'tension-arterial';
    let query: string = `?user_id=${userId}`;

    if (fechaInicio) {
      query += `&fechaInicio=${fechaInicio}`;
    }

    if (fechaFin) {
      query += `&fechaFin=${fechaFin}`;
    }

    if (page) {
      query += `&page=${page}`;
    }

    if (perPage) {
      query += `&limit=${perPage}`;
    }

    return this.http.get<MedicionListModel>(`${this.apiUrl}/${typeUrl}${query}`);
  }

  uploadGlucometria(user_id:number,tomas:GlucometriaDataModel){
    return this.http.post(`${this.apiUrl}/glucometria`, {user_id,tomas}).pipe(catchError(this.handleError));
  }

  uploadTension(user_id:number,tomas:TensionArterialDataModel){
    return this.http.post(`${this.apiUrl}/tension-arterial`, {user_id,tomas}).pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors ?? ['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
