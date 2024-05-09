import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MedicionListModel } from '../interfaces/medicion-list.model';
import { GlucometriaDataModel } from '../interfaces/glucometria-data.model';

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getGlucometria(page:number) {
    return this.http.get<MedicionListModel>(`${this.apiUrl}/glucometria?page=${page}`);
  }
  getTensionArterial(page:number) {
    return this.http.get<MedicionListModel>(`${this.apiUrl}/tension-arterial?page=${page}`);
  }

  getSpecificPage(page:string) {
    return this.http.get<MedicionListModel>(`${this.apiUrl}${page}`);
  }
  
  uploadGlucometria(user_id:number,tomas:GlucometriaDataModel){
    return this.http.post(`${this.apiUrl}/glucometria`, {user_id,tomas}).pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors ?? ['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
