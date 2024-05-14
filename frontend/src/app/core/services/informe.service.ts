import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class informeService {
    baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getInforme(informe_id: number): Observable<Object> {
        return this.http.get<Object>(`${this.baseUrl}/informe/${informe_id}`)
    }
}