import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {ProvinceModel} from "../interfaces/province.model";

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  constructor(private http: HttpClient) { }

  getProvinces(): Observable<ProvinceModel[]> {
    return this.http.get('/provincia').pipe(
      catchError(error => {
        console.error('Error fetching provinces', error);
        return [];
      })
    );
  }
}
