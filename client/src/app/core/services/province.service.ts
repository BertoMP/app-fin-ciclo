import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProvinceModel } from "../interfaces/province.model";

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getProvinces(): Observable<ProvinceModel[]> {
    return this.http.get<ProvinceModel[]>(`${this.baseUrl}/provincia`);
  }
}
