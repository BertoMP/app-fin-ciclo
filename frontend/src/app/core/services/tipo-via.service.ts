import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TipoViaModel } from "../interfaces/tipo-via.model";
import { Observable } from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TipoViaService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTipoVia(): Observable<TipoViaModel[]> {
    return this.http.get<TipoViaModel[]>(`${this.baseUrl}/tipo-via`);
  }
}
