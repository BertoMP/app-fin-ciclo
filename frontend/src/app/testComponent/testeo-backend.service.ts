import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import {FileDownloadService} from "../core/services/file-downloader.service";
import {
  MedicalSpecialtyModel
} from "../core/interfaces/medical-specialty.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TesteoBackendService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient,
              private fileDownloader: FileDownloadService) { }

  getEspecialidad(): Observable<MedicalSpecialtyModel> {
    return this.http.get<MedicalSpecialtyModel>(`${this.apiUrl}/especialidad/1`);
  }

  listCitas() {
    return this.http.get(`${this.apiUrl}/cita`);
  }

  listPacientes() {
    return this.http.get(`${this.apiUrl}/usuario`);
  }

  listMedicamentos() {
    return this.http.get(`${this.apiUrl}/medicamento`);
  }

  generaReceta() {
    const url: string = `${this.apiUrl}/prescripcion/pdf`;

    return this.fileDownloader.downloadFile(url, 'receta.pdf');
  }

  generaInforme() {
    const url: string = `${this.apiUrl}/informe/pdf/1`;

    return this.fileDownloader.downloadFile(url, 'informe.pdf');
  }

  submitForm(especialidad: MedicalSpecialtyModel) {
    const id: string = especialidad.id ?? null;

    return this.http.put(`${this.apiUrl}/especialidad/${id}`, especialidad);
  }
}
