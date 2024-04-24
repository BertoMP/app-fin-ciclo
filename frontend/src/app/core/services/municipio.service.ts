import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MunicipioModel } from "../interfaces/municipio.model";
import { Observable } from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMunicipios(provinceId: string): Observable<MunicipioModel[]> {
    const id: number = parseInt(provinceId, 10);

    return this.http.get<MunicipioModel[]>(`${this.baseUrl}/municipio/${id}`);
  }
}
