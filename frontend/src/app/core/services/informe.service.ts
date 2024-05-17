import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InformeSpecificData } from '../interfaces/informe-specific-data.model';
import { FileDownloadService } from './file-downloader.service';

@Injectable({
    providedIn: 'root'
})
export class InformeService {
    baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient,private descargarPDF: FileDownloadService) { }

    getInforme(informe_id: number): Observable<InformeSpecificData> {
        return this.http.get<InformeSpecificData>(`${this.baseUrl}/informe/${informe_id}`)
    }
    getDownloadInforme(informe_id:number) {
        return this.descargarPDF.downloadFile(`${this.baseUrl}/informe/pdf/${informe_id}`);
     }
}