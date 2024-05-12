import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitasListModel } from '../interfaces/citas-list.model';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCitas(): Observable<CitasListModel> {
    return this.http.get<CitasListModel>(`${this.baseUrl}/cita`);
  }

}
