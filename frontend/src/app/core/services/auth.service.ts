import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserRole} from "../enum/user-role.enum";
import { EspecialistModel } from '../interfaces/especialist.model';
import { PatientModel } from '../interfaces/patient.model';
import {UpdatePasswordModel} from "../interfaces/update-password.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private jwtHelper: JwtHelperService = new JwtHelperService();

  loggedInUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userRoleSubject: BehaviorSubject<UserRole> = new BehaviorSubject<UserRole>(this.getUserRole());

  constructor(private http: HttpClient) {
    this.loggedInUser.next(this.isLoggedIn());
  }

  get isLoggedInUser(): Observable<boolean> {
    return this.loggedInUser.asObservable();
  }

  get userRole(): Observable<UserRole> {
    return this.userRoleSubject.asObservable();
  }

  registerUser(newUser: PatientModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/registro`, newUser)
      .pipe(catchError(this.handleError));
  }

  registerSpecialist(newUser: EspecialistModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/registro-especialista`, newUser)
      .pipe(catchError(this.handleError));
  }

  updateSpecialist(newUser: EspecialistModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/actualizar-especialista/${newUser.usuario_id}`, newUser)
      .pipe(catchError(this.handleError));
  }

  updateUser(newUser: PatientModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/actualizar-paciente/${newUser.usuario_id}`, newUser)
      .pipe(catchError(this.handleError));
  }

  updatePassword(newPassword: UpdatePasswordModel): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuario/actualizar-password`, newPassword)
      .pipe(catchError(this.handleError));
  }

  getPatient(id:number){
    return this.http.get(`${this.apiUrl}/usuario/${id}`).pipe(catchError(this.handleError));
  }

  getEspecialista(id:number){
    return this.http.get(`${this.apiUrl}/especialista/${id}`).pipe(catchError(this.handleError));
  }

  getSelfPatient(){
    return this.http.get(`${this.apiUrl}/usuario`).pipe(catchError(this.handleError));
  }

  updateSelfPatient(newUser:PatientModel):Observable<any>{
    return this.http.put(`${this.apiUrl}/usuario/actualizar-usuario`, newUser)
    .pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/login`, {
      email: email,
      password: password
    })
  }

  logout(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuario/logout`, {});
  }

  getAccessToken(): string {
    return localStorage.getItem('access_token')??'';
  }

  getRefreshToken(): string {
    return localStorage.getItem('refresh_token')??'';
  }

  getUserRole(): number | null {
    const accessToken: string = this.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const decodedToken = this.jwtHelper.decodeToken(accessToken);
    const userRoleId = decodedToken.user_role;

    switch (userRoleId) {
      case 1:
        return UserRole.ADMIN;
      case 2:
        return UserRole.PACIENT;
      case 3:
        return UserRole.ESPECIALIST;
      default:
        return null;
    }
  }

  getUserId(): number | null {
    const accessToken: string = this.getAccessToken();

    if (!accessToken) {
      return null;
    }

    const decodedToken = this.jwtHelper.decodeToken(accessToken);

    return decodedToken.user_id;
  }

  getUserName(): string {
    const accessToken: string = this.getAccessToken();

    if (!accessToken) {
      return '';
    }

    const decodedToken = this.jwtHelper.decodeToken(accessToken);

    return decodedToken.user_name;
  }

  isLoggedIn(): boolean {
    const refreshToken: string = this.getRefreshToken();

    if (!refreshToken || this.jwtHelper.isTokenExpired(refreshToken)) {
      this.removeTokens();
      this.loggedInUser.next(false);
    }

    return !this.jwtHelper.isTokenExpired(refreshToken);
  }

  storeAccessToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  storeRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  removeTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  refreshToken(): Observable<any> {
    const refreshToken: string = this.getRefreshToken();

    if (refreshToken) {
      return this.http.patch(
        `${this.apiUrl}/usuario/refresh-token`,
        {refresh_token: refreshToken}
      )
        .pipe(
          tap((tokens: any) => {
            this.storeAccessToken(tokens.access_token);
            this.storeRefreshToken(tokens.refresh_token);
          }),
          catchError(this.handleError)
        );
    }

    return throwError(() =>
      new Error('No hay token de refresco almacenado'));
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuario/borrar-usuario`)
      .pipe(
        tap(() => {
          this.removeTokens();
          this.loggedInUser.next(false);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors??['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
