import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MedicacionListModel } from '../interfaces/medicacion-list.model';
import { FileDownloadService } from './file-downloader.service';
import { MedicinasDataModel } from '../interfaces/medicinas-data.model';
import { MedicinasListModel } from '../interfaces/medicinas-list.model';
import { MedicacionToma } from '../interfaces/medicacion-toma.model';
import { MedicamentoDataModel } from '../interfaces/medicamento-data.model';

@Injectable({
  providedIn: 'root'
})
export class MedicacionesService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,private descargarPDF: FileDownloadService) { }

  getMedicaciones() {
    return this.http.get<MedicacionListModel>(`${this.baseUrl}/prescripcion`);
  }

  getMedicamentosPreescripcion():Observable<MedicacionToma[]> {
    return this.http.get<MedicacionToma[]>(`${this.baseUrl}/medicamento/prescripcion`);
  }

  getMedicacionesByPacienteId(id: number) {
    return this.http.get<MedicacionListModel>(`${this.baseUrl}/prescripcion/${id}`);
  }

  getDownloadMedicacion() {
    return this.descargarPDF.downloadFile(`${this.baseUrl}/prescripcion/pdf`);
  }

  getDownloadMedicacionByPacienteId(id: number) {
    return this.descargarPDF.downloadFile(`${this.baseUrl}/prescripcion/pdf/${id}`);
  }

  eliminarToma(toma_id:number):Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/prescripcion/borrar-toma/${toma_id}`)
  }

  eliminarMedicamento(usuario_id:number,medicamento_id:number):Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/prescripcion/borrar-medicamento/${usuario_id}/${medicamento_id}`)
  }


  getMedicamentos(search: string, perPage: number, page: number):Observable<MedicinasListModel>{
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

    return this.http.get<MedicinasListModel>(`${this.baseUrl}/medicamento/?${query}`);
  }

  registrarMedicamento(medicamento:MedicinasDataModel):Observable<any>{
    return this.http.post(`${this.baseUrl}/medicamento`, medicamento)
    .pipe(catchError(this.handleError));
  }

  actualizarMedicamento(medicamento:MedicinasDataModel):Observable<any>{
    return this.http.post(`${this.baseUrl}/medicamento`, medicamento)
    .pipe(catchError(this.handleError));
  }

  updateMedicamento(medicamento: MedicinasDataModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/medicamento/${medicamento.id}`, medicamento)
      .pipe(catchError(this.handleError));
  }

  subirMedicamentosPaciente(medicamentos: { paciente_id: number; prescripcion: MedicamentoDataModel[]; }):Observable<any>{
    console.log(medicamentos);

    return this.http.post(`${this.baseUrl}/prescripcion`, medicamentos)
    .pipe(catchError(this.handleError));
  }

  getMedicamentoId(id: number): Observable<MedicinasDataModel> {
    return this.http.get<MedicinasDataModel>(`${this.baseUrl}/medicamento/${id}`);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors ?? ['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
