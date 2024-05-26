import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LogsListModel} from "../interfaces/logs-list.model";

@Injectable({
  providedIn: 'root'
})
export class LogService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLogs(fechaInicio: string, fechaFin: string, perPage: number, page: number): Observable<LogsListModel> {
    let query: string = `?page=${page}`;

    if (fechaInicio) {
      query += `&fechaInicio=${fechaInicio}`;
    }

    if (fechaFin) {
      query += `&fechaFin=${fechaFin}`;
    }

    if (perPage) {
      query += `&limit=${perPage}`;
    }

    return this.http.get<LogsListModel>(`${this.baseUrl}/log${query}`);
  }
}
