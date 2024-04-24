import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CodigoPostalModel} from "../interfaces/codigo-postal.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CodigoPostalService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCodigosPostales(municipioId: string): Observable<CodigoPostalModel[]> {
    const id: number = parseInt(municipioId, 10);

    return this.http.get<CodigoPostalModel[]>(`${this.baseUrl}/codigo-postal/${id}`);
  }
}
