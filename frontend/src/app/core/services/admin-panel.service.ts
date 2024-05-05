import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserListResponseModel } from '../interfaces/user-list-response.model';
import { SpecialityDataModel } from '../interfaces/speciality-data.model';
import { ListedSpecialityModel } from '../interfaces/speciality-list.model';

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

  
  getSpecialitiesList(page:number):Observable<ListedSpecialityModel>{
    return this.http.get<ListedSpecialityModel>(`${this.baseUrl}/especialidad?page=${page}`);

  }
  getSpecificPageSpeciality(url:string):Observable<ListedSpecialityModel>{
    return this.http.get<ListedSpecialityModel>(`${this.baseUrl}${url}`);
  }

  eliminateSpeciality(id:number):Observable<any>{
    return this.http.delete<ListedSpecialityModel>(`${this.baseUrl}/especialidad/${id}`).pipe(catchError(this.handleError));
  }

  getUsersByRoleAndSearch(role:number, search:string):Observable<UserListResponseModel>{
    let query: string = '';

    if (role > 1) {
      query += `role=${role}&`;
    }

    if (search) {
      query += `search=${search}&`;
    }

    query = query.slice(0, -1);

    return this.http.get<UserListResponseModel>(`${this.baseUrl}/usuario/listado?${query}`);
  }

  eliminateUser(id:number):Observable<any>{
    return this.http.delete<UserListResponseModel>(`${this.baseUrl}/usuario/borrar-usuario/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors??['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
