import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import {FileDownloadService} from "../core/services/file-downloader.service";

@Injectable({
  providedIn: 'root'
})
export class TesteoBackendService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient,
              private fileDownloader: FileDownloadService) { }

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
    const url: string = `${this.apiUrl}/paciente-medicamento/pdf`;

    return this.fileDownloader.downloadFile(url, 'receta.pdf');
  }
}
