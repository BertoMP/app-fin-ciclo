import { Injectable } from '@angular/core';
import {
  MedicalSpecialistListModel
} from "../interfaces/medical-specialist-list.model";
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EspecialistaCitaModel } from '../interfaces/especialista-cita.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalSpecialistListService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMedicalSpecialistList():Observable<MedicalSpecialistListModel[]>{
    return this.http.get<MedicalSpecialistListModel[]>(`${this.baseUrl}/especialidad/especialista`);
  }

  getSpecialist(especialidad_id:number):Observable<EspecialistaCitaModel[]>{
    return this.http.get<EspecialistaCitaModel[]>(`${this.baseUrl}/especialistas/${especialidad_id}`);
  }
}
