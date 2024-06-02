import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InformeSpecificData } from '../interfaces/informe-specific-data.model';
import { FileDownloadService } from './file-downloader.service';
import {InformesListModel} from "../interfaces/informes-list.model";
import { InformeFormModel } from '../interfaces/informe-form.model';

@Injectable({
    providedIn: 'root'
})
export class InformeService {
    baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient,
                private descargarPDF: FileDownloadService) { }

    getInformes(fechaInicio: string, fechaFin: string, perPage: number, page: number) {
        let query: string = `?page=${page}`;

        if (fechaInicio) {
            query += `&fechaInicio=${fechaInicio}`;
        }

        if (fechaFin) {
            query += `&fechaFin=${fechaFin}`;
        }

        if (perPage) {
            query += `&limit=${perPage}`;
        }

        return this.http.get<InformesListModel>(`${this.baseUrl}/informe/listado-informes${query}`);
    }

    getInformesByPacienteId(paciente_id: number, fechaInicio: string, fechaFin: string, perPage: number, page: number) {
      let query: string = `?page=${page}`;

      if (fechaInicio) {
        query += `&fechaInicio=${fechaInicio}`;
      }

      if (fechaFin) {
        query += `&fechaFin=${fechaFin}`;
      }

      if (perPage) {
        query += `&limit=${perPage}`;
      }

      return this.http.get<InformesListModel>(`${this.baseUrl}/informe/listado-informes/${paciente_id}${query}`);
    }

    getInforme(informe_id: number): Observable<InformeSpecificData> {
        return this.http.get<InformeSpecificData>(`${this.baseUrl}/informe/${informe_id}`)
    }

    crearInforme(informe:InformeFormModel){
      return this.http.post(`${this.baseUrl}/informe`,informe);
    }

    getDownloadInforme(informe_id:number) {
        return this.descargarPDF.downloadFile(`${this.baseUrl}/informe/pdf/${informe_id}`);
     }
}
