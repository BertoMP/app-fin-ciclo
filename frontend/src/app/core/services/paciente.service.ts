import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PacienteListModel} from "../interfaces/paciente-list.model";

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPacienteList(): Observable<PacienteListModel[]> {
    return this.http.get<PacienteListModel[]>(`${this.apiUrl}/paciente`);
  }
}
