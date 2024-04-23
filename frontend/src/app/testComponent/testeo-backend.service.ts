import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TesteoBackendService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listCitas() {
    return this.http.get(`${this.apiUrl}/cita`);
  }

  listPacientes() {
    return this.http.get(`${this.apiUrl}/usuario`);
  }

  listMedicamentos() {
    return this.http.get(`${this.apiUrl}/medicamento`);
  }
}
