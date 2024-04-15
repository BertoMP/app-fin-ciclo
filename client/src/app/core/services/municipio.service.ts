import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MunicipioModel} from "../interfaces/municipio.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getMunicipios(provinceId: string): Observable<MunicipioModel[]> {
    const id: number = parseInt(provinceId, 10);

    return this.http.get<MunicipioModel[]>(`${this.baseUrl}/municipio/${id}`);
  }
}
