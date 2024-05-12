import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MedicacionListModel } from '../interfaces/medicacion-list.model';
import { FileDownloadService } from './file-downloader.service';

@Injectable({
  providedIn: 'root'
})
export class MedicacionesService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,private descargarPDF: FileDownloadService) { }

  getMedicaciones() {
    return this.http.get<MedicacionListModel>(`${this.apiUrl}/prescripcion`);
  }
  
  getDownloadMedicacion() {
    return this.descargarPDF.downloadFile(`${this.apiUrl}/prescripcion/pdf`);
 }
  
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors ?? ['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
