import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProvinceModel } from "../interfaces/province.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProvinces(): Observable<ProvinceModel[]> {
    return this.http.get<ProvinceModel[]>(`${this.baseUrl}/provincia`);
  }
}
