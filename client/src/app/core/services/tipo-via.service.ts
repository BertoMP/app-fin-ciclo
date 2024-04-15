import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TipoViaModel} from "../interfaces/tipo-via.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TipoViaService {
  baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getTipoVia(): Observable<TipoViaModel[]> {
    return this.http.get<TipoViaModel[]>(`${this.baseUrl}/tipo-via`);
  }
}
