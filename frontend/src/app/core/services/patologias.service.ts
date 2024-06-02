import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PatologiasListModel } from '../interfaces/patologias-list.model';
import { Observable, catchError, throwError } from 'rxjs';
import { PatologiasDataModel } from '../interfaces/patologias-data.model';
import { PatologiasInformeModel } from '../interfaces/patologia-informe.model';

@Injectable({
  providedIn: 'root'
})
export class PatologiasService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPatologias(search: string, perPage: number, page: number): Observable<PatologiasListModel> {
    let query: string = '';

    if (search) {
      query += `search=${search}&`;
    }

    if (perPage) {
      query += `limit=${perPage}&`;
    }

    if (page) {
      query += `page=${page}&`;
    }

    query = query.slice(0, -1);

    return this.http.get<PatologiasListModel>(`${this.baseUrl}/patologia/?${query}`);
  }

  registrarPatologia(patologia:PatologiasDataModel):Observable<any>{
    return this.http.post(`${this.baseUrl}/patologia`, patologia)
    .pipe(catchError(this.handleError));
  }

  updatePatologia(patologia: PatologiasDataModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/patologia/${patologia.id}`, patologia)
      .pipe(catchError(this.handleError));
  }

  getPatologiaId(id: number): Observable<PatologiasDataModel> {
    return this.http.get<PatologiasDataModel>(`${this.baseUrl}/patologia/${id}`);
  }

  getInformePatologias(): Observable<PatologiasInformeModel[]> {
    return this.http.get<PatologiasInformeModel[]>(`${this.baseUrl}/patologia/informe`);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors ?? ['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }

}
