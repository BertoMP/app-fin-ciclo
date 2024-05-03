import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../interfaces/user.model';
import { Observable, catchError, throwError } from 'rxjs';
import { UserListResponseModel } from '../interfaces/user-list-response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserList(page:number):Observable<UserListResponseModel>{
    return this.http.get<UserListResponseModel>(`${this.baseUrl}/usuario/listado?page=${page}`);
  }
  getSpecificPage(url:string):Observable<UserListResponseModel>{
    return this.http.get<UserListResponseModel>(`${this.baseUrl}${url}`);
  }

  getUsersByRole(role: number):Observable<UserListResponseModel>{
    const url: string = (role === 1 || isNaN(role)) ? `${this.baseUrl}/usuario/listado` : `${this.baseUrl}/usuario/listado?role=${role}`;

    return this.http.get<UserListResponseModel>(url);
  }

  getUsersBySearch(search: string):Observable<UserListResponseModel>{
    return this.http.get<UserListResponseModel>(`${this.baseUrl}/usuario/listado?search=${search}`);
  }

  eliminateUser(id:number):Observable<any>{
    return this.http.delete<UserListResponseModel>(`${this.baseUrl}/usuario/borrar-usuario/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors??['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
