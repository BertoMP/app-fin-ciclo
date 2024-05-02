import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../interfaces/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserList(){
    return this.http.get(`${this.baseUrl}/usuario/listado`);
  }
}
